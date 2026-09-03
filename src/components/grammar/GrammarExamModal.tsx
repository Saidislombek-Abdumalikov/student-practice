import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { GrammarLevelId, GrammarQuestion } from '../../types';
import { GRAMMAR_LEVEL_META, GRAMMAR_CURRICULUM } from '../../data/grammar';
import { soundService } from '../../services/soundService';
import { 
  Trophy, 
  X, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface GrammarExamModalProps {
  levelId: GrammarLevelId;
  onClose: () => void;
}

export const GrammarExamModal: React.FC<GrammarExamModalProps> = ({ levelId, onClose }) => {
  const { recordLevelExamResult } = useGame();
  const meta = GRAMMAR_LEVEL_META[levelId];

  // Get the exam unit (Unit 12) from curriculum
  const units = GRAMMAR_CURRICULUM[levelId] || [];
  const examUnit = units[units.length - 1];
  const examTopic = examUnit?.topics[0];
  const questions: GrammarQuestion[] = examTopic?.testQuestions || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [answersLog, setAnswersLog] = useState<{ q: GrammarQuestion; chosen: string; isCorrect: boolean }[]>([]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (selectedOption || isFinished) return;
    setSelectedOption(opt);

    const isCorrect = Array.isArray(currentQ.correctAnswer)
      ? currentQ.correctAnswer.includes(opt)
      : currentQ.correctAnswer === opt;

    if (isCorrect) {
      soundService.playSuccess();
      setScore(s => s + 1);
    } else {
      soundService.playError();
    }

    setAnswersLog(prev => [...prev, { q: currentQ, chosen: opt, isCorrect }]);

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        finishExam(score + (isCorrect ? 1 : 0));
      } else {
        setSelectedOption(null);
        setCurrentIndex(prev => prev + 1);
      }
    }, 700);
  };

  const finishExam = (finalScore: number) => {
    setIsFinished(true);
    const result = recordLevelExamResult(levelId, finalScore, questions.length);
    if (result.passed) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      soundService.playLevelUp();
    }
  };

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = percentage >= 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-slate-900 border-2 border-indigo-500/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* EXAM IN PROGRESS */}
        {!isFinished && currentQ ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                {meta.name} — FINAL CERTIFICATION EXAM
              </span>
              <h3 className="text-lg font-extrabold text-white">
                Question {currentIndex + 1} of {questions.length}
              </h3>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-850 border border-slate-700 text-center space-y-2">
              <p className="text-sm font-bold text-slate-400 uppercase">{currentQ.prompt}</p>
              <h4 className="text-xl sm:text-2xl font-black text-white">{currentQ.sentenceWithBlank}</h4>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={!!selectedOption}
                    className={`p-4 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800 border-slate-700 hover:border-indigo-500 text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Sparkles className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* EXAM RESULTS CERTIFICATION CARD */
          <div className="text-center space-y-6">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl border-2 ${
              passed ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-glow-gold' : 'bg-slate-800 border-slate-700'
            }`}>
              {passed ? '🎓' : '📚'}
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                FINAL EXAM RESULT
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {passed ? 'Certification Passed! 🎉' : 'Needs Review (Threshold: 80%)'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">{meta.name}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400 block font-bold">Score</span>
                <span className="text-xl font-black text-white">{score} / {questions.length}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400 block font-bold">Percentage</span>
                <span className={`text-xl font-black ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {percentage}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400 block font-bold">Bonus</span>
                <span className="text-xl font-black text-amber-400">
                  {passed ? '+500 XP' : '+50 XP'}
                </span>
              </div>
            </div>

            {passed && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold space-y-1">
                <p>🏆 Official Level Certification Unlocked!</p>
                <p className="text-slate-300 font-normal">
                  You have proven mastery of foundational grammar concepts for {meta.name}.
                </p>
              </div>
            )}

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentIndex(0);
                  setScore(0);
                  setSelectedOption(null);
                  setAnswersLog([]);
                }}
                className="btn-game-primary w-full py-3.5 px-6 font-bold text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam</span>
              </button>
              <button
                onClick={onClose}
                className="btn-game-slate w-full py-3 px-6 text-sm font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
