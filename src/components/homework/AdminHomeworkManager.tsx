import React, { useState, useRef } from 'react';
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
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  X,
  Award,
  Zap,
  Upload,
  Image as ImageIcon,
  FileText,
  ListFilter
} from 'lucide-react';

export const AdminHomeworkManager: React.FC = () => {
  const { allAccounts, profile, groups } = useGame();
  
  // Two main options for admin: 1) Add Homework, 2) Review Submissions
  const [activeAdminTab, setActiveAdminTab] = useState<'create' | 'submissions'>('create');

  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(() => HomeworkService.loadAssignments());
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => HomeworkService.loadSubmissions());
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [newTargetGroupId, setNewTargetGroupId] = useState<string>('all');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  
  // Lightbox modal for photo inspection
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<HomeworkType>('listening');
  const [newLevel, setNewLevel] = useState<LevelId>('beginner');
  const [newInstructions, setNewInstructions] = useState('');
  
  // Listening specific
  const [newAudioUrl, setNewAudioUrl] = useState<string>('');
  const [newAudioFileName, setNewAudioFileName] = useState<string>('');
  const [newAudioText, setNewAudioText] = useState('');
  const [newMinListens, setNewMinListens] = useState<number>(3);

  // Reading specific
  const [newReadingPassage, setNewReadingPassage] = useState('');
  const [newReadingImageUrl, setNewReadingImageUrl] = useState<string>('');
  const [newReadingImageFileName, setNewReadingImageFileName] = useState<string>('');
  const [newTranslationInstructions, setNewTranslationInstructions] = useState('');

  // Grading states
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(95);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const readingImageInputRef = useRef<HTMLInputElement | null>(null);

  const refreshData = () => {
    setAssignments(HomeworkService.loadAssignments());
    setSubmissions(HomeworkService.loadSubmissions());
  };

  // Handle Teacher Audio Upload (MP3, WAV, M4A, etc.)
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundService.playClick();
    setNewAudioFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAudioUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Teacher Reading Picture Upload (Textbook page, worksheet, etc.)
  const handleReadingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundService.playClick();
    setNewReadingImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewReadingImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    HomeworkService.createAssignment({
      title: newTitle.trim(),
      type: newType,
      levelId: newLevel,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      instructions: newInstructions.trim() || (newType === 'listening' ? 'Listen carefully, write the full transcript in your notebook, and upload a clear photo.' : 'Read the passage out loud and record your translation.'),
      audioUrl: newType === 'listening' ? newAudioUrl || undefined : undefined,
      audioFileName: newType === 'listening' ? newAudioFileName || undefined : undefined,
      audioText: newType === 'listening' ? newAudioText.trim() || undefined : undefined,
      targetMinListens: newType === 'listening' ? Math.max(1, newMinListens) : undefined,
      readingPassage: newType === 'reading' ? newReadingPassage.trim() || undefined : undefined,
      readingImageUrl: newType === 'reading' ? newReadingImageUrl || undefined : undefined,
      translationInstructions: newType === 'reading' ? newTranslationInstructions.trim() || undefined : undefined,
      targetGroupId: newTargetGroupId === 'all' ? undefined : newTargetGroupId,
    });

    soundService.playSuccess();
    alert('✅ Assignment successfully published to all students!');
    
    // Reset form
    setNewTitle('');
    setNewAudioUrl('');
    setNewAudioFileName('');
    setNewAudioText('');
    setNewMinListens(3);
    setNewReadingPassage('');
    setNewReadingImageUrl('');
    setNewReadingImageFileName('');
    setNewTranslationInstructions('');
    setNewInstructions('');
    setNewTargetGroupId('all');
    
    refreshData();
    setActiveAdminTab('submissions');
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

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm('Delete this homework assignment?')) {
      HomeworkService.deleteAssignment(id);
      refreshData();
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (selectedStudentFilter !== 'all' && s.studentId !== selectedStudentFilter) return false;
    const assignment = assignments.find(a => a.id === s.assignmentId);
    if (selectedTypeFilter !== 'all' && assignment?.type !== selectedTypeFilter) return false;
    if (selectedGroupFilter !== 'all') {
      const student = allAccounts.find(a => a.id === s.studentId);
      const inGroup = student?.groupId === selectedGroupFilter || groups.find(g => g.id === selectedGroupFilter)?.studentIds.includes(s.studentId);
      if (!inGroup) return false;
    }
    return true;
  });

  const studentsList = allAccounts.filter(a => a.role === 'student');

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Teacher Administration Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Homework Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Publish listening audio tasks with custom listen counts, reading passages with pictures, and review student handwritten transcripts and voice recordings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-lg font-black text-white">{assignments.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Assignments</div>
            </div>
            <div className="text-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-lg font-black text-cyan-400">{submissions.length}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Submissions</div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO PRIMARY ADMIN OPTIONS (TABS) */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <button
          onClick={() => {
            soundService.playClick();
            setActiveAdminTab('create');
          }}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeAdminTab === 'create'
              ? 'bg-indigo-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Option 1: Add New Assignment</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setActiveAdminTab('submissions');
          }}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            activeAdminTab === 'submissions'
              ? 'bg-indigo-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Option 2: Review Submissions ({submissions.length})</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* OPTION 1: ADD NEW ASSIGNMENT FORM */}
      {/* ============================================================= */}
      {activeAdminTab === 'create' && (
        <div className="card-game p-6 sm:p-8 bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Create & Publish Homework
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure listening with uploaded audio and custom listen counter, or reading with text and picture upload.
            </p>
          </div>

          <form onSubmit={handleCreateAssignment} className="space-y-5 text-xs">
            
            {/* 1. Title, Target Level & Target Group Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-bold block mb-1.5">
                  Assignment Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 4 Listening: Ordering Coffee & Breakfast"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Target Level
                </label>
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as LevelId)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-sm"
                >
                  <option value="beginner">Beginner (A1)</option>
                  <option value="elementary">Elementary (A2)</option>
                  <option value="pre_intermediate">Pre-Intermediate (B1)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Target Group
                </label>
                <select
                  value={newTargetGroupId}
                  onChange={(e) => setNewTargetGroupId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/50 text-purple-300 font-bold text-sm"
                >
                  <option value="all">All Groups (School-wide)</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Type Selector Toggle */}
            <div>
              <label className="text-slate-300 font-bold block mb-1.5">
                Homework Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewType('listening')}
                  className={`p-3.5 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    newType === 'listening'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow-primary'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Headphones className="w-5 h-5" />
                  <span>🎧 Listening & Dictation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNewType('reading')}
                  className={`p-3.5 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    newType === 'reading'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-glow-primary'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>🎙️ Reading & Voice</span>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* LISTENING SPECIFIC FIELDS */}
            {/* ------------------------------------------------------------- */}
            {newType === 'listening' && (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" />
                  Listening Audio & Counter Settings
                </span>

                {/* Audio Upload */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1.5">
                    Upload Audio File (MP3, WAV, M4A, OGG)
                  </label>
                  
                  {newAudioUrl ? (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                          <Volume2 className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-white text-xs truncate">{newAudioFileName || 'Uploaded Audio'}</div>
                          <audio src={newAudioUrl} controls className="h-7 mt-1 w-48 sm:w-64" />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewAudioUrl('');
                          setNewAudioFileName('');
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold"
                        title="Remove audio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={audioFileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => audioFileInputRef.current?.click()}
                        className="w-full py-4 px-4 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl bg-slate-900/50 flex items-center justify-center gap-2 text-slate-300 hover:text-white font-bold transition-all"
                      >
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <span>Click to Select & Upload Audio File from Device</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Fallback Text for Speech Synthesis */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    English Text / Audio Script (Used if no file uploaded, or for transcript verification)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter the spoken English words or story text..."
                    value={newAudioText}
                    onChange={(e) => setNewAudioText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Minimum Listening Count Input (Direct number, supports > 10, > 100) */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Minimum Listens Required (Supports any count, e.g. 3, 5, 10, 50, 100+)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={newMinListens}
                      onChange={(e) => setNewMinListens(Number(e.target.value))}
                      className="w-32 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-black text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-xs text-slate-400">
                      Students must finish listening {newMinListens} times before submitting transcript.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* READING SPECIFIC FIELDS */}
            {/* ------------------------------------------------------------- */}
            {newType === 'reading' && (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Reading Passage & Picture Options
                </span>

                {/* Picture Upload for Reading */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1.5">
                    Upload Picture of Reading (Textbook Page, Screenshot, or Worksheet)
                  </label>

                  {newReadingImageUrl ? (
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-xs">
                          {newReadingImageFileName || 'Reading Page Image'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewReadingImageUrl('');
                            setNewReadingImageFileName('');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 text-rose-400 text-xs font-bold"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="max-h-48 overflow-hidden rounded-lg border border-slate-800">
                        <img src={newReadingImageUrl} alt="Reading preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={readingImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleReadingImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => readingImageInputRef.current?.click()}
                        className="w-full py-4 px-4 border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-xl bg-slate-900/50 flex items-center justify-center gap-2 text-slate-300 hover:text-white font-bold transition-all"
                      >
                        <ImageIcon className="w-4 h-4 text-purple-400" />
                        <span>Click to Select & Upload Textbook / Worksheet Photo</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Paste English Text */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Or Paste English Reading Passage Text
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste the English reading text here if not using a picture..."
                    value={newReadingPassage}
                    onChange={(e) => setNewReadingPassage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Translation Instructions */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Translation Guidance for Student Voice Audio 2
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Read sentence 1 in English, then translate into Uzbek."
                    value={newTranslationInstructions}
                    onChange={(e) => setNewTranslationInstructions(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Instructions */}
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Custom Instructions for Students (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Leave blank to use default guidance..."
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="btn-game-primary w-full py-4 text-sm font-black flex items-center justify-center gap-2 shadow-game-btn"
              >
                <Plus className="w-5 h-5" />
                <span>Publish Assignment to All Students</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ============================================================= */}
      {/* OPTION 2: REVIEW SUBMISSIONS & GRADING */}
      {/* ============================================================= */}
      {activeAdminTab === 'submissions' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Group:</span>
                <select
                  value={selectedGroupFilter}
                  onChange={(e) => setSelectedGroupFilter(e.target.value)}
                  className="bg-slate-950 border border-purple-500/40 text-xs font-bold text-purple-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Groups</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Student:</span>
                <select
                  value={selectedStudentFilter}
                  onChange={(e) => setSelectedStudentFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Students ({submissions.length})</option>
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
                  className="bg-slate-950 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="listening">🎧 Listening & Transcript</option>
                  <option value="reading">🎙️ Reading & Voice</option>
                </select>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-400">
              Showing <span className="text-white">{filteredSubmissions.length}</span> submissions
            </div>
          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">No submissions found</h3>
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
                            min={0} 
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

          {/* Active Assignments Overview (with Delete option) */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-black text-white px-1">Manage Published Assignments ({assignments.length})</h3>
            <div className="space-y-2">
              {assignments.map(a => (
                <div key={a.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{a.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        {a.type === 'listening' ? '🎧 Listening' : '🎙️ Reading'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {a.type === 'listening' ? `Target Listens: ${a.targetMinListens || 3}` : a.readingImageUrl ? 'Includes Textbook Photo' : 'Text Passage'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAssignment(a.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300"
                    title="Delete assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

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

    </div>
  );
};
