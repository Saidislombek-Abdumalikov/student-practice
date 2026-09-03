import React from 'react';
import { useGame } from '../../context/GameContext';
import { AppScreen } from '../../types';
import { BookOpen, Gamepad2, Trophy, ShoppingBag, Gift, User, Home, Sparkles, ShieldCheck } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface NavItem {
  id: AppScreen;
  label: string;
  mobileLabel: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { profile, currentScreen, setScreen } = useGame();

  const navItems: NavItem[] = [
    { id: 'home', label: 'HOME', mobileLabel: 'Home', icon: <Home className="w-5 h-5" /> },
    ...(profile.role === 'admin' ? [{ id: 'admin' as AppScreen, label: 'ADMIN', mobileLabel: 'Admin', icon: <ShieldCheck className="w-5 h-5 text-amber-400" /> }] : []),
    { id: 'grammar', label: 'GRAMMAR', mobileLabel: 'Grammar', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'learn', label: 'VOCABULARY', mobileLabel: 'Vocab', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'play', label: 'PLAY', mobileLabel: 'Play', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'compete', label: 'COMPETE', mobileLabel: 'Compete', icon: <Trophy className="w-5 h-5" /> },
    { id: 'mystery', label: 'MYSTERY BOX', mobileLabel: 'Box 🎁', icon: <Gift className="w-5 h-5 text-amber-400 animate-pulse" /> },
    { id: 'shop', label: 'SHOP', mobileLabel: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'profile', label: 'PROFILE', mobileLabel: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const handleNav = (screen: AppScreen) => {
    soundService.playClick();
    setScreen(screen);
  };

  return (
    <>
      {/* Mobile Bottom Dock (100% visible, zero scroll, Profile permanently visible) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 border-t border-slate-800/90 backdrop-blur-xl px-1 py-1 safe-area-pb shadow-2xl">
        <div className="flex items-center justify-between w-full max-w-lg mx-auto">
          {navItems.map(item => {
            const isActive = currentScreen === item.id || 
              (item.id === 'learn' && (currentScreen === 'flashcards' || currentScreen === 'practice' || currentScreen === 'mistakes')) ||
              (item.id === 'play' && currentScreen === 'game_active');

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'text-indigo-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all [&>svg]:w-4 [&>svg]:h-4 ${
                  isActive ? 'bg-indigo-600/30 text-indigo-400 shadow-glow-primary scale-105' : ''
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[8px] tracking-tighter mt-0.5 truncate max-w-full leading-none text-center ${isActive ? 'font-black text-indigo-300' : 'font-medium'}`}>
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Floating / Sidebar Nav (On md+ screens) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-slate-900/90 border-r border-slate-800/80 p-4 space-y-2 backdrop-blur-md z-30 overflow-y-auto scrollbar-thin">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-3 py-2">
          Navigation
        </div>
        {navItems.map(item => {
          const isActive = currentScreen === item.id || 
            (item.id === 'learn' && (currentScreen === 'flashcards' || currentScreen === 'practice' || currentScreen === 'mistakes')) ||
            (item.id === 'play' && currentScreen === 'game_active');

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs transition-all duration-150 text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-game-btn border-2 border-indigo-400 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-indigo-700/50' : 'bg-slate-800'}`}>
                {item.icon}
              </div>
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </aside>
    </>
  );
};
