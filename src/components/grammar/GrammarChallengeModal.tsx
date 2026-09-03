import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { GrammarLevelId, GrammarQuestion } from '../../types';
import { GRAMMAR_CURRICULUM } from '../../data/grammar';
import { soundService } from '../../services/soundService';
import { 
  Heart, 
  Flame, 
  Timer, 
  Zap, 
  X, 
  RotateCcw, 
  Trophy, 
  Sparkles 
} from 'lucide-react';

interface GrammarChallengeModalProps {
  levelId: GrammarLevelId;
  onClose: () => void;
}

export const GrammarChallengeModal: React.FC<GrammarChallengeModalProps> = ({ levelId, onClose }) => {
  const { addXP, addCoins } = useGame();

  // Pick 10 random questions across all units in this level
  const [questions] = useState<GrammarQuestion[]>(() => {
    const units = GRAMMAR_CURRICULUM[levelId] || [];
    const pool: GrammarQuestion[] = [];
    units.forEach(u => {
      u.topics.forEach(t => {
        pool.push(...t.practiceQuestions, ...t.testQuestions);
      });
    });
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQ = questions[currentIndex];

  // Timer Tick
  useEffect(() => {
    let timer: any;
    if (!isGameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentIndex, isGameOver, timeLeft]);

  const handleTimeOut = () => {
    soundService.playError();
    setCombo(0);
    const nextLives = lives - 1;
    setLives(nextLives);
    if (nextLives <= 0) {
      endGame();
    } else {
      nextQuestion();
    }
  };

  const handleSelect = (opt: string) => {
    if (selectedOption || isGameOver) return;
    setSelectedOption(opt);

    const isCorrect = Array.isArray(currentQ.correctAnswer)
      ? currentQ.correctAnswer.includes(opt)
      : currentQ.correctAnswer === opt;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      soundService.playCombo(newCombo);

      const addedScore = 100 * Math.min(newCombo, 5);
      setScore(s => s + addedScore);
      addXP(15);
      addCoins(1);
    } else {
      soundService.playError();
      setCombo(0);
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setTimeout(() => endGame(), 600);
        return;
      }
    }

    setTimeout(() => {
      nextQuestion();
    }, 600);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      endGame();
    } else {
      setSelectedOption(null);
      setTimeLeft(15);
      setCurrentIndex(i => i + 1);
    }
  };

  const endGame = () => {
    setIsGameOver(true);
    soundService.playLevelUp();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(heartIdx => (
              <Heart
                key={heartIdx}
                className={`w-6 h-6 transition-all ${
                  heartIdx <= lives
                    ? 'text-rose-500 fill-rose-500 scale-105'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 font-extrabold text-amber-300 text-sm">
            <Timer className="w-4 h-4 text-amber-400" />
            <span>{timeLeft}s</span>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IN GAME */}
        {!isGameOver && currentQ ? (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              {/* Combo Streak */}
              <div className={`flex items-center gap-1 px-3 py-1 rounded-xl font-black text-xs ${
                combo > 1 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse' : 'text-slate-400'
              }`}>
                <Flame className="w-4 h-4" />
                <span>{combo}x Combo</span>
              </div>

              <div className="text-xs font-black text-indigo-400">
                Score: {score} PTS
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-700 text-center space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase">{currentQ.prompt}</p>
              <h4 className="text-xl sm:text-2xl font-black text-white">
                {currentQ.sentenceWithBlank || currentQ.prompt}
              </h4>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    disabled={!!selectedOption}
                    className={`p-4 rounded-2xl font-bold text-base border-2 transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500 border-amber-300 text-slate-900'
                        : 'bg-slate-800 border-slate-700 hover:border-amber-400 text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Sparkles className="w-4 h-4 text-slate-900" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* GAME OVER SUMMARY */
          <div className="text-center space-y-6 pt-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                CHALLENGE COMPLETE
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {lives > 0 ? 'Flawless Survival! ⚡' : 'Game Over! Nice Try!'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400 block font-bold">Total Score</span>
                <span className="text-2xl font-black text-amber-400">{score}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400 block font-bold">Max Combo</span>
                <span className="text-2xl font-black text-orange-400">{maxCombo}x 🔥</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setIsGameOver(false);
                  setCurrentIndex(0);
                  setLives(3);
                  setScore(0);
                  setCombo(0);
                  setTimeLeft(15);
                  setSelectedOption(null);
                }}
                className="btn-game-gold w-full py-3.5 px-6 font-black text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Challenge Again</span>
              </button>
              <button
                onClick={onClose}
                className="btn-game-slate w-full py-3 px-6 text-sm font-bold"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
