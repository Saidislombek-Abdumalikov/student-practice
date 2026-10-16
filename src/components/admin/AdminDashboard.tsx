import { VocabularyExamAdminHub } from './VocabularyExamAdminHub';
import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { CharacterGender, LevelId, UserProfile, StudentGroup, DiamondAwardCategory } from '../../types';
import { formatPresence, formatTimeSpent, formatExactDateTime } from '../../services/presenceService';
import { soundService } from '../../services/soundService';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection 
} from '../../services/supabaseClient';
import { SUPABASE_SQL_SETUP, SupabaseService } from '../../services/supabaseService';
import { 
  ShieldCheck, 
  Users, 
  User, 
  Award, 
  Plus, 
  KeyRound, 
  Copy, 
  Check, 
  LogOut, 
  ExternalLink,
  BookOpen,
  Sparkles,
  Trophy,
  Trash2,
  Lock,
  RotateCcw,
  Cloud,
  Database,
  RefreshCw,
  Server,
  AlertTriangle,
  Gift,
  Edit3,
  Pencil,
  BarChart3,
  CheckCircle2,
  Ticket,
  FileText,
  History,
  Eye,
  EyeOff
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    profile,
    allAccounts, 
    loginAsUser, 
    logout, 
    createNewStudent, 
    resetStudentPassword, 
    resetStudentProgress,
    resetAllStudentsProgress,
    resetAdminProgress,
    deleteStudentAccount, 
    groups,
    createGroup,
    updateGroup,
    deleteGroup,
    assignStudentToGroup,
    removeStudentFromGroup,
    resetGroupProgress,
    restoreLastReset,
    lastResetBackup,
    canRestoreReset,
    isCloudConnected,
    syncWithCloud,
    setScreen,
    gifts,
    giftRequests,
    diamondAwardLogs,
    adminAddGift,
    adminUpdateGift,
    adminDeleteGift,
    adminDeliverGift,
    adminAwardDiamonds
  } = useGame();

  const [adminSection, setAdminSection] = useState<'roster' | 'exams' | 'diamonds' | 'gifts'>('roster');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<UserProfile | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Diamond manual award state
  const [awardStudentId, setAwardStudentId] = useState<string>('');
  const [awardCategory, setAwardCategory] = useState<DiamondAwardCategory>('HOMEWORK_COMPLETED');
  const [awardCustomAmount, setAwardCustomAmount] = useState<number>(3);
  const [awardReason, setAwardReason] = useState<string>('');
  const [awardRelatedId, setAwardRelatedId] = useState<string>('');
  const [awardFeedback, setAwardFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [isAwarding, setIsAwarding] = useState<boolean>(false);

  // Gifts administration state
  const [giftAdminTab, setGiftAdminTab] = useState<'requests' | 'catalog'>('requests');
  const [newGiftTitle, setNewGiftTitle] = useState('');
  const [newGiftDesc, setNewGiftDesc] = useState('');
  const [newGiftPrice, setNewGiftPrice] = useState<number>(5);
  const [newGiftIcon, setNewGiftIcon] = useState('🎁');
  const [newGiftActive, setNewGiftActive] = useState(true);
  const [giftFeedback, setGiftFeedback] = useState<string | null>(null);
  
  // Cloud modal state
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig().anonKey);
  const [cloudStatusMsg, setCloudStatusMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [lastAutoSyncTime, setLastAutoSyncTime] = useState<Date>(new Date());
  const [inspectingStudent, setInspectingStudent] = useState<UserProfile | null>(null);

  // Group Management States
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [groupModalMode, setGroupModalMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupFormName, setGroupFormName] = useState('');
  const [groupFormLevel, setGroupFormLevel] = useState<LevelId>('beginner');
  const [groupFormDesc, setGroupFormDesc] = useState('');
  const [groupFormMemberIds, setGroupFormMemberIds] = useState<string[]>([]);
  const [newStudentGroupId, setNewStudentGroupId] = useState<string>('group_alpha');

  const handleOpenCreateGroup = () => {
    setGroupFormName('');
    setGroupFormLevel('beginner');
    setGroupFormDesc('');
    setGroupFormMemberIds([]);
    setEditingGroupId(null);
    setGroupModalMode('create');
    soundService.playClick();
  };

  const handleOpenEditGroup = (g: StudentGroup) => {
    setEditingGroupId(g.id);
    setGroupFormName(g.name);
    setGroupFormLevel(g.levelId);
    setGroupFormDesc(g.description || '');
    setGroupFormMemberIds([...g.studentIds]);
    setGroupModalMode('edit');
    soundService.playClick();
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormName.trim()) return;

    if (groupModalMode === 'create') {
      createGroup({
        name: groupFormName.trim(),
        levelId: groupFormLevel,
        description: groupFormDesc.trim() || undefined,
        studentIds: groupFormMemberIds,
      });
    } else if (groupModalMode === 'edit' && editingGroupId) {
      updateGroup(editingGroupId, {
        name: groupFormName.trim(),
        levelId: groupFormLevel,
        description: groupFormDesc.trim() || undefined,
        studentIds: groupFormMemberIds,
      });
    }

    setGroupModalMode('list');
    soundService.playSuccess();
  };

  const handleDeleteGroup = (g: StudentGroup) => {
    if (window.confirm(`Are you sure you want to delete group "${g.name}"?\n\nStudents assigned to this group will become unassigned.`)) {
      deleteGroup(g.id);
      soundService.playClick();
    }
  };

  const handleToggleMember = (studentId: string) => {
    setGroupFormMemberIds(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Real-time automatic background refresh (no manual refresh needed!)
  useEffect(() => {
    // 1. Initial sync immediately when entering Admin Dashboard
    syncWithCloud().then(() => setLastAutoSyncTime(new Date()));

    // 2. Continuous auto-refresh interval (every 4 seconds)
    const interval = setInterval(async () => {
      await syncWithCloud();
      setLastAutoSyncTime(new Date());
    }, 15000);

    // 3. Supabase Realtime subscription for instant push updates when any student saves progress
    const unsubscribe = SupabaseService.subscribeToRemoteAccounts(async () => {
      await syncWithCloud();
      setLastAutoSyncTime(new Date());
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Add student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<CharacterGender>('woman');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentLevel, setNewStudentLevel] = useState<LevelId>('beginner');
  const [addError, setAddError] = useState('');

  // Support Assistant account (Roziya)
  const supportAssistant = allAccounts.find(a => a.role === 'support');

  // Filter students (strictly role === 'student')
  const students = allAccounts.filter(a => a.role === 'student');

  // Active vocabulary exam count for live indicator
  const activeExamCount = students.filter(s => s.activeExamAttempt && s.activeExamAttempt.status === 'active').length;

  // Aggregated analytics
  const totalClassXp = students.reduce((sum, s) => sum + s.xp, 0);
  const totalClassCoins = students.reduce((sum, s) => sum + s.coins, 0);
  const topStreakStudent = [...students].sort((a, b) => b.streakDays - a.streakDays)[0];
  const topXpStudent = [...students].sort((a, b) => b.xp - a.xp)[0];

  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundService.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    soundService.playClick();
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentUsername.trim() || !newStudentPassword.trim()) {
      setAddError('Please fill in all student details.');
      return;
    }

    const res = createNewStudent({
      name: newStudentName,
      gender: newStudentGender,
      username: newStudentUsername,
      password: newStudentPassword,
      levelId: newStudentLevel,
      groupId: newStudentGroupId || undefined,
    });

    if (res.success) {
      setShowAddModal(false);
      setNewStudentName('');
      setNewStudentUsername('');
      setNewStudentPassword('');
      setAddError('');
    } else {
      setAddError(res.message || 'Error creating account');
    }
  };

  const handleSaveNewPassword = () => {
    if (!showPasswordModal || !newPasswordInput.trim()) return;
    resetStudentPassword(showPasswordModal.id, newPasswordInput.trim());
    setShowPasswordModal(null);
    setNewPasswordInput('');
  };

  const handleAwardDiamonds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardStudentId) {
      setAwardFeedback({ ok: false, text: "Iltimos, o‘quvchini tanlang!" });
      return;
    }
    const amount = awardCategory === 'HOMEWORK_COMPLETED' ? 1 : awardCategory === 'EXAM_HIGH_SCORE' ? 5 : awardCustomAmount;
    if (!amount || amount <= 0) {
      setAwardFeedback({ ok: false, text: "Olmos miqdori 0 dan katta bo‘lishi kerak!" });
      return;
    }
    setIsAwarding(true);
    setAwardFeedback(null);
    const res = await adminAwardDiamonds({
      studentId: awardStudentId,
      amount,
      category: awardCategory,
      reason: awardReason.trim() || (awardCategory === 'HOMEWORK_COMPLETED' ? 'Vazifalarni to‘liq bajarganligi uchun' : awardCategory === 'EXAM_HIGH_SCORE' ? 'Imtihonda yuqori natija ko‘rsatganligi uchun' : 'Alohida yaxshi ishi uchun'),
      relatedEntityId: awardRelatedId.trim() || undefined,
    });
    setIsAwarding(false);
    if (res.success) {
      soundService.playSuccess();
      setAwardFeedback({ ok: true, text: `✅ ${res.message}` });
      setAwardReason('');
      setAwardRelatedId('');
    } else {
      soundService.playCardFlip();
      setAwardFeedback({ ok: false, text: `❌ ${res.message}` });
    }
  };

  const handleCreateGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftTitle.trim()) return;
    adminAddGift({
      title: newGiftTitle.trim(),
      description: newGiftDesc.trim(),
      diamondPrice: Math.max(1, newGiftPrice),
      iconUrl: newGiftIcon || '🎁',
      isActive: newGiftActive,
    });
    soundService.playSuccess();
    setGiftFeedback('✅ Yangi sovg‘a muvaffaqiyatli qo‘shildi!');
    setNewGiftTitle('');
    setNewGiftDesc('');
    setNewGiftPrice(5);
    setTimeout(() => setGiftFeedback(null), 3000);
  };

  // Generate suggested credentials when typing name
  const handleNameChange = (name: string) => {
    setNewStudentName(name);
    const cleaned = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleaned) {
      setNewStudentUsername(cleaned);
      const randNum = Math.floor(10 + Math.random() * 90);
      setNewStudentPassword(cleaned.substring(0, 2) + randNum);
    }
  };

  const handleSaveCloudSettings = async () => {
    setIsTestingCloud(true);
    setCloudStatusMsg(null);
    saveSupabaseConfig(supabaseUrlInput, supabaseKeyInput);

    const test = await testSupabaseConnection();
    setIsTestingCloud(false);
    setCloudStatusMsg({ ok: test.ok, text: test.message });

    if (test.ok) {
      soundService.playSuccess();
      syncWithCloud();
    } else {
      soundService.playError();
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    soundService.playClick();
    await syncWithCloud();
    setIsSyncing(false);
    soundService.playSuccess();
  };

  const handlePushAllToCloud = async () => {
    setIsSyncing(true);
    const ok = await SupabaseService.saveAllAccountsToRemote(allAccounts);
    setIsSyncing(false);
    if (ok) {
      soundService.playSuccess();
      alert('✅ All student profiles and progress successfully uploaded to Supabase!');
    } else {
      soundService.playError();
      alert('❌ Failed to upload. Make sure the table "student_profiles" exists in Supabase SQL editor.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Teacher / Administrator Center</span>
              </span>

              {/* Supabase status badge */}
              <button
                onClick={() => setShowCloudModal(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  isCloudConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{isCloudConnected ? 'Supabase: Ulangan' : 'Lokal rejim (Supabase sozlash)'}</span>
              </button>

              {/* Live Auto-Refresh Indicator */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Auto-Refresh Live</span>
                <span className="text-emerald-400/70 text-[10px] hidden sm:inline">({lastAutoSyncTime.toLocaleTimeString()})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Class Management & Student Progress
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Manage student accounts, review vocabulary & grammar performance, reward active participation, reset progress, and sync data safely to Supabase Cloud for multi-device access.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="py-2.5 px-3.5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              title="Sync latest student progress from Cloud"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button
              onClick={() => {
                setGroupModalMode('list');
                setShowGroupsModal(true);
              }}
              className="py-2.5 px-3.5 rounded-2xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 flex items-center gap-2 shadow-sm transition-all active:scale-95"
              title="Manage Student Groups (Make, edit, delete groups & isolate classes)"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Groups ({groups.length})</span>
            </button>

            <button
              onClick={() => {
                setAdminSection('exams');
                soundService.playClick();
              }}
              className={`py-2.5 px-3.5 rounded-2xl text-xs font-bold border flex items-center gap-2 shadow-sm transition-all active:scale-95 relative ${
                adminSection === 'exams'
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40'
              }`}
              title="Beginner Vocabulary Progression & Exam Monitoring Matrix"
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>Vocab Exams</span>
              {activeExamCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                  {activeExamCount} Live
                </span>
              )}
            </button>

            <button
              onClick={() => setScreen('homework')}
              className="py-2.5 px-3.5 rounded-2xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-2 shadow-sm transition-all active:scale-95"
              title="Review student homework submissions & voice audios"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Homework Center</span>
            </button>

            <button
              onClick={() => setShowCloudModal(true)}
              className="py-2.5 px-3.5 rounded-2xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Database className="w-4 h-4" />
              <span>Supabase Cloud</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn-game-emerald py-2.5 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>

            <button
              onClick={logout}
              className="py-2.5 px-4 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-game p-4 bg-slate-900/80 border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{students.length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">O‘quvchilar</div>
          </div>
        </div>

        <div className="card-game p-4 bg-slate-900/80 border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">💎 {students.reduce((sum, s) => sum + (s.diamonds || 0), 0)}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Berilgan olmoslar</div>
          </div>
        </div>

        <div className="card-game p-4 bg-slate-900/80 border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{giftRequests.filter(r => r.status === 'PENDING').length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kutilayotgan sovg‘alar</div>
          </div>
        </div>

        <div className="card-game p-4 bg-slate-900/80 border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{activeExamCount}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faol imtihonlar</div>
          </div>
        </div>
      </div>

      {/* Teacher / Administrator Personal Profile & Controls */}
      <div className="card-game p-5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-amber-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-amber-500/60 flex items-center justify-center relative overflow-hidden shadow-inner">
              <ModularCharacter config={profile.character} size="sm" animate={false} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">{profile.name} (Teacher)</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase">
                  ADMIN
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-300">
                <span className="text-cyan-400">💎 {profile.diamonds === 999999 ? '∞' : (profile.diamonds || 0)} olmos</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Clear Admin Progress Button */}
            <button
              onClick={async () => {
                if (window.confirm('⚠️ Clear and reset Teacher/Admin progress?\n\nThis will reset your XP to 0, streak to 1, and clear completed units and grammar masteries.\n\nContinue?')) {
                  await resetAdminProgress();
                  alert('✅ Teacher/Admin progress successfully cleared and reset!');
                }
              }}
              className="py-2 px-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Clear Admin/Teacher learning progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear My Progress</span>
            </button>

            {/* Edit Admin Character & Studio */}
            <button
              onClick={() => setScreen('profile')}
              className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Profile Studio</span>
            </button>
          </div>

        </div>
      </div>

      {/* Support Assistant (Roziya) Dedicated Card */}
      {supportAssistant && (
        <div className="card-game p-5 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border-2 border-purple-500/40 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-purple-500/60 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
                <ModularCharacter config={supportAssistant.character} size="sm" animate={false} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg text-white">{supportAssistant.name} (Support Assistant)</h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase">
                    SUPPORT
                  </span>
                  {(() => {
                    const presence = formatPresence(supportAssistant.lastSeenAt, supportAssistant.isOnline);
                    return (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${
                        presence.isOnline
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${presence.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{presence.shortLabel}</span>
                      </span>
                    );
                  })()}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-bold text-slate-300">
                  <span className="text-amber-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> {supportAssistant.xp} XP
                  </span>
                  <span className="text-yellow-400">🪙 {supportAssistant.coins}</span>
                  <span className="text-cyan-400">💎 {supportAssistant.diamonds || 0}</span>
                  <span className="text-purple-300 flex items-center gap-1">
                    ⏱️ Active: <strong className="text-white">{formatTimeSpent(supportAssistant.totalTimeSpentMinutes)}</strong>
                  </span>
                  <span className="text-slate-400">
                    (Today: <strong className="text-indigo-300">{formatTimeSpent(supportAssistant.todayTimeSpentMinutes)}</strong>)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>Username:</span>
                    <button
                      onClick={() => handleCopyCredentials(supportAssistant.username || 'roziya', `user-${supportAssistant.id}`)}
                      className="font-mono text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1"
                      title="Copy username"
                    >
                      <span>{supportAssistant.username || 'roziya'}</span>
                      {copiedId === `user-${supportAssistant.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span>Password:</span>
                    <button
                      onClick={() => handleCopyCredentials(supportAssistant.password || 'rb88', `pass-${supportAssistant.id}`)}
                      className="font-mono text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1"
                      title="Copy password"
                    >
                      <span>{supportAssistant.password || 'rb88'}</span>
                      {copiedId === `pass-${supportAssistant.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <span>Last Login:</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {formatExactDateTime(supportAssistant.lastLoginAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => loginAsUser(supportAssistant.id)}
                className="py-2 px-3.5 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Sign in as Support Assistant to see what she sees"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View As Support</span>
              </button>

              <button
                onClick={() => {
                  setShowPasswordModal(supportAssistant);
                  setNewPasswordInput('');
                }}
                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                title="Change Support Assistant password"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Change Password</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Primary Section Switcher: Roster, Diamonds, Gifts, Exams */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-3xl overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            soundService.playClick();
            setAdminSection('roster');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            adminSection === 'roster'
              ? 'bg-indigo-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>O‘quvchilar ro‘yxati</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setAdminSection('diamonds');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            adminSection === 'diamonds'
              ? 'bg-cyan-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Olmos berish</span>
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setAdminSection('gifts');
          }}
          className={`flex-1 min-w-[140px] py-2.5 px-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 relative ${
            adminSection === 'gifts'
              ? 'bg-amber-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-300" />
          <span>Sovg‘alar & So‘rovlar</span>
          {giftRequests.filter(r => r.status === 'PENDING').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
              {giftRequests.filter(r => r.status === 'PENDING').length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setAdminSection('exams');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 relative ${
            adminSection === 'exams'
              ? 'bg-purple-600 text-white shadow-game-btn'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Imtihonlar nazorati</span>
          {activeExamCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping absolute top-2 right-2" />
          )}
          {activeExamCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
              {activeExamCount} Live
            </span>
          )}
        </button>
      </div>

      {adminSection === 'exams' ? (
        <VocabularyExamAdminHub />
      ) : adminSection === 'diamonds' ? (
        /* Diamond Awarding Section */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Qo‘lda olmos berish tizimi
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              O‘quvchilarga olmos berish
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Hech bir holatda olmos avtomatik berilmaydi. Admin vazifalar to‘liq bajarilganini tasdiqlasa yoki imtihonda yuqori natija olinsa, ushbu bo‘lim orqali olmos beradi.
            </p>
          </div>

          {/* Form Card */}
          <div className="card-game p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>Mukofot shakli</span>
            </h3>

            {awardFeedback && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold border ${
                awardFeedback.ok
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              }`}>
                {awardFeedback.text}
              </div>
            )}

            <form onSubmit={handleAwardDiamonds} className="space-y-4">
              {/* Select Student */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  O‘quvchini tanlang:
                </label>
                <select
                  value={awardStudentId}
                  onChange={(e) => setAwardStudentId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">-- O‘quvchini tanlang --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.username}) — Hozirgi balansi: 💎 {s.diamonds || 0}
                    </option>
                  ))}
                </select>
              </div>

              {/* Award Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Mukofot turi va miqdori:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAwardCategory('HOMEWORK_COMPLETED');
                      if (!awardReason) setAwardReason("Belgilangan barcha vazifalarini to‘liq bajarganligi uchun");
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      awardCategory === 'HOMEWORK_COMPLETED'
                        ? 'bg-cyan-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black">Vazifa to‘liq bajarildi</span>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-xs">+1 💎</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Admin tekshirib tasdiqlagan vazifalar uchun</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAwardCategory('EXAM_HIGH_SCORE');
                      if (!awardReason) setAwardReason("Imtihonda yuqori natija ko‘rsatganligi uchun");
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      awardCategory === 'EXAM_HIGH_SCORE'
                        ? 'bg-cyan-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black">Imtihonda yuqori natija</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">+5 💎</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Admin belgilagan mezondan yuqori ball olganda</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAwardCategory('SPECIAL_ACHIEVEMENT')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      awardCategory === 'SPECIAL_ACHIEVEMENT'
                        ? 'bg-cyan-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black">Alohida yaxshi ish</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white font-black text-xs">Maxsus 💎</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Admin tanlagan ixtiyoriy miqdor</p>
                  </button>
                </div>
              </div>

              {/* Custom amount input if SPECIAL_ACHIEVEMENT */}
              {awardCategory === 'SPECIAL_ACHIEVEMENT' && (
                <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="text-xs font-bold text-cyan-300">
                    Olmos miqdorini kiriting:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={awardCustomAmount}
                    onChange={(e) => setAwardCustomAmount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Reason input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Mukofot sababi va izohi:
                </label>
                <input
                  type="text"
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="Masalan: Unit 3 listening topshirig'i to'liq bajarildi yoki 98% ball olindi"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAwarding || !awardStudentId}
                className="btn-game-primary py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-game-btn active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>{isAwarding ? 'Olmos berilmoqda...' : 'Olmosni tasdiqlash va berish'}</span>
              </button>
            </form>
          </div>

          {/* Diamond History Log Table */}
          <div className="card-game p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Berilgan olmoslar tarixi ({diamondAwardLogs.length})</span>
              </h3>
            </div>

            {diamondAwardLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center italic">
                Hali hech qanday olmos berilmagan.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">O‘quvchi</th>
                      <th className="p-3">Miqdor</th>
                      <th className="p-3">Sabab</th>
                      <th className="p-3">Admin</th>
                      <th className="p-3">Sana va vaqt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {diamondAwardLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-850/50">
                        <td className="p-3 font-bold text-white">{log.studentName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black">
                            +{log.amount} 💎
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{log.reason}</td>
                        <td className="p-3 text-slate-400">{log.awardedByName}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{formatExactDateTime(log.awardedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : adminSection === 'gifts' ? (
        /* Gifts & Requests Section */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Gift className="w-4 h-4" />
              Sovg‘alar markazi
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Sovg‘alar katalogi va so‘rovlar nazorati
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              O‘quvchilar olmos evaziga oladigan sovg‘alarni qo‘shing, narxini belgilang va kelib tushgan sovg‘a so‘rovlarini topshiring.
            </p>
          </div>

          {/* Subtabs: So'rovlar vs Katalog */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-md">
            <button
              onClick={() => setGiftAdminTab('requests')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                giftAdminTab === 'requests'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              So‘rovlar ({giftRequests.filter(r => r.status === 'PENDING').length} kutilmoqda)
            </button>
            <button
              onClick={() => setGiftAdminTab('catalog')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                giftAdminTab === 'catalog'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sovg‘alar katalogi ({gifts.length})
            </button>
          </div>

          {giftAdminTab === 'requests' ? (
            <div className="card-game p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
              <h3 className="text-base font-black text-white">Kelib tushgan sovg‘a so‘rovlari</h3>

              {giftRequests.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center italic">
                  Hozircha hech qanday sovg‘a so‘rovi yo‘q.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-3">O‘quvchi</th>
                        <th className="p-3">Sovg‘a nomi</th>
                        <th className="p-3">Narxi</th>
                        <th className="p-3">So‘rov vaqti</th>
                        <th className="p-3">Holati</th>
                        <th className="p-3 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {giftRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-850/50">
                          <td className="p-3 font-bold text-white">{req.studentName}</td>
                          <td className="p-3 font-medium text-slate-200">{req.giftTitle}</td>
                          <td className="p-3 text-cyan-400 font-black">💎 {req.diamondPrice}</td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">{formatExactDateTime(req.requestedAt)}</td>
                          <td className="p-3">
                            {req.status === 'DELIVERED' ? (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">
                                ✓ Topshirildi
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black animate-pulse">
                                Kutilmoqda
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {req.status === 'PENDING' ? (
                              <button
                                onClick={() => {
                                  soundService.playSuccess();
                                  adminDeliverGift(req.id);
                                }}
                                className="btn-game-emerald py-1 px-3 text-xs font-black rounded-lg shadow-sm active:scale-95"
                              >
                                Topshirildi deb belgilash
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">
                                {formatExactDateTime(req.deliveredAt)} topshirilgan
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add New Gift Form */}
              <div className="card-game p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Yangi sovg‘a qo‘shish</span>
                </h3>

                {giftFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    {giftFeedback}
                  </div>
                )}

                <form onSubmit={handleCreateGift} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Sovg‘a nomi:</label>
                    <input
                      type="text"
                      value={newGiftTitle}
                      onChange={(e) => setNewGiftTitle(e.target.value)}
                      placeholder="Masalan: Oxford lug'at kitobi"
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Olmosdagi narxi (💎):</label>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={newGiftPrice}
                      onChange={(e) => setNewGiftPrice(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300">Tavsifi:</label>
                    <input
                      type="text"
                      value={newGiftDesc}
                      onChange={(e) => setNewGiftDesc(e.target.value)}
                      placeholder="Sovg'a haqida qisqacha ma'lumot"
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Ikonka (Emoji):</label>
                    <div className="flex gap-2">
                      {['🎁', '📚', '🎧', '🎒', '🍫', '🎟️', '✏️', '⚽', '👕', '🧸'].map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewGiftIcon(emoji)}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                            newGiftIcon === emoji
                              ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-sm'
                              : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 flex items-end">
                    <button
                      type="submit"
                      className="btn-game-emerald w-full py-2.5 px-4 rounded-xl text-xs font-black shadow-sm"
                    >
                      Sovg‘ani saqlash va chiqarish
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Gifts Catalog */}
              <div className="space-y-3">
                <h3 className="text-base font-black text-white px-1">Mavjud sovg‘alar ro‘yxati ({gifts.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {gifts.map(g => (
                    <div
                      key={g.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">{g.iconUrl || '🎁'}</span>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-white">{g.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2">{g.description}</p>
                          <span className="text-xs font-black text-cyan-400 block pt-1">
                            💎 {g.diamondPrice} olmos
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => adminUpdateGift(g.id, { isActive: !g.isActive })}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-black border transition-all ${
                            g.isActive
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}
                        >
                          {g.isActive ? 'Faol' : 'Yashirilgan'}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Sovg‘a "${g.title}" o‘chirilsinmi?`)) {
                              adminDeleteGift(g.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Student Roster Table / Grid */
        <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Student Roster & Accounts</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {students.length} students
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* RESTORE LAST RESET BUTTON */}
            {canRestoreReset && lastResetBackup && (
              <button
                onClick={async () => {
                  const timeStr = new Date(lastResetBackup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const choice = confirm(
                    `⏪ Restore Last Reset?\n\nTarget: ${lastResetBackup.targetName} (${lastResetBackup.affectedStudentCount} students)\nReset Time: ${timeStr}\n\nThis will restore their XP, Coins, Diamonds, Streak, and completed units/grammar records back to how they were right before the reset!\n\nClick OK to restore.`
                  );
                  if (choice) {
                    const res = await restoreLastReset();
                    if (res.success) {
                      alert(`✅ ${res.message}`);
                    } else {
                      alert(`❌ ${res.message}`);
                    }
                  }
                }}
                className="py-1.5 px-3 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-glow-primary active:scale-95 animate-pulse"
                title={`Restore previous state for ${lastResetBackup.targetName} (${lastResetBackup.affectedStudentCount} students)`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Restore Last Reset ({lastResetBackup.targetName})</span>
              </button>
            )}

            {/* GROUP-AWARE RESET BUTTON */}
            {(() => {
              const activeFilterGroup = groups.find((g: StudentGroup) => g.id === selectedGroupFilter);
              if (activeFilterGroup) {
                const groupCount = students.filter(s => s.groupId === activeFilterGroup.id || activeFilterGroup.studentIds.includes(s.id)).length;
                return (
                  <button
                    onClick={async () => {
                      const choice = confirm(
                        `⚠️ Reset learning progress for ${groupCount} students in "${activeFilterGroup.name}"?\n\nThis will reset their XP to 0, Coins to 20, Diamonds to 0, Streak to 1, and clear completed units and grammar records.\n\n(A safety backup will be created automatically so you can restore their progress anytime!)`
                      );
                      if (choice) {
                        const res = await resetGroupProgress(activeFilterGroup.id);
                        alert(`✅ ${res.message}\n\nYou can click "Restore Last Reset" if you need to recover this group's progress!`);
                      }
                    }}
                    className="py-1.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                    title={`Reset progress for all students in ${activeFilterGroup.name}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset {activeFilterGroup.name}</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={async () => {
                    const choice = confirm('⚠️ Clean Slate Reset for ALL Students?\n\nThis will reset all students\' XP to 0, Coins to 20, Diamonds to 0, Streak to 1, and clear completed units and grammar records.\n\n(A safety backup will be created automatically so you can restore their progress anytime!)');
                    if (choice) {
                      await resetAllStudentsProgress(false);
                      alert('✅ All student progress successfully cleared and reset!\n\nYou can click "Restore Last Reset" if you need to recover them.');
                    }
                  }}
                  className="py-1.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  title="Reset all students to clean starting data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Students</span>
                </button>
              );
            })()}
          </div>
        </div>

        {/* Group Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedGroupFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedGroupFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            All Students ({students.length})
          </button>
          {groups.map((g: StudentGroup) => {
            const count = students.filter(s => s.groupId === g.id || g.studentIds.includes(s.id)).length;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGroupFilter(g.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedGroupFilter === g.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-purple-300 hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <span>👥 {g.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/70 font-black">
                  {count}
                </span>
              </button>
            );
          })}
          {students.filter(s => !s.groupId && !groups.some((g: StudentGroup) => g.studentIds.includes(s.id))).length > 0 && (
            <button
              onClick={() => setSelectedGroupFilter('unassigned')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedGroupFilter === 'unassigned'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-amber-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              Unassigned ({students.filter(s => !s.groupId && !groups.some((g: StudentGroup) => g.studentIds.includes(s.id))).length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.filter(student => {
            if (selectedGroupFilter === 'all') return true;
            if (selectedGroupFilter === 'unassigned') {
              return !student.groupId && !groups.some((g: StudentGroup) => g.studentIds.includes(student.id));
            }
            return student.groupId === selectedGroupFilter || groups.find((g: StudentGroup) => g.id === selectedGroupFilter)?.studentIds.includes(student.id);
          }).map(student => {
            const levelLabel = student.levelId === 'elementary' ? 'Elementary (A2)' : student.levelId === 'pre_intermediate' ? 'Pre-Intermediate (B1)' : 'Beginner (A1)';
            const grammarPassedCount = Object.values(student.grammarMasteries || {}).filter(score => score >= 80).length;
            const vocabUnitsCount = Object.keys(student.unitMasteries || {}).length;

            return (
              <div
                key={student.id}
                className="card-game p-5 bg-slate-900/90 border-slate-800/90 hover:border-indigo-500/50 transition-all flex flex-col justify-between gap-4 relative group"
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
                    {(() => {
                      const presence = formatPresence(student.lastSeenAt, student.isOnline);
                      return (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${
                          presence.isOnline
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${presence.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{presence.shortLabel}</span>
                        </span>
                      );
                    })()}
                  </div>

                  {/* Active Time Spent Pill */}
                  <div className="mt-2.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <span>⏱️ Active Time:</span>
                      <span className="text-white font-black">{formatTimeSpent(student.totalTimeSpentMinutes)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Today: <strong className="text-indigo-300">{formatTimeSpent(student.todayTimeSpentMinutes)}</strong>
                    </div>
                  </div>

                  {/* Student Diamonds & Quick Diamond Award Button */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-semibold">Balans:</span>
                      <span className="text-cyan-400 font-black text-xs">💎 {student.diamonds || 0} olmos</span>
                    </div>

                    <button
                      onClick={() => {
                        soundService.playClick();
                        setAwardStudentId(student.id);
                        setAdminSection('diamonds');
                      }}
                      className="py-1 px-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1"
                      title="Ushbu o‘quvchiga olmos berish"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-300" />
                      <span>Olmos berish</span>
                    </button>
                  </div>
                </div>

                {/* Student Group Quick Selector */}
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>Group:</span>
                  </span>
                  <select
                    value={student.groupId || ''}
                    onChange={(e) => {
                      const targetGid = e.target.value;
                      if (targetGid) {
                        assignStudentToGroup(student.id, targetGid);
                      } else {
                        removeStudentFromGroup(student.id);
                      }
                    }}
                    className="text-[11px] font-bold bg-slate-800 border border-slate-700 text-purple-300 rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500"
                  >
                    <option value="">No Group</option>
                    {groups.map((g: StudentGroup) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* Progress Details */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/70 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Vocabulary Units</span>
                    <span className="text-white font-bold">{vocabUnitsCount} studied</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">Grammar Passed</span>
                    <span className="text-white font-bold">{grammarPassedCount} topics</span>
                  </div>
                </div>

                {/* Credentials Panel */}
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Username:</span>
                    <button
                      onClick={() => handleCopyCredentials(student.username || '', `user-${student.id}`)}
                      className="font-mono text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-bold"
                      title="Click to copy username"
                    >
                      <span>{student.username}</span>
                      {copiedId === `user-${student.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Password:</span>
                    <button
                      onClick={() => handleCopyCredentials(student.password || '', `pass-${student.id}`)}
                      className="font-mono text-emerald-300 hover:text-emerald-200 flex items-center gap-1 font-bold"
                      title="Click to copy password"
                    >
                      <span>{student.password}</span>
                      {copiedId === `pass-${student.id}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                    <span className="text-slate-400 font-medium">Last Login (Admin Only):</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {formatExactDateTime(student.lastLoginAt)}
                    </span>
                  </div>
                </div>

                {/* View Student Work & Learning Analytics */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => setInspectingStudent(student)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-black bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-sm"
                    title="Inspect student's exact XP, coins, diamonds, vocabulary & grammar work, and mistakes"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>View Work & Analytics</span>
                  </button>

                  {/* Actions: Impersonate, Reset Password, Reset Progress, Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loginAsUser(student.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      title="Sign in as this student to view what they see"
                    >
                      <span>Impersonate</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setShowPasswordModal(student);
                        setNewPasswordInput('');
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
                      title="Reset Student Password"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>

                    {/* Reset Progress Button */}
                    <button
                      onClick={() => {
                        if (confirm(`⚠️ Reset learning progress for ${student.name}?\n\nThis will reset their XP to 0, Coins to 20, Streak to 1, and clear completed units and grammar records.`)) {
                          resetStudentProgress(student.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all"
                      title="Reset Student Learning Progress"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {students.length > 5 && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove student ${student.name}?`)) {
                            deleteStudentAccount(student.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                        title="Delete Student Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

            {/* Student Groups Management Modal */}
      {showGroupsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">
                    {groupModalMode === 'create' ? 'Create Student Group' : groupModalMode === 'edit' ? 'Edit Student Group' : 'Student Groups Management'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {groupModalMode === 'list' ? 'Keep student cohorts organized with complete isolation' : 'Configure group details and assign member students'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (groupModalMode !== 'list') {
                    setGroupModalMode('list');
                  } else {
                    setShowGroupsModal(false);
                  }
                }}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {groupModalMode === 'list' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Active Groups ({groups.length})
                    </span>
                    <button
                      onClick={handleOpenCreateGroup}
                      className="btn-game-emerald py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Group</span>
                    </button>
                  </div>

                  {groups.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 rounded-2xl bg-slate-950/60 border border-slate-800">
                      No groups created yet. Click "Create New Group" to get started!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {groups.map((g: StudentGroup) => {
                        const members = students.filter(s => s.groupId === g.id || g.studentIds.includes(s.id));
                        const levelLabel = g.levelId === 'elementary' ? 'Elementary (A2)' : g.levelId === 'pre_intermediate' ? 'Pre-Intermediate (B1)' : 'Beginner (A1)';

                        return (
                          <div
                            key={g.id}
                            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-base font-black text-white">{g.name}</h4>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    {levelLabel}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                    {members.length} students
                                  </span>
                                </div>
                                {g.description && (
                                  <p className="text-xs text-slate-400">{g.description}</p>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={async () => {
                                    const choice = confirm(
                                      `⚠️ Reset learning progress for ${members.length} students in "${g.name}"?\n\nThis will reset their XP to 0, Coins to 20, Diamonds to 0, Streak to 1, and clear completed units and grammar records.\n\n(A safety backup will be saved automatically, and you can click "Restore Last Reset" anytime!)`
                                    );
                                    if (choice) {
                                      const res = await resetGroupProgress(g.id);
                                      alert(`✅ ${res.message}\n\nYou can click "Restore Last Reset" if needed.`);
                                    }
                                  }}
                                  className="py-1.5 px-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all text-xs font-bold flex items-center gap-1 active:scale-95"
                                  title={`Reset progress for all students in ${g.name}`}
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Reset</span>
                                </button>

                                <button
                                  onClick={() => handleOpenEditGroup(g)}
                                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1 border border-slate-700 active:scale-95"
                                  title="Edit Group"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteGroup(g)}
                                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all text-xs active:scale-95"
                                  title="Delete Group"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Group Members List */}
                            <div className="pt-2 border-t border-slate-800/70">
                              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                                Group Members:
                              </span>
                              {members.length === 0 ? (
                                <span className="text-xs text-slate-500 italic">No students assigned to this group yet</span>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {members.map(m => (
                                    <span
                                      key={m.id}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200"
                                    >
                                      <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                                        <ModularCharacter config={m.character} size="sm" animate={false} />
                                      </div>
                                      <span>{m.name}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Create or Edit Group Form */
                <form onSubmit={handleSaveGroup} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Group Name</label>
                    <input
                      type="text"
                      value={groupFormName}
                      onChange={e => setGroupFormName(e.target.value)}
                      placeholder="e.g. Morning Group Alpha or Band 7 Prep"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Target Proficiency Level</label>
                      <select
                        value={groupFormLevel}
                        onChange={e => setGroupFormLevel(e.target.value as LevelId)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      >
                        <option value="beginner">Beginner (A1)</option>
                        <option value="elementary">Elementary (A2)</option>
                        <option value="pre_intermediate">Pre-Intermediate (B1)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Description (Optional)</label>
                      <input
                        type="text"
                        value={groupFormDesc}
                        onChange={e => setGroupFormDesc(e.target.value)}
                        placeholder="e.g. Meets Mon/Wed/Fri at 9:00 AM"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* Student Selection Checkboxes */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">
                        Select Students in this Group ({groupFormMemberIds.length} selected)
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setGroupFormMemberIds(students.map(s => s.id))}
                          className="text-[11px] text-purple-400 hover:text-purple-300 font-bold"
                        >
                          Select All
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          type="button"
                          onClick={() => setGroupFormMemberIds([])}
                          className="text-[11px] text-slate-400 hover:text-slate-300 font-bold"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 rounded-2xl bg-slate-950/70 border border-slate-800">
                      {students.map(s => {
                        const isChecked = groupFormMemberIds.includes(s.id);
                        const currentG = groups.find((g: StudentGroup) => g.id === s.groupId && g.id !== editingGroupId);

                        return (
                          <label
                            key={s.id}
                            className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all text-xs ${
                              isChecked
                                ? 'bg-purple-500/15 border-purple-500/50 text-white font-bold'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleMember(s.id)}
                              className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 w-4 h-4"
                            />
                            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                              <ModularCharacter config={s.character} size="sm" animate={false} />
                            </div>
                            <span className="truncate flex-1">{s.name}</span>
                            {currentG && !isChecked && (
                              <span className="text-[9px] text-slate-500 truncate max-w-[80px]">
                                ({currentG.name})
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setGroupModalMode('list')}
                      className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-game-emerald py-2 px-5 rounded-xl text-xs font-bold shadow-md"
                    >
                      {groupModalMode === 'create' ? 'Create Group' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer (List mode) */}
            {groupModalMode === 'list' && (
              <div className="flex justify-end pt-3 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowGroupsModal(false)}
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Register New Student</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Jasur or Madina"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              {/* Gender selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Gender (Avatar Type)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStudentGender('woman')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newStudentGender === 'woman'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/60 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    👩 Woman / Girl
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStudentGender('man')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newStudentGender === 'man'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/60 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    👨 Man / Boy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Login Username</label>
                  <input
                    type="text"
                    value={newStudentUsername}
                    onChange={e => setNewStudentUsername(e.target.value)}
                    placeholder="e.g. jasur"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <input
                    type="text"
                    value={newStudentPassword}
                    onChange={e => setNewStudentPassword(e.target.value)}
                    placeholder="e.g. js42"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Starting Level</label>
                <select
                  value={newStudentLevel}
                  onChange={e => setNewStudentLevel(e.target.value as LevelId)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                >
                  <option value="beginner">Beginner (A1)</option>
                  <option value="elementary">Elementary (A2)</option>
                  <option value="pre_intermediate">Pre-Intermediate (B1)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Assign to Group</label>
                <select
                  value={newStudentGroupId}
                  onChange={e => setNewStudentGroupId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
                >
                  <option value="">No Group (Unassigned)</option>
                  {groups.map((g: StudentGroup) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-game-emerald py-2 px-5 rounded-xl text-xs font-bold"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Student Work & Detailed Learning Analytics Modal (Teacher) */}
      {/* ------------------------------------------------------------- */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="card-game p-6 sm:p-7 max-w-2xl w-full space-y-5 border-2 border-indigo-500/60 bg-slate-900 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            
            {/* Header: Student Identity */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-3xl bg-slate-950 border-2 border-indigo-500/50 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  <ModularCharacter config={inspectingStudent.character} size={70} animate={false} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{inspectingStudent.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      LVL {Math.floor(Math.sqrt((inspectingStudent.xp || 0) / 40)) + 1}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    @{inspectingStudent.username} • {inspectingStudent.levelId.toUpperCase()} • Pass: {inspectingStudent.password}
                  </p>
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-950 to-purple-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
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
                    <span className="text-base font-black text-indigo-300 mt-0.5 block">
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

              {/* Security & Authentication Logs (ADMIN ONLY) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Authentication & Login Logs (Admin Only)</span>
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    ADMIN CONFIDENTIAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase">Last Authenticated</span>
                    <span className="text-white font-mono font-bold text-xs mt-0.5 block">
                      {formatExactDateTime(inspectingStudent.lastLoginAt)}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-medium uppercase">Current Password</span>
                    <span className="text-emerald-400 font-mono font-bold text-xs mt-0.5 block">
                      {inspectingStudent.password}
                    </span>
                  </div>
                </div>

                {/* Recent Login History Log */}
                <div className="pt-1">
                  <span className="text-slate-400 text-[11px] font-bold block mb-1">Recent Login Sessions:</span>
                  {(!inspectingStudent.loginHistory || inspectingStudent.loginHistory.length === 0) ? (
                    <p className="text-xs text-slate-500 italic">No session logs recorded yet.</p>
                  ) : (
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {inspectingStudent.loginHistory.slice().reverse().map((entry, idx) => (
                        <div key={idx} className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-300">{new Date(entry.timestamp).toLocaleString()}</span>
                          <span className="text-indigo-400 font-bold">{entry.device || 'Web'}</span>
                        </div>
                      ))}
                    </div>
                  )}
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

                {/* Mistakes Bank Review Status */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Active Words in Review (Mistakes Bank):</span>
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

              {/* Gift Requests & Delivered Gifts */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    <span>Sovg‘a so‘rovlari va olingan sovg‘alar</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-300">
                    {(inspectingStudent.giftRequests || []).length} ta so‘rov
                  </span>
                </div>

                {(inspectingStudent.giftRequests || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Hozircha sovg‘a so‘rovlari mavjud emas.</p>
                ) : (
                  <div className="space-y-2">
                    {(inspectingStudent.giftRequests || []).map((req) => (
                      <div
                        key={req.id}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-white">{req.giftTitle}</span>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                              req.status === 'DELIVERED' 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {req.status === 'DELIVERED' ? 'Topshirildi' : 'Kutilmoqda'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">💎 {req.diamondPrice} olmos sarflandi</p>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const studentToLogin = inspectingStudent;
                    setInspectingStudent(null);
                    loginAsUser(studentToLogin.id);
                  }}
                  className="btn-game-primary py-2 px-3 text-xs font-black flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Impersonate</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`⚠️ Reset learning progress for ${inspectingStudent.name}?\n\nXP, Coins, Diamonds, Streak, and Mastery records will be reset to initial clean values.`)) {
                      resetStudentProgress(inspectingStudent.id);
                      setInspectingStudent(null);
                    }
                  }}
                  className="py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Reset student progress to clean slate"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Progress</span>
                </button>
              </div>

              <button
                onClick={() => setInspectingStudent(null)}
                className="btn-game-slate py-2 px-4 text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <span>Reset Password for {showPasswordModal.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Current password: <strong className="text-emerald-400 font-mono">{showPasswordModal.password}</strong>
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">New Password</label>
              <input
                type="text"
                value={newPasswordInput}
                onChange={e => setNewPasswordInput(e.target.value)}
                placeholder="Enter new simple password (e.g. dn99)"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(null)}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewPassword}
                disabled={!newPasswordInput.trim()}
                className="btn-game-primary py-2 px-4 rounded-xl text-xs font-bold"
              >
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Supabase Cloud Connection Modal */}
      {showCloudModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm p-4 flex justify-center items-start min-h-screen py-10">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Supabase Cloud Database</h3>
                  <p className="text-xs text-slate-400">Safely sync students, passwords & progress across any device</p>
                </div>
              </div>

              <button
                onClick={() => setShowCloudModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {cloudStatusMsg && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                cloudStatusMsg.ok 
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}>
                <span>{cloudStatusMsg.ok ? '✅' : '❌'}</span>
                <span>{cloudStatusMsg.text}</span>
              </div>
            )}

            {/* Step 1: SQL Setup Script */}
            <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                  Run SQL Schema in Supabase
                </span>

                <button
                  onClick={handleCopySql}
                  className="py-1 px-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                In your free Supabase project, open the <strong>SQL Editor</strong>, paste this table creation snippet, and click <strong>RUN</strong>.
              </p>

              <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-mono overflow-x-auto max-h-28">
                {SUPABASE_SQL_SETUP}
              </pre>
            </div>

            {/* Step 2: Enter Supabase Credentials */}
            <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                Enter Supabase API Credentials
              </span>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Project URL</label>
                <input
                  type="text"
                  value={supabaseUrlInput}
                  onChange={e => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://xyzabcdefghij.supabase.co"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Anon Public Key</label>
                <input
                  type="password"
                  value={supabaseKeyInput}
                  onChange={e => setSupabaseKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveCloudSettings}
                  disabled={isTestingCloud || !supabaseUrlInput.trim() || !supabaseKeyInput.trim()}
                  className="btn-game-primary py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isTestingCloud ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Server className="w-3.5 h-3.5" />
                  )}
                  <span>Test & Connect</span>
                </button>

                {isCloudConnected && (
                  <button
                    type="button"
                    onClick={handlePushAllToCloud}
                    disabled={isSyncing}
                    className="btn-game-emerald py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Upload All Students to Cloud</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowCloudModal(false)}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
