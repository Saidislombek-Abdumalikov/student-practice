import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { soundService } from '../../services/soundService';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  ArrowRight, 
  BookOpen, 
  Flame,
  Award,
  Lock
} from 'lucide-react';

interface VocabularyExamScreenProps {
  unitId: string;
  onExit: () => void;
}

export const VocabularyExamScreen: React.FC<VocabularyExamScreenProps> = ({ unitId, onExit }) => {
  const { 
    profile, 
    curriculumUnits, 
    startVocabularyExam, 
    submitExamAnswer, 
    recordExamTabSwitch, 
    finalizeVocabularyExam,
    setScreen
  } = useGame();

  const currentUnit = curriculumUnits.find(u => u.id === unitId) || curriculumUnits[0];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<{
    scorePercentage: number;
    passed: boolean;
    durationSeconds: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [tabWarning, setTabWarning] = useState<string | null>(null);

  // Active attempt
  const activeAttempt = profile.activeExamAttempt;

  // 1. Initialize or resume exam
  useEffect(() => {
    let isMounted = true;

    async function init() {
      // If already have an active attempt for this unit
      if (activeAttempt && activeAttempt.unitId === unitId && activeAttempt.status === 'active') {
        if (isMounted) setIsLoading(false);
        return;
      }

      const res = await startVocabularyExam(unitId);
      if (!res.success) {
        if (isMounted) {
          setInitError(res.error || 'Failed to start official exam. Please verify teacher authorization.');
          setIsLoading(false);
        }
      } else {
        if (isMounted) setIsLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [unitId]);

  // 2. Timer
  useEffect(() => {
    if (!activeAttempt || activeAttempt.status !== 'active' || finalResult) return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAttempt, finalResult]);

  // 3. Anti-cheat focus loss & tab switch tracker
  useEffect(() => {
    if (!activeAttempt || activeAttempt.status !== 'active' || finalResult) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        soundService.playError();
        recordExamTabSwitch(activeAttempt.id);
        setTabWarning('⚠️ Attention: Window focus lost! Tab switches are recorded in the teacher audit log.');
      }
    };

    const handleWindowBlur = () => {
      recordExamTabSwitch(activeAttempt.id);
      setTabWarning('⚠️ Window focus lost! Please remain in the examination tab.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [activeAttempt, finalResult]);

  // Dismiss warning after 4s
  useEffect(() => {
    if (!tabWarning) return;
    const t = setTimeout(() => setTabWarning(null), 4500);
    return () => clearTimeout(t);
  }, [tabWarning]);

  // Format elapsed time MM:SS
  const formattedTime = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, [elapsedSeconds]);

  // Current question
  const currentQIndex = activeAttempt ? activeAttempt.currentQuestionIndex : 0;
  const currentQuestion = activeAttempt?.questions[currentQIndex];

  // Reset selected answer on question change
  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQIndex]);

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!activeAttempt || !selectedAnswer || isSubmitting || !currentQuestion) return;
    setIsSubmitting(true);
    soundService.playClick();

    const result = await submitExamAnswer(activeAttempt.id, currentQIndex, selectedAnswer);

    if (!result) {
      setIsSubmitting(false);
      return;
    }

    if (result.isLastQuestion) {
      // Finalize exam
      setIsFinalizing(true);
      const fin = await finalizeVocabularyExam(activeAttempt.id);
      setFinalResult({
        scorePercentage: fin.scorePercentage,
        passed: fin.passed,
        durationSeconds: fin.attempt.durationSeconds,
        correctCount: fin.attempt.correctCount,
        totalQuestions: fin.attempt.totalQuestions,
      });

      if (fin.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
      setIsFinalizing(false);
    }

    setIsSubmitting(false);
  };

  // Human friendly question type label
  const questionTypeBadge = useMemo(() => {
    if (!currentQuestion) return 'Multiple Choice';
    switch (currentQuestion.questionType) {
      case 'word_to_meaning': return 'Word → Uzbek Meaning';
      case 'meaning_to_word': return 'Uzbek Meaning → English Word';
      case 'context_sentence': return 'Sentence Context';
      case 'spelling_completion': return 'Spelling & Vocabulary';
      case 'definition_matching': return 'Definition Matching';
      default: return 'Vocabulary Assessment';
    }
  }, [currentQuestion]);

  // -------------------------------------------------------------
  // RENDER: Loading & Error States
  // -------------------------------------------------------------
  if (isLoading || isFinalizing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center px-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-black text-white">
          {isFinalizing ? 'Finalizing Official Exam Results...' : 'Preparing Secure Official Exam...'}
        </h2>
        <p className="text-slate-400 text-sm max-w-md">
          {isFinalizing 
            ? 'Calculating score and evaluating passing grade (95% standard).' 
            : 'Verifying teacher authorization and loading randomized unit questions.'}
        </p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 shadow-glow-rose">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Exam Not Authorized</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{initError}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 text-left space-y-1.5 w-full">
          <div className="font-bold text-slate-200">How to unlock:</div>
          <div>1. Review the unit vocabulary in practice mode.</div>
          <div>2. Ask your teacher to click <span className="text-amber-400 font-bold">"Ready for Exam"</span> in the admin panel.</div>
          <div>3. Return to this screen once authorized.</div>
        </div>
        <button
          onClick={onExit}
          className="btn-game-primary py-3 px-6 text-sm font-bold w-full"
        >
          Return to Vocabulary Units
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Final Pass/Fail Result Screen
  // -------------------------------------------------------------
  if (finalResult) {
    const isPass = finalResult.passed;

    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 max-w-2xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-300">
        
        {/* Pass/Fail Icon Banner */}
        <div className={`w-28 h-28 rounded-3xl flex items-center justify-center border-4 shadow-2xl ${
          isPass 
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-glow-emerald' 
            : 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-glow-rose'
        }`}>
          {isPass ? <Trophy className="w-14 h-14" /> : <XCircle className="w-14 h-14" />}
        </div>

        {/* Title & Unit */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            {currentUnit.title}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {isPass ? 'UNIT COMPLETE' : 'EXAM NOT PASSED'}
          </h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            {isPass 
              ? 'Outstanding performance! You have officially demonstrated comprehensive mastery of this unit.' 
              : 'The passing requirement is 95% correct. Please review your vocabulary and ask your teacher for a retake authorization.'}
          </p>
        </div>

        {/* Large Score Callout */}
        <div className={`py-6 px-10 rounded-3xl border-2 flex flex-col items-center justify-center gap-1 ${
          isPass 
            ? 'bg-emerald-950/40 border-emerald-500/50' 
            : 'bg-rose-950/40 border-rose-500/50'
        }`}>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Final Official Score</span>
          <span className={`text-6xl font-black ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
            {finalResult.scorePercentage}%
          </span>
          <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mt-1 ${
            isPass ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {isPass ? 'PASSED (>= 95%)' : 'FAILED (< 95%)'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Questions</span>
            <span className="text-lg font-black text-white">{finalResult.totalQuestions}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Correct</span>
            <span className="text-lg font-black text-emerald-400">{finalResult.correctCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Duration</span>
            <span className="text-lg font-black text-indigo-300">{Math.round(finalResult.durationSeconds / 60)}m {finalResult.durationSeconds % 60}s</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block">Required</span>
            <span className="text-lg font-black text-amber-400">95%</span>
          </div>
        </div>

        {/* Rewards if passed */}
        {isPass && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-500/30 flex items-center justify-center gap-6 text-sm font-black">
            <span className="flex items-center gap-2 text-amber-400">
              <Award className="w-5 h-5" />
              <span>+50 XP Earned</span>
            </span>
            <span className="flex items-center gap-2 text-yellow-300">
              <span>🪙 +25 Coins</span>
            </span>
          </div>
        )}

        <button
          onClick={onExit}
          className="btn-game-primary w-full py-4 text-base font-black shadow-game-btn"
        >
          {isPass ? 'Continue to Next Unit' : 'Return to Curriculum'}
        </button>
      </div>
    );
  }

  if (!activeAttempt || !currentQuestion) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-slate-400">No active exam attempt found.</p>
        <button onClick={onExit} className="btn-game-primary mt-4 py-2 px-4">Back</button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentQIndex) / activeAttempt.totalQuestions) * 100);

  // -------------------------------------------------------------
  // RENDER: Active Focused Examination Screen
  // -------------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      
      {/* Top Warning Notification (Anti-Cheat) */}
      {tabWarning && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-300 font-bold text-xs sm:text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{tabWarning}</span>
        </div>
      )}

      {/* Exam Header Bar */}
      <div className="card-game p-4 sm:p-5 border-2 border-indigo-500/40 bg-slate-900/90 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            U{currentUnit.unitNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                Official Final Exam
              </span>
              {activeAttempt.tabSwitchCount > 0 && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Focus Loss: {activeAttempt.tabSwitchCount}
                </span>
              )}
            </div>
            <h2 className="text-base font-extrabold text-white truncate max-w-[200px] sm:max-w-xs">
              {currentUnit.title}
            </h2>
          </div>
        </div>

        {/* Live Timer & Question Counter */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formattedTime}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-white block">
              {currentQIndex + 1} / {activeAttempt.totalQuestions}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Question</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Across Top */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="card-game p-6 sm:p-8 border-2 border-slate-700/80 bg-gradient-to-b from-slate-900 to-slate-850 space-y-6">
        
        {/* Question Type Badge */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold">
            {questionTypeBadge}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            Pass Threshold: <strong className="text-amber-400">95%</strong>
          </span>
        </div>

        {/* Main Prompt */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
            {currentQuestion.prompt}
          </h3>
          {currentQuestion.subPrompt && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200 text-base sm:text-lg font-bold font-mono">
              {currentQuestion.subPrompt}
            </div>
          )}
        </div>

        {/* Multiple Choice Options */}
        {currentQuestion.options && currentQuestion.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const letter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  disabled={isSubmitting}
                  onClick={() => {
                    soundService.playClick();
                    setSelectedAnswer(opt);
                  }}
                  className={`p-4 rounded-2xl text-left font-bold text-sm sm:text-base transition-all flex items-center gap-3 border-2 active:scale-98 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-game-btn scale-[1.02]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-750'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isSelected ? 'bg-white text-indigo-900' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {letter}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400 font-medium">
            Answers are locked upon submission.
          </span>

          <button
            disabled={!selectedAnswer || isSubmitting}
            onClick={handleSubmitAnswer}
            className={`py-3.5 px-8 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
              !selectedAnswer || isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'btn-game-emerald shadow-glow-emerald hover:brightness-110 active:scale-98'
            }`}
          >
            <span>{currentQIndex === activeAttempt.totalQuestions - 1 ? 'Finish Official Exam' : 'Submit & Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
