import React from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { 
  BookOpen, 
  FileText, 
  Gift, 
  User, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { soundService } from '../../services/soundService';
import { QuickMoodBar } from '../character/QuickMoodBar';

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner (A1)',
  elementary: 'Elementary (A2)',
  pre_intermediate: 'Pre-Intermediate (B1)',
  intermediate: 'Intermediate (B2)',
  pre_ielts: 'Pre-IELTS',
  ielts: 'IELTS Mastery',
};

export const HomeScreen: React.FC = () => {
  const { 
    profile, 
    curriculumUnits, 
    activeUnitId, 
    setScreen,
    cycleCharacterMood,
    getUnitProgress,
  } = useGame();

  const currentUnit = (curriculumUnits && curriculumUnits.find(u => u.id === activeUnitId)) || (curriculumUnits && curriculumUnits[0]) || { id: 'u1', unitNumber: 1, title: 'Introduction', words: [] };
  const unitProg = getUnitProgress ? getUnitProgress(currentUnit.id) : {
    completedCount: 0,
    totalCount: currentUnit?.words?.length || 1,
    percent: 0,
    lastWordIndex: 0,
    nextWordIndex: 0,
    completedWordIds: []
  };

  const levelName = LEVEL_LABELS[profile?.levelId || 'beginner'] || 'Beginner (A1)';

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Hero Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-2 border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and Mood */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2">
              <div 
                onClick={cycleCharacterMood}
                className="p-3 rounded-3xl bg-slate-800/90 border-2 border-indigo-500/50 shadow-inner cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Kayfiyatni o'zgartirish uchun bosing"
              >
                <ModularCharacter config={profile?.character} size="md" animate={true} />
              </div>
              <QuickMoodBar size="sm" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ta’lim bosqichi: {levelName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Assalomu alaykum, {profile?.name || 'O‘quvchi'}! 👋
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md">
                Ingliz tili mashg‘ulotlarini davom ettiring: yangi so‘zlar, qoidalar va vazifalarni bajaring.
              </p>
            </div>
          </div>

          {/* Diamonds Balance Card */}
          <div 
            onClick={() => {
              soundService.playClick();
              setScreen('gifts');
            }}
            className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-cyan-500/40 text-center cursor-pointer hover:bg-slate-800 hover:border-cyan-400 active:scale-95 transition-all shadow-md w-full sm:w-auto"
            title="Sovg'alar bo'limini ochish"
          >
            <span className="text-xs font-bold text-slate-400 block mb-1">Mavjud Balans</span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">💎</span>
              <span className="text-3xl font-black text-cyan-300">
                {profile?.role === 'admin' ? 'Admin' : (profile?.diamonds || 0)}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-cyan-400/90 block mt-1">
              Sovg‘alarni ko‘rish →
            </span>
          </div>

        </div>
      </div>

      {/* 4 Primary Navigation Cards */}
      <div>
        <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <span>Asosiy Bo‘limlar</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* 1. O'RGANISH (LEARN) */}
          <div 
            onClick={() => {
              soundService.playClick();
              setScreen('learn');
            }}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer group shadow-lg hover:shadow-indigo-500/10 active:scale-98 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                  O‘rganish
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  So‘z kartochkalari (flashcards) va grammatika mavzulari, qoidalar va misollar.
                </p>
              </div>

              {/* Progress preview */}
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-300">
                  <span className="truncate max-w-[180px]">{currentUnit.title}</span>
                  <span className="text-indigo-400">{unitProg.percent}%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${unitProg.percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>Kartochkalarni ochish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. VAZIFALAR (HOMEWORK & EXAMS) */}
          <div 
            onClick={() => {
              soundService.playClick();
              setScreen('homework');
            }}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer group shadow-lg hover:shadow-cyan-500/10 active:scale-98 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  Vazifalar
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Uy vazifalari, audio topshiriqlar, rasmiy imtihonlar va o‘qituvchi baholari.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                <span>Topshirilgan vazifalarni tekshirish va baholarni ko‘rish.</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>Vazifalarga o‘tish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. SOVG'ALAR (GIFTS) */}
          <div 
            onClick={() => {
              soundService.playClick();
              setScreen('gifts');
            }}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-amber-500/60 transition-all cursor-pointer group shadow-lg hover:shadow-amber-500/10 active:scale-98 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                  Sovg‘alar
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Admin belgilagan sovg‘alar katalogi. Olmoslaringiz evaziga sovg‘a so‘rovini yuboring.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-amber-300 font-bold flex items-center justify-between">
                <span>Balansingiz:</span>
                <span className="text-cyan-300 font-black">💎 {profile?.role === 'admin' ? 'Admin' : (profile?.diamonds || 0)} olmos</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Sovg‘alarni tanlash</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. PROFIL (PROFILE & DRESSING) */}
          <div 
            onClick={() => {
              soundService.playClick();
              setScreen('profile');
            }}
            className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group shadow-lg hover:shadow-emerald-500/10 active:scale-98 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  Profil
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Shaxsiy ma'lumotlar, olmos balansi va tarixi, personajni bepul kiyintirish.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                <span>Barcha kiyimlar va aksessuarlar bepul tanlanadi.</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Profilni ochish</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};