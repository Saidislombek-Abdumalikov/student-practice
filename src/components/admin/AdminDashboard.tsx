import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { CharacterGender, LevelId, UserProfile, MysteryBoxPrize, MysteryBoxTier } from '../../types';
import { formatPresence, formatTimeSpent, formatExactDateTime } from '../../services/presenceService';
import { MysteryBoxService, MYSTERY_BOX_PRICES } from '../../services/mysteryBoxService';
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
  Zap, 
  Coins, 
  Flame, 
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
  Ticket
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
    boxPrices,
    updateBoxPrices,
    isCloudConnected,
    syncWithCloud,
    setScreen 
  } = useGame();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<UserProfile | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  
  // Cloud modal state
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig().anonKey);
  const [cloudStatusMsg, setCloudStatusMsg] = useState<{ ok?: boolean; text: string } | null>(null);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [lastAutoSyncTime, setLastAutoSyncTime] = useState<Date>(new Date());

  // Mystery Box Vault State
  const [showPrizesModal, setShowPrizesModal] = useState(false);
  const [prizesList, setPrizesList] = useState<MysteryBoxPrize[]>(() => MysteryBoxService.getPrizes());
  const [selectedPrizeTierTab, setSelectedPrizeTierTab] = useState<'all' | MysteryBoxTier>('all');
  const [newPrizeTitle, setNewPrizeTitle] = useState('');
  const [newPrizeTier, setNewPrizeTier] = useState<MysteryBoxTier>('bronze');
  const [newPrizeType, setNewPrizeType] = useState<'real_world' | 'coins' | 'diamonds' | 'badge'>('real_world');
  const [newPrizeCoinAmount, setNewPrizeCoinAmount] = useState<number>(100);
  const [newPrizeDesc, setNewPrizeDesc] = useState('');
  const [newPrizeChancePercent, setNewPrizeChancePercent] = useState<number>(25);
  const [newPrizeDiamondAmount, setNewPrizeDiamondAmount] = useState<number>(10);
  const [inspectingStudent, setInspectingStudent] = useState<UserProfile | null>(null);

  // Editable Tier Diamond Prices
  const [editBronzeCost, setEditBronzeCost] = useState(boxPrices.bronze);
  const [editPlatinumCost, setEditPlatinumCost] = useState(boxPrices.platinum);
  const [editGoldCost, setEditGoldCost] = useState(boxPrices.gold);
  const [pricesSavedNotice, setPricesSavedNotice] = useState(false);

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrizeTitle.trim()) return;
    MysteryBoxService.addPrize({
      title: newPrizeTitle.trim(),
      tier: newPrizeTier,
      type: newPrizeType,
      chancePercent: Math.max(1, Math.min(100, Number(newPrizeChancePercent) || 20)),
      coinAmount: newPrizeType === 'coins' ? Number(newPrizeCoinAmount) || 100 : undefined,
      description: newPrizeDesc.trim() || (newPrizeType === 'coins' ? `+${newPrizeCoinAmount} Coins` : 'Show to teacher to redeem'),
      icon: newPrizeType === 'coins' ? '🪙' : newPrizeTier === 'gold' ? '👑' : newPrizeTier === 'platinum' ? '💿' : '🍬',
    });
    setPrizesList(MysteryBoxService.getPrizes());
    setNewPrizeTitle('');
    setNewPrizeDesc('');
    soundService.playSuccess();
  };

  const handleDeletePrize = (id: string) => {
    MysteryBoxService.deletePrize(id);
    setPrizesList(MysteryBoxService.getPrizes());
    soundService.playClick();
  };

  const [editingPrize, setEditingPrize] = useState<MysteryBoxPrize | null>(null);

  const handleSaveEditPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize || !editingPrize.title.trim()) return;
    MysteryBoxService.updatePrize(editingPrize.id, {
      title: editingPrize.title.trim(),
      tier: editingPrize.tier,
      type: editingPrize.type,
      chancePercent: Math.max(1, Math.min(100, Number(editingPrize.chancePercent) || 20)),
      coinAmount: editingPrize.type === 'coins' ? Number(editingPrize.coinAmount) || 100 : undefined,
      description: editingPrize.description.trim(),
      icon: editingPrize.type === 'coins' ? '🪙' : editingPrize.tier === 'gold' ? '👑' : editingPrize.tier === 'platinum' ? '💿' : '🍬',
    });
    setPrizesList(MysteryBoxService.getPrizes());
    setEditingPrize(null);
    soundService.playSuccess();
  };

  const handleResetDefaultPrizes = () => {
    if (window.confirm('Reset prize vault to default starter prizes?')) {
      MysteryBoxService.resetToDefaults();
      setPrizesList(MysteryBoxService.getPrizes());
      soundService.playSuccess();
    }
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

  // Filter students (exclude admin)
  const students = allAccounts.filter(a => a.role !== 'admin');

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
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{isCloudConnected ? 'Supabase: Connected' : 'Supabase: Local Mode (Click to setup)'}</span>
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
                setPrizesList(MysteryBoxService.getPrizes());
                setShowPrizesModal(true);
              }}
              className="py-2.5 px-3.5 rounded-2xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-2 shadow-sm transition-all active:scale-95"
              title="Configure prizes inside Mystery Boxes"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Mystery Prizes</span>
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
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Students Enrolled</div>
          </div>
        </div>

        <div className="card-game p-4 bg-slate-900/80 border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalClassXp.toLocaleString()}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Class XP</div>
          </div>
        </div>

        <div className="card-game p-4 bg-slate-900/80 border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalClassCoins.toLocaleString()}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Coins Earned</div>
          </div>
        </div>

        <div className="card-game p-4 bg-slate-900/80 border-slate-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-black text-white truncate max-w-[120px]">
              {topStreakStudent ? `${topStreakStudent.name}` : 'N/A'}
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Top Streak ({topStreakStudent?.streakDays || 0}d)
            </div>
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
                <span className="text-amber-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> {profile.xp} XP
                </span>
                <span className="text-yellow-400">🪙 {profile.coins === 999999 ? '∞' : profile.coins}</span>
                <span className="text-cyan-400">💎 {profile.diamonds === 999999 ? '∞' : (profile.diamonds || 0)}</span>
                <span className="text-orange-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> {profile.streakDays}d Streak
                </span>
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

      {/* Student Roster Table / Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Student Roster & Accounts</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {students.length} students
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const choice = confirm('⚠️ Clean Slate Reset for ALL Students?\n\nThis will reset all students\' XP to 0, Coins to 20, Diamonds to 0, Streak to 1, and clear completed units and grammar records.\n\nClick OK to reset students (Teacher is preserved).');
                if (choice) {
                  await resetAllStudentsProgress(false);
                  alert('✅ All student progress successfully cleared and reset!');
                }
              }}
              className="py-1.5 px-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Reset all students to clean starting data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Students</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => {
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

                  {/* Progress chips (Read-only student achievements) */}
                  <div className="flex items-center gap-2 mt-2 text-[11px] font-bold">
                    <span className="text-amber-300 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> {student.xp} XP
                    </span>
                    <span className="text-yellow-400 flex items-center gap-0.5">
                      🪙 {student.coins}
                    </span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      💎 {student.diamonds || 0}
                    </span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {student.streakDays}d
                    </span>
                  </div>
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

              {/* Claimed Mystery Box Classroom Vouchers */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span>Claimed Mystery Box Classroom Rewards</span>
                  </h4>
                  <span className="text-xs font-bold text-amber-300">
                    {(inspectingStudent.claimedPrizes || []).length} Rewards
                  </span>
                </div>

                {(inspectingStudent.claimedPrizes || []).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Student has not won or claimed any Mystery Box rewards yet.</p>
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

      {/* ------------------------------------------------------------- */}
      {/* Mystery Box Prize Vault Modal (Admin: Add, Edit, Remove) */}
      {/* ------------------------------------------------------------- */}
      {showPrizesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="card-game p-6 max-w-2xl w-full space-y-5 border-2 border-amber-500/50 bg-slate-900 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
                  🎁
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Mystery Box Prize Vault</h3>
                  <p className="text-xs text-slate-400">Add, edit, or remove prizes for each Mystery Box tier</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrizesModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Filter Tabs by Tier */}
            <div className="flex items-center justify-between gap-2 shrink-0 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(['all', 'bronze', 'platinum', 'gold'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedPrizeTierTab(tier)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                      selectedPrizeTierTab === tier
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier === 'all' 
                      ? `All (${prizesList.length})` 
                      : tier === 'bronze' 
                      ? `🥉 Bronze 20💎 (${prizesList.filter(p => p.tier === 'bronze').length})`
                      : tier === 'platinum'
                      ? `💿 Platinum 50💎 (${prizesList.filter(p => p.tier === 'platinum').length})`
                      : `🥇 Gold 100💎 (${prizesList.filter(p => p.tier === 'gold').length})`}
                  </button>
                ))}
              </div>

              <button
                onClick={handleResetDefaultPrizes}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-300 underline shrink-0"
              >
                Reset Defaults
              </button>
            </div>

            {/* Scrollable Content: Add Form + Prize List */}
            <div className="overflow-y-auto space-y-4 pr-1 flex-1 scrollbar-none">
              
              {/* Form: Add New Prize */}
              <form onSubmit={handleAddPrize} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Prize to Mystery Box</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Prize Title *</label>
                    <input
                      type="text"
                      value={newPrizeTitle}
                      onChange={(e) => setNewPrizeTitle(e.target.value)}
                      placeholder="e.g. Free Homework Pass / Chocolate / +500 Coins"
                      required
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Box Tier *</label>
                    <select
                      value={newPrizeTier}
                      onChange={(e) => setNewPrizeTier(e.target.value as MysteryBoxTier)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none focus:border-amber-400"
                    >
                      <option value="bronze">🥉 Bronze (20 💎)</option>
                      <option value="platinum">💿 Platinum (50 💎)</option>
                      <option value="gold">🥇 Gold (100 💎)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Drop Chance (%) *</label>
                    <input
                      type="number"
                      value={newPrizeChancePercent}
                      onChange={(e) => setNewPrizeChancePercent(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                      min="1"
                      max="100"
                      required
                      placeholder="e.g. 25"
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-black text-amber-300 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Reward Type *</label>
                    <select
                      value={newPrizeType}
                      onChange={(e) => setNewPrizeType(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white outline-none focus:border-amber-400"
                    >
                      <option value="real_world">🎟️ Real-World Classroom Voucher</option>
                      <option value="coins">🪙 Bonus Coins (🪙)</option>
                      <option value="diamonds">💎 Bonus Diamonds (💎)</option>
                      <option value="badge">🏆 Leaderboard Honor Badge</option>
                    </select>
                  </div>

                  {newPrizeType === 'coins' ? (
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">Coins Amount</label>
                      <input
                        type="number"
                        value={newPrizeCoinAmount}
                        onChange={(e) => setNewPrizeCoinAmount(Number(e.target.value))}
                        min="10"
                        step="10"
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300 outline-none focus:border-amber-400"
                      />
                    </div>
                  ) : newPrizeType === 'diamonds' ? (
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">Diamonds Amount (💎)</label>
                      <input
                        type="number"
                        value={newPrizeDiamondAmount}
                        onChange={(e) => setNewPrizeDiamondAmount(Math.max(1, Number(e.target.value) || 1))}
                        min="1"
                        step="1"
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 outline-none focus:border-amber-400"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">Redemption Instruction</label>
                      <input
                        type="text"
                        value={newPrizeDesc}
                        onChange={(e) => setNewPrizeDesc(e.target.value)}
                        placeholder="e.g. Show this ticket to teacher to redeem in class"
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-game-emerald w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Prize to {newPrizeTier.toUpperCase()} Box</span>
                </button>
              </form>

              {/* Current Prizes in Vault */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 block">
                  Current Vault Prizes ({selectedPrizeTierTab === 'all' ? prizesList.length : prizesList.filter(p => p.tier === selectedPrizeTierTab).length}):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {prizesList
                    .filter(p => selectedPrizeTierTab === 'all' || p.tier === selectedPrizeTierTab)
                    .map(prize => (
                      <div
                        key={prize.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-2"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-2xl shrink-0">{prize.icon || '🎁'}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                                prize.tier === 'gold' ? 'bg-amber-500/20 text-amber-300' :
                                prize.tier === 'platinum' ? 'bg-cyan-500/20 text-cyan-300' :
                                'bg-amber-700/20 text-amber-400'
                              }`}>
                                {prize.tier} ({MYSTERY_BOX_PRICES[prize.tier]}💎)
                              </span>
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                🎯 {prize.chancePercent || 20}% Chance
                              </span>
                            </div>
                            <h5 className="font-extrabold text-xs text-white mt-1">{prize.title}</h5>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{prize.description}</p>
                          </div>
                        </div>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingPrize(prize)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                            title="Edit prize"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePrize(prize.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete prize"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800 shrink-0">
              <button
                onClick={() => setShowPrizesModal(false)}
                className="btn-game-primary py-2 px-5 text-xs font-bold"
              >
                Save & Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EDIT PRIZE MODAL (Admin) */}
      {/* ------------------------------------------------------------- */}
      {editingPrize && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="card-game p-6 max-w-md w-full space-y-4 border-2 border-cyan-500/60 bg-slate-900 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Edit Mystery Box Prize</h3>
              </div>
              <button
                onClick={() => setEditingPrize(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPrize} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Prize Title *</label>
                <input
                  type="text"
                  value={editingPrize.title}
                  onChange={e => setEditingPrize({ ...editingPrize, title: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Box Tier *</label>
                  <select
                    value={editingPrize.tier}
                    onChange={e => setEditingPrize({ ...editingPrize, tier: e.target.value as MysteryBoxTier })}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none focus:border-cyan-400"
                  >
                    <option value="bronze">🥉 Bronze (20 💎)</option>
                    <option value="platinum">💿 Platinum (50 💎)</option>
                    <option value="gold">🥇 Gold (100 💎)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Drop Chance (%) *</label>
                  <input
                    type="number"
                    value={editingPrize.chancePercent || 20}
                    onChange={e => setEditingPrize({ ...editingPrize, chancePercent: Math.max(1, Math.min(100, Number(e.target.value) || 1)) })}
                    min="1"
                    max="100"
                    required
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-black text-amber-300 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Reward Type *</label>
                  <select
                    value={editingPrize.type}
                    onChange={e => setEditingPrize({ ...editingPrize, type: e.target.value as any })}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none focus:border-cyan-400"
                  >
                    <option value="real_world">🎟️ Classroom Voucher</option>
                    <option value="coins">🪙 In-Game Coins</option>
                    <option value="badge">🏆 Honor Badge</option>
                  </select>
                </div>
              </div>

              {editingPrize.type === 'coins' ? (
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Coins Amount</label>
                  <input
                    type="number"
                    value={editingPrize.coinAmount || 100}
                    onChange={e => setEditingPrize({ ...editingPrize, coinAmount: Number(e.target.value) })}
                    min="10"
                    step="10"
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-amber-300 outline-none focus:border-cyan-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Redemption Instruction</label>
                  <input
                    type="text"
                    value={editingPrize.description}
                    onChange={e => setEditingPrize({ ...editingPrize, description: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-slate-300 outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPrize(null)}
                  className="btn-game-slate py-2 px-4 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-game-primary py-2 px-5 text-xs font-black shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
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
