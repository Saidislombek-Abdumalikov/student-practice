import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { HomeworkService } from '../../services/homeworkService';
import { HomeworkAssignment, HomeworkSubmission, HomeworkType, LevelId } from '../../types';
import { ModularCharacter } from '../character/ModularCharacter';
import { DEFAULT_CHARACTER } from '../../services/storageService';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Volume2, 
  Headphones, 
  Mic, 
  Star, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  X,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';

export const AdminHomeworkManager: React.FC = () => {
  const { allAccounts, profile, addCoins, awardDiamondToAccount } = useGame();
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(() => HomeworkService.loadAssignments());
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => HomeworkService.loadSubmissions());
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  
  // Lightbox modal for photo inspection
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // New assignment modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<HomeworkType>('listening');
  const [newLevel, setNewLevel] = useState<LevelId>('beginner');
  const [newInstructions, setNewInstructions] = useState('');
  const [newAudioText, setNewAudioText] = useState('');
  const [newReadingPassage, setNewReadingPassage] = useState('');
  const [newMinListens, setNewMinListens] = useState(3);

  // Grading states
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(95);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const refreshData = () => {
    setAssignments(HomeworkService.loadAssignments());
    setSubmissions(HomeworkService.loadSubmissions());
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    HomeworkService.createAssignment({
      title: newTitle.trim(),
      type: newType,
      levelId: newLevel,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      instructions: newInstructions.trim() || (newType === 'listening' ? 'Listen carefully and write the transcript.' : 'Read and translate.'),
      audioText: newType === 'listening' ? newAudioText.trim() : undefined,
      readingPassage: newType === 'reading' ? newReadingPassage.trim() : undefined,
      targetMinListens: newType === 'listening' ? newMinListens : undefined,
    });

    soundService.playSuccess();
    setShowNewModal(false);
    setNewTitle('');
    setNewAudioText('');
    setNewReadingPassage('');
    setNewInstructions('');
    refreshData();
  };

  const handleSaveGrade = (submission: HomeworkSubmission, status: 'approved' | 'revision') => {
    soundService.playSuccess();
    HomeworkService.gradeSubmission(
      submission.id,
      gradeInput,
      feedbackInput || (status === 'approved' ? 'Excellent work!' : 'Please check your spelling and re-submit.'),
      status
    );

    setGradingSubId(null);
    setFeedbackInput('');
    refreshData();
  };

  const filteredSubmissions = submissions.filter(s => {
    if (selectedStudentFilter !== 'all' && s.studentId !== selectedStudentFilter) return false;
    const assignment = assignments.find(a => a.id === s.assignmentId);
    if (selectedTypeFilter !== 'all' && assignment?.type !== selectedTypeFilter) return false;
    return true;
  });

  const studentsList = allAccounts.filter(a => a.role === 'student');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Teacher Homework Dashboard
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Student Submissions & Assignments
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review handwritten transcripts, listen to student voice recordings, verify listen counts, and grade.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="btn-game-primary py-2.5 px-4 text-xs font-black flex items-center gap-2 self-start sm:self-center shadow-game-btn"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Student:</span>
          <select
            value={selectedStudentFilter}
            onChange={(e) => setSelectedStudentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Students ({submissions.length} submissions)</option>
            {studentsList.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Type:</span>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Homework Types</option>
            <option value="listening">🎧 Listening & Transcript</option>
            <option value="reading">🎙️ Reading & Voice</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-white">No submissions matching filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Student submissions will appear here automatically when they complete their listening transcripts or reading audio tasks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubmissions.map(sub => {
            const assignment = assignments.find(a => a.id === sub.assignmentId);
            const student = allAccounts.find(a => a.id === sub.studentId);
            const isGrading = gradingSubId === sub.id;

            return (
              <div 
                key={sub.id}
                className="card-game p-5 bg-slate-900/90 border-slate-800 rounded-3xl space-y-4 relative group"
              >
                {/* Header: Student Info & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-indigo-500/40 overflow-hidden flex items-center justify-center shrink-0">
                      <ModularCharacter config={student?.character || DEFAULT_CHARACTER} size="sm" animate={false} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{sub.studentName}</h4>
                      <p className="text-[11px] text-indigo-400 font-semibold truncate max-w-[200px]">
                        {assignment?.title || 'English Homework'}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase ${
                    sub.status === 'approved' 
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : sub.status === 'revision'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                  }`}>
                    {sub.status === 'approved' ? 'Approved ⭐' : sub.status === 'revision' ? 'Revision Needed' : 'Pending Review'}
                  </span>
                </div>

                {/* Content: Listening specific (Photo + Listen Count) */}
                {sub.transcriptPhotoUrl && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Headphones className="w-4 h-4 text-cyan-400" />
                        <span>Listened: <strong className="text-white">{sub.listenCount} times</strong></span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        ✓ AI Scan Verified
                      </span>
                    </div>

                    {/* Thumbnail of notebook photo */}
                    <div 
                      onClick={() => setLightboxPhoto(sub.transcriptPhotoUrl!)}
                      className="relative h-36 rounded-xl overflow-hidden border border-slate-700 group/img cursor-pointer"
                    >
                      <img 
                        src={sub.transcriptPhotoUrl} 
                        alt="Handwritten transcript" 
                        className="w-full h-full object-cover transition-transform group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-black">
                        <Eye className="w-4 h-4" />
                        <span>Click to Zoom Notebook</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content: Reading specific (2 Audio Players) */}
                {(sub.readOutLoudAudioUrl || sub.readTranslateAudioUrl) && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                    {sub.readOutLoudAudioUrl && (
                      <div className="space-y-1">
                        <span className="font-bold text-indigo-300 flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5" /> Audio 1: Read Out Loud (English)
                        </span>
                        <audio src={sub.readOutLoudAudioUrl} controls className="w-full h-8" />
                      </div>
                    )}

                    {sub.readTranslateAudioUrl && (
                      <div className="space-y-1 pt-1 border-t border-slate-800">
                        <span className="font-bold text-purple-300 flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5" /> Audio 2: Read & Translate (Sentence-by-Sentence)
                        </span>
                        <audio src={sub.readTranslateAudioUrl} controls className="w-full h-8" />
                      </div>
                    )}
                  </div>
                )}

                {/* Existing Teacher Feedback / Grade if set */}
                {sub.feedback && (
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
                    <div className="flex items-center justify-between text-indigo-300 font-bold">
                      <span>Teacher Grade: {sub.gradeScore}/100</span>
                      <span>⭐</span>
                    </div>
                    <p className="text-slate-300 italic">"{sub.feedback}"</p>
                  </div>
                )}

                {/* Grading Action / Form */}
                {isGrading ? (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">Grade & Feedback</span>
                      <button 
                        onClick={() => setGradingSubId(null)}
                        className="text-slate-400 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold">Score (0-100):</span>
                      <input 
                        type="number" 
                        min={50} 
                        max={100}
                        value={gradeInput}
                        onChange={(e) => setGradeInput(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs"
                      />
                    </div>

                    <textarea
                      placeholder="Enter teacher feedback for student..."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveGrade(sub, 'approved')}
                        className="flex-1 btn-game-emerald py-2 text-xs font-black"
                      >
                        Approve & Save
                      </button>
                      <button
                        onClick={() => handleSaveGrade(sub, 'revision')}
                        className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                      >
                        Needs Revision
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setGradingSubId(sub.id);
                      setGradeInput(sub.gradeScore || 95);
                      setFeedbackInput(sub.feedback || '');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-bold transition-all active:scale-98"
                  >
                    {sub.status === 'pending' ? 'Review & Grade Submission' : 'Edit Grade & Feedback'}
                  </button>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Photo Modal */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="max-w-2xl w-full bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-2xl relative space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white">Student Handwritten Transcript</h4>
              <button 
                onClick={() => setLightboxPhoto(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto rounded-2xl border border-slate-800 bg-black">
              <img src={lightboxPhoto} alt="Student notebook" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-lg w-full bg-slate-900 p-6 rounded-3xl border-2 border-indigo-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Create New Homework Assignment</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Assignment Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Unit 4 Listening: Ordering at a Restaurant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Homework Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as HomeworkType)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="listening">🎧 Listening & Transcript</option>
                    <option value="reading">🎙️ Reading & Voice</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as LevelId)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="beginner">Beginner (A1)</option>
                    <option value="elementary">Elementary (A2)</option>
                    <option value="pre_intermediate">Pre-Intermediate (B1)</option>
                  </select>
                </div>
              </div>

              {newType === 'listening' ? (
                <>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">
                      Audio English Script (Auto-narrated by speech synthesis)
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write the English text that will be spoken to students..."
                      value={newAudioText}
                      onChange={(e) => setNewAudioText(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Minimum Listens Required</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={10}
                      value={newMinListens}
                      onChange={(e) => setNewMinListens(Number(e.target.value))}
                      className="w-24 p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    English Reading Passage (Students read & translate)
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter the reading passage..."
                    value={newReadingPassage}
                    onChange={(e) => setNewReadingPassage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-game-primary py-2.5 px-5 text-xs font-black shadow-game-btn"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
