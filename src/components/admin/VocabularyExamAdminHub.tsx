import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { 
  UserProfile, 
  StudentGroup, 
  CurriculumUnit, 
  UnitProgressionStatus, 
  VocabularyExamAttempt, 
  UnitExamRecord,
  ExamQuestionAnswer
} from '../../types';
import { VocabularyExamService } from '../../services/vocabularyExamService';
import { soundService } from '../../services/soundService';
import { 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Users, 
  Search, 
  Eye, 
  RotateCcw, 
  Activity, 
  FileText, 
  Check, 
  ExternalLink, 
  Award, 
  ChevronDown, 
  ChevronUp,
  AlertOctagon,
  RefreshCw
} from 'lucide-react';

interface AuditModalState {
  student: UserProfile;
  unit: CurriculumUnit;
  record: UnitExamRecord;
}

export const VocabularyExamAdminHub: React.FC = () => {
  const { 
    allAccounts, 
    groups, 
    curriculumUnits,
    authorizeExam,
    revokeExamAuthorization,
    authorizeExamRetake,
    getStudentUnitStatus,
    syncWithCloud
  } = useGame();

  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'live'>('matrix');
  const [auditModal, setAuditModal] = useState<AuditModalState | null>(null);
  const [expandedAttemptId, setExpandedAttemptId] = useState<string | null>(null);
  const [liveEventsTick, setLiveEventsTick] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Beginner curriculum units sorted in canonical progression (Unit 1 -> Unit 2 -> Unit 3 -> Unit 4...)
  const beginnerUnits = useMemo(() => {
    return curriculumUnits
      .filter(u => u.levelId === 'beginner')
      .sort((a, b) => a.unitNumber - b.unitNumber);
  }, [curriculumUnits]);

  // Students list
  const students = useMemo(() => {
    return allAccounts.filter(a => a.role === 'student');
  }, [allAccounts]);

  // Filtered students by group and search query
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Group filter
      if (selectedGroupFilter !== 'all') {
        const grp = groups.find(g => g.id === selectedGroupFilter);
        const inGroup = s.groupId === selectedGroupFilter || (grp && grp.studentIds.includes(s.id));
        if (!inGroup) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesUser = (s.username || '').toLowerCase().includes(q);
        if (!matchesName && !matchesUser) return false;
      }
      return true;
    });
  }, [students, selectedGroupFilter, searchQuery, groups]);

  // Live active exams across all students
  const activeExams = useMemo(() => {
    return students.filter(s => s.activeExamAttempt && s.activeExamAttempt.status === 'active');
  }, [students, liveEventsTick]);

  // Real-time live exam event subscription
  useEffect(() => {
    const unsubscribe = VocabularyExamService.subscribeToLiveExams((event) => {
      // Force instant reactive re-render of active exams
      setLiveEventsTick(prev => prev + 1);
      // Soft sync in background
      syncWithCloud();
    });

    // Heartbeat ticker every 3 seconds to keep timers and progress live
    const timer = setInterval(() => {
      setLiveEventsTick(prev => prev + 1);
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [syncWithCloud]);

  // Handlers for Teacher Authorization Controls
  const handleAuthorize = async (student: UserProfile, unit: CurriculumUnit) => {
    const key = `${student.id}_${unit.id}`;
    setActionLoadingId(key);
    soundService.playClick();
    try {
      const res = await authorizeExam(student.id, unit.id);
      if (res.success) {
        soundService.playSuccess();
      } else {
        alert(res.message);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRevoke = async (student: UserProfile, unit: CurriculumUnit) => {
    if (!window.confirm(`Revoke exam authorization for ${student.name} on ${unit.title}?`)) return;
    const key = `${student.id}_${unit.id}`;
    setActionLoadingId(key);
    soundService.playClick();
    try {
      const res = await revokeExamAuthorization(student.id, unit.id);
      if (res.success) {
        soundService.playSuccess();
      } else {
        alert(res.message);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAuthorizeRetake = async (student: UserProfile, unit: CurriculumUnit) => {
    const key = `${student.id}_${unit.id}`;
    setActionLoadingId(key);
    soundService.playClick();
    try {
      const res = await authorizeExamRetake(student.id, unit.id);
      if (res.success) {
        soundService.playSuccess();
      } else {
        alert(res.message);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const openAuditModal = (student: UserProfile, unit: CurriculumUnit) => {
    const record = student.vocabProgression?.[unit.id];
    if (!record) return;
    setAuditModal({ student, unit, record });
    if (record.attemptsHistory && record.attemptsHistory.length > 0) {
      setExpandedAttemptId(record.attemptsHistory[record.attemptsHistory.length - 1].id);
    }
    soundService.playClick();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Hub Navigation & Stat Cards */}
      <div className="card-game p-6 bg-slate-900/90 border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-black uppercase tracking-wider">
                Beginner Progression Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black uppercase tracking-wider">
                Strict 95% Passing Standard
              </span>
              {activeExams.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-black uppercase tracking-wider animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{activeExams.length} Live Exam{activeExams.length > 1 ? 's' : ''} Active</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Award className="w-6 h-6 text-indigo-400" />
              <span>Vocabulary Exam Progression & Live Monitoring</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Unit 1 → Unit 4 linear progression. Students must achieve 95% or higher on the official 30-question final exam to pass and unlock the next unit. Authorize exams and monitor student testing live in real time.
            </p>
          </div>

          {/* View Segmented Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('matrix');
              }}
              className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Progression Matrix</span>
            </button>

            <button
              onClick={() => {
                soundService.playClick();
                setActiveTab('live');
              }}
              className={`py-2 px-4 rounded-xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 relative ${
                activeTab === 'live'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Live Monitor</span>
              {activeExams.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping absolute top-2 right-2" />
              )}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeExams.length > 0 ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {activeExams.length}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Bar: Group Filter & Student Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          
          {/* Group Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                soundService.playClick();
                setSelectedGroupFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedGroupFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              All Groups ({students.length})
            </button>
            {groups.map(g => {
              const count = students.filter(s => s.groupId === g.id || g.studentIds.includes(s.id)).length;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    soundService.playClick();
                    setSelectedGroupFilter(g.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedGroupFilter === g.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {g.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Student Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search student..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: PROGRESSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="card-game bg-slate-900/90 border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider font-extrabold">
                  <th className="py-3.5 px-4 min-w-[200px]">Student</th>
                  {beginnerUnits.map(unit => (
                    <th key={unit.id} className="py-3.5 px-4 min-w-[190px]">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <span>Unit {unit.unitNumber}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold truncate max-w-[170px] normal-case">
                        {unit.title} ({unit.words.length} words)
                      </div>
                    </th>
                  ))}
                  <th className="py-3.5 px-4 text-center">Audit Records</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={beginnerUnits.length + 2} className="py-12 text-center text-slate-500">
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const studentGroup = groups.find(g => g.id === student.groupId || g.studentIds.includes(student.id));

                    return (
                      <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Student Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                              <ModularCharacter config={student.character} size="sm" animate={false} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-white text-sm truncate flex items-center gap-1.5">
                                <span>{student.name}</span>
                                {student.activeExamAttempt?.status === 'active' && (
                                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" title="Taking Exam Now" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono truncate">
                                @{student.username || 'student'}
                              </div>
                              {studentGroup && (
                                <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {studentGroup.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Unit Status & Action Cells */}
                        {beginnerUnits.map(unit => {
                          const status = getStudentUnitStatus(student, unit.id);
                          const record = student.vocabProgression?.[unit.id];
                          const wordsStudied = student.unitWordProgress?.[unit.id]?.completedWordIds?.length || 0;
                          const totalWords = unit.words.length;
                          const studyPercent = totalWords > 0 ? Math.round((wordsStudied / totalWords) * 100) : 0;
                          const actionKey = `${student.id}_${unit.id}`;
                          const isLoading = actionLoadingId === actionKey;

                          return (
                            <td key={unit.id} className="py-3.5 px-4 align-top">
                              <div className="space-y-2">
                                
                                {/* Status Badge */}
                                {status === 'LOCKED' && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 text-[11px] font-bold">
                                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Locked</span>
                                  </div>
                                )}

                                {status === 'LEARNING' && (
                                  <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold">
                                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                                      <span>Learning ({studyPercent}%)</span>
                                    </div>
                                    <div className="mt-1.5">
                                      <button
                                        onClick={() => handleAuthorize(student, unit)}
                                        disabled={isLoading}
                                        className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[11px] font-black flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        title="Authorize student to take official 30-question exam"
                                      >
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        <span>{isLoading ? 'Authorizing...' : 'Authorize Exam'}</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {status === 'READY_FOR_EXAM' && (
                                  <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/60 text-amber-300 text-[11px] font-black shadow-sm animate-pulse">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Ready for Exam</span>
                                    </div>
                                    <div className="mt-1.5">
                                      <button
                                        onClick={() => handleRevoke(student, unit)}
                                        disabled={isLoading}
                                        className="w-full py-1 px-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-[10px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                                        title="Revoke authorization before exam begins"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                        <span>{isLoading ? 'Revoking...' : 'Revoke'}</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {status === 'EXAM_IN_PROGRESS' && (
                                  <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/25 border border-purple-500/60 text-purple-300 text-[11px] font-black shadow-sm">
                                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                                      <span>Taking Exam Now</span>
                                    </div>
                                    <div className="mt-1.5">
                                      <button
                                        onClick={() => setActiveTab('live')}
                                        className="w-full py-1 px-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-[10px] font-black flex items-center justify-center gap-1 transition-all active:scale-95"
                                      >
                                        <Activity className="w-3 h-3 text-purple-400" />
                                        <span>Live Monitor</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {status === 'PASSED' && (
                                  <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[11px] font-black">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Passed ({record?.highestScore || 100}%)</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                      <span>{record?.totalAttempts || 1} attempt{(record?.totalAttempts || 1) > 1 ? 's' : ''}</span>
                                      <span>•</span>
                                      <button
                                        onClick={() => openAuditModal(student, unit)}
                                        className="text-indigo-400 hover:text-indigo-300 font-bold underline"
                                      >
                                        Audit
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {status === 'FAILED' && (
                                  <div>
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-[11px] font-black">
                                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                      <span>Failed ({record?.lastAttemptScore || 0}%)</span>
                                    </div>
                                    <div className="mt-1.5">
                                      <button
                                        onClick={() => handleAuthorizeRetake(student, unit)}
                                        disabled={isLoading}
                                        className="w-full py-1.5 px-2.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-black flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                        title="Authorize student for an official retake"
                                      >
                                        <Sparkles className="w-3 h-3 text-rose-400" />
                                        <span>{isLoading ? 'Authorizing...' : 'Authorize Retake'}</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                              </div>
                            </td>
                          );
                        })}

                        {/* Overall Student Audit Button */}
                        <td className="py-3.5 px-4 text-center align-middle">
                          <button
                            onClick={() => {
                              // Open audit for first unit that has attempts or unit-1
                              const firstWithAttempts = beginnerUnits.find(u => {
                                const rec = student.vocabProgression?.[u.id];
                                return rec && rec.attemptsHistory && rec.attemptsHistory.length > 0;
                              }) || beginnerUnits[0];
                              if (firstWithAttempts) {
                                openAuditModal(student, firstWithAttempts);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95 inline-flex items-center gap-1.5 text-xs font-bold"
                            title="Inspect full exam attempts and questions history"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Audit</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: REAL-TIME LIVE EXAM MONITOR */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h3 className="text-base font-black text-white">Live Student Exam Sessions</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                {activeExams.length} in progress
              </span>
            </div>
            
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
              <span>Real-time Live Sync Active</span>
            </div>
          </div>

          {activeExams.length === 0 ? (
            <div className="card-game p-12 text-center bg-slate-900/90 border-slate-800 space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">No Exams Currently In Progress</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When a student is authorized and clicks "Start Official Final Exam", their active session will stream here live, including current question, progress, elapsed time, and anti-cheat tab-switch alerts.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeExams.map(student => {
                const attempt = student.activeExamAttempt!;
                const unit = beginnerUnits.find(u => u.id === attempt.unitId) || {
                  id: attempt.unitId,
                  unitNumber: attempt.unitNumber,
                  title: `Unit ${attempt.unitNumber}`
                };
                const elapsedSec = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
                const elapsedMin = Math.floor(elapsedSec / 60);
                const elapsedRemSec = elapsedSec % 60;
                const progressPct = attempt.totalQuestions > 0 
                  ? Math.round((attempt.currentQuestionIndex / attempt.totalQuestions) * 100) 
                  : 0;

                // Answered questions list
                const answeredQuestions = attempt.questions.filter(q => q.studentAnswer !== null);

                return (
                  <div 
                    key={student.id}
                    className="card-game p-5 bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 border-2 border-purple-500/50 shadow-2xl space-y-4"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-purple-500/60 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                          <ModularCharacter config={student.character} size="sm" animate={false} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-white text-base">{student.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider">
                              EXAM ACTIVE
                            </span>
                          </div>
                          <div className="text-xs text-indigo-300 font-bold">
                            Unit {attempt.unitNumber}: {unit.title}
                          </div>
                        </div>
                      </div>

                      {/* Live Timer */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{elapsedMin}m {elapsedRemSec}s</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Attempt #{attempt.attemptNumber}</div>
                      </div>
                    </div>

                    {/* Progress Bar & Question Counter */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-300">
                          Question {attempt.currentQuestionIndex + 1} of {attempt.totalQuestions}
                        </span>
                        <span className="text-purple-300 font-mono font-black">{progressPct}% Complete</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Anti-cheat audit badge */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        <span className="text-slate-300 font-medium">Focus & Anti-Cheat:</span>
                      </div>
                      {attempt.tabSwitchCount === 0 ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>0 tab switches</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 font-black flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{attempt.tabSwitchCount} tab switch{attempt.tabSwitchCount > 1 ? 'es' : ''} detected!</span>
                        </span>
                      )}
                    </div>

                    {/* Recent Answers Stream */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Submitted Answers ({answeredQuestions.length}/{attempt.totalQuestions})
                      </div>
                      {answeredQuestions.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-500 rounded-xl bg-slate-950/50 border border-slate-800/60">
                          Student has just started. Waiting for first answer...
                        </div>
                      ) : (
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
                          {answeredQuestions.slice(-4).reverse().map((q, idx) => (
                            <div 
                              key={q.questionId || idx}
                              className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                                q.isCorrect 
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                              }`}
                            >
                              <div className="min-w-0 truncate">
                                <span className="font-bold text-slate-200 truncate">{q.targetWord}: </span>
                                <span className="opacity-90">{q.studentAnswer}</span>
                              </div>
                              <span className="shrink-0 font-bold text-[10px] uppercase">
                                {q.isCorrect ? '✓ Correct' : '✗ Missed'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lock Note */}
                    <div className="text-[11px] text-slate-400 text-center italic">
                      🔒 Exam session is strictly locked. Resets are disabled while student is testing.
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DETAILED STUDENT EXAM AUDIT MODAL */}
      {auditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-3xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
                  <ModularCharacter config={auditModal.student.character} size="sm" animate={false} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-white">{auditModal.student.name}</h3>
                    <span className="text-xs font-mono text-slate-400">(@{auditModal.student.username || 'student'})</span>
                  </div>
                  <p className="text-xs text-indigo-300 font-bold">
                    Official Exam Audit: Unit {auditModal.unit.unitNumber} ({auditModal.unit.title})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAuditModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Audit Summary Header Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Current Status</div>
                <div className="text-sm font-black text-white mt-0.5">
                  {auditModal.record.status}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Attempts</div>
                <div className="text-sm font-black text-white mt-0.5">
                  {auditModal.record.totalAttempts || 0}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Highest Score</div>
                <div className={`text-sm font-black mt-0.5 ${
                  (auditModal.record.highestScore || 0) >= 95 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {auditModal.record.highestScore !== undefined ? `${auditModal.record.highestScore}%` : 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Passing Bar</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">
                  ≥ 95% Required
                </div>
              </div>
            </div>

            {/* Attempts History Accordion */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full Attempt Records ({auditModal.record.attemptsHistory?.length || 0})
              </div>

              {(!auditModal.record.attemptsHistory || auditModal.record.attemptsHistory.length === 0) ? (
                <div className="p-8 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
                  No completed attempts recorded yet for this unit.
                </div>
              ) : (
                auditModal.record.attemptsHistory.map((att, idx) => {
                  const isExpanded = expandedAttemptId === att.id;
                  const dateStr = new Date(att.startedAt).toLocaleString();
                  const durationMin = Math.floor(att.durationSeconds / 60);
                  const durationSec = att.durationSeconds % 60;

                  return (
                    <div 
                      key={att.id || idx}
                      className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden space-y-2 transition-all"
                    >
                      {/* Attempt Summary Bar */}
                      <button
                        onClick={() => setExpandedAttemptId(isExpanded ? null : att.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-white text-sm">Attempt #{att.attemptNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              att.passed 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}>
                              {att.passed ? `PASSED (${att.scorePercentage}%)` : `FAILED (${att.scorePercentage}%)`}
                            </span>
                            {att.tabSwitchCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                                ⚠️ {att.tabSwitchCount} tab switch{att.tabSwitchCount > 1 ? 'es' : ''}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-3">
                            <span>📅 {dateStr}</span>
                            <span>⏱️ {durationMin}m {durationSec}s</span>
                            <span>🎯 {att.correctCount} / {att.totalQuestions} correct</span>
                          </div>
                        </div>

                        <div className="text-slate-400 p-1 rounded-lg hover:bg-slate-800">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {/* Detailed Questions List (When Expanded) */}
                      {isExpanded && (
                        <div className="p-4 pt-1 border-t border-slate-800/80 space-y-3">
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Question Breakdown ({att.questions.length} questions):
                          </div>

                          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                            {att.questions.map((q, qIdx) => (
                              <div 
                                key={q.questionId || qIdx}
                                className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                  q.isCorrect 
                                    ? 'bg-emerald-500/5 border-emerald-500/25' 
                                    : 'bg-rose-500/5 border-rose-500/25'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="font-bold text-slate-200">
                                    <span className="text-slate-400 mr-1.5">Q{qIdx + 1}.</span>
                                    <span>{q.prompt}</span>
                                    {q.subPrompt && (
                                      <span className="block text-indigo-300 font-semibold mt-0.5">{q.subPrompt}</span>
                                    )}
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                                    q.isCorrect 
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  }`}>
                                    {q.isCorrect ? 'Correct' : 'Missed'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                                  <div>
                                    <span className="text-slate-400">Student Answer: </span>
                                    <span className={`font-bold ${q.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {q.studentAnswer || '(No answer)'}
                                    </span>
                                  </div>
                                  {!q.isCorrect && (
                                    <div>
                                      <span className="text-slate-400">Correct Answer: </span>
                                      <span className="font-bold text-emerald-400">{q.correctAnswer}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800 shrink-0">
              <div>
                {auditModal.record.status === 'FAILED' && (
                  <button
                    onClick={() => {
                      handleAuthorizeRetake(auditModal.student, auditModal.unit);
                      setAuditModal(null);
                    }}
                    className="py-2 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/50 text-xs font-black flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>Authorize Retake Now</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setAuditModal(null)}
                className="py-2 px-5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition-colors"
              >
                Close Audit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
