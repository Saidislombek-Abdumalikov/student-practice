import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { CharacterGender, SkinTone, HairStyle, HairColor, CharacterExpression } from '../../types';
import { soundService } from '../../services/soundService';
import { formatTimeSpent } from '../../services/presenceService';
import { QuickMoodBar } from '../character/QuickMoodBar';
import { 
  User, 
  Clock,
  Sparkles, 
  Flame, 
  Coins, 
  Zap, 
  CheckCircle2, 
  Palette, 
  Award, 
  Smile, 
  RotateCcw,
  ArrowLeft,
  RefreshCw,
  LogOut
} from 'lucide-react';

const SKIN_TONES: { color: SkinTone; label: string }[] = [
  { color: '#FFDFC4', label: 'Fair' },
  { color: '#F0C08A', label: 'Warm' },
  { color: '#D49B6A', label: 'Golden' },
  { color: '#A1663B', label: 'Caramel' },
  { color: '#5C381E', label: 'Rich' },
];

const HAIR_STYLES_MAN: { id: HairStyle; label: string }[] = [
  { id: 'fade', label: 'Fade' },
  { id: 'curly_top', label: 'Curly' },
  { id: 'side_sweep', label: 'Sweep' },
  { id: 'afro', label: 'Afro' },
];

const HAIR_STYLES_WOMAN: { id: HairStyle; label: string }[] = [
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'wavy_bob', label: 'Wavy Bob' },
  { id: 'braids', label: 'Braids' },
  { id: 'afro', label: 'Afro' },
];

const HAIR_COLORS: { color: HairColor; label: string }[] = [
  { color: '#1E293B', label: 'Black' },
  { color: '#4A2E18', label: 'Brunette' },
  { color: '#D97706', label: 'Blonde' },
  { color: '#991B1B', label: 'Auburn' },
  { color: '#3B82F6', label: 'Blue' },
  { color: '#8B5CF6', label: 'Purple' },
];


const EXPRESSIONS: { id: CharacterExpression; label: string; emoji: string }[] = [
  { id: 'idle', label: 'Calm', emoji: '🙂' },
  { id: 'happy', label: 'Happy', emoji: '😄' },
  { id: 'thinking', label: 'Focus', emoji: '🤔' },
  { id: 'victory', label: 'Victory', emoji: '😎' },
  { id: 'oops', label: 'Surprised', emoji: '😮' },
];

export const ProfileScreen: React.FC = () => {
  const { profile, levelNumber, updateCharacter, updateLevel, applyOutfitPreset, cycleCharacterMood, stickers, curriculumUnits, logout, setScreen, resetAdminProgress, resetStudentProgress } = useGame();
  const [activeTab, setActiveTab] = useState<'customizer' | 'stats' | 'stickers'>('customizer');

  const masteredUnitsCount = Object.values(profile?.unitMasteries || {}).filter(m => m >= 80).length;

  const handleGenderToggle = (gender: CharacterGender) => {
    soundService.playSuccess();
    if (gender === 'man') {
      const isFeminineOutfit = ['dress', 'summer_top', 'turtleneck', 'hoodie_cropped', 'kimono'].includes(profile.character.outfit);
      updateCharacter({
        gender: 'man',
        hairStyle: 'fade',
        outfit: isFeminineOutfit ? 'hoodie' : profile.character.outfit,
        outfitColor: '#3B82F6', // Royal blue masculine color
        hat: ['flower_crown', 'tiara', 'cat_ears', 'ribbon_bow'].includes(profile.character.hat) ? 'none' : profile.character.hat,
        glasses: profile.character.glasses === 'cat_eye' ? 'none' : profile.character.glasses,
        accessory: ['choker', 'pearl_necklace', 'silver_pendant'].includes(profile.character.accessory) ? 'none' : profile.character.accessory,
      });
    } else {
      updateCharacter({
        gender: 'woman',
        hairStyle: 'ponytail',
        outfit: 'dress',
        outfitColor: '#F43F5E', // Rose pink feminine color
        hat: profile.character.hat === 'snapback' ? 'none' : profile.character.hat,
        accessory: profile.character.accessory === 'bowtie' ? 'none' : profile.character.accessory,
      });
    }
  };

  return (
    <div className="space-y-5 pb-28 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={() => { soundService.playClick(); setScreen('home'); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Reset / Clear Progress Button */}
          <button
            onClick={() => {
              if (window.confirm('⚠️ Clear and reset your learning progress?\n\nThis will reset your XP to 0, streak to 1, and clear completed units and grammar lessons so you can test from the beginning.\n\nContinue?')) {
                if (profile.role === 'admin') {
                  resetAdminProgress();
                } else {
                  resetStudentProgress(profile.id);
                }
                alert('✅ Progress successfully cleared and reset!');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Clear and reset learning progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Progress</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-bold transition-all active:scale-95 shadow-sm"
            title="Sign out of account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Player Showcase Banner */}
      <div className="card-game p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 shadow-game-card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Modular Character Spotlight with Quick Mood Bar */}
            <div className="flex flex-col items-center gap-2">
              <div 
                onClick={cycleCharacterMood}
                className="p-3 rounded-3xl bg-slate-800/80 border-2 border-indigo-500/60 shadow-inner cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Tap to cycle mood!"
              >
                <ModularCharacter config={profile.character} size={150} animate={true} />
              </div>
              <QuickMoodBar size="sm" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>LEVEL {levelNumber} LEARNER</span>
              </div>
              <h1 className="text-3xl font-black text-white">{profile.name || 'Hero Learner'}</h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                English Adventurer • Level: <span className="text-indigo-400 font-bold uppercase">{profile.levelId}</span>
              </p>

              {/* Move / Switch Curriculum Level Anytime */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Move Level:</span>
                {(['beginner', 'elementary', 'pre_intermediate'] as const).map(lvlId => {
                  const isCur = profile.levelId === lvlId;
                  const label = lvlId === 'beginner' ? 'Beginner (A1)' : lvlId === 'elementary' ? 'Elementary (A2)' : 'Pre-Int (B1)';
                  return (
                    <button
                      key={lvlId}
                      onClick={() => updateLevel(lvlId)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all ${
                        isCur
                          ? 'bg-indigo-600 text-white border border-indigo-400 shadow-sm scale-105'
                          : 'bg-slate-800/90 text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-700'
                      }`}
                      title={`Switch to ${label}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full sm:w-auto">
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 block">Total XP</span>
              <span className="text-xl font-black text-indigo-400">⚡ {profile.xp}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 block">Coins</span>
              <span className="text-xl font-black text-amber-400">🪙 {profile.role === 'admin' ? '∞' : profile.coins}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 block">Diamonds</span>
              <span className="text-xl font-black text-cyan-400">💎 {profile.role === 'admin' ? '∞' : profile.diamonds || 0}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 block">Streak</span>
              <span className="text-xl font-black text-orange-400">🔥 {profile.streakDays}d</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-400 block">Mastered</span>
              <span className="text-xl font-black text-emerald-400">⭐ {masteredUnitsCount}</span>
            </div>
          </div>

        </div>

        {/* My Learning & Study Time (Visible to User) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white block">My Platform Study Time</span>
              <span className="text-slate-400 text-[11px]">Active minutes spent learning and practicing</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 font-bold">
            <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Total:</span>
              <span className="text-white font-black">{formatTimeSpent(profile.totalTimeSpentMinutes)}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Today:</span>
              <span className="text-indigo-300 font-black">{formatTimeSpent(profile.todayTimeSpentMinutes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Customizer Studio, Statistics, Sticker Album */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-2xl border border-slate-700">
        <button
          onClick={() => { soundService.playClick(); setActiveTab('customizer'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'customizer'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Character Studio</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveTab('stats'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'stats'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Unit Masteries</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveTab('stickers'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'stickers'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>Sticker Album</span>
        </button>
      </div>

      {/* 1. CHARACTER CUSTOMIZER STUDIO */}
      {activeTab === 'customizer' && (
        <div className="card-game p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              MODULAR CHARACTER STUDIO
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Refine Your Appearance & Expression
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Change your base character (MAN 👦 / WOMAN 👧), hair, skin, and facial moods anytime!
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            {/* MAN / WOMAN Base Selector */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Base Appearance & Biology:
              </span>
              <span className="block text-xs font-bold text-slate-400 mb-2">
                Character Base (Change Anytime)
              </span>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  onClick={() => handleGenderToggle('man')}
                  className={`py-3 px-4 rounded-2xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                    profile.character.gender === 'man'
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-game-btn'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👦 MAN</span>
                </button>
                <button
                  onClick={() => handleGenderToggle('woman')}
                  className={`py-3 px-4 rounded-2xl font-black text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                    profile.character.gender === 'woman'
                      ? 'bg-purple-600 border-purple-400 text-white shadow-game-btn'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👧 WOMAN</span>
                </button>
              </div>
            </div>

            {/* Skin Tone */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Skin Tone
              </span>
              <div className="flex gap-2.5">
                {SKIN_TONES.map(item => (
                  <button
                    key={item.color}
                    onClick={() => updateCharacter({ skinTone: item.color })}
                    className={`w-10 h-10 rounded-full border-2 transition-transform ${
                      profile.character.skinTone === item.color
                        ? 'border-indigo-400 scale-110 ring-2 ring-indigo-400/50'
                        : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.label}
                  />
                ))}
              </div>
            </div>

            {/* Hair Style */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Hair Style
              </span>
              <div className="grid grid-cols-4 gap-2 max-w-md">
                {(profile.character.gender === 'man' ? HAIR_STYLES_MAN : HAIR_STYLES_WOMAN).map(item => (
                  <button
                    key={item.id}
                    onClick={() => updateCharacter({ hairStyle: item.id })}
                    className={`py-2.5 px-2 text-center rounded-xl font-bold text-xs border transition-all ${
                      profile.character.hairStyle === item.id
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Hair Color
              </span>
              <div className="flex gap-2.5">
                {HAIR_COLORS.map(item => (
                  <button
                    key={item.color}
                    onClick={() => updateCharacter({ hairColor: item.color })}
                    className={`w-9 h-9 rounded-full border-2 transition-transform ${
                      profile.character.hairColor === item.color
                        ? 'border-white scale-110 ring-2 ring-indigo-400/50'
                        : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.label}
                  />
                ))}
              </div>
            </div>


            {/* Facial Expression Mood */}
            <div>
              <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
                Character Mood / Expression
              </span>
              <div className="flex flex-wrap gap-2">
                {EXPRESSIONS.map(exp => (
                  <button
                    key={exp.id}
                    onClick={() => updateCharacter({ expression: exp.id })}
                    className={`py-2 px-3.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                      profile.character.expression === exp.id
                        ? 'bg-amber-500 border-amber-300 text-slate-900 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <span>{exp.emoji}</span>
                    <span>{exp.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. UNIT MASTERIES & STATS */}
      {activeTab === 'stats' && (
        <div className="card-game p-6 space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              PROGRESS BREAKDOWN
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Curriculum Unit Masteries
            </h3>
          </div>

          <div className="space-y-3">
            {curriculumUnits.map(unit => {
              const score = profile.unitMasteries[unit.id] || 0;
              const isMastered = score >= 80;

              return (
                <div
                  key={unit.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">{unit.title}</h4>
                    <p className="text-xs text-slate-400">{unit.words.length} Vocabulary Words</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden hidden sm:block">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <span className="text-sm font-black text-emerald-400 w-12 text-right">
                      {score}%
                    </span>

                    {isMastered && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. STICKER ALBUM */}
      {activeTab === 'stickers' && (
        <div className="card-game p-6 space-y-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
              COLLECTIBLES
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Student Sticker Album
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Stickers you unlock from learning milestones and shop rewards.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stickers.map(stk => {
              const isUnlocked = profile.unlockedStickers.includes(stk.id);

              return (
                <div
                  key={stk.id}
                  className={`p-4 rounded-3xl border-2 text-center space-y-2 flex flex-col items-center justify-center transition-all ${
                    isUnlocked
                      ? 'bg-purple-950/30 border-purple-500/50 shadow-glow-primary'
                      : 'bg-slate-900/60 border-slate-800 opacity-50'
                  }`}
                >
                  <div className="text-4xl">{isUnlocked ? stk.emoji : '🔒'}</div>
                  <h4 className="font-extrabold text-sm text-white">{stk.title}</h4>
                  <p className="text-[11px] text-slate-400">{stk.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Account Info & Switch Account */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-white block text-sm">
            Signed in as {profile.name} ({profile.role === 'admin' ? 'Teacher / Admin' : profile.role === 'support' ? 'Support Assistant' : 'Student'})
          </span>
          <span className="text-slate-400 text-xs mt-0.5 block font-mono">
            Username: <strong className="text-indigo-300 font-bold">{profile.username}</strong>
            {profile.password && (
              <>
                <span className="text-slate-600 mx-2">|</span>
                Password: <strong className="text-emerald-300 font-bold">{profile.password}</strong>
              </>
            )}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold transition-all active:scale-95 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Account / Sign In</span>
        </button>
      </div>

    </div>
  );
};
