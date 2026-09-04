import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { UserProfile } from '../../types';
import { formatPresence, formatTimeSpent } from '../../services/presenceService';
import { 
  Users, 
  Zap, 
  Coins, 
  Flame, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Calendar, 
  BarChart3, 
  Check, 
  CheckCircle2, 
  Ticket,
  Eye,
  Activity
} from 'lucide-react';

export const SupportDashboard: React.FC = () => {
  const { profile, allAccounts } = useGame();
  const [inspectingStudent, setInspectingStudent] = useState<UserProfile | null>(null);

  // Filter students (exclude admin and self from the student roster list)
  const students = allAccounts.filter(a => a.role === 'student');

  const onlineStudentsCount = students.filter(s => {
    const p = formatPresence(s.lastSeenAt, s.isOnline);
    return p.isOnline;
  }).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Support Assistant Portal</span>
              </span>

              {/* Online Presence Summary */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{onlineStudentsCount} of {students.length} Students Online</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Student Activity & Progress
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Monitor student engagement, time spent learning, vocabulary & grammar milestones, and help students who are falling behind.
            </p>
          </div>

          {/* Logged in Support Card */}
          <div className="flex items-center gap-3.5 bg-slate-900/80 border border-purple-500/30 p-3.5 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-purple-500/40 overflow-hidden flex items-center justify-center">
              <ModularCharacter config={profile.character} size="sm" animate={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">{profile.name}</h4>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-purple-500/30 text-purple-300 rounded">SUPPORT</span>
              </div>
              <p className="text-xs text-slate-400">Learning & Student Guide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Roster Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-black text-white">Student Directory</h2>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {students.length} students
          </span>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => {
          const levelLabel = student.levelId === 'elementary' ? 'Elementary (A2)' : student.levelId === 'pre_intermediate' ? 'Pre-Intermediate (B1)' : 'Beginner (A1)';
          const grammarPassedCount = Object.values(student.grammarMasteries || {}).filter(score => score >= 80).length;
          const vocabUnitsCount = Object.keys(student.unitMasteries || {}).length;
          const presence = formatPresence(student.lastSeenAt, student.isOnline);

          return (
            <div
              key={student.id}
              className="card-game p-5 bg-slate-900/90 border-slate-800/90 hover:border-purple-500/50 transition-all flex flex-col justify-between gap-4 relative group shadow-lg"
            >
              {/* Header: Avatar, Name, Level, Gender, Online Status */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shrink-0 relative overflow-hidden">
                      <ModularCharacter config={student.character} size="sm" animate={false} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-black text-base text-white truncate">{student.name}</h3>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          student.character.gender === 'woman' 
                            ? 'bg-pink-500/20 text-pink-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {student.character.gender === 'woman' ? 'Girl' : 'Boy'}
                        </span>
                      </div>

                      <p className="text-xs text-indigo-400 font-semibold mt-0.5">{levelLabel}</p>
                    </div>
                  </div>

                  {/* Online Presence Pill */}
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${
                    presence.isOnline
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${presence.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                    <span>{presence.label}</span>
                  </span>
                </div>

                {/* Engagement / Time Spent Pill */}
                <div className="mt-3 p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Active Time:</span>
                    <span className="text-white font-black">{formatTimeSpent(student.totalTimeSpentMinutes)}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Today: <strong className="text-purple-300">{formatTimeSpent(student.todayTimeSpentMinutes)}</strong>
                  </div>
                </div>

                {/* Progress chips */}
                <div className="flex items-center gap-2 mt-2.5 text-[11px] font-bold">
                  <span className="text-amber-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-400" /> {student.xp} XP
                  </span>
                  <span className="text-yellow-400 flex items-center gap-0.5">
                    🪙 {student.coins}
                  </span>
                  <span className="text-cyan-400 flex items-center gap-0.5">
                    💎 {student.diamonds || 0}
                  </span>
                  <span className="text-rose-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-rose-400" /> {student.streakDays}d
                  </span>
                </div>

                {/* Learning Summary Grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 mt-3 bg-slate-950/60 rounded-xl border border-slate-800/70 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Vocabulary Units</span>
                    <span className="text-white font-bold">{vocabUnitsCount} studied</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Grammar Passed</span>
                    <span className="text-white font-bold">{grammarPassedCount} topics</span>
                  </div>
                </div>
              </div>

              {/* View Activity Button */}
              <button
                onClick={() => setInspectingStudent(student)}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-black bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-98 shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View Learning & Time Analytics</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Student Learning & Activity Inspection Modal (Support View) */}
      {/* ------------------------------------------------------------- */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="card-game p-6 sm:p-7 max-w-2xl w-full space-y-5 border-2 border-purple-500/60 bg-slate-900 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            
            {/* Header: Student Identity */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-3xl bg-slate-950 border-2 border-purple-500/50 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  <ModularCharacter config={inspectingStudent.character} size={70} animate={false} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{inspectingStudent.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      LVL {Math.floor(Math.sqrt((inspectingStudent.xp || 0) / 40)) + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 font-mono">@{inspectingStudent.username}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs font-bold text-indigo-300 uppercase">{inspectingStudent.levelId.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectingStudent(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Analytics Body */}
            <div className="overflow-y-auto space-y-5 pr-1 flex-1 scrollbar-none">
              
              {/* Presence & Time Spent Spotlight */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-950 to-indigo-950/40 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>Presence & Time Spent in Platform</span>
                  </h4>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    formatPresence(inspectingStudent.lastSeenAt, inspectingStudent.isOnline).isOnline
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {formatPresence(inspectingStudent.lastSeenAt, inspectingStudent.isOnline).label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Time</span>
                    <span className="text-base font-black text-white mt-0.5 block">
                      {formatTimeSpent(inspectingStudent.totalTimeSpentMinutes)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Time Today</span>
                    <span className="text-base font-black text-purple-300 mt-0.5 block">
                      {formatTimeSpent(inspectingStudent.todayTimeSpentMinutes)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Days</span>
                    <span className="text-base font-black text-orange-400 mt-0.5 block">
                      {inspectingStudent.streakDays || 1} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Progression Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">XP Progress</span>
                  <span className="text-lg font-black text-indigo-400 flex items-center justify-center gap-1 mt-0.5">
                    <Zap className="w-4 h-4 fill-indigo-400" />
                    <span>{inspectingStudent.xp || 0}</span>
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coins Balance</span>
                  <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                    <span>🪙</span>
                    <span>{inspectingStudent.coins || 0}</span>
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duel Diamonds</span>
                  <span className="text-lg font-black text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
                    <span>💎</span>
                    <span>{inspectingStudent.diamonds || 0}</span>
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Streak</span>
                  <span className="text-lg font-black text-orange-400 flex items-center justify-center gap-1 mt-0.5">
                    <Flame className="w-4 h-4 fill-orange-400" />
                    <span>{inspectingStudent.streakDays || 1}d</span>
                  </span>
                </div>
              </div>

              {/* Vocabulary Work & Units Mastery */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Vocabulary Work & Units Mastered</span>
                  </h4>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {Object.values(inspectingStudent.unitMasteries || {}).filter(m => m >= 80).length} Mastered (≥80%)
                  </span>
                </div>

                {Object.keys(inspectingStudent.unitMasteries || {}).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No vocabulary units completed yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(inspectingStudent.unitMasteries || {}).map(([uId, mastery]) => (
                      <div
                        key={uId}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                          mastery >= 80 
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        <span>{uId.toUpperCase()}:</span>
                        <span className="font-black">{mastery}%</span>
                        {mastery >= 80 && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* Mistakes Bank Status */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Words Needing Practice (Mistakes Bank):</span>
                  <span className="font-black text-rose-400">
                    {(inspectingStudent.mistakes || []).length} words
                  </span>
                </div>
              </div>

              {/* Grammar Work & Passed Topics */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Grammar Lessons & Topic Mastery</span>
                  </h4>
                  <span className="text-xs font-extrabold text-indigo-300">
                    {Object.values(inspectingStudent.grammarMasteries || {}).filter(s => s >= 80).length} Topics Passed
                  </span>
                </div>

                {Object.keys(inspectingStudent.grammarMasteries || {}).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No grammar topic quizzes attempted yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(inspectingStudent.grammarMasteries || {}).map(([topicId, score]) => (
                      <div
                        key={topicId}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                          score >= 80
                            ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        <span>{topicId}:</span>
                        <span className="font-black">{score}%</span>
                        {score >= 80 && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mystery Box Claimed Prizes */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span>Claimed Mystery Box Rewards</span>
                  </h4>
                  <span className="text-xs font-bold text-amber-300">
                    {(inspectingStudent.claimedPrizes || []).length} Rewards
                  </span>
                </div>

                {(inspectingStudent.claimedPrizes || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Student has not claimed any rewards yet.</p>
                ) : (
                  <div className="space-y-2">
                    {(inspectingStudent.claimedPrizes || []).map((record) => (
                      <div
                        key={record.id}
                        className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-white">{record.prizeTitle}</span>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                              {record.tier}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{record.description}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(record.claimedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setInspectingStudent(null)}
                className="btn-game-slate py-2 px-5 text-xs font-bold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
