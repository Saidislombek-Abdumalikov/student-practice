import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { GrammarQuestion, GrammarTopic } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Trophy, 
  ArrowRight,
  Sparkles,
  Zap,
  Coins
} from 'lucide-react';

interface GrammarExerciseRunnerProps {
  topic: GrammarTopic;
  questions: GrammarQuestion[];
  mode: 'guided' | 'practice' | 'test';
  onComplete: (score: number, total: number) => void;
  onExit: () => void;
}

export const GrammarExerciseRunner: React.FC<GrammarExerciseRunnerProps> = ({
  topic,
  questions,
  mode,
  onComplete,
  onExit,
}) => {
  const { addXP, addCoins, recordGrammarMistake, recordGrammarAttempt } = useGame();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Question specific states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sentenceBuilderPicked, setSentenceBuilderPicked] = useState<string[]>([]);
  const [sentenceBuilderPool, setSentenceBuilderPool] = useState<string[]>([]);
  const [selectedWordToFix, setSelectedWordToFix] = useState<string | null>(null);
  const [matchingSelectedLeft, setMatchingSelectedLeft] = useState<string | null>(null);
  const [matchingSelectedRight, setMatchingSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    if (!currentQ || isFinished) return;
    setFeedback(null);
    setSelectedOption(null);
    setSelectedWordToFix(null);
    setMatchingSelectedLeft(null);
    setMatchingSelectedRight(null);
    setMatchedPairs([]);

    // Initialize sentence builder
    if (currentQ.type === 'sentence_builder' && currentQ.scrambledWords) {
      setSentenceBuilderPool([...currentQ.scrambledWords].sort(() => Math.random() - 0.5));
      setSentenceBuilderPicked([]);
    }
  }, [currentIndex, isFinished]);

  const handleCorrect = () => {
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    soundService.playCombo(newCombo);
    setFeedback('correct');

    const xp = 10 + Math.min(newCombo, 5) * 2;
    const coins = 1 + (newCombo >= 3 ? 1 : 0);
    addXP(xp);
    addCoins(coins);
    setCorrectCount(prev => prev + 1);

    setTimeout(() => {
      proceedNext();
    }, 1000);
  };

  const handleWrong = (studentAnswer: string) => {
    soundService.playError();
    setCombo(0);
    setFeedback('wrong');
    recordGrammarMistake(topic.id, topic.title, currentQ, studentAnswer);

    // In guided mode, give more time to read explanation
    const delay = mode === 'guided' ? 2200 : 1400;
    setTimeout(() => {
      proceedNext();
    }, delay);
  };

  const proceedNext = () => {
    if (currentIndex + 1 >= questions.length) {
      finishRunner();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const finishRunner = () => {
    setIsFinished(true);
    soundService.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    recordGrammarAttempt(topic.id, correctCount + 1, questions.length, mode === 'test');
    onComplete(correctCount + 1, questions.length);
  };

  // 1. Multiple Choice / Fill Blank Handler
  const handleSelectOption = (option: string) => {
    if (feedback || selectedOption) return;
    setSelectedOption(option);

    const isCorrect = Array.isArray(currentQ.correctAnswer)
      ? currentQ.correctAnswer.includes(option)
      : currentQ.correctAnswer.trim().toLowerCase() === option.trim().toLowerCase();

    if (isCorrect) {
      handleCorrect();
    } else {
      handleWrong(option);
    }
  };

  // 2. Sentence Builder Pick / Unpick
  const handlePickBuilderWord = (word: string, idx: number) => {
    if (feedback) return;
    soundService.playClick();
    const newPool = [...sentenceBuilderPool];
    newPool.splice(idx, 1);
    setSentenceBuilderPool(newPool);

    const newPicked = [...sentenceBuilderPicked, word];
    setSentenceBuilderPicked(newPicked);

    if (newPool.length === 0) {
      const assembled = newPicked.join(' ');
      const target = Array.isArray(currentQ.correctAnswer) ? currentQ.correctAnswer[0] : currentQ.correctAnswer;
      if (assembled.trim().toLowerCase() === target.trim().toLowerCase()) {
        handleCorrect();
      } else {
        handleWrong(assembled);
      }
    }
  };

  const handleUnpickBuilderWord = (word: string, idx: number) => {
    if (feedback) return;
    soundService.playClick();
    const newPicked = [...sentenceBuilderPicked];
    newPicked.splice(idx, 1);
    setSentenceBuilderPicked(newPicked);

    setSentenceBuilderPool(prev => [...prev, word]);
  };

  // 3. Error Correction Handler
  const handleSelectErrorWord = (word: string) => {
    if (feedback) return;
    setSelectedWordToFix(word);
    if (currentQ.errorWord && word.toLowerCase().includes(currentQ.errorWord.toLowerCase())) {
      handleCorrect();
    } else {
      handleWrong(word);
    }
  };

  // 4. Matching Handler
  const handleMatchLeft = (left: string) => {
    if (matchedPairs.some(p => p.startsWith(left))) return;
    soundService.playClick();
    setMatchingSelectedLeft(left);
    if (matchingSelectedRight && currentQ.matchingPairs) {
      checkMatchPair(left, matchingSelectedRight);
    }
  };

  const handleMatchRight = (right: string) => {
    if (matchedPairs.some(p => p.endsWith(right))) return;
    soundService.playClick();
    setMatchingSelectedRight(right);
    if (matchingSelectedLeft && currentQ.matchingPairs) {
      checkMatchPair(matchingSelectedLeft, right);
    }
  };

  const checkMatchPair = (left: string, right: string) => {
    const pair = currentQ.matchingPairs?.find(p => p.left === left && p.right === right);
    if (pair) {
      soundService.playSuccess();
      const updated = [...matchedPairs, `${left}:${right}`];
      setMatchedPairs(updated);
      setMatchingSelectedLeft(null);
      setMatchingSelectedRight(null);
      if (updated.length === (currentQ.matchingPairs?.length || 0)) {
        handleCorrect();
      }
    } else {
      soundService.playError();
      setMatchingSelectedLeft(null);
      setMatchingSelectedRight(null);
    }
  };

  // SESSION COMPLETE VIEW
  if (isFinished) {
    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= 80;

    return (
      <div className="max-w-md mx-auto card-game p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            {mode === 'test' ? 'TOPIC TEST COMPLETE' : 'PRACTICE COMPLETE'}
          </span>
          <h2 className="text-3xl font-black text-white mt-1">
            {passed ? 'Topic Mastered! ⭐' : 'Good Effort! Keep Practicing!'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{topic.title}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">Accuracy</span>
            <span className="text-2xl font-black text-emerald-400">{scorePct}%</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">Max Combo</span>
            <span className="text-2xl font-black text-orange-400">{maxCombo}x 🔥</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">Score</span>
            <span className="text-2xl font-black text-indigo-400">{correctCount} / {questions.length}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 block font-bold">Rewards</span>
            <span className="text-2xl font-black text-amber-400">+{correctCount * 10} XP</span>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              setIsFinished(false);
              setCurrentIndex(0);
              setCorrectCount(0);
              setCombo(0);
            }}
            className="btn-game-primary w-full py-3.5 px-6 font-bold text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={onExit}
            className="btn-game-slate w-full py-3 px-6 text-sm font-bold"
          >
            Back to Topic Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Top Runner Bar */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        {/* Combo */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-2xl font-black text-xs transition-all ${
          combo > 1 
            ? 'bg-orange-500/25 border border-orange-500/50 text-orange-300 shadow-glow-gold scale-105' 
            : 'bg-slate-800/80 border border-slate-700 text-slate-400'
        }`}>
          <Flame className={`w-4 h-4 ${combo > 1 ? 'text-orange-400 fill-orange-400 animate-flame-wobble' : 'text-slate-500'}`} />
          <span>{combo > 0 ? `${combo}x COMBO` : '1x'}</span>
        </div>

        {/* Counter */}
        <div className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/30">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
        <div 
          className="bg-indigo-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* QUESTION CARD */}
      <div className={`card-game p-6 sm:p-8 space-y-6 transition-all border-2 ${
        feedback === 'correct' ? 'border-emerald-500 shadow-glow-emerald' :
        feedback === 'wrong' ? 'border-rose-500 shadow-glow-gold' :
        'border-slate-700'
      }`}>

        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
              {currentQ.type.replace('_', ' ')}
            </span>
            {mode === 'guided' && (
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                GUIDED HINT ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{currentQ.prompt}</h3>
        </div>

        {/* 1. SENTENCE WITH BLANK (Multiple Choice / Fill Blank) */}
        {currentQ.sentenceWithBlank && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-bold text-lg sm:text-xl text-indigo-200">
            {currentQ.sentenceWithBlank}
          </div>
        )}

        {/* OPTIONS GRID (Multiple Choice, Fill Blank, True/False, Translations) */}
        {currentQ.options && currentQ.options.length > 0 && currentQ.type !== 'matching' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = Array.isArray(currentQ.correctAnswer)
                ? currentQ.correctAnswer.includes(opt)
                : currentQ.correctAnswer === opt;

              let btnStyle = 'bg-slate-800/90 border-slate-700 hover:border-indigo-500 hover:bg-slate-750 text-white';
              if (selectedOption) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-300';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-300';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={!!selectedOption}
                  className={`py-4 px-5 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-between shadow-sm active:translate-y-1 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedOption && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {selectedOption && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. SENTENCE BUILDER RENDERER */}
        {currentQ.type === 'sentence_builder' && (
          <div className="space-y-5 text-center">
            {/* Picked Area */}
            <div className="min-h-[64px] p-3 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-700 flex flex-wrap items-center justify-center gap-2">
              {sentenceBuilderPicked.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Tap words below to arrange the sentence</span>
              ) : (
                sentenceBuilderPicked.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUnpickBuilderWord(w, idx)}
                    className="py-2 px-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm border-2 border-indigo-400 shadow-game-btn active:scale-95"
                  >
                    {w}
                  </button>
                ))
              )}
            </div>

            {/* Word Pool */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {sentenceBuilderPool.map((w, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickBuilderWord(w, idx)}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 text-white font-bold text-sm border-2 border-slate-700 hover:border-indigo-400 shadow-game-btn active:translate-y-1 transition-all"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. ERROR CORRECTION RENDERER */}
        {currentQ.type === 'error_correction' && currentQ.wrongSentence && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase">Click the incorrect word:</p>
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              {currentQ.wrongSentence.split(' ').map((word, idx) => {
                const isPicked = selectedWordToFix === word;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectErrorWord(word)}
                    className={`px-3 py-2 rounded-xl font-bold text-base border-2 transition-all ${
                      isPicked 
                        ? 'bg-rose-600/30 border-rose-500 text-rose-300' 
                        : 'bg-slate-800 border-slate-700 hover:border-indigo-500 text-white'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. MATCHING RENDERER */}
        {currentQ.type === 'matching' && currentQ.matchingPairs && (
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-400 block text-center">Concept</span>
              {currentQ.matchingPairs.map(p => {
                const isMatched = matchedPairs.some(pair => pair.startsWith(p.left));
                const isSelected = matchingSelectedLeft === p.left;
                return (
                  <button
                    key={p.left}
                    disabled={isMatched}
                    onClick={() => handleMatchLeft(p.left)}
                    className={`w-full py-3 px-3 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all ${
                      isMatched ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 opacity-60 line-through' :
                      isSelected ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-primary' :
                      'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    {p.left}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-400 block text-center">Rule / Example</span>
              {currentQ.matchingPairs.map(p => {
                const isMatched = matchedPairs.some(pair => pair.endsWith(p.right));
                const isSelected = matchingSelectedRight === p.right;
                return (
                  <button
                    key={p.right}
                    disabled={isMatched}
                    onClick={() => handleMatchRight(p.right)}
                    className={`w-full py-3 px-3 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all ${
                      isMatched ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 opacity-60 line-through' :
                      isSelected ? 'bg-indigo-600 border-indigo-400 text-white shadow-glow-primary' :
                      'bg-slate-800 border-slate-700 text-slate-200'
                    }`}
                  >
                    {p.right}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback Rationale Accordion */}
        {feedback && (
          <div className={`p-4 rounded-2xl border text-sm space-y-1 animate-in fade-in duration-200 ${
            feedback === 'correct' 
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          }`}>
            <span className="font-black block">
              {feedback === 'correct' ? '🎉 Brilliant!' : 'Almost! Here is why:'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200">{currentQ.explanationEn}</p>
            <p className="text-xs text-slate-400 italic">🇺🇿 {currentQ.explanationUz}</p>
          </div>
        )}

      </div>

    </div>
  );
};
