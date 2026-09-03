import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
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
import { StorageService, DEFAULT_CHARACTER, DEFAULT_PROFILE } from '../services/storageService';
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
  createNewStudent: (data: { name: string; username: string; password: string; gender: CharacterGender; levelId: LevelId }) => { success: boolean; message?: string };
  resetStudentPassword: (studentId: string, newPass: string) => void;
  resetStudentProgress: (studentId: string) => void;
  resetAllStudentsProgress: () => void;
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
  recordPracticeResult: (unitId: string, correct: number, total: number) => void;
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
  const [allAccounts, setAllAccounts] = useState<UserProfile[]>(() => StorageService.loadAllAccounts());
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const activeUid = StorageService.getActiveUserId();
    if (!activeUid) {
      return 'login';
    }
    const prof = StorageService.loadProfile();
    return prof.role === 'admin' ? 'admin' : 'home';
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
          // Keep local if local has newer active date or higher XP
          if (localTime >= remTime || (local.xp || 0) >= (rem.xp || 0)) {
            SupabaseService.saveAccountToRemote(local);
            return local;
          }
          return rem;
        });

        for (const rem of remote) {
          if (!merged.some(m => m.id === rem.id)) {
            merged.push(rem);
          }
        }

        StorageService.saveAllAccounts(merged);
        setAllAccounts([...merged]);
        setIsCloudConnected(true);

        const activeId = StorageService.getActiveUserId();
        if (activeId) {
          const current = merged.find(r => r.id === activeId);
          if (current) {
            setProfile({ ...current });
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

  // Run initial cloud sync on mount
  useEffect(() => {
    syncWithCloud();
  }, []);

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
      return {
        ...prev,
        xp: newXp,
      };
    });
  };

  const addCoins = (amount: number) => {
    soundService.playCoin();
    setProfile(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
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

  const recordPracticeResult = (unitId: string, correct: number, total: number) => {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    setProfile(prev => {
      const currentMastery = prev.unitMasteries[unitId] || 0;
      const newMastery = Math.min(100, Math.max(currentMastery, accuracy));
      const completed = newMastery >= 80 && !prev.completedUnits.includes(unitId)
        ? [...prev.completedUnits, unitId]
        : prev.completedUnits;

      return {
        ...prev,
        unitMasteries: {
          ...prev.unitMasteries,
          [unitId]: newMastery,
        },
        completedUnits: completed,
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

    setProfile(found);
    setIsAuthenticated(true);
    StorageService.setActiveUserId(found.id);
    soundService.playSuccess();
    if (found.role === 'admin') {
      setCurrentScreen('admin');
    } else {
      setCurrentScreen('home');
    }
    return { success: true };
  };

  const loginAsUser = (userId: string) => {
    const latestAccounts = StorageService.loadAllAccounts();
    const found = latestAccounts.find(a => a.id === userId);
    if (found) {
      setProfile(found);
      setIsAuthenticated(true);
      StorageService.setActiveUserId(found.id);
      soundService.playSuccess();
      if (found.role === 'admin') {
        setCurrentScreen('admin');
      } else {
        setCurrentScreen('home');
      }
    }
  };

  const logout = () => {
    soundService.playClick();
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

  const resetStudentProgress = (studentId: string) => {
    const accounts = StorageService.loadAllAccounts();
    const idx = accounts.findIndex(a => a.id === studentId);
    if (idx >= 0) {
      const target = accounts[idx];
      target.xp = 0;
      target.coins = 20;
      target.diamonds = 0;
      target.streakDays = 1;
      target.unitMasteries = {};
      target.completedUnits = [];
      target.grammarMasteries = {};
      target.completedGrammarTopics = [];
      target.completedGrammarExams = {};
      target.grammarMistakes = [];
      target.mistakes = [];
      target.claimedPrizes = [];
      target.grammarHearts = 5;
      target.currentUnitId = target.levelId === 'elementary' ? 'el_u1' : target.levelId === 'pre_intermediate' ? 'pre_u0' : 'u1';

      StorageService.saveAllAccounts(accounts);
      setAllAccounts([...accounts]);
      if (profile.id === studentId) {
        setProfile({ ...target });
        StorageService.saveProfile(target);
      }
      if (isSupabaseConfigured()) {
        SupabaseService.saveAccountToRemote(target);
      }
      soundService.playSuccess();
    }
  };

  const resetAllStudentsProgress = () => {
    const accounts = StorageService.loadAllAccounts();
    const updated = accounts.map(acc => {
      if (acc.role === 'admin') return acc;
      return {
        ...acc,
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
        currentUnitId: acc.levelId === 'elementary' ? 'el_u1' : acc.levelId === 'pre_intermediate' ? 'pre_u0' : 'u1',
      };
    });
    StorageService.saveAllAccounts(updated);
    setAllAccounts([...updated]);
    const current = updated.find(a => a.id === profile.id);
    if (current && current.role !== 'admin') {
      setProfile({ ...current });
      StorageService.saveProfile(current);
    }
    if (isSupabaseConfigured()) {
      updated.filter(a => a.role !== 'admin').forEach(s => SupabaseService.saveAccountToRemote(s));
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
        resetAllStudentsProgress,
        deleteStudentAccount,
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
