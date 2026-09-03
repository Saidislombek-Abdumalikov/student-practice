import { getSupabaseClient } from './supabaseClient';
import { CharacterConfig } from '../types';

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
  opponentId: string;
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
}

type DuelListener = (match: ActiveDuelMatch, eventType: string) => void;

class PeerDuelManager {
  private channel: any = null;
  private listeners: Set<DuelListener> = new Set();
  private isSubscribed = false;

  constructor() {
    this.initRealtime();
    // Also listen to local window storage events for same-device/different-tab real-time testing
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
    this.listeners.forEach(fn => fn(match, eventType));
  }

  public broadcast(match: ActiveDuelMatch, eventType: string) {
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
      localStorage.setItem('peer_duel_realtime_event', JSON.stringify({
        match,
        eventType,
        timestamp: Date.now(),
      }));
    }
  }

  /**
   * Send a real duel challenge to a classmate
   */
  public sendChallenge(match: ActiveDuelMatch) {
    this.broadcast(match, 'challenge_sent');
  }

  /**
   * Accept an incoming challenge (Player 2)
   */
  public acceptChallenge(match: ActiveDuelMatch) {
    const updated: ActiveDuelMatch = {
      ...match,
      status: 'accepted',
    };
    this.broadcast(updated, 'challenge_accepted');
    return updated;
  }

  /**
   * Decline an incoming challenge
   */
  public declineChallenge(match: ActiveDuelMatch) {
    const updated: ActiveDuelMatch = {
      ...match,
      status: 'declined',
    };
    this.broadcast(updated, 'challenge_declined');
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
      this.broadcast(updated, 'match_completed');
    } else {
      this.broadcast(updated, 'score_updated');
    }

    return updated;
  }
}

export const peerDuelService = new PeerDuelManager();
