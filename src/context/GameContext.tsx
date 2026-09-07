import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  StudentGroup,
  CharacterConfig, 
  LevelId, 
  AppScreen, 
  ShopItem, 
  ShopCategory, 
  CurriculumUnit, 
  VocabularyWord,
  Achievement,
  StickerItem,
  MistakeRecord,
  GrammarLevelId,
  GrammarTopic,
  GrammarQuestion,
  GrammarMistakeRecord,
  GrammarExamResult,
  CharacterExpression,
  CharacterGender,
  MysteryBoxPrize,
  MysteryBoxTier,
  ClaimedPrizeRecord
} from '../types';
import { MysteryBoxService, MYSTERY_BOX_PRICES } from '../services/mysteryBoxService';
import { GroupService } from '../services/groupService';
import { StorageService, DEFAULT_CHARACTER, DEFAULT_PROFILE, sanitizeProfile, deduplicateAccounts } from '../services/storageService';
import { sanitizeAccountListForViewer } from '../services/presenceService';
import { CURRICULUM_UNITS } from '../data/curriculumData';
import { SHOP_ITEMS, STICKERS } from '../data/shopData';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { soundService } from '../services/soundService';
import { 
  GRAMMAR_CURRICULUM, 
  GRAMMAR_LEVEL_META, 
  getAllGrammarTopics, 
  getGrammarTopicById, 
  getRecommendedNextTopic 
} from '../data/grammar';
import { OutfitPreset, OUTFIT_PRESETS } from '../data/outfitPresets';
import { SupabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface GameContextType {
  profile: UserProfile;
  currentScreen: AppScreen;
  activeUnitId: string;
  curriculumUnits: CurriculumUnit[];
  achievements: Achievement[];
  stickers: StickerItem[];
  levelNumber: number;
  xpProgressPercent: number;
  currentLevelXp: number;
  nextLevelThresholdXp: number;

  // Grammar System Enhancements
  activeGrammarLevel: GrammarLevelId;
  activeGrammarTopicId: string;
  activeGrammarTopic: GrammarTopic | undefined;
  overallGrammarProgress: number;
  weakGrammarTopics: GrammarTopic[];
  strongGrammarTopics: GrammarTopic[];
  recommendedGrammarTopic: GrammarTopic;
  setActiveGrammarLevel: (level: GrammarLevelId) => void;
  setActiveGrammarTopicId: (topicId: string) => void;
  recordGrammarAttempt: (topicId: string, correct: number, total: number, isTest?: boolean) => void;
  recordGrammarMistake: (topicId: string, topicTitle: string, question: GrammarQuestion, studentAnswer: string) => void;
  resolveGrammarMistake: (questionId: string) => void;
  recordLevelExamResult: (levelId: GrammarLevelId, score: number, total: number) => GrammarExamResult;

  // Authentication & Account Management
  isAuthenticated: boolean;
  allAccounts: UserProfile[];
  login: (username: string, password: string) => { success: boolean; message?: string };
  loginAsUser: (userId: string) => void;
  logout: () => void;
  awardStudent: (studentId: string, xpDelta: number, coinsDelta: number, streakDelta?: number) => void;
  createNewStudent: (data: { name: string; username: string; password: string; gender: CharacterGender; levelId: LevelId; groupId?: string }) => { success: boolean; message?: string };
  // Student Groups Management & Class Isolation
  groups: StudentGroup[];
  currentStudentGroup: StudentGroup | undefined;
  createGroup: (data: { name: string; levelId: LevelId; description?: string; studentIds?: string[] }) => StudentGroup;
  updateGroup: (id: string, updates: Partial<StudentGroup>) => StudentGroup | undefined;
  deleteGroup: (id: string) => void;
  assignStudentToGroup: (studentId: string, groupId: string) => void;
  removeStudentFromGroup: (studentId: string) => void;
  resetStudentPassword: (studentId: string, newPass: string) => void;
  resetStudentProgress: (studentId: string) => void;
  resetAdminProgress: () => void;
  resetAllStudentsProgress: (includeAdmin?: boolean) => Promise<void>;
  deleteStudentAccount: (studentId: string) => void;
  boxPrices: Record<MysteryBoxTier, number>;
  updateBoxPrices: (prices: Record<MysteryBoxTier, number>) => void;
  isCloudConnected: boolean;
  syncWithCloud: () => Promise<void>;

  setScreen: (screen: AppScreen) => void;
  setActiveUnitId: (unitId: string) => void;
  updateCharacter: (config: Partial<CharacterConfig>) => void;
  updateLevel: (levelId: LevelId) => void;
  updateOwnStats: (updates: { xp?: number; streakDays?: number; coins?: number; diamonds?: number }) => void;
  updateStudentCharacter: (studentId: string, config: Partial<CharacterConfig>) => void;
  applyOutfitPreset: (preset: OutfitPreset) => void;
  buyOutfitPreset: (preset: OutfitPreset) => boolean;
  setCharacterMood: (expression: CharacterExpression) => void;
  cycleCharacterMood: () => void;
  completeOnboarding: (name: string, character: CharacterConfig, levelId: LevelId) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addDiamonds: (amount: number) => void;
  tradeDiamondsForCoins: (diamondCount?: number) => boolean;
  awardDiamondToAccount: (accountId: string, amount?: number) => void;
  updateStudentDiamonds: (accountId: string, amount: number) => void;
  updateStudentXP: (accountId: string, amount: number) => void;
  buyShopItem: (item: ShopItem) => boolean;
  equipShopItem: (category: ShopCategory, itemValue: string) => void;
  unequipShopItem: (category: ShopCategory) => void;
  recordMistake: (word: VocabularyWord) => void;
  resolveMistake: (wordId: string) => void;
  recordPracticeResult: (unitId: string, completedWordsOrCount: string[] | number, lastIndexOrTotal?: number) => void;
  getUnitProgress: (unitId: string) => {
    completedCount: number;
    totalCount: number;
    percent: number;
    lastWordIndex: number;
    nextWordIndex: number;
    completedWordIds: string[];
  };
  toggleSound: () => void;
  resetProgress: () => void;
  openMysteryBox: (tier: MysteryBoxTier) => { success: boolean; prize?: MysteryBoxPrize; message?: string };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return StorageService.getActiveUserId() !== null;
  });
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.loadProfile());
  const [groups, setGroups] = useState<StudentGroup[]>(() => GroupService.getGroups());

  const currentStudentGroup = useMemo(() => {
    return groups.find(g => g.id === profile.groupId || g.studentIds.includes(profile.id));
  }, [groups, profile.groupId, profile.id]);

  const createGroup = (data: { name: string; levelId: LevelId; description?: string; studentIds?: string[] }) => {
    const newGroup = GroupService.createGroup(data);
    setGroups(GroupService.getGroups());
    refreshAccounts();
    return newGroup;
  };

  const updateGroup = (id: string, updates: Partial<StudentGroup>) => {
    const updated = GroupService.updateGroup(id, updates);
    setGroups(GroupService.getGroups());
    refreshAccounts();
    return updated;
  };

  const deleteGroup = (id: string) => {
    GroupService.deleteGroup(id);
    setGroups(GroupService.getGroups());
    refreshAccounts();
  };

  const assignStudentToGroup = (studentId: string, groupId: string) => {
    GroupService.assignStudentToGroup(studentId, groupId);
    setGroups(GroupService.getGroups());
    refreshAccounts();
    if (profile.id === studentId) {
      setProfile(prev => ({ ...prev, groupId }));
    }
  };

  const removeStudentFromGroup = (studentId: string) => {
    GroupService.removeStudentFromGroup(studentId);
    setGroups(GroupService.getGroups());
    refreshAccounts();
    if (profile.id === studentId) {
      setProfile(prev => {
        const copy = { ...prev };
        delete copy.groupId;
        return copy;
      });
    }
  };
  const [allAccounts, setAllAccounts] = useState<UserProfile[]>(() => StorageService.loadAllAccounts());
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const activeUid = StorageService.getActiveUserId();
    if (!activeUid) {
      return 'login';
    }
    const prof = StorageService.loadProfile();
    return prof.role === 'admin' ? 'admin' : (prof.role === 'support' ? 'support' : 'home');
  });
  const [activeUnitId, setActiveUnitId] = useState<string>(() => 
    profile.currentUnitId || (profile.levelId === 'elementary' ? 'el_u1' : profile.levelId === 'pre_intermediate' ? 'pre_u0' : 'u1')
  );
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [stickers, setStickers] = useState<StickerItem[]>(STICKERS);

  // Sync activeUnitId when profile or student changes
  useEffect(() => {
    if (profile.currentUnitId) {
      setActiveUnitId(profile.currentUnitId);
    } else {
      const def = profile.levelId === 'elementary' ? 'el_u1' : profile.levelId === 'pre_intermediate' ? 'pre_u0' : 'u1';
      setActiveUnitId(def);
    }
  }, [profile.id, profile.levelId]);

  const refreshAccounts = () => {
    setAllAccounts(StorageService.loadAllAccounts());
  };

  // Active Grammar Level & Topic
  const [activeGrammarLevel, setActiveGrammarLevel] = useState<GrammarLevelId>(() => profile.grammarLevel || 'level_1');
  const [activeGrammarTopicId, setActiveGrammarTopicId] = useState<string>('l1_u1_t1');

  // Cloud sync status
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(() => isSupabaseConfigured());

  // Editable Mystery Box Diamond Prices
  const [boxPrices, setBoxPrices] = useState<Record<MysteryBoxTier, number>>(() => MysteryBoxService.getBoxPrices());

  const updateBoxPrices = (prices: Record<MysteryBoxTier, number>) => {
    MysteryBoxService.saveBoxPrices(prices);
    setBoxPrices({ ...prices });
    soundService.playSuccess();
  };

  // Cloud sync handler with intelligent merge (preserves local avatar and progress)
  const syncWithCloud = async () => {
    if (!isSupabaseConfigured()) {
      setIsCloudConnected(false);
      return;
    }
    try {
      const remote = await SupabaseService.fetchRemoteAccounts();
      if (remote && remote.length > 0) {
        const localAccounts = StorageService.loadAllAccounts();
        const merged = localAccounts.map(local => {
          const rem = remote.find(r => r.id === local.id);
          if (!rem) {
            SupabaseService.saveAccountToRemote(local);
            return local;
          }
          const localTime = new Date(local.lastActiveDate || 0).getTime();
          const remTime = new Date(rem.lastActiveDate || 0).getTime();
          // Newest action always wins! A deliberate reset with a recent timestamp will never be reverted by old higher XP.
          if (localTime >= remTime) {
            SupabaseService.saveAccountToRemote(local);
            return local;
          }
          return rem;
        });

        for (const rem of remote) {
          if (!merged.some(m => m.id === rem.id || (m.username && rem.username && m.username.toLowerCase() === rem.username.toLowerCase()))) {
            merged.push(rem);
          }
        }

        const dedupedMerged = deduplicateAccounts(merged);
        StorageService.saveAllAccounts(dedupedMerged);
        setAllAccounts([...dedupedMerged]);
        setIsCloudConnected(true);

        const activeId = StorageService.getActiveUserId();
        if (activeId) {
          const current = dedupedMerged.find(r => r.id === activeId || (r.username && profile.username && r.username.toLowerCase() === profile.username.toLowerCase()));
          if (current) {
            setProfile(sanitizeProfile(current));
          }
        }
      } else if (remote && remote.length === 0) {
        await SupabaseService.saveAllAccountsToRemote(allAccounts);
        setIsCloudConnected(true);
      }
    } catch {
      setIsCloudConnected(false);
    }
  };

  // Multi-device real-time sync: Listen for changes across devices + focus/online
  useEffect(() => {
    syncWithCloud();

    // Realtime Supabase push updates across all connected devices (phones, tablets, PCs)
    const unsubscribe = SupabaseService.subscribeToRemoteAccounts(() => {
      syncWithCloud();
    });

    // Auto-sync when user returns to tab or reconnects to WiFi
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncWithCloud();
      }
    };
    const handleOnline = () => syncWithCloud();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  
  // Active Presence & Time Tracking Heartbeat (Throttled, updates active time & lastSeen)
  useEffect(() => {
    if (!isAuthenticated || !profile.id) return;

    const recordActiveMinute = () => {
      const now = new Date();
      const nowIso = now.toISOString();
      const todayKey = nowIso.split('T')[0];

      setProfile(prev => {
        const prevDaily = prev.dailyTimeSpent || {};
        const updatedDaily = {
          ...prevDaily,
          [todayKey]: (prevDaily[todayKey] || 0) + 1,
        };

        return {
          ...prev,
          lastSeenAt: nowIso,
          isOnline: true,
          totalTimeSpentMinutes: (prev.totalTimeSpentMinutes || 0) + 1,
          todayTimeSpentMinutes: (prev.todayTimeSpentMinutes || 0) + 1,
          dailyTimeSpent: updatedDaily,
        };
      });
    };

    // Heartbeat every 60 seconds of active usage (while window is visible)
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        recordActiveMinute();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, profile.id]);

  // Sync with LocalStorage, allAccounts state, & Supabase (only when logged in)
  useEffect(() => {
    if (!isAuthenticated) return;
    StorageService.saveProfile(profile);
    setAllAccounts(prev => {
      const idx = prev.findIndex(a => a.id === profile.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...profile };
        return copy;
      }
      return [...prev, { ...profile }];
    });
    if (isSupabaseConfigured()) {
      SupabaseService.saveAccountToRemote(profile);
    }
  }, [profile, isAuthenticated]);

  // Sync Sound settings
  useEffect(() => {
    soundService.setMuted(!profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Level & XP Formula: Level = Math.floor(Math.sqrt(xp / 40)) + 1
  const levelNumber = Math.floor(Math.sqrt(profile.xp / 40)) + 1;
  const currentLevelBaseXp = Math.pow(levelNumber - 1, 2) * 40;
  const nextLevelThresholdXp = Math.pow(levelNumber, 2) * 40;
  const currentLevelXp = profile.xp - currentLevelBaseXp;
  const rangeXp = nextLevelThresholdXp - currentLevelBaseXp;
  const xpProgressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / rangeXp) * 100)));

  // Active Grammar Topic Object
  const activeGrammarTopic = useMemo(() => {
    return getGrammarTopicById(activeGrammarTopicId) || GRAMMAR_CURRICULUM[activeGrammarLevel][0]?.topics[0];
  }, [activeGrammarTopicId, activeGrammarLevel]);

  // Computed Grammar Analytics
  const currentLevelTopics = useMemo(() => {
    const units = GRAMMAR_CURRICULUM[activeGrammarLevel] || [];
    const topics: GrammarTopic[] = [];
    units.forEach(u => topics.push(...u.topics));
    return topics;
  }, [activeGrammarLevel]);

  const overallGrammarProgress = useMemo(() => {
    if (currentLevelTopics.length === 0) return 0;
    const completedInLevel = currentLevelTopics.filter(t => (profile.grammarMasteries[t.id] || 0) >= 80).length;
    return Math.round((completedInLevel / currentLevelTopics.length) * 100);
  }, [currentLevelTopics, profile.grammarMasteries]);

  const weakGrammarTopics = useMemo(() => {
    const all = getAllGrammarTopics();
    return all.filter(t => {
      const score = profile.grammarMasteries[t.id] || 0;
      return score > 0 && score < 70;
    });
  }, [profile.grammarMasteries]);

  const strongGrammarTopics = useMemo(() => {
    const all = getAllGrammarTopics();
    return all.filter(t => {
      const score = profile.grammarMasteries[t.id] || 0;
      return score >= 85;
    });
  }, [profile.grammarMasteries]);

  const recommendedGrammarTopic = useMemo(() => {
    return getRecommendedNextTopic(profile.completedGrammarTopics || [], activeGrammarLevel);
  }, [profile.completedGrammarTopics, activeGrammarLevel]);

  const updateLevel = (levelId: LevelId) => {
    soundService.playLevelUp();
    const defaultUnitId = levelId === 'elementary' ? 'el_u1' : levelId === 'pre_intermediate' ? 'pre_u0' : 'u1';
    setProfile(prev => {
      const updated = {
        ...prev,
        levelId,
        currentUnitId: defaultUnitId,
      };
      StorageService.saveProfile(updated);
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updated);
      }
      return updated;
    });
    setActiveUnitId(defaultUnitId);
  };

  const updateOwnStats = (updates: { xp?: number; streakDays?: number; coins?: number; diamonds?: number }) => {
    soundService.playSuccess();
    setProfile(prev => {
      const updated = {
        ...prev,
        ...updates,
      };
      StorageService.saveProfile(updated);
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updated);
      }
      return updated;
    });
    setAllAccounts(accounts => {
      const idx = accounts.findIndex(a => a.id === profile.id);
      if (idx >= 0) {
        const copy = [...accounts];
        copy[idx] = { ...copy[idx], ...updates };
        return copy;
      }
      return accounts;
    });
  };

  const updateCharacter = (partial: Partial<CharacterConfig>) => {
    setProfile(prev => {
      const updatedProfile: UserProfile = {
        ...prev,
        character: {
          ...prev.character,
          ...partial,
        },
        lastActiveDate: new Date().toISOString(),
      };
      StorageService.saveProfile(updatedProfile);
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === updatedProfile.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updatedProfile;
          StorageService.saveAllAccounts(copy);
          return copy;
        }
        return accounts;
      });
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updatedProfile);
      }
      return updatedProfile;
    });
  };

  const updateStudentCharacter = (studentId: string, partial: Partial<CharacterConfig>) => {
    if (studentId === profile.id) {
      updateCharacter(partial);
      return;
    }
    setAllAccounts(prev => {
      const updated = prev.map(acc => {
        if (acc.id === studentId) {
          return {
            ...acc,
            character: {
              ...acc.character,
              ...partial,
            },
          };
        }
        return acc;
      });
      StorageService.saveAllAccounts(updated);
      if (isSupabaseConfigured()) {
        const target = updated.find(a => a.id === studentId);
        if (target) SupabaseService.saveAccountToRemote(target);
      }
      return updated;
    });
  };

  const applyOutfitPreset = (preset: OutfitPreset) => {
    soundService.playLevelUp();
    setProfile(prev => {
      const newInventory = [...prev.inventory];
      for (const itemId of preset.includedItemIds) {
        if (!newInventory.includes(itemId)) {
          newInventory.push(itemId);
        }
      }
      const updatedProfile = {
        ...prev,
        character: {
          ...prev.character,
          ...preset.character,
        },
        inventory: newInventory,
      };
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === updatedProfile.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updatedProfile;
          return copy;
        }
        return accounts;
      });
      return updatedProfile;
    });
  };

  const buyOutfitPreset = (preset: OutfitPreset): boolean => {
    const isAdmin = profile.role === 'admin';
    if (!isAdmin && profile.coins < preset.bundlePrice) {
      soundService.playError();
      return false;
    }
    soundService.playSuccess();
    setProfile(prev => {
      const updatedCoins = isAdmin ? 999999 : prev.coins - preset.bundlePrice;
      const newInventory = [...prev.inventory];
      for (const itemId of preset.includedItemIds) {
        if (!newInventory.includes(itemId)) {
          newInventory.push(itemId);
        }
      }
      const updatedProfile = {
        ...prev,
        coins: updatedCoins,
        character: {
          ...prev.character,
          ...preset.character,
        },
        inventory: newInventory,
      };
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === updatedProfile.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updatedProfile;
          return copy;
        }
        return accounts;
      });
      return updatedProfile;
    });
    return true;
  };

  const setCharacterMood = (expression: CharacterExpression) => {
    soundService.playClick();
    updateCharacter({ expression });
  };

  const cycleCharacterMood = () => {
    const expressions: CharacterExpression[] = ['happy', 'victory', 'thinking', 'idle', 'oops'];
    const currentIdx = expressions.indexOf(profile.character.expression);
    const nextExpr = expressions[(currentIdx + 1) % expressions.length];
    soundService.playSuccess();
    updateCharacter({ expression: nextExpr });
  };

  const completeOnboarding = (name: string, character: CharacterConfig, levelId: LevelId) => {
    setProfile(prev => ({
      ...prev,
      name: name.trim() || 'Hero Learner',
      character,
      levelId,
      isOnboarded: true,
      xp: 50,
      coins: 100, // Starter bonus
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
    }));
    soundService.playLevelUp();
    setCurrentScreen('home');
  };

  const addXP = (amount: number) => {
    setProfile(prev => {
      const oldLevel = Math.floor(Math.sqrt(prev.xp / 40)) + 1;
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(Math.sqrt(newXp / 40)) + 1;

      if (newLevel > oldLevel) {
        soundService.playLevelUp();
      }
      const updated = {
        ...prev,
        xp: newXp,
        lastActiveDate: new Date().toISOString(),
      };
      StorageService.saveProfile(updated);
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === prev.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updated;
          StorageService.saveAllAccounts(copy);
          return copy;
        }
        return accounts;
      });
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updated);
      }
      return updated;
    });
  };

  const addCoins = (amount: number) => {
    soundService.playCoin();
    setProfile(prev => {
      const updated = {
        ...prev,
        coins: prev.role === 'admin' ? 999999 : prev.coins + amount,
        lastActiveDate: new Date().toISOString(),
      };
      StorageService.saveProfile(updated);
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === prev.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updated;
          StorageService.saveAllAccounts(copy);
          return copy;
        }
        return accounts;
      });
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updated);
      }
      return updated;
    });
  };

  const addDiamonds = (amount: number) => {
    soundService.playLevelUp();
    setProfile(prev => {
      const newDiamonds = prev.role === 'admin' ? 999999 : (prev.diamonds || 0) + amount;
      const updated = {
        ...prev,
        diamonds: newDiamonds,
      };
      StorageService.saveProfile(updated);
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === prev.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updated;
          return copy;
        }
        return accounts;
      });
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updated);
      }
      return updated;
    });
  };

  const tradeDiamondsForCoins = (diamondCount: number = 1): boolean => {
    const currentDiamonds = profile.diamonds || 0;
    if (profile.role !== 'admin' && (currentDiamonds < diamondCount || diamondCount <= 0)) {
      soundService.playError();
      return false;
    }
    const coinsToAdd = diamondCount * 5;
    soundService.playCoin();
    setProfile(prev => {
      const updated = {
        ...prev,
        diamonds: prev.role === 'admin' ? 999999 : Math.max(0, (prev.diamonds || 0) - diamondCount),
        coins: prev.role === 'admin' ? 999999 : prev.coins + coinsToAdd,
      };
      StorageService.saveProfile(updated);
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === prev.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updated;
          return copy;
        }
        return accounts;
      });
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updated);
      }
      return updated;
    });
    return true;
  };

  const awardDiamondToAccount = (accountId: string, amount: number = 1) => {
    soundService.playLevelUp();
    if (accountId === profile.id) {
      addDiamonds(amount);
      return;
    }
    setAllAccounts(prev => {
      const updated = prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            diamonds: (acc.diamonds || 0) + amount,
          };
        }
        return acc;
      });
      StorageService.saveAllAccounts(updated);
      if (isSupabaseConfigured()) {
        const target = updated.find(a => a.id === accountId);
        if (target) SupabaseService.saveAccountToRemote(target);
      }
      return updated;
    });
  };

  const updateStudentDiamonds = (accountId: string, amount: number) => {
    const validAmount = Math.max(0, Math.round(amount));
    soundService.playLevelUp();
    if (accountId === profile.id) {
      setProfile(prev => {
        const updated = { ...prev, diamonds: validAmount };
        StorageService.saveProfile(updated);
        return updated;
      });
    }
    setAllAccounts(prev => {
      const updated = prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            diamonds: validAmount,
          };
        }
        return acc;
      });
      StorageService.saveAllAccounts(updated);
      if (isSupabaseConfigured()) {
        const target = updated.find(a => a.id === accountId);
        if (target) SupabaseService.saveAccountToRemote(target);
      }
      return updated;
    });
  };

  const updateStudentXP = (accountId: string, amount: number) => {
    const validAmount = Math.max(0, Math.round(amount));
    soundService.playLevelUp();
    if (accountId === profile.id) {
      setProfile(prev => {
        const updated = { ...prev, xp: validAmount };
        StorageService.saveProfile(updated);
        return updated;
      });
    }
    setAllAccounts(prev => {
      const updated = prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            xp: validAmount,
          };
        }
        return acc;
      });
      StorageService.saveAllAccounts(updated);
      if (isSupabaseConfigured()) {
        const target = updated.find(a => a.id === accountId);
        if (target) SupabaseService.saveAccountToRemote(target);
      }
      return updated;
    });
  };

  const openMysteryBox = (tier: MysteryBoxTier): { success: boolean; prize?: MysteryBoxPrize; message?: string } => {
    const cost = MysteryBoxService.getPrice(tier);
    const isAdmin = profile.role === 'admin';
    if (!isAdmin && (profile.diamonds || 0) < cost) {
      soundService.playError();
      return { success: false, message: `Need ${cost} Diamonds to open this ${tier} box!` };
    }

    const prize = MysteryBoxService.rollPrize(tier);
    if (!prize) {
      soundService.playError();
      return { success: false, message: 'No prizes available in this box yet. Please ask teacher to add prizes!' };
    }

    soundService.playLevelUp();
    setProfile(prev => {
      let newDiamonds = isAdmin ? (prev.diamonds || 0) : Math.max(0, (prev.diamonds || 0) - cost);
      let newCoins = prev.coins;
      let newClaimed = [...(prev.claimedPrizes || [])];

      if (prize.type === 'coins' && prize.coinAmount) {
        newCoins = isAdmin ? 999999 : prev.coins + prize.coinAmount;
      } else if (prize.type === 'diamonds' && prize.diamondAmount) {
        newDiamonds = isAdmin ? 999999 : newDiamonds + prize.diamondAmount;
      } else {
        const claim: ClaimedPrizeRecord = {
          id: `clm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          prizeId: prize.id,
          prizeTitle: prize.title,
          tier,
          type: prize.type,
          description: prize.description,
          claimedAt: new Date().toISOString(),
          redeemed: false,
        };
        newClaimed.unshift(claim);
      }

      return {
        ...prev,
        diamonds: newDiamonds,
        coins: newCoins,
        claimedPrizes: newClaimed,
      };
    });

    return { success: true, prize };
  };

  const buyShopItem = (item: ShopItem): boolean => {
    const isAdmin = profile.role === 'admin';
    if (!isAdmin && profile.coins < item.price) {
      soundService.playError();
      return false;
    }
    soundService.playCoin();
    setProfile(prev => {
      const newInventory = prev.inventory.includes(item.id) 
        ? prev.inventory 
        : [...prev.inventory, item.id];

      const updatedChar = { ...prev.character };
      switch (item.category) {
        case 'clothes':
          updatedChar.outfit = item.itemValue as any;
          break;
        case 'hats':
          updatedChar.hat = item.itemValue as any;
          break;
        case 'glasses':
          updatedChar.glasses = item.itemValue as any;
          break;
        case 'accessories':
          updatedChar.accessory = item.itemValue as any;
          break;
        case 'pets':
          updatedChar.pet = item.itemValue as any;
          break;
        case 'backgrounds':
          updatedChar.background = item.itemValue as any;
          break;
      }

      return {
        ...prev,
        coins: isAdmin ? 999999 : prev.coins - item.price,
        inventory: newInventory,
        character: updatedChar,
      };
    });
    return true;
  };

  const equipShopItem = (category: ShopCategory, itemValue: string) => {
    soundService.playClick();
    setProfile(prev => {
      const updated = { ...prev.character };
      switch (category) {
        case 'clothes':
          updated.outfit = itemValue as any;
          break;
        case 'hats':
          updated.hat = itemValue as any;
          break;
        case 'glasses':
          updated.glasses = itemValue as any;
          break;
        case 'accessories':
          updated.accessory = itemValue as any;
          break;
        case 'pets':
          updated.pet = itemValue as any;
          break;
        case 'backgrounds':
          updated.background = itemValue as any;
          break;
      }
      const updatedProfile: UserProfile = {
        ...prev,
        character: updated,
        lastActiveDate: new Date().toISOString(),
      };
      StorageService.saveProfile(updatedProfile);
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === updatedProfile.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updatedProfile;
          StorageService.saveAllAccounts(copy);
          return copy;
        }
        return accounts;
      });
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updatedProfile);
      }
      return updatedProfile;
    });
  };

  const unequipShopItem = (category: ShopCategory) => {
    soundService.playClick();
    setProfile(prev => {
      const updated = { ...prev.character };
      switch (category) {
        case 'clothes':
          updated.outfit = 'casual_tee';
          break;
        case 'hats':
          updated.hat = 'none';
          break;
        case 'glasses':
          updated.glasses = 'none';
          break;
        case 'accessories':
          updated.accessory = 'none';
          break;
        case 'pets':
          updated.pet = 'none';
          break;
        case 'backgrounds':
          updated.background = 'default';
          break;
      }
      const updatedProfile: UserProfile = {
        ...prev,
        character: updated,
        lastActiveDate: new Date().toISOString(),
      };
      StorageService.saveProfile(updatedProfile);
      setAllAccounts(accounts => {
        const idx = accounts.findIndex(a => a.id === updatedProfile.id);
        if (idx >= 0) {
          const copy = [...accounts];
          copy[idx] = updatedProfile;
          StorageService.saveAllAccounts(copy);
          return copy;
        }
        return accounts;
      });
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(updatedProfile);
      }
      return updatedProfile;
    });
  };

  // Vocabulary Mistakes
  const recordMistake = (word: VocabularyWord) => {
    setProfile(prev => {
      const existingIdx = prev.mistakes.findIndex(m => m.wordId === word.id);
      let updatedMistakes = [...prev.mistakes];
      if (existingIdx >= 0) {
        const item = updatedMistakes[existingIdx];
        updatedMistakes[existingIdx] = {
          ...item,
          wrongCount: item.wrongCount + 1,
          lastMistakeTime: new Date().toISOString(),
          isMastered: false,
        };
      } else {
        const newMistake: MistakeRecord = {
          id: 'mistake_' + word.id,
          wordId: word.id,
          word: word.word,
          uzbekTranslation: word.uzbekTranslation,
          exampleSentence: word.exampleSentence,
          wrongCount: 1,
          lastMistakeTime: new Date().toISOString(),
          isMastered: false,
        };
        updatedMistakes.push(newMistake);
      }
      return {
        ...prev,
        mistakes: updatedMistakes,
      };
    });
  };

  const resolveMistake = (wordId: string) => {
    setProfile(prev => ({
      ...prev,
      mistakes: prev.mistakes.filter(m => m.wordId !== wordId),
    }));
  };

  // Grammar Attempt Recording & Mastery Calculation
  const recordGrammarAttempt = (topicId: string, correct: number, total: number, isTest = false) => {
    if (total === 0) return;
    const sessionAccuracy = Math.round((correct / total) * 100);

    setProfile(prev => {
      const currentMastery = prev.grammarMasteries[topicId] || 0;
      
      // If test: mastery reflects 70% test weight + 30% previous mastery
      // If practice: gentle incremental growth
      let newMastery: number;
      if (isTest) {
        newMastery = Math.max(currentMastery, Math.round(sessionAccuracy * 0.7 + currentMastery * 0.3));
        if (sessionAccuracy >= 80 && newMastery < 80) newMastery = 80;
      } else {
        newMastery = Math.max(currentMastery, Math.min(100, Math.round(currentMastery * 0.8 + sessionAccuracy * 0.2)));
      }

      const completed = newMastery >= 80 && !prev.completedGrammarTopics?.includes(topicId)
        ? [...(prev.completedGrammarTopics || []), topicId]
        : (prev.completedGrammarTopics || []);

      return {
        ...prev,
        grammarMasteries: {
          ...prev.grammarMasteries,
          [topicId]: newMastery,
        },
        completedGrammarTopics: completed,
      };
    });
  };

  // Grammar Mistakes Tracking
  const recordGrammarMistake = (
    topicId: string, 
    topicTitle: string, 
    question: GrammarQuestion, 
    studentAnswer: string
  ) => {
    setProfile(prev => {
      const currentList = prev.grammarMistakes || [];
      const existingIdx = currentList.findIndex(m => m.question.id === question.id);
      const updated = [...currentList];

      if (existingIdx >= 0) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          studentAnswer,
          wrongCount: updated[existingIdx].wrongCount + 1,
          lastMistakeTime: new Date().toISOString(),
          isMastered: false,
        };
      } else {
        const newRecord: GrammarMistakeRecord = {
          id: 'gmistake_' + question.id,
          topicId,
          topicTitle,
          question,
          studentAnswer,
          wrongCount: 1,
          lastMistakeTime: new Date().toISOString(),
          isMastered: false,
        };
        updated.push(newRecord);
      }

      return {
        ...prev,
        grammarMistakes: updated,
      };
    });
  };

  const resolveGrammarMistake = (questionId: string) => {
    setProfile(prev => ({
      ...prev,
      grammarMistakes: (prev.grammarMistakes || []).filter(m => m.question.id !== questionId),
    }));
  };

  // Final Level Certification Exam Result
  const recordLevelExamResult = (levelId: GrammarLevelId, score: number, total: number): GrammarExamResult => {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= 80;

    const result: GrammarExamResult = {
      levelId,
      score,
      total,
      percentage,
      passed,
      date: new Date().toISOString(),
    };

    if (passed) {
      soundService.playLevelUp();
      addXP(500);
      addCoins(150);
    }

    setProfile(prev => ({
      ...prev,
      completedGrammarExams: {
        ...prev.completedGrammarExams,
        [levelId]: result,
      },
    }));

    return result;
  };

  const getUnitProgress = (unitId: string) => {
    const unit = CURRICULUM_UNITS.find(u => u.id === unitId);
    const totalCount = unit ? unit.words.length : 1;
    const progress = profile.unitWordProgress?.[unitId];

    let completedWordIds: string[] = progress?.completedWordIds || [];
    // If completedWordIds is empty but unitMasteries has a value, seed completedWordIds from unit words
    if (completedWordIds.length === 0 && (profile.unitMasteries[unitId] || 0) > 0 && unit) {
      const count = Math.min(totalCount, Math.round(totalCount * ((profile.unitMasteries[unitId] || 0) / 100)));
      completedWordIds = unit.words.slice(0, count).map(w => w.id);
    }

    const completedCount = completedWordIds.length;
    const percent = Math.min(100, Math.round((completedCount / totalCount) * 100));
    const lastWordIndex = progress?.lastWordIndex ?? (completedCount > 0 ? completedCount - 1 : 0);
    const nextWordIndex = completedCount >= totalCount ? 0 : Math.min(totalCount - 1, Math.max(completedCount, lastWordIndex + 1));

    return {
      completedCount,
      totalCount,
      percent,
      lastWordIndex,
      nextWordIndex,
      completedWordIds,
    };
  };

  const recordPracticeResult = (
    unitId: string, 
    completedWordsOrCount: string[] | number, 
    lastIndexOrTotal?: number
  ) => {
    const unit = CURRICULUM_UNITS.find(u => u.id === unitId);
    const totalUnitWords = unit ? unit.words.length : 1;

    setProfile(prev => {
      const currentWordProgress = prev.unitWordProgress?.[unitId] || {
        completedWordIds: [],
        lastWordIndex: 0,
      };

      let newCompletedIds: string[];
      let newLastIndex: number;

      if (Array.isArray(completedWordsOrCount)) {
        // Exact list of word IDs completed/answered correctly in session
        const set = new Set([...currentWordProgress.completedWordIds, ...completedWordsOrCount]);
        newCompletedIds = Array.from(set);
        newLastIndex = typeof lastIndexOrTotal === 'number' ? lastIndexOrTotal : currentWordProgress.lastWordIndex;
      } else {
        // Backwards compatibility if called with count
        const correctCount = completedWordsOrCount;
        const wordsToAdd = unit ? unit.words.slice(0, correctCount).map(w => w.id) : [];
        const set = new Set([...currentWordProgress.completedWordIds, ...wordsToAdd]);
        newCompletedIds = Array.from(set);
        newLastIndex = typeof lastIndexOrTotal === 'number' ? lastIndexOrTotal : currentWordProgress.lastWordIndex;
      }

      // Actual percent of the unit finished
      const actualCompletedCount = newCompletedIds.length;
      const percentFinished = Math.min(100, Math.round((actualCompletedCount / Math.max(1, totalUnitWords)) * 100));

      const isUnitCompleted = percentFinished >= 100;
      const updatedCompletedUnits = isUnitCompleted && !prev.completedUnits.includes(unitId)
        ? [...prev.completedUnits, unitId]
        : prev.completedUnits;

      return {
        ...prev,
        unitMasteries: {
          ...prev.unitMasteries,
          [unitId]: percentFinished,
        },
        unitWordProgress: {
          ...(prev.unitWordProgress || {}),
          [unitId]: {
            completedWordIds: newCompletedIds,
            lastWordIndex: newLastIndex,
            lastPracticedAt: new Date().toISOString(),
          },
        },
        completedUnits: updatedCompletedUnits,
      };
    });
  };

  const toggleSound = () => {
    setProfile(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const resetProgress = () => {
    StorageService.clearProfile();
    setProfile({
      ...StorageService.loadProfile(),
      isOnboarded: false,
      character: DEFAULT_CHARACTER,
    });
    setCurrentScreen('home');
  };

  const login = (username: string, password: string): { success: boolean; message?: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();
    const latestAccounts = StorageService.loadAllAccounts();
    const found = latestAccounts.find(
      a => (a.username || '').toLowerCase() === trimmedUser && (a.password || '') === trimmedPass
    );

    if (!found) {
      return { success: false, message: 'Invalid username or password. Please try again.' };
    }

    const nowIso = new Date().toISOString();
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const newEntry = {
      timestamp: nowIso,
      device: isMobile ? 'Mobile' : 'Desktop',
    };

    const safeFound = sanitizeProfile({
      ...found,
      lastLoginAt: nowIso,
      lastSeenAt: nowIso,
      isOnline: true,
      loginHistory: [...(found.loginHistory || []).slice(-19), newEntry],
    });

    setProfile(safeFound);
    StorageService.saveProfile(safeFound);
    StorageService.setActiveUserId(safeFound.id);
    setIsAuthenticated(true);
    soundService.playSuccess();
    if (safeFound.role === 'admin') {
      setCurrentScreen('admin');
    } else if (safeFound.role === 'support') {
      setCurrentScreen('support');
    } else {
      setCurrentScreen('home');
    }
    return { success: true };
  };

  const loginAsUser = (userId: string) => {
    const latestAccounts = StorageService.loadAllAccounts();
    const found = latestAccounts.find(a => a.id === userId);
    if (found) {
      const nowIso = new Date().toISOString();
      const safeFound = sanitizeProfile({
        ...found,
        lastLoginAt: nowIso,
        lastSeenAt: nowIso,
        isOnline: true,
      });
      setProfile(safeFound);
      setIsAuthenticated(true);
      StorageService.setActiveUserId(found.id);
      soundService.playSuccess();
      if (found.role === 'admin') {
        setCurrentScreen('admin');
      } else if (found.role === 'support') {
        setCurrentScreen('support');
      } else {
        setCurrentScreen('home');
      }
    }
  };

  const logout = () => {
    soundService.playClick();
    if (profile && profile.id) {
      const accounts = StorageService.loadAllAccounts();
      const idx = accounts.findIndex(a => a.id === profile.id);
      if (idx >= 0) {
        accounts[idx].isOnline = false;
        accounts[idx].lastSeenAt = new Date().toISOString();
        StorageService.saveAllAccounts(accounts);
        if (isSupabaseConfigured()) {
          SupabaseService.saveAccountToRemote(accounts[idx]);
        }
      }
    }
    StorageService.clearActiveSession();
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const awardStudent = (studentId: string, xpDelta: number, coinsDelta: number, streakDelta = 0) => {
    const accounts = StorageService.loadAllAccounts();
    const idx = accounts.findIndex(a => a.id === studentId);
    if (idx >= 0) {
      const target = accounts[idx];
      target.xp = Math.max(0, target.xp + xpDelta);
      target.coins = Math.max(0, target.coins + coinsDelta);
      if (streakDelta) {
        target.streakDays = Math.max(1, target.streakDays + streakDelta);
      }
      StorageService.saveAllAccounts(accounts);
      setAllAccounts([...accounts]);
      if (profile.id === studentId) {
        setProfile({ ...target });
      }
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(target);
      }
      soundService.playLevelUp();
    }
  };

  const createNewStudent = (data: {
    name: string;
    username: string;
    password: string;
    gender: CharacterGender;
    levelId: LevelId;
    groupId?: string;
  }): { success: boolean; message?: string } => {
    const accounts = StorageService.loadAllAccounts();
    const existing = accounts.find(
      a => (a.username || '').toLowerCase() === data.username.trim().toLowerCase()
    );
    if (existing) {
      return { success: false, message: 'This username is already taken. Choose another.' };
    }

    const newStudent: UserProfile = {
      ...DEFAULT_PROFILE,
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: data.name.trim(),
      username: data.username.trim().toLowerCase(),
      password: data.password.trim(),
      role: 'student',
      isOnboarded: true,
      levelId: data.levelId,
      groupId: data.groupId,
      currentUnitId: data.levelId === 'elementary' ? 'el_u1' : data.levelId === 'pre_intermediate' ? 'pre_u0' : 'u1',
      xp: 150,
      coins: 50,
      streakDays: 1,
      character: {
        ...DEFAULT_CHARACTER,
        gender: data.gender,
        hairStyle: data.gender === 'woman' ? 'ponytail' : 'fade',
        hairColor: '#1E293B',
        outfitColor: data.gender === 'woman' ? '#F43F5E' : '#6366F1',
        expression: 'happy',
      },
    };

    StorageService.addAccount(newStudent);
    if (data.groupId) {
      GroupService.assignStudentToGroup(newStudent.id, data.groupId);
      setGroups(GroupService.getGroups());
    }
    refreshAccounts();
    if (isSupabaseConfigured()) {
      SupabaseService.saveAccountToRemote(newStudent);
    }
    soundService.playSuccess();
    return { success: true };
  };

  const resetStudentPassword = (studentId: string, newPass: string) => {
    const accounts = StorageService.loadAllAccounts();
    const idx = accounts.findIndex(a => a.id === studentId);
    if (idx >= 0) {
      accounts[idx].password = newPass.trim();
      StorageService.saveAllAccounts(accounts);
      setAllAccounts([...accounts]);
      if (profile.id === studentId) {
        setProfile({ ...accounts[idx] });
      }
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(accounts[idx]);
      }
      soundService.playSuccess();
    }
  };

  const resetAdminProgress = async () => {
    const accounts = StorageService.loadAllAccounts();
    const now = new Date().toISOString();
    const updated = accounts.map(acc => {
      if (acc.role === 'admin' || acc.id === profile.id) {
        return {
          ...acc,
          xp: 0,
          coins: 999999, // infinite admin currency
          diamonds: 999999,
          streakDays: 1,
          unitMasteries: {},
          completedUnits: [],
          grammarMasteries: {},
          completedGrammarTopics: [],
          completedGrammarExams: {},
          grammarMistakes: [],
          mistakes: [],
          claimedPrizes: [],
          grammarHearts: 5,
          currentUnitId: 'u1',
          lastActiveDate: now,
        };
      }
      return acc;
    });

    StorageService.saveAllAccounts(updated);
    setAllAccounts([...updated]);
    const currentAdmin = updated.find(a => a.role === 'admin' || a.id === profile.id);
    if (currentAdmin) {
      setProfile({ ...currentAdmin });
      StorageService.saveProfile(currentAdmin);
      if (isSupabaseConfigured()) {
        await SupabaseService.saveAccountToRemote(currentAdmin);
      }
    }
    soundService.playSuccess();
  };

  const resetStudentProgress = async (studentId: string) => {
    const accounts = StorageService.loadAllAccounts();
    const idx = accounts.findIndex(a => a.id === studentId);
    if (idx >= 0) {
      const now = new Date().toISOString();
      const target = {
        ...accounts[idx],
        xp: 0,
        coins: 20,
        diamonds: 0,
        streakDays: 1,
        unitMasteries: {},
        completedUnits: [],
        grammarMasteries: {},
        completedGrammarTopics: [],
        completedGrammarExams: {},
        grammarMistakes: [],
        mistakes: [],
        claimedPrizes: [],
        grammarHearts: 5,
        currentUnitId: accounts[idx].levelId === 'elementary' ? 'el_u1' : accounts[idx].levelId === 'pre_intermediate' ? 'pre_u0' : 'u1',
        lastActiveDate: now,
      };
      accounts[idx] = target;

      StorageService.saveAllAccounts(accounts);
      setAllAccounts([...accounts]);
      if (profile.id === studentId) {
        setProfile({ ...target });
        StorageService.saveProfile(target);
      }
      if (isSupabaseConfigured()) {
        await SupabaseService.saveAccountToRemote(target);
      }
      soundService.playSuccess();
    }
  };

  const resetAllStudentsProgress = async (includeAdmin: boolean = false) => {
    const accounts = StorageService.loadAllAccounts();
    const now = new Date().toISOString();
    const updated = accounts.map(acc => {
      if ((acc.role === 'admin' || acc.role === 'support') && !includeAdmin) return acc;
      return {
        ...acc,
        xp: 0,
        coins: acc.role === 'admin' ? 999999 : acc.role === 'support' ? 100 : 20,
        diamonds: acc.role === 'admin' ? 999999 : acc.role === 'support' ? 10 : 0,
        streakDays: 1,
        unitMasteries: {},
        completedUnits: [],
        grammarMasteries: {},
        completedGrammarTopics: [],
        completedGrammarExams: {},
        grammarMistakes: [],
        mistakes: [],
        claimedPrizes: [],
        grammarHearts: 5,
        currentUnitId: acc.levelId === 'elementary' ? 'el_u1' : acc.levelId === 'pre_intermediate' ? 'pre_u0' : 'u1',
        lastActiveDate: now,
      };
    });
    StorageService.saveAllAccounts(updated);
    setAllAccounts([...updated]);
    const current = updated.find(a => a.id === profile.id);
    if (current) {
      setProfile(sanitizeProfile(current));
      StorageService.saveProfile(current);
    }
    if (isSupabaseConfigured()) {
      await SupabaseService.saveAllAccountsToRemote(updated);
    }
    soundService.playSuccess();
  };

  const deleteStudentAccount = (studentId: string) => {
    StorageService.deleteAccount(studentId);
    refreshAccounts();
    if (isSupabaseConfigured()) {
      SupabaseService.deleteAccountFromRemote(studentId);
    }
    soundService.playClick();
  };

  return (
    <GameContext.Provider
      value={{
        isAuthenticated,
        profile,
        allAccounts,
        login,
        loginAsUser,
        logout,
        awardStudent,
        createNewStudent,
        resetStudentPassword,
        resetStudentProgress,
        resetAdminProgress,
        resetAllStudentsProgress,
        deleteStudentAccount,
        groups,
        currentStudentGroup,
        createGroup,
        updateGroup,
        deleteGroup,
        assignStudentToGroup,
        removeStudentFromGroup,
        boxPrices,
        updateBoxPrices,
        isCloudConnected,
        syncWithCloud,
        currentScreen,
        activeUnitId,
        curriculumUnits: CURRICULUM_UNITS,
        achievements,
        stickers,
        levelNumber,
        xpProgressPercent,
        currentLevelXp,
        nextLevelThresholdXp,
        // Grammar exports
        activeGrammarLevel,
        activeGrammarTopicId,
        activeGrammarTopic,
        overallGrammarProgress,
        weakGrammarTopics,
        strongGrammarTopics,
        recommendedGrammarTopic,
        setActiveGrammarLevel,
        setActiveGrammarTopicId,
        recordGrammarAttempt,
        recordGrammarMistake,
        resolveGrammarMistake,
        recordLevelExamResult,
        setScreen: setCurrentScreen,
        setActiveUnitId,
        updateCharacter,
        updateLevel,
        updateOwnStats,
        updateStudentCharacter,
        applyOutfitPreset,
        buyOutfitPreset,
        setCharacterMood,
        cycleCharacterMood,
        completeOnboarding,
        addXP,
        addCoins,
        addDiamonds,
        tradeDiamondsForCoins,
        awardDiamondToAccount,
        updateStudentDiamonds,
        updateStudentXP,
        buyShopItem,
        equipShopItem,
        unequipShopItem,
        recordMistake,
        resolveMistake,
        recordPracticeResult,
        getUnitProgress,
        toggleSound,
        resetProgress,
        openMysteryBox,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
