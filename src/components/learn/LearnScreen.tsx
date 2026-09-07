import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { LevelId, CurriculumUnit, PracticeMode } from '../../types';
import { LEVELS } from '../../data/curriculumData';
import { FlashcardViewer } from './FlashcardViewer';
import { VocabularyExamScreen } from './VocabularyExamScreen';
import { VocabularyPractice, WordCountMode } from './VocabularyPractice';
import { MistakesReview } from './MistakesReview';
import { GrammarDashboard } from '../grammar/GrammarDashboard';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, 
  Zap, 
  CheckCircle2,
  Lock,
  AlertCircle, 
  RotateCcw, 
  ChevronRight,
  MousePointerClick,
  Trophy,
  Sparkles,
  XCircle
} from 'lucide-react';

export const LearnScreen: React.FC = () => {
  const { 
    profile, 
    curriculumUnits, 
    activeUnitId, 
    setActiveUnitId, 
    updateLevel, 
    currentScreen,
    getUnitProgress,
    getStudentUnitStatus
  } = useGame();

  const [learnCategory, setLearnCategory] = useState<'vocabulary' | 'grammar'>('vocabulary');
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>(() => profile.levelId || 'beginner');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [practiceCountMode, setPracticeCountMode] = useState<WordCountMode>('whole');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('mixed');
  const [practiceStartIndex, setPracticeStartIndex] = useState<number | undefined>(undefined);
  const [flashcardStartIndex, setFlashcardStartIndex] = useState<number>(0);

  const [examUnitId, setExamUnitId] = useState<string | null>(() => {
    if (profile.activeExamAttempt && profile.activeExamAttempt.status === 'active') {
      return profile.activeExamAttempt.unitId;
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'units' | 'flashcards' | 'practice' | 'mistakes' | 'exam'>(() => {
    if (profile.activeExamAttempt && profile.activeExamAttempt.status === 'active') {
      return 'exam';
    }
    if (currentScreen === 'flashcards') return 'flashcards';
    if (currentScreen === 'practice') return 'practice';
    if (currentScreen === 'mistakes') return 'mistakes';
    return 'units';
  });(() => {
    if (currentScreen === 'flashcards') return 'flashcards';
    if (currentScreen === 'practice') return 'practice';
    if (currentScreen === 'mistakes') return 'mistakes';
    return 'units';
  });

  const levelUnits = curriculumUnits.filter(u => u.levelId === selectedLevelId);
  const activeUnit = selectedUnitId ? (levelUnits.find(u => u.id === selectedUnitId) || null) : null;

  // Sub-view routing
  if (activeTab === 'flashcards') {
    return (
      <FlashcardViewer 
        onBack={() => setActiveTab('units')} 
        initialIndex={flashcardStartIndex}
      />
    );
  }

  if (activeTab === 'practice') {
    return (
      <VocabularyPractice 
        onBack={() => {
          setActiveTab('units');
          setPracticeStartIndex(undefined);
        }} 
        initialCountMode={practiceCountMode}
        initialMode={practiceMode}
        startWordIndex={practiceStartIndex}
      />
    );
  }

  if (activeTab === 'mistakes') {
    return <MistakesReview onBack={() => setActiveTab('units')} />;
  }

  if (activeTab === 'exam' || (profile.activeExamAttempt && profile.activeExamAttempt.status === 'active')) {
    const targetId = examUnitId || profile.activeExamAttempt?.unitId || activeUnitId;
    return (
      <VocabularyExamScreen 
        unitId={targetId} 
        onExit={() => {
          setActiveTab('units');
          setExamUnitId(null);
        }} 
      />
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Segmented Switch: Vocabulary vs Grammar */}
      <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-md mx-auto sm:mx-0">
        <button
          onClick={() => {
            soundService.playClick();
            setLearnCategory('vocabulary');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            learnCategory === 'vocabulary'
              ? 'bg-indigo-600 text-white shadow-game-btn scale-102'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Vocabulary Units</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setLearnCategory('grammar');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            learnCategory === 'grammar'
              ? 'bg-indigo-600 text-white shadow-game-btn scale-102'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Grammar Challenge</span>
        </button>
      </div>

      {/* RENDER GRAMMAR DASHBOARD IF GRAMMAR SELECTED */}
      {learnCategory === 'grammar' ? (
        <GrammarDashboard />
      ) : (
        <>
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
            const prog = getUnitProgress(u.id);
            const unitStatus = getStudentUnitStatus(profile, u.id);
            const isLocked = unitStatus === 'LOCKED';
            const isPassed = unitStatus === 'PASSED';
            const isReady = unitStatus === 'READY_FOR_EXAM';
            const isInProgress = unitStatus === 'EXAM_IN_PROGRESS';
            const isFailed = unitStatus === 'FAILED';
            const unitRecord = profile.vocabProgression?.[u.id];

            return (
              <div
                key={u.id}
                onClick={() => {
                  soundService.playClick();
                  setSelectedUnitId(u.id);
                  setActiveUnitId(u.id);
                }}
                className={`card-game p-5 cursor-pointer transition-all duration-150 border-2 ${
                  isReady
                    ? 'border-amber-500/80 bg-gradient-to-r from-amber-950/30 to-slate-900 shadow-glow-amber ring-1 ring-amber-500/40'
                    : isInProgress
                    ? 'border-emerald-500/90 bg-emerald-950/30 shadow-glow-emerald animate-pulse'
                    : isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-glow-primary scale-[1.01]'
                    : isLocked
                    ? 'border-slate-800 bg-slate-900/60 opacity-75 hover:opacity-90 hover:border-slate-700'
                    : isPassed
                    ? 'border-emerald-500/40 bg-slate-900/90 hover:border-emerald-500/60'
                    : isFailed
                    ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500/60'
                    : 'border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Unit Number Badge */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border-2 ${
                      isPassed
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : isReady
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : isInProgress
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                        : isFailed
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : isLocked
                        ? 'bg-slate-800/80 border-slate-700 text-slate-500'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {isPassed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-slate-500" />
                      ) : isFailed ? (
                        <XCircle className="w-6 h-6 text-rose-400" />
                      ) : (
                        u.unitNumber
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-white">
                          {u.title}
                        </h3>
                        {/* Status Badges */}
                        {isReady && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider animate-bounce">
                            ⭐ Ready for Exam!
                          </span>
                        )}
                        {isInProgress && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                            Active Exam
                          </span>
                        )}
                        {isPassed && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                            ✓ Passed {unitRecord?.lastAttemptScore ? `(${unitRecord.lastAttemptScore}%)` : ''}
                          </span>
                        )}
                        {isFailed && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                            ✕ Failed {unitRecord?.lastAttemptScore ? `(${unitRecord.lastAttemptScore}%)` : ''}
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-bold">
                            Locked
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        {isLocked ? (
                          <span className="text-slate-500">Pass Unit {u.unitNumber - 1} with ≥ 95% on official exam to unlock</span>
                        ) : (
                          <>
                            <span className="text-emerald-400 font-extrabold">{prog.percent}% Studied</span>
                            <span>•</span>
                            <span>{prog.completedCount} / {u.words.length} words</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-indigo-400 rotate-90 lg:rotate-0' : 'text-slate-600'}`} />
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      (isPassed || prog.percent >= 100) ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                    }`}
                    style={{ width: `${prog.percent}%` }}
                  />
                </div>

                {/* In-progress continue indicator */}
                {prog.percent < 100 && prog.completedCount > 0 && (
                  <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
                    <span className="flex items-center gap-1.5 font-bold truncate">
                      <span>📍</span>
                      <span>Next: Word {prog.nextWordIndex + 1} {u.words[prog.nextWordIndex]?.word ? `("${u.words[prog.nextWordIndex].word}")` : ''}</span>
                    </span>
                    <span className="text-[11px] text-indigo-400/80 font-medium shrink-0 ml-2">
                      {u.words.length - prog.completedCount} left
                    </span>
                  </div>
                )}

                {/* Mobile Quick Action Buttons (visible only on mobile when selected) */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-indigo-500/30 flex flex-col gap-2 lg:hidden animate-in fade-in duration-200">
                    {prog.percent < 100 && prog.completedCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundService.playSuccess();
                          setPracticeStartIndex(prog.nextWordIndex);
                          setPracticeCountMode('10');
                          setPracticeMode('mixed');
                          setActiveTab('practice');
                        }}
                        className="btn-game-emerald w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-black shadow-glow-emerald"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Continue Practice (from Word {prog.nextWordIndex + 1})</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundService.playSuccess();
                        setPracticeStartIndex(undefined);
                        setPracticeCountMode('whole');
                        setPracticeMode('mixed');
                        setActiveTab('practice');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black flex items-center justify-center gap-2 text-xs shadow-game-btn"
                    >
                      <Trophy className="w-4 h-4 text-slate-950" />
                      <span>Full Unit Exam ({u.words.length} Words)</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundService.playClick();
                          setFlashcardStartIndex(prog.nextWordIndex);
                          setActiveTab('flashcards');
                        }}
                        className="btn-game-primary py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-bold"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Flashcards</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundService.playClick();
                          setPracticeStartIndex(undefined);
                          setPracticeCountMode('10');
                          setPracticeMode('mixed');
                          setActiveTab('practice');
                        }}
                        className="btn-game-slate py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-bold"
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
          {activeUnit ? (() => {
            const activeUnitProg = getUnitProgress(activeUnit.id);
            return (
              <div className="card-game p-6 border-2 border-indigo-500/40 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 space-y-5 sticky top-20 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                      Selected Unit
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      {activeUnitProg.percent}% Finished
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">{activeUnit.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">{activeUnit.description}</p>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${activeUnitProg.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span>{activeUnitProg.completedCount} of {activeUnit.words.length} words completed</span>
                      <span>{Math.max(0, activeUnit.words.length - activeUnitProg.completedCount)} left</span>
                    </div>
                  </div>
                </div>

                {/* Launch Action Buttons */}
                <div className="space-y-2.5">
                  {/* Primary Continue Button if in progress */}
                  {activeUnitProg.percent < 100 && activeUnitProg.completedCount > 0 && (
                    <button
                      onClick={() => {
                        soundService.playSuccess();
                        setPracticeStartIndex(activeUnitProg.nextWordIndex);
                        setPracticeCountMode('10');
                        setPracticeMode('mixed');
                        setActiveTab('practice');
                      }}
                      className="btn-game-emerald w-full py-3.5 px-5 flex items-center justify-center gap-2 font-black text-sm shadow-glow-emerald hover:brightness-110 active:scale-98 transition-all"
                    >
                      <Zap className="w-5 h-5 fill-white" />
                      <span>Continue Practice (from Word {activeUnitProg.nextWordIndex + 1})</span>
                    </button>
                  )}

                  {/* Official Final Exam Launcher */}
                  {(() => {
                    const status = getStudentUnitStatus(profile, activeUnit.id);
                    const isReady = status === 'READY_FOR_EXAM';
                    const isInProgress = status === 'EXAM_IN_PROGRESS';
                    const isPassed = status === 'PASSED';
                    const isFailed = status === 'FAILED';
                    const isLocked = status === 'LOCKED';
                    const record = profile.vocabProgression?.[activeUnit.id];

                    if (isReady || isInProgress) {
                      return (
                        <button
                          onClick={() => {
                            soundService.playSuccess();
                            setExamUnitId(activeUnit.id);
                            setActiveTab('exam');
                          }}
                          className={`w-full py-3.5 px-5 rounded-2xl font-black flex items-center justify-center gap-2 text-sm shadow-game-btn hover:brightness-110 active:scale-98 transition-all ${
                            isInProgress
                              ? 'btn-game-emerald shadow-glow-emerald animate-pulse'
                              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-glow-amber'
                          }`}
                        >
                          <Trophy className="w-5 h-5" />
                          <span>{isInProgress ? 'Resume Official Exam' : 'START OFFICIAL FINAL EXAM (Authorized)'}</span>
                        </button>
                      );
                    }

                    if (isPassed) {
                      return (
                        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-black">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Unit Passed ({record?.lastAttemptScore || 100}%)</span>
                          </span>
                          <span className="text-[11px] opacity-80">Official Completed</span>
                        </div>
                      );
                    }

                    if (isFailed) {
                      return (
                        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold space-y-1">
                          <div className="flex items-center gap-2 font-black">
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <span>Exam Not Passed ({record?.lastAttemptScore}%)</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            95% required to pass. Please review your vocabulary and ask your teacher to authorize a retake.
                          </p>
                        </div>
                      );
                    }

                    if (isLocked) {
                      return (
                        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-bold flex items-center gap-2">
                          <Lock className="w-4 h-4 text-slate-500" />
                          <span>Unit Locked — Pass earlier units to unlock</span>
                        </div>
                      );
                    }

                    // Status === 'LEARNING'
                    return (
                      <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold space-y-1">
                        <div className="flex items-center gap-1.5 font-black text-white">
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>Final Exam Locked (Teacher Authorization Required)</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Study flashcards and practice first. When you are ready, ask your teacher to grant exam access.
                        </p>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        soundService.playClick();
                        setFlashcardStartIndex(activeUnitProg.nextWordIndex);
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
                        setPracticeStartIndex(undefined);
                        setPracticeCountMode('10');
                        setPracticeMode('mixed');
                        setActiveTab('practice');
                      }}
                      className="btn-game-slate py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold"
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
                    {activeUnit.words.map((w, idx) => {
                      const isWordDone = activeUnitProg.completedWordIds.includes(w.id);
                      return (
                        <span
                          key={w.id}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                            isWordDone 
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                              : idx === activeUnitProg.nextWordIndex && activeUnitProg.percent < 100
                              ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-sm ring-1 ring-indigo-400'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {isWordDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          <span>{w.word}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })() : (
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
      </>
      )}

    </div>
  );
};
