import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MistakeRecord } from '../../types';
import { soundService } from '../../services/soundService';
import { speechService } from '../../services/speechService';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  Sparkles, 
  HelpCircle,
  Trophy
} from 'lucide-react';

interface MistakesReviewProps {
  onBack: () => void;
}

export const MistakesReview: React.FC<MistakesReviewProps> = ({ onBack }) => {
  const { profile, resolveMistake, addXP, addCoins } = useGame();
  const mistakes = profile.mistakes;

  const [activeReviewIdx, setActiveReviewIdx] = useState<number | null>(null);
  const [typedCheck, setTypedCheck] = useState<string>('');
  const [feedback, setFeedback] = useState<'success' | 'try_again' | null>(null);

  const activeMistake: MistakeRecord | null = activeReviewIdx !== null ? mistakes[activeReviewIdx] : null;

  const handleStartPractice = (index: number) => {
    setActiveReviewIdx(index);
    setTypedCheck('');
    setFeedback(null);
    soundService.playClick();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMistake || !typedCheck.trim()) return;

    if (typedCheck.trim().toLowerCase() === activeMistake.word.toLowerCase()) {
      soundService.playSuccess();
      setFeedback('success');
      addXP(15);
      addCoins(2);

      setTimeout(() => {
        resolveMistake(activeMistake.wordId);
        setActiveReviewIdx(null);
        setFeedback(null);
      }, 1000);
    } else {
      soundService.playError();
      setFeedback('try_again');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-extrabold">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{mistakes.length} Tricky Words</span>
        </div>
      </div>

      {/* Encouraging Banner */}
      <div className="card-game p-6 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border-rose-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-2xl shrink-0">
            💪
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              My Mistakes Arena
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              "Mistakes are proof that you are learning!" Practice these tricky words to master them and earn bonus XP.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {mistakes.length === 0 && (
        <div className="card-game p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">All Clear, Champion!</h3>
          <p className="text-slate-400 text-sm">
            You have no pending mistakes right now. Keep practicing vocabulary and playing games!
          </p>
          <button
            onClick={onBack}
            className="btn-game-primary py-3 px-6 text-sm font-bold"
          >
            Practice New Words
          </button>
        </div>
      )}

      {/* ACTIVE DRILL MODAL */}
      {activeMistake && (
        <div className="card-game p-6 sm:p-8 border-2 border-indigo-500 bg-slate-900 shadow-glow-primary space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Master This Word
            </span>
            <button
              onClick={() => setActiveReviewIdx(null)}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black text-amber-400">
              "{activeMistake.uzbekTranslation}"
            </h3>
            <p className="text-sm text-slate-300 italic max-w-md mx-auto">
              "{activeMistake.exampleSentence}"
            </p>
          </div>

          <form onSubmit={handleVerify} className="max-w-sm mx-auto space-y-3">
            <input
              type="text"
              value={typedCheck}
              onChange={e => setTypedCheck(e.target.value)}
              placeholder="Type English word..."
              autoFocus
              className="w-full px-5 py-3.5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-center text-xl font-bold uppercase tracking-wider focus:outline-none focus:border-indigo-500"
            />

            {feedback === 'try_again' && (
              <div className="text-rose-400 text-sm font-bold animate-shake">
                Almost! Try again! (Hint: starts with "{activeMistake.word[0].toUpperCase()}")
              </div>
            )}

            {feedback === 'success' && (
              <div className="text-emerald-400 text-sm font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Word Mastered! +15 XP +2 🪙</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!typedCheck.trim()}
              className="btn-game-emerald w-full py-3.5 px-6 font-bold text-base"
            >
              Verify & Clear Mistake
            </button>
          </form>
        </div>
      )}

      {/* Mistake Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {mistakes.map((m, idx) => (
          <div
            key={m.id}
            className="card-game p-4 flex flex-col justify-between border-slate-700 hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-lg text-white">{m.word}</h4>
                  <button
                    onClick={() => speechService.speak(m.word, 'normal')}
                    className="p-1 rounded-lg bg-slate-800 text-indigo-400 hover:text-white"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-sm font-bold text-emerald-400">{m.uzbekTranslation}</p>
                <p className="text-xs text-slate-400 italic mt-1 line-clamp-1">
                  "{m.exampleSentence}"
                </p>
              </div>

              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
                {m.wrongCount}x missed
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Ready to conquer?</span>
              <button
                onClick={() => handleStartPractice(idx)}
                className="btn-game-primary py-1.5 px-3.5 text-xs font-bold"
              >
                Clear Word
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
