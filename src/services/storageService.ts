import { UserProfile, CharacterConfig } from '../types';
import { INITIAL_ACCOUNTS } from '../data/accountsData';

const ACCOUNTS_STORAGE_KEY = 'play_learn_compete_accounts_v2';
const ACTIVE_USER_ID_KEY = 'play_learn_compete_active_uid_v3';
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
  unitWordProgress: {},
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


export function sanitizeProfile(raw: any): UserProfile {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_PROFILE };
  }

  const role = raw.role === 'admin' ? 'admin' : (raw.role === 'support' ? 'support' : 'student');
  const defaultChar = role === 'admin' 
    ? { ...DEFAULT_CHARACTER, gender: 'man' as const, expression: 'victory' as const }
    : { ...DEFAULT_CHARACTER, gender: (raw.character?.gender === 'woman' ? 'woman' : 'man') };

  return {
    ...DEFAULT_PROFILE,
    ...raw,
    id: raw.id || ('usr_' + Math.random().toString(36).substring(2, 9)),
    name: raw.name || (role === 'admin' ? 'Teacher Admin' : role === 'support' ? 'Roziya' : 'Student'),
    username: (raw.username || '').toLowerCase().trim(),
    password: raw.password || '',
    role,
    isOnboarded: raw.isOnboarded !== undefined ? raw.isOnboarded : true,
    character: {
      ...defaultChar,
      ...(raw.character && typeof raw.character === 'object' ? raw.character : {}),
    },
    levelId: raw.levelId || 'beginner',
    currentUnitId: raw.currentUnitId || (raw.levelId === 'elementary' ? 'el_u1' : raw.levelId === 'pre_intermediate' ? 'pre_u0' : 'u1'),
    xp: typeof raw.xp === 'number' ? raw.xp : (role === 'admin' ? 590 : role === 'support' ? 410 : 0),
    coins: role === 'admin' ? 999999 : (typeof raw.coins === 'number' ? raw.coins : 20),
    diamonds: role === 'admin' ? 999999 : (typeof raw.diamonds === 'number' ? raw.diamonds : 0),
    streakDays: typeof raw.streakDays === 'number' ? raw.streakDays : 1,
    lastActiveDate: raw.lastActiveDate || new Date().toISOString(),
    lastSeenAt: raw.lastSeenAt,
    isOnline: raw.isOnline ?? false,
    totalTimeSpentMinutes: typeof raw.totalTimeSpentMinutes === 'number' ? raw.totalTimeSpentMinutes : 0,
    todayTimeSpentMinutes: typeof raw.todayTimeSpentMinutes === 'number' ? raw.todayTimeSpentMinutes : 0,
    dailyTimeSpent: (raw.dailyTimeSpent && typeof raw.dailyTimeSpent === 'object') ? raw.dailyTimeSpent : {},
    lastLoginAt: raw.lastLoginAt,
    loginHistory: Array.isArray(raw.loginHistory) ? raw.loginHistory : [],
    inventory: Array.isArray(raw.inventory) && raw.inventory.length > 0 ? raw.inventory : DEFAULT_PROFILE.inventory,
    unlockedStickers: Array.isArray(raw.unlockedStickers) && raw.unlockedStickers.length > 0 ? raw.unlockedStickers : DEFAULT_PROFILE.unlockedStickers,
    unitMasteries: (raw.unitMasteries && typeof raw.unitMasteries === 'object') ? raw.unitMasteries : {},
    unitWordProgress: (raw.unitWordProgress && typeof raw.unitWordProgress === 'object') ? raw.unitWordProgress : {},
    completedUnits: Array.isArray(raw.completedUnits) ? raw.completedUnits : [],
    grammarMasteries: (raw.grammarMasteries && typeof raw.grammarMasteries === 'object') ? raw.grammarMasteries : {},
    completedGrammarTopics: Array.isArray(raw.completedGrammarTopics) ? raw.completedGrammarTopics : [],
    completedGrammarExams: (raw.completedGrammarExams && typeof raw.completedGrammarExams === 'object') ? raw.completedGrammarExams : {},
    grammarMistakes: Array.isArray(raw.grammarMistakes) ? raw.grammarMistakes : [],
    mistakes: Array.isArray(raw.mistakes) ? raw.mistakes : [],
    claimedPrizes: Array.isArray(raw.claimedPrizes) ? raw.claimedPrizes : [],
    soundEnabled: raw.soundEnabled !== undefined ? raw.soundEnabled : true,
    speechSpeed: raw.speechSpeed || 'normal',
    grammarLevel: raw.grammarLevel || 'level_1',
    grammarHearts: typeof raw.grammarHearts === 'number' ? raw.grammarHearts : 5,
  };
}

export class StorageService {
  /**
   * Load all user and student accounts. Initializes with default accounts if not set.
   */
  public static loadAllAccounts(): UserProfile[] {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as UserProfile[];
          // Migrate legacy robiya -> roziya and om19 -> omina in existing accounts
          for (const acc of parsed) {
            if (acc.username === 'robiya' || acc.id === 'usr_robiya') {
              acc.id = 'usr_roziya';
              acc.name = 'Roziya';
              acc.username = 'roziya';
            }
            if (acc.username === 'omina' && (acc.password === 'om19' || !acc.password)) {
              acc.password = 'omina';
            }
          }

          try {
            const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
            if (activeId === 'usr_robiya') {
              localStorage.setItem(ACTIVE_USER_ID_KEY, 'usr_roziya');
            }
          } catch {
            // Ignored
          }

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
            if (acc.username === 'omina' && acc.password === 'om19') {
              acc.password = 'omina';
            }
          }
          const sanitized = merged.map(acc => sanitizeProfile(acc));
          try {
            localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(sanitized));
          } catch {
            // Ignored
          }
          return sanitized;
      }
    } catch {
      // Fallback
    }

    // Initialize with default accounts
    try {
      const sanitizedInitial = INITIAL_ACCOUNTS.map(acc => sanitizeProfile(acc));
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(sanitizedInitial));
      return sanitizedInitial;
    } catch {
      // Storage error
    }
    return INITIAL_ACCOUNTS.map(acc => sanitizeProfile(acc));
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
      sessionStorage.removeItem(ACTIVE_USER_ID_KEY);
      localStorage.removeItem('play_learn_compete_active_uid_v2');
      localStorage.removeItem('play_learn_compete_active_uid_v1');
      localStorage.removeItem('play_learn_compete_active_user_v1');
      localStorage.removeItem('play_learn_compete_user_v1');
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
      return sanitizeProfile(found);
    }
    const fallback = all.find(a => a.role !== 'admin') || all[0] || INITIAL_ACCOUNTS[1] || INITIAL_ACCOUNTS[0];
    return sanitizeProfile(fallback);
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
