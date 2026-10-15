import React, { useState } from 'react';
import { GrammarTopic } from '../../types';
import { soundService } from '../../services/soundService';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Repeat,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface GrammarTopicPageProps {
  topic: GrammarTopic;
  onBack: () => void;
}

export const GrammarTopicPage: React.FC<GrammarTopicPageProps> = ({ topic, onBack }) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'flashcards'>('learn');
  const [activeFlashcardIdx, setActiveFlashcardIdx] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  const flashcard = topic.flashcards?.[activeFlashcardIdx] || topic.flashcards?.[0];

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-3xl mx-auto animate-in fade-in duration-200">
      
      {/* Sleek Minimal Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha grammatika mavzulari</span>
        </button>

        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{topic.estimatedMinutes} daqiqa o‘qish</span>
        </div>
      </div>

      {/* TOPIC HEADER */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            {topic.difficulty}
          </span>
        </div>

        <h1 className="text-2xl font-black text-white">{topic.title}</h1>
        <p className="text-emerald-400 font-medium text-xs sm:text-sm">🇺🇿 {topic.titleUz}</p>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{topic.description}</p>
      </div>

      {/* TABS: Tushuntirish vs Qoidalar kartochkalari */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => { soundService.playClick(); setActiveTab('learn'); }}
          className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'learn' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mavzu tushuntirishi va misollar</span>
        </button>

        {topic.flashcards && topic.flashcards.length > 0 && (
          <button
            onClick={() => { soundService.playClick(); setActiveTab('flashcards'); }}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-purple-400" />
            <span>Qoidalar kartochkalari ({topic.flashcards.length})</span>
          </button>
        )}
      </div>

      {/* 1. LEARN TAB: Clean educational content */}
      {activeTab === 'learn' && (
        <div className="space-y-4">
          
          {/* Section: Overview */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400">
              Mavzu haqida umumiy ma'lumot
            </h2>
            <p className="text-white text-sm sm:text-base leading-relaxed">{topic.lesson.whatIsItEn}</p>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">🇺🇿 Oʻzbekcha Izoh:</span>
              <p>{topic.lesson.whatIsItUz}</p>
            </div>
          </div>

          {/* Section: Formula & Sentence Structures */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Formula va gap tuzilishi
            </h2>

            {topic.lesson.formula && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono font-bold text-amber-300 text-xs sm:text-sm">
                {topic.lesson.formula}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Positive */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-black uppercase text-emerald-400 block">
                  (+) Darak gap
                </span>
                <p className="text-xs text-slate-300">{topic.lesson.positiveStructure.rule}</p>
                <div className="pt-1.5 text-xs text-slate-400 border-t border-slate-800/80 space-y-0.5">
                  <p className="font-semibold text-white">"{topic.lesson.positiveStructure.example}"</p>
                  <p className="italic text-[11px] text-slate-400">{topic.lesson.positiveStructure.exampleUz}</p>
                </div>
              </div>

              {/* Negative */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-black uppercase text-rose-400 block">
                  (-) Inkor gap
                </span>
                <p className="text-xs text-slate-300">{topic.lesson.negativeStructure.rule}</p>
                <div className="pt-1.5 text-xs text-slate-400 border-t border-slate-800/80 space-y-0.5">
                  <p className="font-semibold text-white">"{topic.lesson.negativeStructure.example}"</p>
                  <p className="italic text-[11px] text-slate-400">{topic.lesson.negativeStructure.exampleUz}</p>
                </div>
              </div>

              {/* Question */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <span className="text-[11px] font-black uppercase text-indigo-400 block">
                  (?) So‘roq gap
                </span>
                <p className="text-xs text-slate-300">{topic.lesson.questionStructure.rule}</p>
                <div className="pt-1.5 text-xs text-slate-400 border-t border-slate-800/80 space-y-0.5">
                  <p className="font-semibold text-white">"{topic.lesson.questionStructure.example}"</p>
                  <p className="italic text-[11px] text-slate-400">{topic.lesson.questionStructure.exampleUz}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Examples */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-purple-400">
              Misollar (Examples in Context)
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
          {topic.lesson.commonMistakes && topic.lesson.commonMistakes.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <span>Ko‘p uchraydigan xatolar va ularning to‘g‘rilanishi</span>
              </h2>
              <div className="space-y-2.5">
                {topic.lesson.commonMistakes.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm font-semibold">
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> {m.incorrect}
                      </span>
                      <span className="hidden sm:inline text-slate-600">➔</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {m.correct}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">🇺🇿 {m.explanationUz}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. FLASHCARDS TAB (RULES DECK) */}
      {activeTab === 'flashcards' && flashcard && (
        <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-200">
          <div className="text-center space-y-0.5">
            <span className="text-xs font-bold text-purple-400">Qoidalar to‘plami</span>
            <p className="text-xs text-slate-500">{activeFlashcardIdx + 1} / {topic.flashcards.length}-kartochka</p>
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
                <span className="text-[11px] font-bold uppercase text-indigo-400">Qoida savoli / tushunchasi</span>
                <h3 className="text-xl font-bold text-white my-auto">{flashcard.front}</h3>
                <span className="text-xs text-slate-500">Aylantirish uchun bosing</span>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-6 flex flex-col justify-between items-center text-center bg-slate-900 border border-indigo-500/50 shadow-md">
                <span className="text-[11px] font-bold uppercase text-emerald-400">Formula va ma'nosi</span>
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
              className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
            >
              Oldingi qoida
            </button>
            <button
              onClick={() => {
                soundService.playClick();
                setIsCardFlipped(false);
                setActiveFlashcardIdx(p => (p + 1) % topic.flashcards.length);
              }}
              className="py-2 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold"
            >
              Keyingi qoida
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
