import { UserProfile, CharacterConfig } from '../types';
import { INITIAL_ACCOUNTS } from '../data/accountsData';

const ACCOUNTS_STORAGE_KEY = 'play_learn_compete_accounts_v2';
const ACTIVE_USER_ID_KEY = 'play_learn_compete_active_uid_v2';
const LEGACY_STORAGE_KEY = 'play_learn_compete_user_v1';

export const DEFAULT_CHARACTER: CharacterConfig = {
  gender: 'man',
  skinTone: '#F0C08A',
  hairStyle: 'fade',
  hairColor: '#1E293B',
  outfit: 'hoodie',
  outfitColor: '#6366F1',
  hat: 'none',
  glasses: 'none',
  accessory: 'none',
  pet: 'none',
  background: 'default',
  expression: 'idle',
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_' + Math.random().toString(36).substring(2, 9),
  name: '',
  role: 'student',
  isOnboarded: false,
  character: DEFAULT_CHARACTER,
  levelId: 'beginner',
  currentUnitId: 'u1',
  xp: 0,
  coins: 0,
  diamonds: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString(),
  inventory: ['char_man', 'char_woman', 'outfit_hoodie_indigo', 'hair_fade_black'],
  unlockedStickers: ['sticker_lets_go'],
  unitMasteries: {},
  completedUnits: [],
  mistakes: [],
  soundEnabled: true,
  speechSpeed: 'normal',
  grammarLevel: 'level_1',
  grammarMasteries: {},
  completedGrammarTopics: [],
  completedGrammarExams: {},
  grammarMistakes: [],
  grammarHearts: 3,
};

export class StorageService {
  /**
   * Load all user and student accounts. Initializes with default accounts if not set.
   */
  public static loadAllAccounts(): UserProfile[] {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as UserProfile[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all initial accounts exist and admin has infinite coins
          const existingIds = new Set(parsed.map(a => a.id));
          const merged = [...parsed];
          for (const initAcc of INITIAL_ACCOUNTS) {
            if (!existingIds.has(initAcc.id)) {
              merged.push(initAcc);
            }
          }
          // Admin always has infinite coins and diamond currency initialized
          for (const acc of merged) {
            acc.diamonds = typeof acc.diamonds === 'number' ? acc.diamonds : 0;
            if (acc.role === 'admin') {
              acc.coins = 999999;
              acc.diamonds = 999999;
            }
          }
          return merged;
        }
      }
    } catch {
      // Fallback
    }

    // Initialize with default accounts
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
    } catch {
      // Storage error
    }
    return INITIAL_ACCOUNTS;
  }

  /**
   * Reset accounts back to initial starter profiles
   */
  public static resetToInitialAccounts(): UserProfile[] {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
    } catch {
      // Storage error
    }
    return INITIAL_ACCOUNTS;
  }

  /**
   * Save all accounts array.
   */
  public static saveAllAccounts(accounts: UserProfile[]): void {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch {
      // Storage full or unavailable
    }
  }

  /**
   * Get the active logged in user ID.
   */
  public static getActiveUserId(): string | null {
    try {
      const id = localStorage.getItem(ACTIVE_USER_ID_KEY);
      if (id) return id;
    } catch {
      // Ignored
    }
    return null;
  }

  /**
   * Set active logged in user ID.
   */
  public static setActiveUserId(userId: string): void {
    try {
      localStorage.setItem(ACTIVE_USER_ID_KEY, userId);
    } catch {
      // Ignored
    }
  }

  /**
   * Clear active session (log out).
   */
  public static clearActiveSession(): void {
    try {
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
    } catch {
      // Ignored
    }
  }

  /**
   * Load the active user profile.
   */
  public static loadProfile(): UserProfile {
    const all = this.loadAllAccounts();
    const activeId = this.getActiveUserId();
    const found = all.find(a => a.id === activeId);
    if (found) {
      if (found.role === 'admin') {
        found.coins = 999999;
        found.diamonds = 999999;
      }
      return found;
    }
    const fallback = all.find(a => a.role !== 'admin') || all[0] || INITIAL_ACCOUNTS[1] || INITIAL_ACCOUNTS[0];
    return fallback;
  }

  /**
   * Save or update an account in the accounts repository.
   */
  public static saveProfile(profile: UserProfile): void {
    const all = this.loadAllAccounts();
    const index = all.findIndex(a => a.id === profile.id);
    if (index >= 0) {
      all[index] = { ...profile };
    } else {
      all.push({ ...profile });
    }
    this.saveAllAccounts(all);
    // Only update active user id if there is an active session
    if (this.getActiveUserId() !== null) {
      this.setActiveUserId(profile.id);
    }
  }

  /**
   * Add a brand new student account.
   */
  public static addAccount(newProfile: UserProfile): void {
    const all = this.loadAllAccounts();
    all.push(newProfile);
    this.saveAllAccounts(all);
  }

  /**
   * Delete an account by ID.
   */
  public static deleteAccount(userId: string): void {
    const all = this.loadAllAccounts().filter(a => a.id !== userId);
    this.saveAllAccounts(all);
  }

  public static clearProfile(): void {
    try {
      localStorage.removeItem(ACTIVE_USER_ID_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignored
    }
  }
}
