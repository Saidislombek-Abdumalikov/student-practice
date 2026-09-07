// Character Customization Types
export type CharacterGender = 'man' | 'woman';

export type SkinTone = '#FFDFC4' | '#F0C08A' | '#D49B6A' | '#A1663B' | '#5C381E';

export type HairStyle = 
  | 'fade' 
  | 'curly_top' 
  | 'side_sweep' 
  | 'ponytail' 
  | 'wavy_bob' 
  | 'braids' 
  | 'afro';

export type HairColor = 
  | '#1E293B' // Jet Black
  | '#4A2E18' // Deep Brown
  | '#D97706' // Golden Blonde
  | '#991B1B' // Auburn Red
  | '#3B82F6' // Neon Blue
  | '#8B5CF6'; // Cyber Violet

export type OutfitType = 
  | 'hoodie' 
  | 'varsity' 
  | 'casual_tee' 
  | 'blazer' 
  | 'explorer'
  | 'cyber_jacket'
  | 'knit_sweater'
  | 'tracksuit'
  | 'dress'
  | 'summer_top'
  | 'turtleneck'
  | 'hoodie_cropped'
  | 'leather_biker'
  | 'kimono';

export type OutfitColor = 
  | '#6366F1' // Indigo
  | '#10B981' // Emerald
  | '#F43F5E' // Coral / Rose
  | '#F59E0B' // Amber
  | '#8B5CF6' // Purple
  | '#06B6D4' // Cyan
  | '#3B82F6' // Royal Blue
  | '#1E293B'; // Midnight Black

export type HatType = 
  | 'none' 
  | 'snapback' 
  | 'beanie' 
  | 'bucket_hat' 
  | 'crown' 
  | 'wizard' 
  | 'beret' 
  | 'headband'
  | 'flower_crown'
  | 'tiara'
  | 'cat_ears'
  | 'ribbon_bow'
  | 'baseball_cap'
  | 'flat_cap'
  | 'fedora'
  | 'cowboy'
  | 'bandana'
  | 'top_hat'
  | 'ninja_headband';

export type GlassesType = 
  | 'none' 
  | 'specs' 
  | 'sunglasses' 
  | 'retro_round' 
  | 'heart_shades' 
  | 'aviator'
  | 'cat_eye'
  | 'star_shades';

export type AccessoryType = 
  | 'none' 
  | 'headphones' 
  | 'gold_chain' 
  | 'backpack' 
  | 'pearl_necklace' 
  | 'scarf'
  | 'silver_pendant'
  | 'choker'
  | 'bowtie'
  | 'medal';

export type PetType = 
  | 'none' 
  | 'owl' 
  | 'robot_pup' 
  | 'slime' 
  | 'cat' 
  | 'dragon'
  | 'bunny'
  | 'phoenix'
  | 'panda';

export type BackgroundType = 
  | 'default' 
  | 'cosmic' 
  | 'sunset' 
  | 'cyber' 
  | 'emerald_grove' 
  | 'sakura' 
  | 'aurora'
  | 'starlight'
  | 'bubblegum'
  | 'matrix';

export type CharacterExpression = 'idle' | 'happy' | 'thinking' | 'victory' | 'oops';

export interface CharacterConfig {
  gender: CharacterGender;
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  outfit: OutfitType;
  outfitColor: OutfitColor;
  hat: HatType;
  glasses: GlassesType;
  accessory: AccessoryType;
  pet: PetType;
  background: BackgroundType;
  expression: CharacterExpression;
}

// Comprehensive 3-Level Grammar Types
export type GrammarLevelId = 'level_1' | 'level_2' | 'level_3';

export type GrammarExerciseType = 
  | 'multiple_choice' 
  | 'fill_blank' 
  | 'sentence_builder' 
  | 'error_correction' 
  | 'translation_uz_en' 
  | 'translation_en_uz' 
  | 'true_false' 
  | 'matching';

export type GrammarDifficulty = 'easy' | 'medium' | 'hard' | 'challenge';

export interface GrammarQuestion {
  id: string;
  topicId: string;
  type: GrammarExerciseType;
  prompt: string;
  sentenceWithBlank?: string;
  options?: string[];
  correctAnswer: string | string[]; // Single string or array of acceptable answers
  scrambledWords?: string[]; // for sentence_builder
  wrongSentence?: string; // for error_correction
  errorWord?: string; // for error_correction
  correction?: string; // for error_correction
  matchingPairs?: Array<{ left: string; right: string }>; // for matching
  explanationEn: string;
  explanationUz: string;
  difficulty: GrammarDifficulty;
}

export interface GrammarFlashcard {
  id: string;
  front: string;
  back: string;
  formula?: string;
  example: string;
  uzbekNote?: string;
}

export interface GrammarLesson {
  id: string;
  topicId?: string;
  whatIsItEn: string;
  whatIsItUz: string;
  formula?: string;
  positiveStructure: { rule: string; example: string; exampleUz: string };
  negativeStructure: { rule: string; example: string; exampleUz: string };
  questionStructure: { rule: string; example: string; exampleUz: string };
  shortAnswers?: { positive: string; negative: string };
  examples: Array<{ en: string; uz: string; highlight?: string }>;
  signalWords: string[];
  commonMistakes: Array<{
    incorrect: string;
    correct: string;
    explanationUz: string;
  }>;
  studyTips: string[];
}

export interface GrammarTopic {
  id: string;
  unitId: string;
  levelId: GrammarLevelId;
  title: string;
  titleUz: string;
  slug: string;
  description: string;
  difficulty: GrammarDifficulty;
  estimatedMinutes: number;
  prerequisites: string[]; // Topic IDs that should precede this
  lesson: GrammarLesson;
  guidedQuestions: GrammarQuestion[];
  practiceQuestions: GrammarQuestion[];
  testQuestions: GrammarQuestion[];
  flashcards: GrammarFlashcard[];
}

export interface GrammarUnitDefinition {
  id: string;
  unitNumber: number;
  levelId: GrammarLevelId;
  title: string;
  titleUz: string;
  description: string;
  topics: GrammarTopic[];
}

export interface GrammarMistakeRecord {
  id: string;
  topicId: string;
  topicTitle: string;
  question: GrammarQuestion;
  studentAnswer: string;
  wrongCount: number;
  lastMistakeTime: string;
  isMastered: boolean;
}

export interface GrammarExamResult {
  levelId: GrammarLevelId;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  date: string;
}

// Curriculum & Learning Types
export type LevelId = 
  | 'beginner' 
  | 'elementary' 
  | 'pre_intermediate' 
  | 'intermediate' 
  | 'pre_ielts' 
  | 'ielts';

export interface LevelInfo {
  id: LevelId;
  name: string;
  code: string;
  description: string;
  color: string;
  totalUnits: number;
}

export type WordFamiliarity = 'new' | 'again' | 'good' | 'easy';

export interface VocabularyWord {
  id: string;
  word: string;
  uzbekTranslation: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  definition: string;
  exampleSentence: string;
  exampleTranslation: string;
  unitId: string;
  levelId: LevelId;
  familiarity?: WordFamiliarity;
  mistakeCount?: number;
}

export interface GrammarRule {
  title: string;
  explanationEn: string;
  explanationUz: string;
  formula?: string;
  examples: Array<{
    en: string;
    uz: string;
  }>;
}

export interface GrammarUnit {
  id: string;
  unitId: string;
  title: string;
  titleUz: string;
  rules: GrammarRule[];
  commonMistakes: Array<{
    incorrect: string;
    correct: string;
    explanationUz: string;
  }>;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  levelId: LevelId;
  title: string;
  description: string;
  words: VocabularyWord[];
  grammar?: GrammarUnit;
  isCompleted?: boolean;
  isUnlocked?: boolean;
  masteryScore?: number; // 0 - 100%
}

// Practice & Game Types
export type PracticeMode = 
  | 'mixed'
  | 'flashcards' 
  | 'multiple_choice' 
  | 'true_false' 
  | 'typing' 
  | 'unscramble' 
  | 'matching';

export type GameId = 
  | 'word_rush' 
  | 'word_scramble' 
  | 'four_doors' 
  | 'memory_match';

export interface GameScoreResult {
  gameId: GameId;
  score: number;
  accuracy: number;
  maxCombo: number;
  xpEarned: number;
  coinsEarned: number;
  timeSpentSeconds: number;
  timestamp: string;
}

// Mistake Tracker
export interface MistakeRecord {
  id: string;
  wordId: string;
  word: string;
  uzbekTranslation: string;
  exampleSentence: string;
  wrongCount: number;
  lastMistakeTime: string;
  isMastered: boolean;
}

// Economy & Inventory
export type ShopCategory = 
  | 'characters' 
  | 'clothes' 
  | 'bundles'
  | 'hats' 
  | 'glasses' 
  | 'accessories' 
  | 'pets' 
  | 'backgrounds' 
  | 'stickers'
  | 'mystery';

export type MysteryBoxTier = 'bronze' | 'platinum' | 'gold';

export interface MysteryBoxPrize {
  id: string;
  tier: MysteryBoxTier;
  title: string;
  description: string;
  type: 'coins' | 'diamonds' | 'real_world' | 'badge' | 'custom';
  coinAmount?: number;
  diamondAmount?: number;
  icon?: string;
  chancePercent?: number; // Drop rate probability (e.g. 1%, 15%, 50%, 99%)
  createdAt?: string;
}

export interface ClaimedPrizeRecord {
  id: string;
  prizeId: string;
  prizeTitle: string;
  tier: MysteryBoxTier;
  type: 'coins' | 'diamonds' | 'real_world' | 'badge' | 'custom';
  description: string;
  claimedAt: string;
  redeemed?: boolean;
}

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  rarity: ItemRarity;
  description: string;
  itemType: string;
  itemValue: string;
  icon?: string;
  gender?: 'man' | 'woman' | 'all';
}

export interface StickerItem {
  id: string;
  title: string;
  emoji: string;
  description: string;
  price: number;
  unlocked: boolean;
}

// Achievements & Leaderboard
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'games' | 'streaks' | 'shop';
  currentProgress: number;
  maxProgress: number;
  isUnlocked: boolean;
  rewardCoins: number;
  rewardXp: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  character: CharacterConfig;
  score: number;
  streak: number;
  coins: number;
  accuracy: number;
  diamonds?: number;
  isCurrentUser?: boolean;
  role?: UserRole;
  isTeacher?: boolean;
  lastSeenAt?: string;
  isOnline?: boolean;
}

// User Roles
export type UserRole = 'student' | 'support' | 'admin';

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  password?: string;
  role?: UserRole;
  groupId?: string; // Reference to assigned StudentGroup (e.g. 'group_alpha')
  isOnboarded: boolean;
  character: CharacterConfig;
  levelId: LevelId;
  currentUnitId: string;
  xp: number;
  coins: number;
  diamonds: number; // 💎 Earned in 2-player matches, tradable 1 💎 -> 5 🪙
  streakDays: number;
  lastActiveDate: string;
  inventory: string[]; // List of owned item IDs
  unlockedStickers: string[];
  unitMasteries: Record<string, number>; // unitId -> 0-100%
  unitWordProgress?: Record<string, {
    completedWordIds: string[];
    lastWordIndex: number;
    lastPracticedAt?: string;
  }>;
  completedUnits: string[];
  mistakes: MistakeRecord[];
  soundEnabled: boolean;
  speechSpeed: 'normal' | 'slow';
  // Grammar System Enhancements
  grammarLevel: GrammarLevelId;
  grammarMasteries: Record<string, number>; // topicId -> 0-100%
  completedGrammarTopics: string[];
  completedGrammarExams: Record<string, GrammarExamResult>;
  grammarMistakes: GrammarMistakeRecord[];
  grammarHearts: number; // For challenge mode (default 3)
  claimedPrizes?: ClaimedPrizeRecord[]; // Mystery Box won rewards

  // -------------------------------------------------------------
  // Presence & Activity Tracking (Master Prompt)
  // -------------------------------------------------------------
  // 1. Online Status & Last Seen (Visible to Everyone)
  lastSeenAt?: string;
  isOnline?: boolean;

  // 2. Time Spent in App (Support + Admin + Self ONLY)
  totalTimeSpentMinutes?: number;
  todayTimeSpentMinutes?: number;
  dailyTimeSpent?: Record<string, number>; // date "YYYY-MM-DD" -> minutes

  // 3. Last Login & Auth Logs (Admin ONLY)
  lastLoginAt?: string;
  loginHistory?: Array<{
    timestamp: string;
    device?: string;
  }>;
}

// Active Screen Navigation
export type AppScreen = 
  | 'home' 
  | 'homework'
  | 'grammar' 
  | 'grammar_topic' 
  | 'learn' 
  | 'flashcards' 
  | 'practice' 
  | 'mistakes' 
  | 'play' 
  | 'game_active' 
  | 'compete' 
  | 'shop' 
  | 'mystery' 
  | 'profile'
  | 'admin'
  | 'support'
  | 'login';

// -------------------------------------------------------------
// Homework Management & Audio Submissions
// -------------------------------------------------------------
export type HomeworkType = 'listening' | 'reading';
export type HomeworkStatus = 'pending' | 'submitted' | 'approved' | 'revision';

export interface HomeworkAssignment {
  id: string;
  title: string;
  type: HomeworkType;
  levelId: LevelId;
  dueDate: string; // ISO string
  createdAt: string;
  instructions: string;
  // For Listening Homework:
  audioUrl?: string;
  audioFileName?: string;
  audioText?: string;
  targetMinListens?: number;
  // For Reading Homework:
  readingPassage?: string;
  readingImageUrl?: string;
  translationInstructions?: string;
  assignedToUserIds?: string[];
  targetGroupId?: string; // 'all' or specific StudentGroup id (e.g. 'group_alpha')
}

export interface HomeworkSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: HomeworkStatus;
  feedback?: string;
  gradeScore?: number;
  // For Listening Homework:
  listenCount: number;
  totalListenTimeSeconds: number;
  transcriptPhotoUrl?: string;
  aiCheckStatus?: 'verified' | 'checked';
  // For Reading Homework:
  readOutLoudAudioUrl?: string;
  readTranslateAudioUrl?: string;
}

// -------------------------------------------------------------
// Student Groups Management & Class Isolation
// -------------------------------------------------------------
export interface StudentGroup {
  id: string;
  name: string; // e.g. 'Morning Group Alpha', 'Afternoon Group Beta'
  levelId: LevelId;
  description?: string;
  studentIds: string[]; // User IDs enrolled in this group
  createdAt: string;
  updatedAt?: string;
}

// -------------------------------------------------------------
// Progress Reset & Backup Recovery System
// -------------------------------------------------------------
export interface ResetBackupRecord {
  id: string;
  timestamp: string; // ISO string
  scope: 'single' | 'group' | 'all';
  targetId?: string;
  targetName: string; // e.g. "Morning Group Alpha", "All Students", "Dilnuraxon"
  affectedStudentCount: number;
  previousProfiles: UserProfile[]; // Snapshot of student profiles before reset
}



