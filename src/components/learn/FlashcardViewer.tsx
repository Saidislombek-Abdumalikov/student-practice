import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { VocabularyWord } from '../../types';
import { speechService } from '../../services/speechService';
import { soundService } from '../../services/soundService';
import { 
  Volume2, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  Play, 
  Pause, 
  Check, 
  Repeat 
} from 'lucide-react';

interface FlashcardViewerProps {
  onBack: () => void;
  initialIndex?: number;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ onBack, initialIndex = 0 }) => {
  const { curriculumUnits, activeUnitId, recordMistake, recordPracticeResult } = useGame();
  const currentUnit = curriculumUnits.find(u => u.id === activeUnitId) || curriculumUnits[0];

  const [words, setWords] = useState<VocabularyWord[]>(() => [...currentUnit.words]);
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return Math.max(0, Math.min(initialIndex, (currentUnit?.words?.length || 1) - 1));
  });
  const [reviewedWordIds, setReviewedWordIds] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [direction, setDirection] = useState<'en_uz' | 'uz_en'>('en_uz');
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  const currentWord = words[currentIndex] || words[0];

  // Auto pronunciation on word change (if in EN -> UZ mode)
  useEffect(() => {
    setIsFlipped(false);
    if (currentWord && direction === 'en_uz') {
      speechService.speak(currentWord.word, 'normal');
    }
  }, [currentIndex, direction]);

  // Auto-play interval
  useEffect(() => {
    let timer: any;
    if (isAutoPlay) {
      timer = setInterval(() => {
        setIsFlipped(prev => {
          if (!prev) {
            soundService.playCardFlip();
            return true;
          } else {
            setCurrentIndex(idx => (idx + 1) % words.length);
            soundService.playClick();
            return false;
          }
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlay, words.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1') {
        handleRate('again');
      } else if (e.key === '2') {
        handleRate('good');
      } else if (e.key === '3') {
        handleRate('easy');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, words.length]);

  const handleFlip = () => {
    soundService.playCardFlip();
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && direction === 'uz_en' && currentWord) {
      speechService.speak(currentWord.word, 'normal');
    }
  };

  const handleNext = () => {
    soundService.playClick();
    setCurrentIndex(prev => (prev + 1) % words.length);
  };

  const handlePrev = () => {
    soundService.playClick();
    setCurrentIndex(prev => (prev - 1 + words.length) % words.length);
  };

  const handleShuffle = () => {
    soundService.playClick();
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const toggleDirection = () => {
    soundService.playClick();
    setDirection(prev => prev === 'en_uz' ? 'uz_en' : 'en_uz');
    setIsFlipped(false);
  };

  const handleSpeak = (e: React.MouseEvent, speed: 'normal' | 'slow') => {
    e.stopPropagation();
    speechService.speak(currentWord.word, speed);
  };

  const handleRate = (rating: 'again' | 'good' | 'easy') => {
    if (rating === 'again') {
      soundService.playError();
      recordMistake(currentWord);
    } else {
      soundService.playSuccess();
      if (currentWord && !reviewedWordIds.includes(currentWord.id)) {
        setReviewedWordIds(prev => [...prev, currentWord.id]);
      }
    }
    handleNext();
  };

  const handleFinish = () => {
    soundService.playSuccess();
    if (reviewedWordIds.length > 0) {
      recordPracticeResult(currentUnit.id, reviewedWordIds, currentIndex);
    }
    onBack();
  };

  if (!currentWord) return null;

  const isEnglishFront = direction === 'en_uz';

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ortga</span>
          </button>
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Tugallash</span>
          </button>
        </div>

        {/* Direction Toggle: EN ➔ UZ or UZ ➔ EN */}
        <button
          onClick={toggleDirection}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 transition-colors text-xs font-extrabold"
          title="Yo‘nalishni almashtirish"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>{direction === 'en_uz' ? 'EN ➔ UZ' : 'UZ ➔ EN'}</span>
        </button>

        {/* Shuffle & AutoPlay */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="So‘zlarni aralashtirish"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
              isAutoPlay 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Avto</span>
          </button>
        </div>
      </div>

      {/* Progress & Counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span>{currentUnit.title}</span>
          <span className="text-indigo-400 font-extrabold">
            {currentIndex + 1} / {words.length} ta so‘z
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D TACTILE FLASHCARD */}
      <div 
        onClick={handleFlip}
        className="w-full aspect-[4/3] sm:aspect-[16/10] max-h-[360px] perspective-1000 cursor-pointer select-none group"
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center bg-gradient-to-b from-slate-850 via-slate-900 to-slate-900 border-2 border-slate-700 shadow-xl group-hover:border-indigo-500/60 transition-colors">
            
            {/* Top info badge */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {isEnglishFront ? (currentWord.partOfSpeech || 'ENGLISH') : "O‘ZBEKCHA"}
              </span>

              {/* Pronunciation buttons on front (when showing English) */}
              {isEnglishFront ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleSpeak(e, 'normal')}
                    className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50 hover:text-white transition-all"
                    title="Talaffuz (1.0x)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleSpeak(e, 'slow')}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/40 text-xs font-bold transition-all flex items-center gap-1"
                    title="Sekin talaffuz (0.65x)"
                  >
                    <span className="text-sm">🐢</span>
                    <span className="text-[10px]">Sekin</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-500 italic">Inglizcha so‘zni toping</span>
              )}
            </div>

            {/* Center Word & Phonetics */}
            <div className="my-auto space-y-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {isEnglishFront ? currentWord.word : currentWord.uzbekTranslation}
              </h2>
              {isEnglishFront && currentWord.phonetic && (
                <p className="text-base sm:text-lg font-mono text-indigo-300/90 font-medium">
                  {currentWord.phonetic}
                </p>
              )}
              {!isEnglishFront && (
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Tarjimani ko‘rish uchun kartani bosing
                </p>
              )}
            </div>

            {/* Bottom hint to tap */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Aylantirish uchun kartochkani bosing</span>
            </div>

          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-900 border-2 border-indigo-500/70 shadow-xl">
            
            {/* Top Bar on back */}
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                {isEnglishFront ? "O‘zbekcha Ma'nosi" : `English Translation (${currentWord.partOfSpeech || 'Word'})`}
              </span>

              {/* Pronunciation always available for the English word */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleSpeak(e, 'normal')}
                  className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/50 hover:text-white transition-all"
                  title="Talaffuz"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleSpeak(e, 'slow')}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/40 text-xs font-bold transition-all flex items-center gap-1"
                  title="Sekin talaffuz"
                >
                  <span className="text-sm">🐢</span>
                </button>
              </div>
            </div>

            {/* Center Translation & Example */}
            <div className="my-auto space-y-3 max-w-md">
              <h3 className="text-2xl sm:text-4xl font-black text-emerald-400">
                {isEnglishFront ? currentWord.uzbekTranslation : currentWord.word}
              </h3>
              {!isEnglishFront && currentWord.phonetic && (
                <p className="text-base font-mono text-indigo-300 font-medium">
                  {currentWord.phonetic}
                </p>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-left space-y-1">
                <p className="text-sm sm:text-base font-semibold text-white">
                  "{currentWord.exampleSentence}"
                </p>
                <p className="text-xs sm:text-sm text-slate-400 italic">
                  "{currentWord.exampleTranslation}"
                </p>
              </div>
            </div>

            <div className="text-[11px] font-bold text-indigo-300">
              Quyidagi baholardan birini tanlang 👇
            </div>

          </div>

        </div>
      </div>

      {/* Response Rating Buttons (Again, Got it, Easy) */}
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-3">
          {/* AGAIN */}
          <button
            onClick={() => handleRate('again')}
            className="py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 active:scale-95 transition-all"
          >
            <span className="text-lg">😕</span>
            <div className="text-center sm:text-left">
              <span className="block text-xs sm:text-sm font-extrabold leading-none">Takrorlash</span>
              <span className="text-[10px] opacity-80 leading-none">Qiyin bo‘ldi</span>
            </div>
          </button>

          {/* GOT IT */}
          <button
            onClick={() => handleRate('good')}
            className="py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 active:scale-95 transition-all"
          >
            <span className="text-lg">🙂</span>
            <div className="text-center sm:text-left">
              <span className="block text-xs sm:text-sm font-extrabold leading-none">Bilar edim</span>
              <span className="text-[10px] opacity-80 leading-none">Yaxshi</span>
            </div>
          </button>

          {/* EASY */}
          <button
            onClick={() => handleRate('easy')}
            className="py-3 px-2 flex flex-col sm:flex-row items-center justify-center gap-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 active:scale-95 transition-all"
          >
            <span className="text-lg">😎</span>
            <div className="text-center sm:text-left">
              <span className="block text-xs sm:text-sm font-extrabold leading-none">Juda oson</span>
              <span className="text-[10px] opacity-80 leading-none">O‘zlashtirildi</span>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Previous / Next */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Oldingi</span>
        </button>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Bo‘sh joy = Aylantirish, 1/2/3 = Baholash
        </span>

        <button
          onClick={handleNext}
          className="py-2.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
        >
          <span>Keyingi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
