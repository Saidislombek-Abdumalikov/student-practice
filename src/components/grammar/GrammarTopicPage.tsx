import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { GrammarTopic } from '../../types';
import { checkPrerequisitesMet } from '../../data/grammar';
import { GrammarExerciseRunner } from './GrammarExerciseRunner';
import { soundService } from '../../services/soundService';
import { 
  ArrowLeft, 
  BookOpen, 
  Zap, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Lightbulb,
  Repeat,
  AlertTriangle
} from 'lucide-react';

interface GrammarTopicPageProps {
  topic: GrammarTopic;
  onBack: () => void;
}

export const GrammarTopicPage: React.FC<GrammarTopicPageProps> = ({ topic, onBack }) => {
  const { profile } = useGame();
  const masteryScore = profile.grammarMasteries[topic.id] || 0;
  const prereqCheck = checkPrerequisitesMet(topic.id, profile.completedGrammarTopics || []);

  const [activeTab, setActiveTab] = useState<'learn' | 'flashcards'>('learn');
  const [activeRunnerMode, setActiveRunnerMode] = useState<'guided' | 'practice' | 'test' | null>(null);
  const [activeFlashcardIdx, setActiveFlashcardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  const guidedSet = topic.guidedQuestions.length > 0 
    ? topic.guidedQuestions 
    : topic.practiceQuestions.slice(0, Math.min(3, topic.practiceQuestions.length));
  const practiceSet = topic.practiceQuestions.length > 0 
    ? topic.practiceQuestions 
    : topic.testQuestions;
  const testSet = topic.testQuestions.length > 0 
    ? topic.testQuestions 
    : topic.practiceQuestions;

  // Switch to Runner when Practice, Guided, or Test is selected
  if (activeRunnerMode === 'guided' && guidedSet.length > 0) {
    return (
      <GrammarExerciseRunner
        topic={topic}
        questions={guidedSet}
        mode="guided"
        onComplete={() => setActiveRunnerMode(null)}
        onExit={() => setActiveRunnerMode(null)}
      />
    );
  }

  if (activeRunnerMode === 'practice' && practiceSet.length > 0) {
    return (
      <GrammarExerciseRunner
        topic={topic}
        questions={practiceSet}
        mode="practice"
        onComplete={() => setActiveRunnerMode(null)}
        onExit={() => setActiveRunnerMode(null)}
      />
    );
  }

  if (activeRunnerMode === 'test' && testSet.length > 0) {
    return (
      <GrammarExerciseRunner
        topic={topic}
        questions={testSet}
        mode="test"
        onComplete={() => setActiveRunnerMode(null)}
        onExit={() => setActiveRunnerMode(null)}
      />
    );
  }

  const flashcard = topic.flashcards[activeFlashcardIdx] || topic.flashcards[0];

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-3xl mx-auto animate-in fade-in duration-200">
      
      {/* Sleek Minimal Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Topics</span>
        </button>

        {/* Minimal Mastery Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Mastery:</span>
          <span className={`font-black ${
            masteryScore >= 80 ? 'text-emerald-400' :
            masteryScore > 0 ? 'text-indigo-400' : 'text-slate-500'
          }`}>
            {masteryScore}%
          </span>
        </div>
      </div>

      {/* Prerequisite Alert if not met */}
      {!prereqCheck.met && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Recommended Prerequisites First</span>
            <span className="text-slate-300">
              Review: {prereqCheck.missingPrerequisites.map(p => p.title).join(', ')}.
            </span>
          </div>
        </div>
      )}

      {/* MINIMAL TOPIC HEADER */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              {topic.difficulty}
            </span>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="w-3 h-3" />
              <span>{topic.estimatedMinutes} mins</span>
            </div>
            {masteryScore >= 80 && (
              <>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mastered</span>
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl font-black text-white">{topic.title}</h1>
          <p className="text-emerald-400 font-medium text-xs sm:text-sm">🇺🇿 {topic.titleUz}</p>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{topic.description}</p>
        </div>

        {/* Minimal Progress Line */}
        <div className="pt-2">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(4, masteryScore)}%` }}
            />
          </div>
        </div>
      </div>

      {/* SLEEK MINIMAL TABS */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => { soundService.playClick(); setActiveTab('learn'); }}
          className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'learn' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Learn</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveRunnerMode('guided'); }}
          className="flex-1 min-w-[100px] py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Guided ({guidedSet.length})</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveRunnerMode('practice'); }}
          className="flex-1 min-w-[90px] py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Practice ({practiceSet.length})</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveRunnerMode('test'); }}
          className="flex-1 min-w-[90px] py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Test ({testSet.length})</span>
        </button>

        {topic.flashcards.length > 0 && (
          <button
            onClick={() => { soundService.playClick(); setActiveTab('flashcards'); }}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-purple-400" />
            <span>Rules</span>
          </button>
        )}
      </div>

      {/* 1. LEARN TAB: Clean, distraction-free educational content */}
      {activeTab === 'learn' && (
        <div className="space-y-4">
          
          {/* Section: Overview */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400">
              Overview
            </h2>
            <p className="text-white text-sm sm:text-base leading-relaxed">{topic.lesson.whatIsItEn}</p>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300">
              <span className="font-bold text-emerald-400 block mb-0.5">🇺🇿 Oʻzbekcha Izoh:</span>
              <p>{topic.lesson.whatIsItUz}</p>
            </div>
          </div>

          {/* Section: Formula & Sentence Structures */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Formula & Sentence Patterns
            </h2>

            {topic.lesson.formula && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono font-bold text-amber-300 text-xs sm:text-sm">
                {topic.lesson.formula}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Positive */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-black uppercase text-emerald-400 block">
                  (+) Affirmative
                </span>
                <p className="text-xs text-slate-300">{topic.lesson.positiveStructure.rule}</p>
                <div className="pt-1 text-xs text-slate-400 border-t border-slate-800/80">
                  <p className="font-semibold text-white">"{topic.lesson.positiveStructure.example}"</p>
                  <p className="italic text-[10px] text-slate-400">{topic.lesson.positiveStructure.exampleUz}</p>
                </div>
              </div>

              {/* Negative */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-black uppercase text-rose-400 block">
                  (-) Negative
                </span>
                <p className="text-xs text-slate-300">{topic.lesson.negativeStructure.rule}</p>
                <div className="pt-1 text-xs text-slate-400 border-t border-slate-800/80">
                  <p className="font-semibold text-white">"{topic.lesson.negativeStructure.example}"</p>
                  <p className="italic text-[10px] text-slate-400">{topic.lesson.negativeStructure.exampleUz}</p>
                </div>
              </div>

              {/* Question */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-black uppercase text-indigo-400 block">
                  (?) Question
                </span>
                <p className="text-xs text-slate-300">{topic.lesson.questionStructure.rule}</p>
                <div className="pt-1 text-xs text-slate-400 border-t border-slate-800/80">
                  <p className="font-semibold text-white">"{topic.lesson.questionStructure.example}"</p>
                  <p className="italic text-[10px] text-slate-400">{topic.lesson.questionStructure.exampleUz}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Examples */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-purple-400">
              Examples in Context
            </h2>
            <div className="space-y-2">
              {topic.lesson.examples.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
                  <span className="text-indigo-400 text-sm font-bold">›</span>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white text-xs sm:text-sm">{ex.en}</p>
                    <p className="text-[11px] text-slate-400 italic">🇺🇿 {ex.uz}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Common Mistakes */}
          {topic.lesson.commonMistakes.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-rose-400">
                Common Mistakes & Traps
              </h2>
              <div className="space-y-2.5">
                {topic.lesson.commonMistakes.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm font-semibold">
                      <span className="text-rose-400">❌ {m.incorrect}</span>
                      <span className="hidden sm:inline text-slate-600">➔</span>
                      <span className="text-emerald-400">✅ {m.correct}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">🇺🇿 {m.explanationUz}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minimal Action CTA */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-xs sm:text-sm text-white">Ready to test what you learned?</p>
              <p className="text-[11px] text-slate-400">Practice questions or take the test.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveRunnerMode('guided')}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
              >
                Guided Drill ({guidedSet.length})
              </button>
              <button
                onClick={() => setActiveRunnerMode('practice')}
                className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                Start Practice ⚡ ({practiceSet.length})
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 2. FLASHCARDS TAB (RULES DECK) */}
      {activeTab === 'flashcards' && flashcard && (
        <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
          <div className="text-center space-y-0.5">
            <span className="text-xs font-bold text-purple-400">Rules Deck</span>
            <p className="text-xs text-slate-500">Card {activeFlashcardIdx + 1} of {topic.flashcards.length}</p>
          </div>

          <div
            onClick={() => {
              soundService.playCardFlip();
              setIsCardFlipped(!isCardFlipped);
            }}
            className="w-full aspect-[4/3] perspective-1000 cursor-pointer select-none"
          >
            <div className={`relative w-full h-full duration-300 preserve-3d transition-transform ${isCardFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl p-6 flex flex-col justify-between items-center text-center bg-slate-900 border border-slate-800 shadow-md">
                <span className="text-[11px] font-bold uppercase text-indigo-400">Rule Concept</span>
                <h3 className="text-xl font-bold text-white my-auto">{flashcard.front}</h3>
                <span className="text-xs text-slate-500">Tap to flip</span>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-6 flex flex-col justify-between items-center text-center bg-slate-900 border border-indigo-500/50 shadow-md">
                <span className="text-[11px] font-bold uppercase text-emerald-400">Formula & Meaning</span>
                <div className="my-auto space-y-2">
                  <p className="text-sm font-semibold text-white whitespace-pre-line">{flashcard.back}</p>
                  {flashcard.formula && (
                    <div className="p-1.5 rounded-lg bg-slate-950 text-xs font-mono text-amber-300">
                      {flashcard.formula}
                    </div>
                  )}
                  {flashcard.uzbekNote && (
                    <p className="text-xs text-slate-400 italic">🇺🇿 {flashcard.uzbekNote}</p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">"{flashcard.example}"</span>
              </div>

            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                soundService.playClick();
                setIsCardFlipped(false);
                setActiveFlashcardIdx(p => (p - 1 + topic.flashcards.length) % topic.flashcards.length);
              }}
              className="py-1.5 px-3 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
            >
              Previous
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setIsCardFlipped(false);
                setActiveFlashcardIdx(p => (p + 1) % topic.flashcards.length);
              }}
              className="py-1.5 px-3 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
