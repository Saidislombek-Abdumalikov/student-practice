import React from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  ShoppingBag, 
  Flame, 
  Zap, 
  Sparkles, 
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { soundService } from '../../services/soundService';
import { QuickMoodBar } from '../character/QuickMoodBar';

export const HomeScreen: React.FC = () => {
  const { 
    profile, 
    levelNumber, 
    curriculumUnits, 
    activeUnitId, 
    setActiveUnitId, 
    setScreen,
    recommendedGrammarTopic,
    overallGrammarProgress,
    cycleCharacterMood,
  } = useGame();

  const currentUnit = curriculumUnits.find(u => u.id === activeUnitId) || curriculumUnits[0];
  const unitMastery = profile.unitMasteries[currentUnit.id] || 0;
  const mistakeCount = profile.mistakes.length;

  const handleStartLearn = () => {
    soundService.playClick();
    setScreen('flashcards');
  };

  const handleStartPractice = () => {
    soundService.playClick();
    setScreen('practice');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* GAME HERO CARD: Character Showcase & Daily Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border-2 border-indigo-500/30 p-6 sm:p-8 shadow-game-card">
        {/* Decorative Background Grid & Lights */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Left: Text & Greetings */}
          <div className="text-center sm:text-left space-y-3 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LEVEL {levelNumber} ADVENTURER</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to learn, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                {profile.name || 'Hero'}
              </span>? 🚀
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every word you master earns you coins, boosts your streak, and unlocks rare gear for your character!
            </p>

            {/* Quick Stats Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold text-xs">
                <Flame className="w-4 h-4 text-orange-400 animate-flame-wobble" />
                <span>{profile.streakDays} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
                <span>🪙 {profile.role === 'admin' ? '∞' : profile.coins} Coins</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{profile.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Character with 1-Tap Quick Mood Switcher */}
          <div className="flex flex-col items-center gap-3">
            <div 
              onClick={cycleCharacterMood}
              className="cursor-pointer group relative flex flex-col items-center justify-center p-3 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/70 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl"
              title="Click avatar to cycle mood!"
            >
              {/* Speech bubble */}
              <div className="absolute -top-3 bg-indigo-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg border border-indigo-400 animate-bounce-subtle whitespace-nowrap flex items-center gap-1">
                <span>Tap to change mood! ✨</span>
              </div>

              <ModularCharacter config={profile.character} size={160} animate={true} />

              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">
                  Mood: <span className="text-indigo-300 font-extrabold capitalize">{profile.character.expression}</span>
                </span>
              </div>
            </div>

            {/* Quick Mood Bar */}
            <div className="flex flex-col items-center gap-1 w-full">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Change Mood:
              </span>
              <QuickMoodBar size="sm" />
              <button
                onClick={() => setScreen('profile')}
                className="mt-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>Customize Wardrobe</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 1. CORE GRAMMAR SYSTEM HERO CARD */}
      <div className="card-game p-6 border-2 border-indigo-500/50 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 shadow-game-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded-md border border-indigo-500/40">
                CORE CURRICULUM
              </span>
              <span className="text-xs font-bold text-slate-300">
                3-Level English Grammar System
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              Grammar Master: {recommendedGrammarTopic?.title || 'Beginner Grammar'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              🇺🇿 {recommendedGrammarTopic?.titleUz || 'Oʻzbekcha tushunarli qoidalar'} — Interactive lessons, formula decks, 7 practice modes, and certification exams!
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block">Grammar Progress</span>
              <span className="text-xl font-black text-emerald-400">{overallGrammarProgress}%</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center font-bold text-lg text-indigo-300">
              ⚡
            </div>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 my-4">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(8, overallGrammarProgress)}%` }}
          />
        </div>

        {/* Quick Launch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => {
              soundService.playClick();
              setScreen('grammar');
            }}
            className="btn-game-primary py-3.5 px-6 flex items-center justify-center gap-2 text-sm font-extrabold"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Open Grammar Curriculum</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setScreen('grammar');
            }}
            className="btn-game-gold py-3.5 px-6 flex items-center justify-center gap-2 text-sm font-extrabold shadow-glow-gold"
          >
            <Zap className="w-5 h-5" />
            <span>Speed Grammar Challenge</span>
          </button>
        </div>
      </div>

      {/* 2. VOCABULARY LEARNING CARD */}
      <div className="card-game p-6 border border-slate-700 bg-slate-900/90">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                VOCABULARY DECK
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentUnit.words.length} words in {currentUnit.title}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {currentUnit.title} Vocabulary
            </h3>
            <p className="text-slate-400 text-xs">
              {currentUnit.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block">Vocabulary Mastery</span>
              <span className="text-lg font-black text-emerald-400">{unitMastery}%</span>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <button
            onClick={handleStartLearn}
            className="btn-game-slate py-3 px-5 flex items-center justify-center gap-2 text-xs font-bold"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Study 3D Flashcards</span>
          </button>

          <button
            onClick={handleStartPractice}
            className="btn-game-emerald py-3 px-5 flex items-center justify-center gap-2 text-xs font-bold"
          >
            <Zap className="w-4 h-4" />
            <span>Practice Vocabulary & Earn Coins</span>
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS GRID: Play, Compete, Shop, Mistakes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. PLAY GAMES */}
        <div 
          onClick={() => { soundService.playClick(); setScreen('play'); }}
          className="card-game-interactive p-5 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              4 GAMES
            </span>
          </div>

          <div className="mt-4">
            <h3 className="font-extrabold text-lg text-white group-hover:text-indigo-300 transition-colors">
              Play & Rush
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Word Rush, Scramble, Four Doors & Memory Match!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-400">
            <span>Play Now</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 2. COMPETE / LEADERBOARDS */}
        <div 
          onClick={() => { soundService.playClick(); setScreen('compete'); }}
          className="card-game-interactive p-5 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              LEAGUE
            </span>
          </div>

          <div className="mt-4">
            <h3 className="font-extrabold text-lg text-white group-hover:text-amber-300 transition-colors">
              Leaderboard
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Climb the weekly XP & streak ranks with fellow learners.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>View Ranks</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 3. SHOP & DRESSING ROOM */}
        <div 
          onClick={() => { soundService.playClick(); setScreen('shop'); }}
          className="card-game-interactive p-5 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              GEAR
            </span>
          </div>

          <div className="mt-4">
            <h3 className="font-extrabold text-lg text-white group-hover:text-purple-300 transition-colors">
              Cosmetic Shop
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Outfits, hats, glasses, pets & backgrounds for your character.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-purple-400">
            <span>Visit Shop</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 4. MY MISTAKES ARENA */}
        <div 
          onClick={() => { soundService.playClick(); setScreen('mistakes'); }}
          className="card-game-interactive p-5 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
              {mistakeCount} REVIEW
            </span>
          </div>

          <div className="mt-4">
            <h3 className="font-extrabold text-lg text-white group-hover:text-rose-300 transition-colors">
              My Mistakes
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Turn tricky words into your greatest strengths!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-rose-400">
            <span>Review Mistakes</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>

    </div>
  );
};
