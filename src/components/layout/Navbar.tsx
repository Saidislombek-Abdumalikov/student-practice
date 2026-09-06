import React from 'react';
import { useGame } from '../../context/GameContext';
import { AppScreen } from '../../types';
import { 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  ShoppingBag, 
  Gift, 
  User, 
  Home, 
  Sparkles, 
  ShieldCheck, 
  Users,
  FileText
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface NavItem {
  id: AppScreen;
  label: string;
  mobileLabel: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { profile, currentScreen, setScreen } = useGame();

  // Phone mode: Only Home and Homework (Compete, Play, Learn, Shop, Profile accessed via Home screen)
  const mobileNavItems: NavItem[] = [
    { id: 'home', label: 'HOME', mobileLabel: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'homework', label: 'HOMEWORK', mobileLabel: 'Homework', icon: <FileText className="w-5 h-5 text-cyan-400" /> },
    ...(profile.role === 'admin' ? [{ id: 'admin' as AppScreen, label: 'ADMIN', mobileLabel: 'Admin', icon: <ShieldCheck className="w-5 h-5 text-amber-400" /> }] : []),
    ...(profile.role === 'support' ? [{ id: 'support' as AppScreen, label: 'STUDENTS', mobileLabel: 'Students', icon: <Users className="w-5 h-5 text-purple-400" /> }] : []),
  ];

  // Full Desktop Sidebar Navigation
  const desktopNavItems: NavItem[] = [
    { id: 'home', label: 'HOME', mobileLabel: 'Home', icon: <Home className="w-5 h-5" /> },
    ...(profile.role === 'admin' ? [{ id: 'admin' as AppScreen, label: 'ADMIN CENTER', mobileLabel: 'Admin', icon: <ShieldCheck className="w-5 h-5 text-amber-400" /> }] : []),
    ...(profile.role === 'support' ? [{ id: 'support' as AppScreen, label: 'STUDENT SUPPORT', mobileLabel: 'Students', icon: <Users className="w-5 h-5 text-purple-400" /> }] : []),
    { id: 'learn', label: 'LEARN (VOCAB & GRAMMAR)', mobileLabel: 'Learn', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'homework', label: 'HOMEWORK & VOICE', mobileLabel: 'Homework', icon: <FileText className="w-5 h-5 text-cyan-400" /> },
    { id: 'play', label: 'PLAY ARENA', mobileLabel: 'Play', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'compete', label: 'COMPETE & DUELS', mobileLabel: 'Compete', icon: <Trophy className="w-5 h-5" /> },
    { id: 'mystery', label: 'MYSTERY BOX', mobileLabel: 'Box 🎁', icon: <Gift className="w-5 h-5 text-amber-400 animate-pulse" /> },
    { id: 'shop', label: 'SHOP & DRESSING', mobileLabel: 'Shop', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'profile', label: 'PROFILE STUDIO', mobileLabel: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  const handleNav = (screen: AppScreen) => {
    soundService.playClick();
    setScreen(screen);
  };

  const isTabActive = (itemId: AppScreen) => {
    if (currentScreen === itemId) return true;
    if (itemId === 'learn' && (
      currentScreen === 'flashcards' || 
      currentScreen === 'practice' || 
      currentScreen === 'mistakes' ||
      currentScreen === 'grammar' ||
      currentScreen === 'grammar_topic'
    )) return true;
    if (itemId === 'play' && currentScreen === 'game_active') return true;
    return false;
  };

  return (
    <>
      {/* Mobile Bottom Dock (Evenly spaced, fits all phones perfectly without overflow) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 border-t border-slate-800/90 backdrop-blur-xl px-1.5 py-1.5 safe-area-pb shadow-2xl">
        <div className="flex items-center justify-around w-full max-w-md mx-auto">
          {mobileNavItems.map(item => {
            const isActive = isTabActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'text-indigo-400 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all [&>svg]:w-5 [&>svg]:h-5 ${
                  isActive ? 'bg-indigo-600/30 text-indigo-400 shadow-glow-primary scale-110' : ''
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] tracking-tight mt-0.5 whitespace-nowrap leading-none text-center ${isActive ? 'font-black text-indigo-300' : 'font-semibold'}`}>
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Floating Sidebar Nav (On md+ screens) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-slate-900/90 border-r border-slate-800/80 p-4 space-y-2 backdrop-blur-md z-30 overflow-y-auto scrollbar-thin">
        <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-3 py-2">
          Navigation
        </div>
        {desktopNavItems.map(item => {
          const isActive = isTabActive(item.id);

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
