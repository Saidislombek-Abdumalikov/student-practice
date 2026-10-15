import React from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { soundService } from '../../services/soundService';
import { Volume2, VolumeX, ShieldCheck, LogOut } from 'lucide-react';

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner (A1)',
  elementary: 'Elementary (A2)',
  pre_intermediate: 'Pre-Intermediate (B1)',
  intermediate: 'Intermediate (B2)',
  pre_ielts: 'Pre-IELTS',
  ielts: 'IELTS Mastery',
};

export const Header: React.FC = () => {
  const { 
    profile, 
    toggleSound,
    setScreen,
    cycleCharacterMood,
    logout,
  } = useGame();

  const levelName = LEVEL_LABELS[profile?.levelId || 'beginner'] || 'Beginner';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 w-full bg-slate-900/95 border-b border-slate-800/90 backdrop-blur-xl px-4 py-2.5 sm:px-6 shadow-md flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        
        {/* Left: Avatar, Name & Educational Level */}
        <div 
          onClick={() => { soundService.playClick(); setScreen('profile'); }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          title="Profilni ko‘rish"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-800 border-2 border-indigo-500/60 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-sm shrink-0">
            <ModularCharacter config={profile?.character} size="sm" animate={false} />
          </div>

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black text-white max-w-[120px] sm:max-w-[180px] truncate">
              {profile?.name || 'O‘quvchi'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-indigo-400">
              {levelName}
            </span>
          </div>
        </div>

        {/* Right: Diamonds Balance, Sound & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Diamonds Balance Pill (Clicking goes to Sovg'alar) */}
          <button 
            onClick={() => {
              soundService.playClick();
              setScreen('gifts');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-black text-xs sm:text-sm shadow-sm hover:bg-cyan-500/25 active:scale-95 transition-all"
            title="Olmos balansi — Sovg'alar bo'limiga o'tish"
          >
            <span className="text-base leading-none">💎</span>
            <span>{profile?.role === 'admin' ? 'Admin' : (profile?.diamonds || 0)}</span>
            <span className="hidden sm:inline text-[11px] font-semibold text-cyan-400">olmos</span>
          </button>

          {/* Admin panel shortcut (only for admin) */}
          {profile?.role === 'admin' && (
            <button
              onClick={() => { soundService.playClick(); setScreen('admin'); }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-500/25 transition-all"
              title="Admin Panel"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-2xl bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={profile?.soundEnabled ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
          >
            {profile?.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
