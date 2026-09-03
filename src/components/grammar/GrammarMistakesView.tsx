import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GrammarMistakeRecord } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface GrammarMistakesViewProps {
  onBack: () => void;
}

export const GrammarMistakesView: React.FC<GrammarMistakesViewProps> = ({ onBack }) => {
  const { profile, resolveGrammarMistake, addXP } = useGame();
  const mistakes: GrammarMistakeRecord[] = profile.grammarMistakes || [];

  const [activeDrillMistake, setActiveDrillMistake] = useState<GrammarMistakeRecord | null>(null);
  const [selectedDrillOption, setSelectedDrillOption] = useState<string | null>(null);
  const [drillSuccess, setDrillSuccess] = useState<boolean | null>(null);

  const handleSolveDrill = (opt: string) => {
    if (!activeDrillMistake || selectedDrillOption) return;
    setSelectedDrillOption(opt);

    const isCorrect = Array.isArray(activeDrillMistake.question.correctAnswer)
      ? activeDrillMistake.question.correctAnswer.includes(opt)
      : activeDrillMistake.question.correctAnswer === opt;

    if (isCorrect) {
      soundService.playSuccess();
      setDrillSuccess(true);
      addXP(20);
      setTimeout(() => {
        resolveGrammarMistake(activeDrillMistake.question.id);
        setActiveDrillMistake(null);
        setSelectedDrillOption(null);
        setDrillSuccess(null);
      }, 1000);
    } else {
      soundService.playError();
      setDrillSuccess(false);
      setTimeout(() => {
        setSelectedDrillOption(null);
        setDrillSuccess(null);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grammar</span>
        </button>

        <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/30">
          {mistakes.length} Grammar Mistakes Recorded
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-rose-400" />
          <span>Grammar Mistake Bank</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Review the questions you missed, analyze the rules, and conquer them to clear your mistake record!
        </p>
      </div>

      {/* ACTIVE DRILL MODAL / CARD */}
      {activeDrillMistake && (
        <div className="card-game p-6 border-2 border-indigo-500 space-y-5 bg-gradient-to-b from-slate-900 to-indigo-950/40 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-indigo-400">
              RE-ATTEMPT: {activeDrillMistake.topicTitle}
            </span>
            <button
              onClick={() => setActiveDrillMistake(null)}
              className="text-xs text-slate-400 hover:text-white font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-bold text-lg text-white">
            {activeDrillMistake.question.sentenceWithBlank || activeDrillMistake.question.prompt}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeDrillMistake.question.options?.map((opt, idx) => {
              const isSelected = selectedDrillOption === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSolveDrill(opt)}
                  disabled={!!selectedDrillOption}
                  className={`p-3.5 rounded-2xl font-bold text-sm border-2 transition-all text-left flex items-center justify-between ${
                    isSelected && drillSuccess
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                      : isSelected && drillSuccess === false
                      ? 'bg-rose-600/30 border-rose-500 text-rose-300'
                      : 'bg-slate-800 border-slate-700 hover:border-indigo-400 text-white'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && drillSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isSelected && drillSuccess === false && <XCircle className="w-4 h-4 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {drillSuccess && (
            <p className="text-center font-bold text-xs text-emerald-400">
              🎉 Correct! Mistake conquered and removed from record! (+20 XP)
            </p>
          )}
        </div>
      )}

      {/* MISTAKES LIST */}
      {mistakes.length === 0 ? (
        <div className="card-game p-12 text-center space-y-3 border-emerald-500/30">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">
            ✨
          </div>
          <h3 className="text-xl font-black text-white">Mistake Bank Clear!</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            You currently have no recorded grammar errors. Practice new topics and challenge yourself to test your skills!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.map((m) => (
            <div key={m.id} className="card-game p-5 border-slate-700/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-black uppercase text-indigo-400 block">
                    {m.topicTitle}
                  </span>
                  <h4 className="font-extrabold text-base text-white mt-0.5">
                    {m.question.sentenceWithBlank || m.question.prompt}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    soundService.playClick();
                    setActiveDrillMistake(m);
                  }}
                  className="btn-game-emerald py-2 px-3 text-xs font-bold shrink-0"
                >
                  Conquer Mistake
                </button>
              </div>

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-2">
                  <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Your Answer: "{m.studentAnswer}"</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Correct Answer: "{m.question.correctAnswer}"</span>
                </div>
              </div>

              {/* Pedagogical Explanation */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <p className="text-slate-200">{m.question.explanationEn}</p>
                <p className="text-slate-400 italic">🇺🇿 {m.question.explanationUz}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
