import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { VocabularyWord, PracticeMode } from '../../types';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Volume2, 
  ArrowRight,
  RotateCcw,
  Trophy,
  Shuffle,
  Timer
} from 'lucide-react';

export type WordCountMode = '5' | '10' | 'whole';

// Robust Fisher-Yates shuffle algorithm for automatic question randomization
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface VocabularyPracticeProps {
  onBack: () => void;
  initialCountMode?: WordCountMode;
  initialMode?: PracticeMode;
}

export const VocabularyPractice: React.FC<VocabularyPracticeProps> = ({ 
  onBack, 
  initialCountMode = '10',
  initialMode = 'mixed' 
}) => {
  const { 
    curriculumUnits, 
    activeUnitId, 
    addXP, 
    addCoins, 
    recordMistake, 
    recordPracticeResult 
  } = useGame();

  const currentUnit = curriculumUnits.find(u => u.id === activeUnitId) || curriculumUnits[0];
  
  const [wordCountMode, setWordCountMode] = useState<WordCountMode>(initialCountMode);
  const [shuffleCounter, setShuffleCounter] = useState<number>(1);

  // Automatically shuffles on start, after every session, and on count change
  const activeWords = useMemo(() => {
    const shuffled = shuffleArray(currentUnit.words);
    if (wordCountMode === '5') {
      return shuffled.slice(0, Math.min(5, shuffled.length));
    }
    if (wordCountMode === '10') {
      return shuffled.slice(0, Math.min(10, shuffled.length));
    }
    // 'whole': examines ALL words from the full unit!
    return shuffled;
  }, [currentUnit.words, wordCountMode, shuffleCounter]);

  const handleWordCountChange = (newCount: WordCountMode) => {
    soundService.playClick();
    setWordCountMode(newCount);
    setShuffleCounter(c => c + 1); // Automatically re-shuffles questions!
    setQuestionIndex(0);
    setCombo(0);
    setScore(0);
    setCorrectCount(0);
    setIsFinished(false);
  };

  const handleManualShuffle = () => {
    soundService.playClick();
    setShuffleCounter(c => c + 1); // Instant manual shuffle
    setQuestionIndex(0);
    setCombo(0);
    setCorrectCount(0);
    setIsFinished(false);
  };

  // Selected practice mode tab
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [matchRound, setMatchRound] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState<number>(0);
  const [totalXpEarned, setTotalXpEarned] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Exercise Specific States
  // 1. Multiple Choice
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  // 2. True / False
  const [tfStatement, setTfStatement] = useState<{ displayedMeaning: string; isCorrect: boolean }>({ displayedMeaning: '', isCorrect: true });
  // 3. Typing
  const [typedInput, setTypedInput] = useState<string>('');
  // 4. Unscramble
  const [scrambledLetters, setScrambledLetters] = useState<{ id: string; letter: string }[]>([]);
  const [pickedLetters, setPickedLetters] = useState<{ id: string; letter: string }[]>([]);
  // 5. Matching
  const [matchPairsEn, setMatchPairsEn] = useState<VocabularyWord[]>([]);
  const [matchPairsUz, setMatchPairsUz] = useState<VocabularyWord[]>([]);
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedUz, setSelectedUz] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  // Feedback State
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Derive dynamic question type for mixed exam mode (rotates through all 4 interactive types)
  const mixedTypes: ('multiple_choice' | 'true_false' | 'typing' | 'unscramble')[] = [
    'multiple_choice',
    'true_false',
    'typing',
    'unscramble',
  ];
  const activeQuestionType = mode === 'mixed' ? mixedTypes[questionIndex % mixedTypes.length] : mode;

  // Fixed Countdown Timer (20s per question, 45s for matching rounds)
  const [timeLeft, setTimeLeft] = useState<number>(mode === 'matching' ? 45 : 20);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);

  // Reset timer on question change, mode change, or round change
  useEffect(() => {
    setTimeLeft(mode === 'matching' ? 45 : 20);
  }, [questionIndex, mode, matchRound]);

  // Main countdown timer interval
  useEffect(() => {
    if (isFinished || isTimerPaused) return;

    const timer = setInterval(() => {
      setTotalElapsedTime(t => t + 1);
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time expired!
          if (mode === 'matching') {
            const startIdx = matchRound * 5;
            if (startIdx + 5 < activeWords.length) {
              setMatchRound(r => r + 1);
              return 45;
            } else {
              finishSession();
              return 0;
            }
          } else {
            handleTimeOut();
            return 20;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, isTimerPaused, mode, matchRound, questionIndex, activeWords.length]);

  const handleTimeOut = () => {
    if (feedback) return;
    soundService.playError();
    setFeedback('wrong');
    setCombo(0);
    recordMistake(currentWord);
    setTimeout(() => {
      proceedNext();
    }, 1200);
  };

  const currentWord = activeWords[questionIndex % activeWords.length];

  // Initialize questions on activeQuestionType or index change
  useEffect(() => {
    if (!currentWord || isFinished) return;
    setFeedback(null);
    setSelectedOption(null);
    setTypedInput('');

    // Generate Multiple Choice Options (Properly shuffled with Fisher-Yates)
    if (activeQuestionType === 'multiple_choice') {
      const wrong = shuffleArray(
        currentUnit.words.filter((w: VocabularyWord) => w.id !== currentWord.id)
      ).slice(0, 3).map((w: VocabularyWord) => w.uzbekTranslation);
      
      const all = shuffleArray([currentWord.uzbekTranslation, ...wrong]);
      setOptions(all);
    }

    // Generate True / False
    if (activeQuestionType === 'true_false') {
      const isMatch = Math.random() > 0.5;
      if (isMatch) {
        setTfStatement({ displayedMeaning: currentWord.uzbekTranslation, isCorrect: true });
      } else {
        const otherWords = currentUnit.words.filter((w: VocabularyWord) => w.id !== currentWord.id);
        const randomOther = otherWords[Math.floor(Math.random() * otherWords.length)] || currentWord;
        setTfStatement({ displayedMeaning: randomOther.uzbekTranslation, isCorrect: false });
      }
    }

    // Generate Unscramble
    if (activeQuestionType === 'unscramble') {
      const letters = currentWord.word.toUpperCase().split('').map((l, i) => ({ id: `l_${i}`, letter: l }));
      setScrambledLetters(shuffleArray(letters));
      setPickedLetters([]);
    }
  }, [activeQuestionType, questionIndex, isFinished, activeWords]);

  // Generate Matching (paginated 5 pairs per round across activeWords)
  useEffect(() => {
    if (mode === 'matching' && !isFinished) {
      const startIdx = matchRound * 5;
      const roundSlice = activeWords.slice(startIdx, startIdx + 5);
      if (roundSlice.length > 0) {
        setMatchPairsEn(shuffleArray(roundSlice));
        setMatchPairsUz(shuffleArray(roundSlice));
        setMatchedIds([]);
        setSelectedEn(null);
        setSelectedUz(null);
      }
    }
  }, [mode, matchRound, activeWords, isFinished]);

  // Handle Correct Answer Reward
  const handleCorrect = () => {
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    soundService.playCombo(newCombo);
    setFeedback('correct');

    const xpEarned = 10 + Math.min(newCombo, 5) * 2;
    // Spelling (typing) and Unscramble award 2 coins
    const isSpellingOrUnscramble = activeQuestionType === 'typing' || activeQuestionType === 'unscramble';
    const baseCoins = isSpellingOrUnscramble ? 2 : 1;
    const coinsEarned = baseCoins + (newCombo >= 3 ? 1 : 0);

    addXP(xpEarned);
    addCoins(coinsEarned);

    setTotalXpEarned(prev => prev + xpEarned);
    setTotalCoinsEarned(prev => prev + coinsEarned);
    setScore(prev => prev + (100 * Math.min(newCombo, 5)));
    setCorrectCount(prev => prev + 1);

    setTimeout(() => {
      proceedNext();
    }, 900);
  };

  // Handle Wrong Answer
  const handleWrong = () => {
    soundService.playError();
    setCombo(0); // Break combo
    setFeedback('wrong');
    recordMistake(currentWord);

    setTimeout(() => {
      proceedNext();
    }, 1200);
  };

  const proceedNext = () => {
    if (questionIndex + 1 >= activeWords.length && mode !== 'matching') {
      finishSession();
    } else {
      setQuestionIndex(prev => prev + 1);
    }
  };

  const finishSession = () => {
    setIsFinished(true);
    soundService.playLevelUp();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    const totalAttempted = mode === 'matching' 
      ? Math.max(1, matchedIds.length) 
      : Math.max(1, questionIndex + (feedback ? 1 : 0));
    recordPracticeResult(currentUnit.id, correctCount, Math.min(activeWords.length, totalAttempted));
  };

  // 1. Multiple Choice Handler
  const handleOptionSelect = (option: string) => {
    if (feedback || selectedOption) return;
    setSelectedOption(option);
    if (option === currentWord.uzbekTranslation) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  // 2. True / False Handler
  const handleTfAnswer = (userSaidTrue: boolean) => {
    if (feedback) return;
    if (userSaidTrue === tfStatement.isCorrect) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  // 3. Typing Submit Handler
  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback || !typedInput.trim()) return;
    if (typedInput.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  // 4. Unscramble Handlers
  const handlePickLetter = (item: { id: string; letter: string }) => {
    if (feedback) return;
    soundService.playClick();
    setScrambledLetters(prev => prev.filter(l => l.id !== item.id));
    const nextPicked = [...pickedLetters, item];
    setPickedLetters(nextPicked);

    // Check if full word is assembled
    if (nextPicked.length === currentWord.word.length) {
      const assembled = nextPicked.map(l => l.letter).join('');
      if (assembled.toLowerCase() === currentWord.word.toLowerCase()) {
        handleCorrect();
      } else {
        handleWrong();
      }
    }
  };

  const handleUnpickLetter = (item: { id: string; letter: string }) => {
    if (feedback) return;
    soundService.playClick();
    setPickedLetters(prev => prev.filter(l => l.id !== item.id));
    setScrambledLetters(prev => [...prev, item]);
  };

  // 5. Matching Handlers
  const handleSelectEnMatch = (wordId: string) => {
    if (matchedIds.includes(wordId)) return;
    soundService.playClick();
    setSelectedEn(wordId);
    if (selectedUz) {
      checkMatch(wordId, selectedUz);
    }
  };

  const handleSelectUzMatch = (wordId: string) => {
    if (matchedIds.includes(wordId)) return;
    soundService.playClick();
    setSelectedUz(wordId);
    if (selectedEn) {
      checkMatch(selectedEn, wordId);
    }
  };

  const checkMatch = (enId: string, uzId: string) => {
    if (enId === uzId) {
      soundService.playSuccess();
      const updated = [...matchedIds, enId];
      setMatchedIds(updated);
      setSelectedEn(null);
      setSelectedUz(null);

      const newCombo = combo + 1;
      setCombo(newCombo);
      addXP(15);
      addCoins(1);
      setTotalXpEarned(p => p + 15);
      setTotalCoinsEarned(p => p + 1);

      const startIdx = matchRound * 5;
      const currentRoundWords = activeWords.slice(startIdx, startIdx + 5);
      if (updated.length === currentRoundWords.length) {
        if (startIdx + 5 < activeWords.length) {
          // Advance to next round of matching!
          setTimeout(() => {
            soundService.playSuccess();
            setMatchRound(r => r + 1);
            setTimeLeft(45);
          }, 600);
        } else {
          // Finished all matching rounds!
          setTimeout(() => finishSession(), 600);
        }
      }
    } else {
      soundService.playError();
      setCombo(0);
      setSelectedEn(null);
      setSelectedUz(null);
    }
  };

  // SESSION FINISHED SCREEN
  if (isFinished) {
    const answeredCount = mode === 'matching' 
      ? Math.max(1, matchedIds.length) 
      : Math.max(1, questionIndex + (feedback ? 1 : 0));
    const accuracy = answeredCount > 0 ? Math.min(100, Math.round((correctCount / answeredCount) * 100)) : 100;

    return (
      <div className="max-w-md mx-auto card-game p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
            PRACTICE COMPLETE
          </span>
          <h2 className="text-3xl font-black text-white mt-1">Fantastic Job! 🎉</h2>
          <p className="text-slate-400 text-sm mt-1">{currentUnit.title}</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">Accuracy</span>
            <span className="text-2xl font-black text-emerald-400">{accuracy}%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">Questions</span>
            <span className="text-2xl font-black text-white">
              {correctCount} / {answeredCount}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">XP Earned</span>
            <span className="text-2xl font-black text-indigo-400">+{totalXpEarned}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">Coins Earned</span>
            <span className="text-2xl font-black text-amber-400">+{totalCoinsEarned} 🪙</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 col-span-2 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">⏱️ Total Time Taken</span>
            <span className="text-sm font-black text-white font-mono">
              {Math.floor(totalElapsedTime / 60)}m {totalElapsedTime % 60}s
            </span>
          </div>
        </div>

        {wordCountMode === 'whole' && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-black text-sm uppercase tracking-wide">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Full Unit Exam Mastered!</span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium">
              You examined all {activeWords.length} words from {currentUnit.title}!
            </p>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              soundService.playSuccess();
              setShuffleCounter(c => c + 1); // Automatically shuffles after each practice!
              setIsFinished(false);
              setQuestionIndex(0);
              setMatchRound(0);
              setTimeLeft(mode === 'matching' ? 45 : 20);
              setTotalElapsedTime(0);
              setCombo(0);
              setCorrectCount(0);
              setTotalXpEarned(0);
              setTotalCoinsEarned(0);
              setMatchedIds([]);
            }}
            className="btn-game-primary w-full py-3.5 px-6 flex items-center justify-center gap-2 font-bold text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again (Auto-Shuffled 🎲)</span>
          </button>
          <button
            onClick={onBack}
            className="btn-game-slate w-full py-3 px-6 text-sm font-bold"
          >
            Back to Unit Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Top Navigation & Combo Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold shrink-0"
            title="Exit practice"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit</span>
          </button>

          <button
            onClick={finishSession}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-game-btn transition-all active:scale-95 shrink-0"
            title="Finish practice session and submit results"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Finish</span>
          </button>
        </div>

        {/* Locked, Stationary Exam Timer (Tabular Monospaced Numbers, Zero Screen Flicker) */}
        <div 
          onClick={() => setIsTimerPaused(p => !p)}
          className={`w-20 sm:w-24 px-2 py-1.5 rounded-xl border text-xs font-mono font-black tabular-nums flex items-center justify-center gap-1.5 shrink-0 cursor-pointer select-none transition-all ${
            timeLeft <= 5 
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-amber-300'
          }`}
          title={isTimerPaused ? "Timer paused. Click to resume" : "Click to pause/resume timer"}
        >
          <Timer className={`w-3.5 h-3.5 shrink-0 ${timeLeft <= 5 ? 'text-rose-400' : 'text-amber-400'}`} />
          <span className="w-[30px] text-right">{timeLeft}s</span>
        </div>

        {/* Combo Multiplier Flame */}
        <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl font-extrabold text-xs transition-all shrink-0 ${
          combo > 1 
            ? 'bg-orange-500/25 border border-orange-500/50 text-orange-300 shadow-glow-gold scale-105' 
            : 'bg-slate-800/80 border border-slate-700 text-slate-400'
        }`}>
          <Flame className={`w-4 h-4 ${combo > 1 ? 'text-orange-400 fill-orange-400 animate-flame-wobble' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">{combo > 0 ? `${combo}x COMBO` : 'COMBO 1x'}</span>
          <span className="sm:hidden">{combo}x</span>
        </div>

        {/* Question Counter & Mode Tag */}
        <div className="flex items-center gap-2 shrink-0">
          {wordCountMode === 'whole' && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase">
              <Trophy className="w-3 h-3 text-amber-400" />
              Full Unit
            </span>
          )}
          <div className="text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-500/20 font-mono tabular-nums">
            {mode === 'matching' 
              ? `R${matchRound + 1}/${Math.ceil(activeWords.length / 5)}`
              : `${questionIndex + 1} / ${activeWords.length}`}
          </div>
        </div>
      </div>

      {/* Word Count Selector Bar (5 Words, 10 Words, Full Unit) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Practice Scope:</span>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleWordCountChange('5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              wordCountMode === '5'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5 Words
          </button>
          <button
            onClick={() => handleWordCountChange('10')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              wordCountMode === '10'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            10 Words
          </button>
          <button
            onClick={() => handleWordCountChange('whole')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              wordCountMode === 'whole'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-sm'
                : 'text-amber-400/90 hover:text-amber-300'
            }`}
            title="Examines all words from the complete unit"
          >
            <Trophy className="w-3 h-3" />
            <span>Full Unit ({currentUnit.words.length})</span>
          </button>
        </div>

        {/* Shuffle Button with live indicator */}
        <button
          onClick={handleManualShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all ml-auto"
          title="Questions automatically shuffle after each practice. Click to re-shuffle words right now!"
        >
          <Shuffle className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto-Shuffled 🎲</span>
        </button>
      </div>

      {/* Mode Selector Tabs (6 Distinct Visual Engines) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => { soundService.playClick(); setMode('mixed'); setQuestionIndex(0); setFeedback(null); }}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            mode === 'mixed' 
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-game-btn' 
              : 'text-amber-400/90 hover:text-amber-300'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Mixed Exam (All Types)</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setMode('multiple_choice'); setQuestionIndex(0); setFeedback(null); }}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
            mode === 'multiple_choice' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Multiple Choice
        </button>

        <button
          onClick={() => { soundService.playClick(); setMode('true_false'); setQuestionIndex(0); setFeedback(null); }}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
            mode === 'true_false' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          True / False
        </button>

        <button
          onClick={() => { soundService.playClick(); setMode('typing'); setQuestionIndex(0); setFeedback(null); }}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            mode === 'typing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Spelling & Typing</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
            +2 🪙
          </span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setMode('unscramble'); setQuestionIndex(0); setFeedback(null); }}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            mode === 'unscramble' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Unscramble</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/30">
            +2 🪙
          </span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setMode('matching'); setMatchRound(0); setMatchedIds([]); setFeedback(null); }}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition-all ${
            mode === 'matching' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Memory Match
        </button>
      </div>

      {/* MAIN ACTIVITY CARD */}
      <div className={`card-game p-6 sm:p-8 space-y-6 transition-all border-2 ${
        feedback === 'correct' ? 'border-emerald-500 shadow-glow-emerald' :
        feedback === 'wrong' ? 'border-rose-500 shadow-glow-gold' :
        'border-slate-700'
      }`}>

        {/* Mixed Exam Indicator Header */}
        {mode === 'mixed' && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {activeQuestionType === 'multiple_choice' ? 'EXAM: MULTIPLE CHOICE (1 of 4)' :
                 activeQuestionType === 'true_false' ? 'EXAM: TRUE OR FALSE' :
                 activeQuestionType === 'typing' ? 'EXAM: SPELLING & TYPING' :
                 'EXAM: LETTER UNSCRAMBLE'}
              </span>
            </span>
            <span className="text-slate-400 font-mono text-xs">
              Word {questionIndex + 1} of {activeWords.length}
            </span>
          </div>
        )}

        {/* 1. MULTIPLE CHOICE MODE */}
        {(mode === 'multiple_choice' || (mode === 'mixed' && activeQuestionType === 'multiple_choice')) && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
                Choose the correct Uzbek translation
              </span>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-4xl font-black text-white">{currentWord.word}</h2>
                <button
                  onClick={() => speechService.speak(currentWord.word, 'normal')}
                  className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs font-mono text-slate-400">{currentWord.phonetic}</p>
            </div>

            {/* 4 Large Interactive Choice Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentWord.uzbekTranslation;
                let btnStyle = 'bg-slate-800/90 border-slate-700 hover:border-indigo-500/80 hover:bg-slate-750 text-white';

                if (selectedOption) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-300';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    disabled={!!selectedOption}
                    className={`py-4 px-5 rounded-2xl border-2 font-bold text-base transition-all duration-150 flex items-center justify-between shadow-sm active:translate-y-1 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOption && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {selectedOption && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TRUE / FALSE MODE */}
        {(mode === 'true_false' || (mode === 'mixed' && activeQuestionType === 'true_false')) && (
          <div className="space-y-6 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Does this word match the translation?
            </span>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto space-y-3">
              <h2 className="text-3xl font-black text-white">{currentWord.word}</h2>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">equals</div>
              <h3 className="text-2xl font-extrabold text-amber-400">
                "{tfStatement.displayedMeaning}"
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <button
                onClick={() => handleTfAnswer(true)}
                disabled={!!feedback}
                className="btn-game-emerald py-4 px-6 text-lg font-black flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>TRUE</span>
              </button>
              <button
                onClick={() => handleTfAnswer(false)}
                disabled={!!feedback}
                className="btn-game-coral py-4 px-6 text-lg font-black flex items-center justify-center gap-2"
              >
                <XCircle className="w-6 h-6" />
                <span>FALSE</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. TYPING & SPELLING MODE */}
        {(mode === 'typing' || (mode === 'mixed' && activeQuestionType === 'typing')) && (
          <div className="space-y-6 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Type the English word
            </span>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-400">
                {currentWord.uzbekTranslation}
              </h3>
              <p className="text-xs text-slate-400 italic">"{currentWord.exampleSentence}"</p>
            </div>

            <form onSubmit={handleTypingSubmit} className="max-w-sm mx-auto space-y-3">
              <input
                type="text"
                value={typedInput}
                onChange={e => setTypedInput(e.target.value)}
                placeholder="Type in English..."
                disabled={!!feedback}
                autoFocus
                className="w-full px-5 py-3.5 bg-slate-900 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 text-center text-xl font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 uppercase tracking-wider"
              />

              <button
                type="submit"
                disabled={!typedInput.trim() || !!feedback}
                className="btn-game-primary w-full py-3.5 px-6 font-bold text-base flex items-center justify-center gap-2"
              >
                <span>Check Spelling</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 4. UNSCRAMBLE MODE */}
        {(mode === 'unscramble' || (mode === 'mixed' && activeQuestionType === 'unscramble')) && (
          <div className="space-y-6 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Tap the tiles to rebuild the word
            </span>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-amber-400">
                {currentWord.uzbekTranslation}
              </h3>
              <p className="text-xs text-slate-400">"{currentWord.exampleSentence}"</p>
            </div>

            {/* Assembled Letters Drop Area */}
            <div className="min-h-[60px] p-3 rounded-2xl bg-slate-900/90 border-2 border-dashed border-slate-700 flex flex-wrap items-center justify-center gap-2">
              {pickedLetters.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Tap letter tiles below</span>
              ) : (
                pickedLetters.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleUnpickLetter(item)}
                    className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl border-2 border-indigo-400 shadow-game-btn flex items-center justify-center active:scale-95"
                  >
                    {item.letter}
                  </button>
                ))
              )}
            </div>

            {/* Available Letters Pool */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
              {scrambledLetters.map(item => (
                <button
                  key={item.id}
                  onClick={() => handlePickLetter(item)}
                  className="w-12 h-12 rounded-xl bg-slate-800 text-white font-black text-xl border-2 border-slate-700 hover:border-indigo-400 shadow-game-btn flex items-center justify-center active:translate-y-1 transition-all"
                >
                  {item.letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. MATCHING MODE */}
        {mode === 'matching' && (
          <div className="space-y-6 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Match English words with their Uzbek translations • Round {matchRound + 1} of {Math.ceil(activeWords.length / 5)}
            </span>

            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* English Column */}
              <div className="space-y-2.5">
                <div className="text-xs font-extrabold text-slate-400 uppercase">English</div>
                {matchPairsEn.map(w => {
                  const isMatched = matchedIds.includes(w.id);
                  const isSelected = selectedEn === w.id;

                  return (
                    <button
                      key={w.id}
                      onClick={() => handleSelectEnMatch(w.id)}
                      disabled={isMatched}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 opacity-60 line-through'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-primary scale-105'
                          : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      {w.word}
                    </button>
                  );
                })}
              </div>

              {/* Uzbek Column */}
              <div className="space-y-2.5">
                <div className="text-xs font-extrabold text-slate-400 uppercase">Uzbek</div>
                {matchPairsUz.map(w => {
                  const isMatched = matchedIds.includes(w.id);
                  const isSelected = selectedUz === w.id;

                  return (
                    <button
                      key={w.id}
                      onClick={() => handleSelectUzMatch(w.id)}
                      disabled={isMatched}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 opacity-60 line-through'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-primary scale-105'
                          : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      {w.uzbekTranslation}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Practice Footer: Quick Finish Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {correctCount} correct • {mode === 'matching' ? `${matchedIds.length} pairs matched` : `${questionIndex + 1} of ${activeWords.length}`}
          </span>
          <button
            onClick={finishSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-all active:scale-95"
            title="Complete your practice and view results"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Finish Practice</span>
          </button>
        </div>

      </div>

    </div>
  );
};
