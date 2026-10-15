import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { HomeworkService } from '../../services/homeworkService';
import { HomeworkAssignment, HomeworkSubmission } from '../../types';
import { RestrictedListeningPlayer } from './RestrictedListeningPlayer';
import { SimulatedAiScannerModal } from './SimulatedAiScannerModal';
import { VoiceRecorderWidget } from './VoiceRecorderWidget';
import { AdminHomeworkManager } from './AdminHomeworkManager';
import { VocabularyExamScreen } from '../learn/VocabularyExamScreen';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, 
  Camera, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  RotateCcw,
  Eye,
  X,
  Award,
  XCircle,
  HelpCircle
} from 'lucide-react';

export const HomeworkScreen: React.FC = () => {
  const { profile, curriculumUnits } = useGame();

  // If Admin: Directly open the Admin Homework Center
  if (profile.role === 'admin') {
    return <AdminHomeworkManager />;
  }

  const [activeTab, setActiveTab] = useState<'homework' | 'exams'>('homework');
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(() => HomeworkService.loadAssignments());
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => HomeworkService.getSubmissionsForStudent(profile.id));
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [activeExamUnitId, setActiveExamUnitId] = useState<string | null>(() => {
    if (profile.activeExamAttempt && profile.activeExamAttempt.status === 'active') {
      return profile.activeExamAttempt.unitId;
    }
    return null;
  });

  // Listening Homework state
  const [currentListenCount, setCurrentListenCount] = useState<number>(0);
  const [totalSecondsListened, setTotalSecondsListened] = useState<number>(0);
  const [transcriptPhotoUrl, setTranscriptPhotoUrl] = useState<string | null>(null);
  const [showAiScanner, setShowAiScanner] = useState(false);

  // Reading Homework state
  const [readOutLoudAudioUrl, setReadOutLoudAudioUrl] = useState<string>('');
  const [readTranslateAudioUrl, setReadTranslateAudioUrl] = useState<string>('');
  
  // Lightbox for reading picture
  const [readingImageZoom, setReadingImageZoom] = useState<string | null>(null);

  const refreshSubmissions = () => {
    setSubmissions(HomeworkService.getSubmissionsForStudent(profile.id));
  };

  const selectedAssignment = assignments.find(a => a.id === activeAssignmentId);
  const currentSubmission = activeAssignmentId ? submissions.find(s => s.assignmentId === activeAssignmentId) : null;

  useEffect(() => {
    if (currentSubmission) {
      setCurrentListenCount(currentSubmission.listenCount || 0);
      setTranscriptPhotoUrl(currentSubmission.transcriptPhotoUrl || null);
      setReadOutLoudAudioUrl(currentSubmission.readOutLoudAudioUrl || '');
      setReadTranslateAudioUrl(currentSubmission.readTranslateAudioUrl || '');
    } else {
      setCurrentListenCount(0);
      setTotalSecondsListened(0);
      setTranscriptPhotoUrl(null);
      setReadOutLoudAudioUrl('');
      setReadTranslateAudioUrl('');
    }
  }, [activeAssignmentId]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundService.playClick();
    const reader = new FileReader();
    reader.onloadend = () => {
      setTranscriptPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleListeningSubmit = () => {
    if (!selectedAssignment || !transcriptPhotoUrl) return;
    soundService.playSuccess();
    setShowAiScanner(true);
  };

  const handleCompleteAiScan = () => {
    if (!selectedAssignment || !transcriptPhotoUrl) return;

    HomeworkService.submitListeningHomework({
      assignmentId: selectedAssignment.id,
      studentId: profile.id,
      studentName: profile.name || 'Student',
      listenCount: currentListenCount,
      totalListenTimeSeconds: totalSecondsListened,
      transcriptPhotoUrl: transcriptPhotoUrl,
    });

    // Diamonds are manually awarded by admin only upon teacher verification
    refreshSubmissions();
    setShowAiScanner(false);
  };

  const handleReadingSubmit = () => {
    if (!selectedAssignment || !readOutLoudAudioUrl || !readTranslateAudioUrl) return;

    soundService.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    HomeworkService.submitReadingHomework({
      assignmentId: selectedAssignment.id,
      studentId: profile.id,
      studentName: profile.name || 'Student',
      readOutLoudAudioUrl,
      readTranslateAudioUrl,
    });

    // Diamonds are manually awarded by admin only upon teacher verification
    refreshSubmissions();
  };

  // If currently taking an exam
  if (activeExamUnitId || (profile.activeExamAttempt && profile.activeExamAttempt.status === 'active')) {
    const targetId = activeExamUnitId || profile.activeExamAttempt?.unitId || '';
    return (
      <VocabularyExamScreen 
        unitId={targetId} 
        onExit={() => {
          setActiveExamUnitId(null);
        }} 
      />
    );
  }

  // If viewing a specific assignment
  if (selectedAssignment) {
    const isListening = selectedAssignment.type === 'listening';
    const isSubmitted = currentSubmission?.status === 'submitted' || currentSubmission?.status === 'approved';
    const isApproved = currentSubmission?.status === 'approved';
    const isNeedsRevision = currentSubmission?.status === 'revision';

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveAssignmentId(null)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800/90 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Vazifalar ro‘yxatiga qaytish</span>
          </button>
        </div>

        {/* Assignment Header Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
              isListening 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            }`}>
              {isListening ? '🎧 Tinglash va daftarga yozish (Dictation)' : '🎙️ O‘qish va ovoz yozish (Reading)'}
            </span>

            {currentSubmission && (
              <span className={`text-[11px] font-black px-3 py-1 rounded-full border uppercase ${
                isApproved 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isNeedsRevision
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                {isApproved ? 'Tasdiqlandi ⭐' : isNeedsRevision ? 'Qayta topshirish kerak' : 'Topshirildi (Kutilmoqda)'}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">{selectedAssignment.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedAssignment.instructions}</p>
        </div>

        {/* Teacher Feedback Banner */}
        {currentSubmission?.feedback && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-2 border-indigo-500/40 shadow-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                O‘qituvchi bahosi va izohi:
              </span>
              <span className="text-amber-300 font-mono text-sm">{currentSubmission.gradeScore}/100</span>
            </div>
            <p className="text-xs text-slate-200 italic">"{currentSubmission.feedback}"</p>
          </div>
        )}

        {/* LISTENING HOMEWORK SECTION */}
        {isListening && (
          <div className="space-y-5">
            <RestrictedListeningPlayer
              audioText={selectedAssignment.audioText}
              audioUrl={selectedAssignment.audioUrl}
              targetMinListens={selectedAssignment.targetMinListens || 3}
              initialListens={currentListenCount}
              onListenCompleted={(count, seconds) => {
                setCurrentListenCount(count);
                setTotalSecondsListened(seconds);
              }}
            />

            {/* Upload Notebook Photo */}
            <div className="card-game p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-indigo-400" />
                    Daftardagi matn rasmini yuklash
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Eshitgan matningizni daftaringizga to‘liq yozing va sahifasini rasmga olib yuklang.
                  </p>
                </div>
              </div>

              {transcriptPhotoUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/40 max-h-72 bg-slate-950">
                    <img 
                      src={transcriptPhotoUrl} 
                      alt="Daftar rasmi" 
                      className="w-full h-full object-contain mx-auto"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98">
                      <RotateCcw className="w-4 h-4" />
                      <span>Rasmni almashtirish</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                        onChange={handlePhotoUpload} 
                      />
                    </label>

                    {!isSubmitted && (
                      <button
                        onClick={handleListeningSubmit}
                        disabled={currentListenCount < (selectedAssignment.targetMinListens || 3)}
                        className="flex-1 btn-game-primary py-2.5 px-4 font-black text-xs flex items-center justify-center gap-2 shadow-game-btn disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>O‘qituvchiga tekshirishga yuborish</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="w-full py-8 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400/80 rounded-2xl bg-indigo-950/20 hover:bg-indigo-950/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-white">Rasmga olish yoki fayl yuklash uchun bosing</span>
                    <span className="text-[11px] text-slate-400">Ingliz tili daftaringizdagi yozilgan sahifani suratga oling</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                    />
                  </label>
                </div>
              )}

              {currentListenCount < (selectedAssignment.targetMinListens || 3) && (
                <p className="text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Topshirish uchun kamida {selectedAssignment.targetMinListens || 3} marta to‘liq eshitishingiz kerak.
                </p>
              )}
            </div>

            {showAiScanner && transcriptPhotoUrl && (
              <SimulatedAiScannerModal
                photoUrl={transcriptPhotoUrl}
                onComplete={handleCompleteAiScan}
                onClose={() => setShowAiScanner(false)}
              />
            )}
          </div>
        )}

        {/* READING HOMEWORK SECTION */}
        {!isListening && (
          <div className="space-y-5">
            
            {/* Reading Passage / Picture Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  O‘qish materiali (Reading)
                </span>
                {selectedAssignment.readingImageUrl && (
                  <span className="text-[11px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full">
                    Darslik sahifasi surati
                  </span>
                )}
              </div>

              {/* Display Reading Picture if uploaded by teacher */}
              {selectedAssignment.readingImageUrl && (
                <div className="space-y-2">
                  <div 
                    onClick={() => setReadingImageZoom(selectedAssignment.readingImageUrl!)}
                    className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 max-h-80 bg-slate-950 cursor-pointer group/readImg"
                  >
                    <img 
                      src={selectedAssignment.readingImageUrl} 
                      alt="Darslik sahifasi" 
                      className="w-full h-full object-contain mx-auto transition-transform group-hover/readImg:scale-102"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover/readImg:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-black">
                      <Eye className="w-4 h-4" />
                      <span>Kattalashtirish uchun bosing</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Reading Text if available */}
              {selectedAssignment.readingPassage && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-white font-medium text-sm sm:text-base leading-relaxed tracking-wide space-y-2">
                  <p>{selectedAssignment.readingPassage}</p>
                </div>
              )}

              {selectedAssignment.translationInstructions && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200">
                  <strong>💡 Tarjima bo‘yicha ko‘rsatma:</strong> {selectedAssignment.translationInstructions}
                </div>
              )}
            </div>

            {/* Dual Audio Recorders */}
            <div className="space-y-4">
              <VoiceRecorderWidget
                label="1-ovoz: Ingliz tilida ravon o‘qish (Read Out Loud)"
                instructions="Inglizcha matnni aniq va to‘g‘ri talaffuz bilan ovoz chiqarib o‘qing."
                existingAudioUrl={readOutLoudAudioUrl}
                onAudioRecorded={(url) => setReadOutLoudAudioUrl(url)}
              />

              <VoiceRecorderWidget
                label="2-ovoz: O‘qish va gapma-gap tarjima qilish (Translate)"
                instructions="Bitta gapni inglizcha o‘qing, so‘ngra darhol o‘zbekcha tarjimasini ayting."
                existingAudioUrl={readTranslateAudioUrl}
                onAudioRecorded={(url) => setReadTranslateAudioUrl(url)}
              />
            </div>

            {/* Submit Reading Audios */}
            <div className="pt-2">
              <button
                onClick={handleReadingSubmit}
                disabled={!readOutLoudAudioUrl || !readTranslateAudioUrl}
                className="btn-game-primary w-full py-4 text-sm font-black flex items-center justify-center gap-2 shadow-game-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span>
                  {isSubmitted ? 'Ovoz yozuvlarini yangilash va qayta topshirish' : 'Ovozli vazifani o‘qituvchiga topshirish'}
                </span>
              </button>
            </div>

          </div>
        )}

        {/* Lightbox for Reading Picture */}
        {readingImageZoom && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
            onClick={() => setReadingImageZoom(null)}
          >
            <div 
              className="max-w-3xl w-full bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-2xl relative space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white">Darslik materiali</h4>
                <button 
                  onClick={() => setReadingImageZoom(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[80vh] overflow-auto rounded-2xl border border-slate-800 bg-black">
                <img src={readingImageZoom} alt="Darslik materiali" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // MAIN VIEW: TABS FOR HOMEWORK & EXAMS
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black uppercase tracking-wider">
              TA’LIM TOPSHIRIQLARI
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              Vazifalar va Imtihonlar
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Uy vazifalarini bajaring, audio va tarjimalarni topshiring hamda rasmiy imtihon natijalaringizni kuzatib boring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-black text-indigo-400">
                {assignments.filter(a => !a.targetGroupId || a.targetGroupId === 'all' || a.targetGroupId === profile.groupId).length}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Vazifalar</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-black text-emerald-400">
                {submissions.filter(s => s.status === 'submitted' || s.status === 'approved').length}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Bajarildi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Switcher: Uy vazifalari vs Rasmiy imtihonlar */}
      <div className="flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-md">
        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('homework');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeTab === 'homework'
              ? 'bg-indigo-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Uy vazifalari</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setActiveTab('exams');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeTab === 'exams'
              ? 'bg-indigo-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Imtihonlar va Natijalar</span>
        </button>
      </div>

      {/* 1. UY VAZIFALARI RO'YXATI */}
      {activeTab === 'homework' && (
        <div className="space-y-3">
          <h2 className="text-base font-black text-white px-1">Belgilangan uy vazifalari</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.filter(a => {
              if (!a.targetGroupId || a.targetGroupId === 'all') return true;
              return a.targetGroupId === profile.groupId;
            }).map(assignment => {
              const sub = submissions.find(s => s.assignmentId === assignment.id);
              const isCompleted = sub?.status === 'submitted' || sub?.status === 'approved';
              const isListening = assignment.type === 'listening';

              return (
                <div
                  key={assignment.id}
                  onClick={() => {
                    soundService.playClick();
                    setActiveAssignmentId(assignment.id);
                  }}
                  className="card-game p-5 bg-slate-900/90 hover:border-indigo-500/60 border border-slate-800/90 rounded-3xl transition-all cursor-pointer flex flex-col justify-between gap-4 group active:scale-98 shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase ${
                        isListening
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      }`}>
                        {isListening ? '🎧 Tinglash va daftarga yozish' : '🎙️ O‘qish va ovoz yozish'}
                      </span>

                      {sub && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          sub.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                        }`}>
                          {sub.status === 'approved' ? 'Baholandi ⭐' : 'Topshirildi'}
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-base text-white group-hover:text-indigo-300 transition-colors">
                      {assignment.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {assignment.instructions}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'Faol'}</span>
                    </span>

                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-black">
                      <span>{isCompleted ? 'Ko‘rish / Tahrirlash' : 'Bajarish'}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. IMTIHONLAR VA NATIJALAR */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-black text-white">Rasmiy Unit Imtihonlari</h2>
            <span className="text-xs text-slate-400 font-semibold">O‘tish bali: 95%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {curriculumUnits.filter(u => u.levelId === profile.levelId).map(unit => {
              const record = profile.vocabProgression?.[unit.id];
              const isPassed = record?.status === 'PASSED';
              const isFailed = record?.status === 'FAILED';
              const isReady = record?.status === 'READY_FOR_EXAM';
              const isInProgress = record?.status === 'EXAM_IN_PROGRESS';

              return (
                <div 
                  key={unit.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-xs font-black text-slate-300 flex items-center justify-center">
                        {unit.unitNumber}
                      </span>
                      <h4 className="font-bold text-sm text-white">{unit.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 pl-8">
                      {unit.words.length} ta so‘z imtihoni
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {isPassed ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>O‘tdi ({record.lastAttemptScore}%)</span>
                      </span>
                    ) : isFailed ? (
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-black flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>O‘tmadi ({record.lastAttemptScore}%)</span>
                      </span>
                    ) : isReady || isInProgress ? (
                      <button
                        onClick={() => {
                          soundService.playClick();
                          setActiveExamUnitId(unit.id);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Imtihonni topshirish</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        O‘qituvchi ruxsati kerak
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
