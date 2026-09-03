import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { CharacterConfig, CharacterGender, LevelId, SkinTone, HairStyle, HairColor, OutfitType, OutfitColor } from '../../types';
import { ModularCharacter } from '../character/ModularCharacter';
import { LEVELS } from '../../data/curriculumData';
import { soundService } from '../../services/soundService';
import { Sparkles, ArrowRight, Check, User, Compass, Zap } from 'lucide-react';

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

export const OnboardingModal: React.FC = () => {
  const { completeOnboarding } = useGame();
  const [step, setStep] = useState<number>(1); // 1: Name, 2: MAN/WOMAN, 3: Style, 4: Level, 5: Ready
  const [name, setName] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<CharacterGender>('man');
  const [characterConfig, setCharacterConfig] = useState<CharacterConfig>({
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
    expression: 'happy',
  });
  const [selectedLevel, setSelectedLevel] = useState<LevelId>('beginner');

  // Switch character gender
  const handleGenderSelect = (gender: CharacterGender) => {
    setSelectedGender(gender);
    const newHair: HairStyle = gender === 'man' ? 'fade' : 'ponytail';
    const newOutfit: OutfitType = gender === 'man' ? 'hoodie' : 'dress';
    const newColor: OutfitColor = gender === 'man' ? '#3B82F6' : '#F43F5E';
    setCharacterConfig(prev => ({
      ...prev,
      gender,
      hairStyle: newHair,
      outfit: newOutfit,
      outfitColor: newColor,
      expression: 'happy',
    }));
    soundService.playSuccess();
  };

  const handleNext = () => {
    soundService.playClick();
    if (step === 4) {
      // Trigger confetti explosion on final step
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      soundService.playLevelUp();
    }
    setStep(prev => prev + 1);
  };

  const handleFinish = () => {
    completeOnboarding(name, characterConfig, selectedLevel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-slate-900 border-2 border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-indigo-500'
                  : s < step
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: NAME INPUT */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to Play · Learn · Compete
              </h2>
              <p className="mt-2 text-slate-400 text-sm sm:text-base">
                Your journey to English mastery starts with your player identity!
              </p>
            </div>

            <div className="max-w-sm mx-auto">
              <label className="block text-left text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                What is your name / player tag?
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jasur, Malika, Apex..."
                maxLength={24}
                className="w-full px-5 py-3.5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-lg font-semibold text-center transition-all"
                autoFocus
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="btn-game-primary w-full max-w-sm mx-auto py-3.5 px-6 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: CHOOSE YOUR CHARACTER (MAN / WOMAN) */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                Non-Permanent • Change Anytime in Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                CHOOSE YOUR CHARACTER
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Pick your hero base. You can customize hair, clothes, and accessories next!
              </p>
            </div>

            {/* Character Selection Cards (MAN vs WOMAN) */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {/* MAN CARD */}
              <div
                onClick={() => handleGenderSelect('man')}
                className={`group relative p-4 rounded-3xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-between border-2 ${
                  selectedGender === 'man'
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-glow-primary scale-105'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="w-full aspect-square flex items-center justify-center">
                  <ModularCharacter
                    config={{
                      ...characterConfig,
                      gender: 'man',
                      hairStyle: 'fade',
                    }}
                    size="lg"
                    animate={false}
                  />
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 font-bold text-sm">
                  <span>👦 MAN</span>
                  {selectedGender === 'man' && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </div>

              {/* WOMAN CARD */}
              <div
                onClick={() => handleGenderSelect('woman')}
                className={`group relative p-4 rounded-3xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-between border-2 ${
                  selectedGender === 'woman'
                    ? 'bg-purple-950/60 border-purple-500 shadow-glow-primary scale-105'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="w-full aspect-square flex items-center justify-center">
                  <ModularCharacter
                    config={{
                      ...characterConfig,
                      gender: 'woman',
                      hairStyle: 'ponytail',
                    }}
                    size="lg"
                    animate={false}
                  />
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 font-bold text-sm">
                  <span>👧 WOMAN</span>
                  {selectedGender === 'woman' && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Looking good feedback badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold animate-bounce-subtle">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Looking good! ✨</span>
            </div>

            <div>
              <button
                onClick={handleNext}
                className="btn-game-primary w-full max-w-sm mx-auto py-3.5 px-6 flex items-center justify-center gap-2 text-base font-bold"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMIZE APPEARANCE */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Customize Appearance
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Fine-tune skin, hair style, and hair color
              </p>
            </div>

            {/* Live Character Preview */}
            <div className="flex justify-center my-2">
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-3xl shadow-inner">
                <ModularCharacter config={characterConfig} size="lg" animate={true} />
              </div>
            </div>

            <div className="space-y-4 max-w-md mx-auto text-left text-xs font-bold text-slate-300">
              {/* Skin Tone */}
              <div>
                <span className="block mb-1.5 uppercase tracking-wider">Skin Tone</span>
                <div className="flex gap-2.5">
                  {SKIN_TONES.map(item => (
                    <button
                      key={item.color}
                      onClick={() => setCharacterConfig(c => ({ ...c, skinTone: item.color }))}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        characterConfig.skinTone === item.color
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
                <span className="block mb-1.5 uppercase tracking-wider">Hair Style</span>
                <div className="grid grid-cols-4 gap-2">
                  {(characterConfig.gender === 'man' ? HAIR_STYLES_MAN : HAIR_STYLES_WOMAN).map(item => (
                    <button
                      key={item.id}
                      onClick={() => setCharacterConfig(c => ({ ...c, hairStyle: item.id }))}
                      className={`py-2 px-1 text-center rounded-xl font-bold text-xs border transition-all ${
                        characterConfig.hairStyle === item.id
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <span className="block mb-1.5 uppercase tracking-wider">Hair Color</span>
                <div className="flex gap-2.5">
                  {HAIR_COLORS.map(item => (
                    <button
                      key={item.color}
                      onClick={() => setCharacterConfig(c => ({ ...c, hairColor: item.color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        characterConfig.hairColor === item.color
                          ? 'border-white scale-110 ring-2 ring-indigo-400/50'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="btn-game-primary w-full max-w-sm mx-auto py-3.5 px-6 flex items-center justify-center gap-2 text-base font-bold"
            >
              <span>Next: Select Level</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 4: SELECT LEARNING LEVEL */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <div className="w-14 h-14 mx-auto rounded-3xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3">
                <Compass className="w-7 h-7" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Choose Your Level
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Where would you like to start? You can practice any level anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
              {LEVELS.map(lvl => (
                <div
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer border-2 transition-all flex items-start gap-3 ${
                    selectedLevel === lvl.id
                      ? 'bg-indigo-950/70 border-indigo-500 shadow-glow-primary scale-[1.02]'
                      : 'bg-slate-800/70 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-slate-900 text-xs shrink-0"
                    style={{ backgroundColor: lvl.color }}
                  >
                    {lvl.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{lvl.name}</h4>
                    <p className="text-slate-400 text-xs line-clamp-2 mt-0.5">{lvl.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="btn-game-primary w-full max-w-sm mx-auto py-3.5 px-6 flex items-center justify-center gap-2 text-base font-bold"
            >
              <span>Ready to Play!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 5: WELCOME PACK & ENTER */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-3xl inline-block">
              <ModularCharacter config={characterConfig} size="xl" animate={true} />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-white">
                You are ready, {name || 'Champion'}! 🚀
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Here is your beginner adventurer bonus pack:
              </p>
            </div>

            {/* Rewards Showcase */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-base">
                <span className="text-xl">🪙</span>
                <span>+100 Coins</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-extrabold text-base">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span>+50 XP</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-base">
                <span>🎉</span>
                <span>"LET'S GO!" Sticker</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="btn-game-gold w-full max-w-sm mx-auto py-4 px-8 flex items-center justify-center gap-2 text-lg tracking-wide uppercase font-extrabold shadow-glow-gold"
            >
              <span>ENTER THE GAME</span>
              <Sparkles className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
