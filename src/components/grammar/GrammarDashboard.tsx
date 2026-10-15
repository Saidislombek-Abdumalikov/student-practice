import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GrammarLevelId, GrammarTopic } from '../../types';
import { getGrammarTopicsByLevel, GRAMMAR_LEVEL_META } from '../../data/grammar';
import { GrammarTopicPage } from './GrammarTopicPage';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const GrammarDashboard: React.FC = () => {
  const { 
    activeGrammarLevel, 
    setActiveGrammarLevel,
  } = useGame();

  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);

  // Directly get flat topics for the active level
  const topics = getGrammarTopicsByLevel(activeGrammarLevel);
  const currentMeta = GRAMMAR_LEVEL_META[activeGrammarLevel];

  // Open Topic view
  if (selectedTopic) {
    return (
      <GrammarTopicPage
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
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

        <div className="text-xs text-slate-400 font-semibold">
          Jami {topics.length} ta mavzu
        </div>
      </div>

      {/* MINIMAL LEVEL HERO HEADER */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Grammatika bo‘limi</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          {currentMeta.name} Grammatika
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {currentMeta.description}
        </p>
      </div>

      {/* FLAT TOPIC LIST: Simple, Minimal, Clean Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-400">
          <span>MAVZUNI TANLANG</span>
          <span>{topics.length} ta mavzu</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {topics.map((topic, index) => {
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
                    <span>{topic.estimatedMinutes} daqiqa</span>
                  </div>

                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    O‘qish
                  </span>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
