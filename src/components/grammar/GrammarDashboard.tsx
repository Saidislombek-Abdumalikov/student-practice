import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GrammarLevelId, GrammarTopic } from '../../types';
import { getGrammarTopicsByLevel, GRAMMAR_LEVEL_META } from '../../data/grammar';
import { GrammarTopicPage } from './GrammarTopicPage';
import { GrammarExamModal } from './GrammarExamModal';
import { GrammarChallengeModal } from './GrammarChallengeModal';
import { GrammarMistakesView } from './GrammarMistakesView';
import { soundService } from '../../services/soundService';
import { 
  Zap, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const GrammarDashboard: React.FC = () => {
  const { 
    profile, 
    activeGrammarLevel, 
    setActiveGrammarLevel,
    overallGrammarProgress,
  } = useGame();

  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [showChallengeModal, setShowChallengeModal] = useState<boolean>(false);
  const [showMistakesView, setShowMistakesView] = useState<boolean>(false);

  // Directly get flat topics for the active level (NO units grouping)
  const topics = getGrammarTopicsByLevel(activeGrammarLevel);
  const currentMeta = GRAMMAR_LEVEL_META[activeGrammarLevel];
  const examResult = profile.completedGrammarExams?.[activeGrammarLevel];
  const mistakesCount = profile.grammarMistakes?.length || 0;

  // Open Topic view
  if (selectedTopic) {
    return (
      <GrammarTopicPage
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  // Open Mistakes view
  if (showMistakesView) {
    return <GrammarMistakesView onBack={() => setShowMistakesView(false)} />;
  }

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* LEVEL SELECTOR: Minimal sleek pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 w-full sm:w-fit">
          {(['level_1', 'level_2', 'level_3'] as GrammarLevelId[]).map(lvlId => {
            const isSelected = activeGrammarLevel === lvlId;
            const meta = GRAMMAR_LEVEL_META[lvlId];
            return (
              <button
                key={lvlId}
                onClick={() => {
                  soundService.playClick();
                  setActiveGrammarLevel(lvlId);
                }}
                className={`flex-1 sm:flex-none py-1.5 px-3 sm:px-4 rounded-lg font-bold text-xs transition-all text-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {meta.name}
              </button>
            );
          })}
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center gap-2">
          {mistakesCount > 0 && (
            <button
              onClick={() => { soundService.playClick(); setShowMistakesView(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Mistakes ({mistakesCount})</span>
            </button>
          )}

          <button
            onClick={() => { soundService.playClick(); setShowChallengeModal(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-bold transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Challenge</span>
          </button>

          <button
            onClick={() => { soundService.playClick(); setShowExamModal(true); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              examResult?.passed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{examResult?.passed ? 'Certified ⭐' : 'Final Exam'}</span>
          </button>
        </div>
      </div>

      {/* MINIMAL LEVEL HERO HEADER */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentMeta.name} Grammar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {currentMeta.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 block font-semibold">Mastery</span>
            <span className="text-lg font-black text-emerald-400">{overallGrammarProgress}%</span>
          </div>
        </div>

        {/* Slim minimal progress line */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(4, overallGrammarProgress)}%` }}
          />
        </div>
      </div>

      {/* FLAT TOPIC LIST: Simple, Minimal, Clean Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-400">
          <span>SELECT A TOPIC</span>
          <span>{topics.length} Topics</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {topics.map((topic, index) => {
            const mastery = profile.grammarMasteries[topic.id] || 0;
            const isMastered = mastery >= 80;

            return (
              <div
                key={topic.id}
                onClick={() => {
                  soundService.playClick();
                  setSelectedTopic(topic);
                }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Topic Index */}
                  <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-white truncate group-hover:text-indigo-300 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 italic truncate">
                      🇺🇿 {topic.titleUz}
                    </p>
                  </div>
                </div>

                {/* Status / Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{topic.estimatedMinutes}m</span>
                  </div>

                  {isMastered ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{mastery}%</span>
                    </span>
                  ) : mastery > 0 ? (
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {mastery}%
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      Start
                    </span>
                  )}

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {showExamModal && (
        <GrammarExamModal
          levelId={activeGrammarLevel}
          onClose={() => setShowExamModal(false)}
        />
      )}

      {showChallengeModal && (
        <GrammarChallengeModal
          levelId={activeGrammarLevel}
          onClose={() => setShowChallengeModal(false)}
        />
      )}

    </div>
  );
};
