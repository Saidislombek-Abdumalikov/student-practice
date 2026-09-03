import React from 'react';
import { useGame } from '../../context/GameContext';
import { AppScreen } from '../../types';
import { BookOpen, Gamepad2, Trophy, ShoppingBag, Gift, User, Home, Sparkles, ShieldCheck } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface NavItem {
  id: AppScreen;
  label: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { profile, currentScreen, setScreen } = useGame();

  const navItems: NavItem[] = [
    { id: 'home', label: 'HOME', icon: <Home className="w-5 h-5" /> },
    ...(profile.role === 'admin' ? [{ id: 'admin' as AppScreen, label: 'ADMIN', icon: <ShieldCheck className="w-5 h-5 text-amber-400" /> }] : []),
    { id: 'grammar', label: 'GRAMMAR', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'learn', label: 'VOCABULARY', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'play', label: 'PLAY', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'compete', label: 'COMPETE', icon: <Trophy className="w-5 h-5" /> },
    { id: 'shop', label: 'SHOP', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'mystery', label: 'MYSTERY BOX', icon: <Gift className="w-5 h-5 text-amber-400" /> },
    { id: 'profile', label: 'PROFILE', icon: <User className="w-5 h-5" /> },
  ];

  const handleNav = (screen: AppScreen) => {
    soundService.playClick();
    setScreen(screen);
  };

  return (
    <>
      {/* Mobile Bottom Dock (Fixed at bottom on screens < md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-xl px-1 py-1.5 safe-area-pb shadow-2xl">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map(item => {
            const isActive = currentScreen === item.id || 
              (item.id === 'learn' && (currentScreen === 'flashcards' || currentScreen === 'practice' || currentScreen === 'mistakes')) ||
              (item.id === 'play' && currentScreen === 'game_active');

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'text-indigo-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all [&>svg]:w-4 [&>svg]:h-4 ${
                  isActive ? 'bg-indigo-600/30 text-indigo-400 shadow-glow-primary scale-110' : ''
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] tracking-tight mt-0.5 ${isActive ? 'font-black text-indigo-300' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Floating / Sidebar Nav (On md+ screens) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-slate-900/70 border-r border-slate-800/80 p-4 space-y-2 backdrop-blur-md z-30">
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
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-150 text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-game-btn'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={isActive ? 'text-white' : 'text-indigo-400'}>
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
