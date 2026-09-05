import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { HomeworkService } from '../../services/homeworkService';
import { HomeworkAssignment, HomeworkSubmission } from '../../types';
import { RestrictedListeningPlayer } from './RestrictedListeningPlayer';
import { SimulatedAiScannerModal } from './SimulatedAiScannerModal';
import { VoiceRecorderWidget } from './VoiceRecorderWidget';
import { AdminHomeworkManager } from './AdminHomeworkManager';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, 
  Headphones, 
  Mic, 
  Camera, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  FileText, 
  Upload, 
  RotateCcw,
  Check,
  ShieldCheck
} from 'lucide-react';

export const HomeworkScreen: React.FC = () => {
  const { profile, addXP, addCoins, awardDiamondToAccount, setScreen } = useGame();
  
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(() => HomeworkService.loadAssignments());
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => HomeworkService.getSubmissionsForStudent(profile.id));
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

  // Listening Homework state
  const [currentListenCount, setCurrentListenCount] = useState<number>(0);
  const [totalSecondsListened, setTotalSecondsListened] = useState<number>(0);
  const [transcriptPhotoUrl, setTranscriptPhotoUrl] = useState<string | null>(null);
  const [showAiScanner, setShowAiScanner] = useState(false);

  // Reading Homework state
  const [readOutLoudAudioUrl, setReadOutLoudAudioUrl] = useState<string>('');
  const [readTranslateAudioUrl, setReadTranslateAudioUrl] = useState<string>('');

  // Admin view toggle if teacher
  const [adminViewMode, setAdminViewMode] = useState<boolean>(profile.role === 'admin');

  const refreshSubmissions = () => {
    setSubmissions(HomeworkService.getSubmissionsForStudent(profile.id));
  };

  const selectedAssignment = assignments.find(a => a.id === activeAssignmentId);
  const currentSubmission = activeAssignmentId ? submissions.find(s => s.assignmentId === activeAssignmentId) : null;

  // Sync listen count if existing
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

  // Handle Photo Selection via camera or file picker
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

  // Submit Listening Homework
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

    addXP(150);
    addCoins(30);
    awardDiamondToAccount(profile.id, 1);
    refreshSubmissions();
    setShowAiScanner(false);
  };

  // Submit Reading Homework
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

    addXP(150);
    addCoins(30);
    awardDiamondToAccount(profile.id, 1);
    refreshSubmissions();
  };

  // Render Admin Dashboard if in Admin mode
  if (profile.role === 'admin' && adminViewMode) {
    return (
      <div className="space-y-5 max-w-6xl mx-auto pb-24 md:pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setAdminViewMode(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to Student Homework View</span>
          </button>
        </div>
        <AdminHomeworkManager />
      </div>
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
            <span>Back to Homework List</span>
          </button>

          {profile.role === 'admin' && (
            <button
              onClick={() => setAdminViewMode(true)}
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Teacher Review View</span>
            </button>
          )}
        </div>

        {/* Assignment Header Card */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
              isListening 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            }`}>
              {isListening ? '🎧 Listening & Transcript Dictation' : '🎙️ Reading & Dual Voice Recording'}
            </span>

            {currentSubmission && (
              <span className={`text-[11px] font-black px-3 py-1 rounded-full border uppercase ${
                isApproved 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isNeedsRevision
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
              }`}>
                {isApproved ? 'Approved ⭐' : isNeedsRevision ? 'Needs Revision' : 'Submitted (Under Review)'}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">{selectedAssignment.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedAssignment.instructions}</p>
        </div>

        {/* Teacher Feedback Banner if evaluated */}
        {currentSubmission?.feedback && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-2 border-indigo-500/40 shadow-lg space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Teacher Grade & Notes:
              </span>
              <span className="text-amber-300 font-mono text-sm">{currentSubmission.gradeScore}/100</span>
            </div>
            <p className="text-xs text-slate-200 italic">"{currentSubmission.feedback}"</p>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LISTENING HOMEWORK SECTION */}
        {/* ------------------------------------------------------------- */}
        {isListening && (
          <div className="space-y-5">
            
            {/* 1. Restricted Audio Player */}
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

            {/* 2. Upload Notebook Photo */}
            <div className="card-game p-5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-indigo-400" />
                    Handwritten Transcript Upload
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Write everything you heard in your notebook, then take a photo of the page.
                  </p>
                </div>
              </div>

              {transcriptPhotoUrl ? (
                /* Photo Preview */
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/40 max-h-72 bg-slate-950">
                    <img 
                      src={transcriptPhotoUrl} 
                      alt="Handwritten transcript preview" 
                      className="w-full h-full object-contain mx-auto"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98">
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake / Change Photo</span>
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
                        <span>Submit for AI Check & Review</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Upload Button */
                <div>
                  <label className="w-full py-8 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400/80 rounded-2xl bg-indigo-950/20 hover:bg-indigo-950/30 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-white">Tap to Take Photo or Upload from Gallery</span>
                    <span className="text-[11px] text-slate-400">Capture your physical English notebook page</span>
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

              {/* Notice if minimum listens not met */}
              {currentListenCount < (selectedAssignment.targetMinListens || 3) && (
                <p className="text-[11px] text-amber-300 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Please complete at least {selectedAssignment.targetMinListens || 3} full listens before submitting.
                </p>
              )}
            </div>

            {/* AI Scanner Animation Modal */}
            {showAiScanner && transcriptPhotoUrl && (
              <SimulatedAiScannerModal
                photoUrl={transcriptPhotoUrl}
                onComplete={handleCompleteAiScan}
                onClose={() => setShowAiScanner(false)}
              />
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* READING HOMEWORK SECTION */}
        {/* ------------------------------------------------------------- */}
        {!isListening && (
          <div className="space-y-5">
            
            {/* Reading Passage Card */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  English Reading Passage
                </span>
                <span className="text-[11px] text-slate-400 font-bold">5 Sentences</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-white font-medium text-sm sm:text-base leading-relaxed tracking-wide space-y-2">
                <p>{selectedAssignment.readingPassage}</p>
              </div>

              {selectedAssignment.translationInstructions && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200">
                  <strong>💡 Translation Guide:</strong> {selectedAssignment.translationInstructions}
                </div>
              )}
            </div>

            {/* Dual Audio Recorders */}
            <div className="space-y-4">
              <VoiceRecorderWidget
                label="Audio 1: Read Out Loud (English)"
                instructions="Record yourself reading the English text out loud with clear pronunciation."
                existingAudioUrl={readOutLoudAudioUrl}
                onAudioRecorded={(url) => setReadOutLoudAudioUrl(url)}
              />

              <VoiceRecorderWidget
                label="Audio 2: Read & Translate (Sentence-by-Sentence)"
                instructions="Read one sentence in English, then translate into Uzbek. Continue until the end."
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
                  {isSubmitted ? 'Update & Re-Submit Voice Recordings' : 'Submit Both Voice Recordings to Teacher (+150 XP, +30 🪙, +1 💎)'}
                </span>
              </button>
            </div>

          </div>
        )}

      </div>
    );
  }

  // -------------------------------------------------------------
  // HOMEWORK ASSIGNMENTS LIST VIEW
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black uppercase tracking-wider">
                Daily Study Tasks
              </span>
              {profile.role === 'admin' && (
                <button
                  onClick={() => setAdminViewMode(true)}
                  className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1 hover:bg-amber-500/30"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Teacher Review Center</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              English Homework & Voice Practice
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Listen to audio dictations without forward skips, write transcripts in your notebook, and record dual reading voices for teacher evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-black text-indigo-400">{assignments.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Tasks</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-black text-emerald-400">
                {submissions.filter(s => s.status === 'submitted' || s.status === 'approved').length}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-white px-1">Your Assigned Tasks</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map(assignment => {
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
                      {isListening ? '🎧 Listening & Dictation' : '🎙️ Reading & Voice'}
                    </span>

                    {sub && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                      }`}>
                        {sub.status === 'approved' ? 'Approved ⭐' : 'Submitted'}
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
                    <span>Due in 5 days</span>
                  </span>

                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-black">
                    <span>{isCompleted ? 'View / Edit' : 'Start Task'}</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
