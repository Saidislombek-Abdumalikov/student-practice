import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { LevelId, CurriculumUnit, PracticeMode } from '../../types';
import { LEVELS } from '../../data/curriculumData';
import { FlashcardViewer } from './FlashcardViewer';
import { VocabularyPractice, WordCountMode } from './VocabularyPractice';
import { MistakesReview } from './MistakesReview';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  RotateCcw, 
  ChevronRight,
  MousePointerClick,
  Trophy
} from 'lucide-react';

export const LearnScreen: React.FC = () => {
  const { 
    profile, 
    curriculumUnits, 
    activeUnitId, 
    setActiveUnitId,
    updateLevel,
    currentScreen,
  } = useGame();

  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>(() => profile.levelId || 'beginner');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [practiceCountMode, setPracticeCountMode] = useState<WordCountMode>('whole');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('mixed');
  const [activeTab, setActiveTab] = useState<'units' | 'flashcards' | 'practice' | 'mistakes'>(() => {
    if (currentScreen === 'flashcards') return 'flashcards';
    if (currentScreen === 'practice') return 'practice';
    if (currentScreen === 'mistakes') return 'mistakes';
    return 'units';
  });

  const levelUnits = curriculumUnits.filter(u => u.levelId === selectedLevelId);
  const activeUnit = selectedUnitId ? (levelUnits.find(u => u.id === selectedUnitId) || null) : null;
  const activeUnitMastery = activeUnit ? (profile.unitMasteries[activeUnit.id] || 0) : 0;

  // Sub-view routing
  if (activeTab === 'flashcards') {
    return <FlashcardViewer onBack={() => setActiveTab('units')} />;
  }

  if (activeTab === 'practice') {
    return (
      <VocabularyPractice 
        onBack={() => setActiveTab('units')} 
        initialCountMode={practiceCountMode}
        initialMode={practiceMode}
      />
    );
  }

  if (activeTab === 'mistakes') {
    return <MistakesReview onBack={() => setActiveTab('units')} />;
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Banner & Level Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            CURRICULUM TREE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            English Learning Journey
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Progress through units, flip interactive flashcards, and master vocabulary.
          </p>
        </div>

        {/* Mistakes review shortcut */}
        <button
          onClick={() => { soundService.playClick(); setActiveTab('mistakes'); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all text-xs font-extrabold"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>My Mistakes ({profile.mistakes.length})</span>
        </button>
      </div>

      {/* Level Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LEVELS.map(lvl => {
          const isSelected = selectedLevelId === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => {
                soundService.playClick();
                setSelectedLevelId(lvl.id);
                updateLevel(lvl.id);
                setSelectedUnitId(null); // Clear selection on level switch so no default/unrelated vocab displays
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all border-2 ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-game-btn scale-105'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: lvl.color }}
              />
              <span>{lvl.name}</span>
              <span className="opacity-70 text-[10px]">({lvl.code})</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Unit Path (Left) & Active Unit Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Unit Nodes (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Units in this level ({levelUnits.length})
            </span>
            <span className="text-[11px] text-indigo-400 font-semibold">
              Select a unit below
            </span>
          </div>

          {levelUnits.map((u) => {
            const isSelected = selectedUnitId === u.id;
            const mastery = profile.unitMasteries[u.id] || 0;
            const isCompleted = mastery >= 80;

            return (
              <div
                key={u.id}
                onClick={() => {
                  soundService.playClick();
                  setSelectedUnitId(u.id);
                  setActiveUnitId(u.id);
                }}
                className={`card-game p-5 cursor-pointer transition-all duration-150 border-2 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-glow-primary scale-[1.01]'
                    : 'border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Unit Number Badge */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border-2 ${
                      isCompleted
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : u.unitNumber}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-white">
                        {u.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{u.words.length} Words</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{mastery}% Mastery</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-indigo-400 rotate-90 lg:rotate-0' : 'text-slate-600'}`} />
                </div>

                {/* Mobile Quick Action Buttons (visible only on mobile when selected) */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-indigo-500/30 flex flex-col gap-2 lg:hidden animate-in fade-in duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundService.playSuccess();
                        setPracticeCountMode('whole');
                        setPracticeMode('mixed');
                        setActiveTab('practice');
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black flex items-center justify-center gap-2 text-xs shadow-game-btn"
                    >
                      <Trophy className="w-4 h-4 text-slate-950" />
                      <span>Full Unit Exam ({u.words.length} Words)</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundService.playClick();
                          setActiveTab('flashcards');
                        }}
                        className="btn-game-primary py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-bold"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Flashcards</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundService.playClick();
                          setPracticeCountMode('10');
                          setPracticeMode('mixed');
                          setActiveTab('practice');
                        }}
                        className="btn-game-emerald py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-bold"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Quick (10 Words)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Unit Overview & Launchers (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeUnit ? (
            <div className="card-game p-6 border-2 border-indigo-500/40 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 space-y-5 sticky top-20 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                    Selected Unit
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {activeUnitMastery}% Mastered
                  </span>
                </div>
                <h2 className="text-xl font-black text-white">{activeUnit.title}</h2>
                <p className="text-xs text-slate-400 mt-1">{activeUnit.description}</p>
              </div>

              {/* Launch Action Buttons */}
              <div className="space-y-2.5">
                {/* 1. Full Unit Exam (Prominent Golden Button) */}
                <button
                  onClick={() => {
                    soundService.playSuccess();
                    setPracticeCountMode('whole');
                    setPracticeMode('mixed');
                    setActiveTab('practice');
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black flex items-center justify-center gap-2 text-sm shadow-game-btn hover:brightness-110 active:scale-98 transition-all"
                >
                  <Trophy className="w-5 h-5 text-slate-950" />
                  <span>Full Unit Exam ({activeUnit.words.length} Words)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      soundService.playClick();
                      setActiveTab('flashcards');
                    }}
                    className="btn-game-primary py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>3D Flashcards</span>
                  </button>

                  <button
                    onClick={() => {
                      soundService.playClick();
                      setPracticeCountMode('10');
                      setPracticeMode('mixed');
                      setActiveTab('practice');
                    }}
                    className="btn-game-emerald py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Quick (10 Words)</span>
                  </button>
                </div>
              </div>

              {/* Word Preview Chips */}
              <div className="pt-4 border-t border-slate-700/80">
                <span className="text-xs font-bold text-slate-400 block mb-2">
                  Words in this unit ({activeUnit.words.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {activeUnit.words.map(w => (
                    <span
                      key={w.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card-game p-8 border-2 border-dashed border-slate-800 bg-slate-900/40 text-center space-y-4 sticky top-20 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <MousePointerClick className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-base font-black text-white">Choose a Unit to Start</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select any unit from the list on the left to view words, study 3D flashcards, or practice exercises.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
