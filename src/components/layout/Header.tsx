import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { soundService } from '../../services/soundService';
import { Volume2, VolumeX, Flame, Coins, Zap, ShieldCheck, Users } from 'lucide-react';

const moodEmojis: Record<string, string> = {
  happy: '😄',
  victory: '😎',
  thinking: '🤔',
  idle: '🙂',
  oops: '😮',
};

export const Header: React.FC = () => {
  const { 
    profile, 
    levelNumber, 
    xpProgressPercent, 
    currentLevelXp, 
    nextLevelThresholdXp,
    toggleSound,
    setScreen,
    cycleCharacterMood,
    tradeDiamondsForCoins,
    logout,
  } = useGame();

  const [showTradeModal, setShowTradeModal] = useState(false);
  const currentMoodEmoji = moodEmojis[profile.character.expression || 'idle'] || '🙂';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 border-b border-slate-800/90 backdrop-blur-md px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Brand & Player Level */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Modular Mini Avatar with 1-Tap Mood Cycle */}
            <div 
              onClick={cycleCharacterMood} 
              className="relative w-10 h-10 rounded-2xl bg-slate-800 border-2 border-indigo-500/60 overflow-hidden flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer group"
              title="Tap avatar to change mood!"
            >
              <ModularCharacter config={profile.character} size="sm" animate={false} />
              <div className="absolute -bottom-0.5 -right-0.5 bg-slate-900/90 text-[10px] leading-none px-1 py-0.5 rounded-full border border-indigo-500/40 shadow">
                {currentMoodEmoji}
              </div>
            </div>

            <div 
              onClick={() => setScreen('profile')} 
              className="cursor-pointer group"
              title="View Profile"
            >

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400">LVL</span>
                <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/30">
                  {levelNumber}
                </span>
                <span className="text-sm font-bold text-white max-w-[120px] truncate">
                  {profile.name || 'Hero'}
                </span>
              </div>

              {/* XP Mini Bar */}
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1 border border-slate-700/60">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Center: XP Bar (Visible on medium+ screens) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
          <div className="text-xs font-bold text-slate-300">
            <span>{profile.xp}</span>
            <span className="text-slate-500"> XP</span>
          </div>
          <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/60 ml-1">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Streak, Coins & Sound Toggle */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Streak Badge */}
          <div 
            className="shrink-0 flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-extrabold text-xs shadow-sm"
            title="Daily Practice Streak"
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-flame-wobble" />
            <span>{profile.streakDays}</span>
          </div>

          {/* Coins Badge */}
          <div 
            onClick={() => setScreen('shop')}
            className="shrink-0 flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-xs shadow-sm cursor-pointer hover:bg-amber-500/25 transition-colors"
            title={profile.role === 'admin' ? 'Admin: Infinite Coins 🪙' : 'Coins Balance (Click to open Shop)'}
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span className={profile.role === 'admin' ? 'text-lg leading-none font-black' : ''}>
              {profile.role === 'admin' ? '∞' : profile.coins}
            </span>
          </div>

          {/* Diamonds Badge */}
          <div 
            onClick={() => {
              soundService.playClick();
              setScreen('mystery');
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 font-extrabold text-xs sm:text-sm shadow-sm cursor-pointer hover:bg-cyan-500/25 transition-colors"
            title="Diamonds (Click to open Mystery Box 🎁)"
          >
            <span className="text-sm">💎</span>
            <span className={profile.role === 'admin' ? 'text-lg leading-none font-black' : ''}>
              {profile.role === 'admin' ? '∞' : (profile.diamonds || 0)}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-2xl bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={profile.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Admin Dashboard Quick Nav (if admin) */}
          {profile.role === 'admin' && (
            <button
              onClick={() => setScreen('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs shadow-sm hover:border-amber-400 transition-all active:scale-95"
              title="Open Teacher & Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* Switch User / Log In */}
          <button
            onClick={logout}
            className="shrink-0 flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-xs font-bold"
            title="Switch Student or Admin Account"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Switch</span>
          </button>
        </div>

      </div>

      {/* Diamond Trade Modal (Students Only) */}
      {showTradeModal && profile.role !== 'admin' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="card-game p-6 max-w-sm w-full border-2 border-cyan-500/40 bg-slate-900 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-glow-primary">
              💎
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Diamond Exchange</h3>
              <p className="text-xs text-slate-400 mt-1">
                Trade your peer match victory diamonds into coins!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-around text-center">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Your Diamonds</span>
                <span className="text-xl font-black text-cyan-400">💎 {profile.diamonds || 0}</span>
              </div>
              <div className="text-slate-500 text-lg font-bold">➡️</div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Rate</span>
                <span className="text-base font-black text-amber-300">1 💎 = 5 🪙</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  const success = tradeDiamondsForCoins(1);
                  if (success) {
                    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                  }
                }}
                disabled={(profile.diamonds || 0) < 1}
                className="btn-game-gold w-full py-3 px-4 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>Trade 1 💎 for +5 🪙 Coins</span>
              </button>

              {(profile.diamonds || 0) > 1 && (
                <button
                  onClick={() => {
                    const count = profile.diamonds || 0;
                    const success = tradeDiamondsForCoins(count);
                    if (success) {
                      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                    }
                  }}
                  className="btn-game-primary w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>Trade ALL {profile.diamonds} 💎 (+{(profile.diamonds || 0) * 5} 🪙)</span>
                </button>
              )}

              {(profile.diamonds || 0) === 0 && (
                <p className="text-xs text-slate-400 italic">
                  Play with a group mate in the Play tab to win diamonds!
                </p>
              )}

              <button
                onClick={() => {
                  setShowTradeModal(false);
                  setScreen('mystery');
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>🎁 Open Mystery Boxes (20💎 / 50💎 / 100💎)</span>
              </button>

              <button
                onClick={() => setShowTradeModal(false)}
                className="btn-game-slate w-full py-2 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
