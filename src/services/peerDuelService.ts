import { getSupabaseClient } from './supabaseClient';
import { CharacterConfig, UserProfile } from '../types';

export interface DuelQuestionItem {
  id: string;
  type: 'multiple_choice' | 'spelling' | 'unscramble';
  word: {
    id: string;
    word: string;
    phonetic: string;
    uzbekTranslation: string;
  };
  choices: { text: string; isCorrect: boolean }[];
  scrambledLetters: { id: string; letter: string }[];
}

export interface ActiveDuelMatch {
  matchId: string;
  challengerId: string;
  challengerName: string;
  challengerCharacter: CharacterConfig;
  opponentId: string; // user ID or 'open'
  opponentName: string;
  opponentCharacter: CharacterConfig;
  roundSize: 10 | 15;
  diamondReward: number; // 1 or 2 normal, 2 or 4 for 2x mixed battle
  drillType: 'mixed' | 'multiple_choice' | 'spelling' | 'unscramble';
  questions: DuelQuestionItem[];
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'expired';
  createdAt: number;
  expiresAt: number;
  challengerResult?: { score: number; time: number };
  opponentResult?: { score: number; time: number };
  groupId?: string; // Group isolation so students do not mix
  isOpenDuel?: boolean; // When true, any online student in the group can join!
}

type DuelListener = (match: ActiveDuelMatch, eventType: string) => void;

const OPEN_DUELS_STORAGE_KEY = 'plc_active_open_duels_v1';

class PeerDuelManager {
  private channel: any = null;
  private listeners: Set<DuelListener> = new Set();
  private isSubscribed = false;

  constructor() {
    this.initRealtime();
    // Listen to local window storage events for same-device / different-tab real-time testing
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'peer_duel_realtime_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.notifyListeners(data.match, data.eventType);
          } catch {
            // Ignored
          }
        }
      });
    }
  }

  private initRealtime() {
    const client = getSupabaseClient();
    if (!client || this.isSubscribed) return;

    try {
      this.channel = client.channel('public:vocab_duels', {
        config: { broadcast: { self: false } },
      });

      this.channel
        .on('broadcast', { event: 'duel_event' }, (payload: any) => {
          if (payload && payload.payload) {
            const { match, eventType } = payload.payload;
            this.notifyListeners(match, eventType);
          }
        })
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            this.isSubscribed = true;
          }
        });
    } catch (err) {
      console.warn('PeerDuel Realtime setup error:', err);
    }
  }

  public subscribe(listener: DuelListener): () => void {
    this.listeners.add(listener);
    this.initRealtime();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(match: ActiveDuelMatch, eventType: string) {
    this.listeners.forEach(fn => {
      try {
        fn(match, eventType);
      } catch (err) {
        console.error('Error in duel listener:', err);
      }
    });
  }

  public broadcast(match: ActiveDuelMatch, eventType: string, notifyLocal = false) {
    // 1. Cross-device broadcast via Supabase Realtime
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'duel_event',
        payload: { match, eventType },
      });
    }

    // 2. Cross-tab fallback via localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('peer_duel_realtime_event', JSON.stringify({
          match,
          eventType,
          timestamp: Date.now() + Math.random(),
        }));
      } catch {
        // Ignored
      }
    }

    // 3. Local in-memory notification (if explicitly requested or for local events)
    if (notifyLocal) {
      this.notifyListeners(match, eventType);
    }
  }

  /**
   * Send a direct duel challenge to a specific classmate
   */
  public sendChallenge(match: ActiveDuelMatch) {
    this.broadcast(match, 'challenge_sent');
  }

  /**
   * Create an Open Duel that ANY student in the same group can join
   */
  public createOpenDuel(match: ActiveDuelMatch): ActiveDuelMatch {
    const openMatch: ActiveDuelMatch = {
      ...match,
      isOpenDuel: true,
      opponentId: 'open',
      opponentName: 'Waiting for Challenger...',
      status: 'pending',
    };

    // Save to open duels list
    const openDuels = this.getActiveOpenDuels();
    openDuels.push(openMatch);
    this.saveOpenDuels(openDuels);

    this.broadcast(openMatch, 'open_duel_created', true);
    return openMatch;
  }

  /**
   * Retrieve active, unexpired open duels (optionally filtered by group)
   */
  public getActiveOpenDuels(groupId?: string): ActiveDuelMatch[] {
    try {
      const raw = localStorage.getItem(OPEN_DUELS_STORAGE_KEY);
      if (!raw) return [];
      const duels = JSON.parse(raw) as ActiveDuelMatch[];
      const now = Date.now();
      // Filter unexpired (max 60 seconds) and pending status
      const valid = duels.filter(d => d.status === 'pending' && d.expiresAt > now);

      if (groupId) {
        return valid.filter(d => !d.groupId || d.groupId === groupId);
      }
      return valid;
    } catch {
      return [];
    }
  }

  private saveOpenDuels(duels: ActiveDuelMatch[]) {
    try {
      localStorage.setItem(OPEN_DUELS_STORAGE_KEY, JSON.stringify(duels));
    } catch {
      // Ignored
    }
  }

  /**
   * Join an open duel hosted by another student
   */
  public joinOpenDuel(matchId: string, joiner: UserProfile): ActiveDuelMatch | null {
    const openDuels = this.getActiveOpenDuels();
    const targetIdx = openDuels.findIndex(d => d.matchId === matchId);
    if (targetIdx === -1) return null;

    const targetMatch = openDuels[targetIdx];
    const acceptedMatch: ActiveDuelMatch = {
      ...targetMatch,
      opponentId: joiner.id,
      opponentName: joiner.name || 'Opponent',
      opponentCharacter: joiner.character,
      status: 'accepted',
    };

    // Remove from open duels
    openDuels.splice(targetIdx, 1);
    this.saveOpenDuels(openDuels);

    // Broadcast that the open duel is accepted
    this.broadcast(acceptedMatch, 'challenge_accepted', true);
    return acceptedMatch;
  }

  /**
   * Cancel an open duel hosted by current user
   */
  public cancelOpenDuel(matchId: string) {
    const openDuels = this.getActiveOpenDuels().filter(d => d.matchId !== matchId);
    this.saveOpenDuels(openDuels);

    const dummyMatch: ActiveDuelMatch = {
      matchId,
      challengerId: '',
      challengerName: '',
      challengerCharacter: {} as any,
      opponentId: '',
      opponentName: '',
      opponentCharacter: {} as any,
      roundSize: 10,
      diamondReward: 1,
      drillType: 'mixed',
      questions: [],
      status: 'declined',
      createdAt: Date.now(),
      expiresAt: Date.now(),
    };

    this.broadcast(dummyMatch, 'open_duel_cancelled', true);
  }

  /**
   * Accept an incoming challenge (Player 2)
   */
  public acceptChallenge(match: ActiveDuelMatch) {
    const updated: ActiveDuelMatch = {
      ...match,
      status: 'accepted',
    };
    this.broadcast(updated, 'challenge_accepted', true);
    return updated;
  }

  /**
   * Decline or cancel an incoming/outgoing challenge
   */
  public declineChallenge(match: ActiveDuelMatch) {
    const updated: ActiveDuelMatch = {
      ...match,
      status: 'declined',
    };
    // Also remove from open duels if it was open
    if (match.isOpenDuel) {
      this.cancelOpenDuel(match.matchId);
    }
    this.broadcast(updated, 'challenge_declined', true);
    return updated;
  }

  /**
   * Submit round results (either Player 1 or Player 2)
   */
  public submitPlayerResult(
    match: ActiveDuelMatch, 
    userId: string, 
    score: number, 
    time: number
  ): ActiveDuelMatch {
    const isChallenger = userId === match.challengerId;
    const updated: ActiveDuelMatch = {
      ...match,
      challengerResult: isChallenger ? { score, time } : match.challengerResult,
      opponentResult: !isChallenger ? { score, time } : match.opponentResult,
    };

    if (updated.challengerResult && updated.opponentResult) {
      updated.status = 'completed';
      this.broadcast(updated, 'match_completed', true);
    } else {
      this.broadcast(updated, 'score_updated', true);
    }

    return updated;
  }
}

export const peerDuelService = new PeerDuelManager();
