import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ModularCharacter } from '../character/ModularCharacter';
import { soundService } from '../../services/soundService';
import { formatPresence } from '../../services/presenceService';
import { DEFAULT_CHARACTER } from '../../services/storageService';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Target, 
  Zap, 
  Award,
  Gift, 
  Sparkles, 
  Crown,
  CheckCircle2,
  Pencil,
  Check
} from 'lucide-react';

export const CompeteScreen: React.FC = () => {
  const { profile, allAccounts, achievements, levelNumber, updateOwnStats, setScreen, groups, currentStudentGroup } = useGame();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [leaderboardCategory, setLeaderboardCategory] = useState<'xp' | 'streak' | 'coins' | 'accuracy'>('xp');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>(() => profile.groupId || 'all');
  const [showTeacherEditModal, setShowTeacherEditModal] = useState(false);
  const [editXpVal, setEditXpVal] = useState(profile.xp || 0);
  const [editStreakVal, setEditStreakVal] = useState(profile.streakDays || 1);
  const [editCoinsVal, setEditCoinsVal] = useState(profile.coins || 100);

  // Build leaderboard with accounts (group isolated so students do not mix!)
  const rawList = [...allAccounts];
  if (!rawList.some(s => s.id === profile.id)) {
    rawList.push(profile);
  }

  const seenIds = new Set<string>();
  const seenUsernames = new Set<string>();
  const uniqueList = [];

  if (profile) {
    seenIds.add(profile.id);
    if (profile.username) seenUsernames.add(profile.username.toLowerCase().trim());
    uniqueList.push(profile);
  }

  for (const acc of rawList) {
    const normUser = (acc.username || '').toLowerCase().trim();
    if (seenIds.has(acc.id)) continue;
    if (normUser && seenUsernames.has(normUser)) continue;

    seenIds.add(acc.id);
    if (normUser) seenUsernames.add(normUser);
    uniqueList.push(acc);
  }

  // Filter by selected group so students in different groups do not mix
  const filteredList = uniqueList.filter(student => {
    if (selectedGroupFilter === 'all') return true;
    if (student.role === 'admin') return true; // Teacher remains visible to motivate students
    return student.groupId === selectedGroupFilter;
  });

  const fullList = filteredList.map(student => {
    const isCurrent = student.id === profile.id;
    const currentCharacter = isCurrent ? profile.character : student.character;
    const currentXp = isCurrent ? profile.xp : student.xp;
    const currentStreak = isCurrent ? profile.streakDays : student.streakDays;
    const currentCoins = isCurrent ? profile.coins : student.coins;
    
    // Dynamic accuracy based on mistake count
    const mistakeCount = (isCurrent ? profile.mistakes : student.mistakes)?.length || 0;
    const accuracy = Math.max(75, Math.min(100, 100 - mistakeCount * 2));

    return {
      id: student.id,
      name: student.name || 'Student',
      character: currentCharacter,
      score: currentXp,
      streak: currentStreak,
      coins: currentCoins,
      accuracy,
      isCurrentUser: isCurrent,
      lastSeenAt: isCurrent ? profile.lastSeenAt : student.lastSeenAt,
      isOnline: isCurrent ? true : student.isOnline,
      rank: 1,
    };
  }).sort((a, b) => {
    if (leaderboardCategory === 'xp') return b.score - a.score;
    if (leaderboardCategory === 'streak') return b.streak - a.streak;
    if (leaderboardCategory === 'coins') return b.coins - a.coins;
    return b.accuracy - a.accuracy;
  }).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const renderPodiumStat = (entry: typeof fullList[0]) => {
    if (leaderboardCategory === 'streak') {
      return (
        <span className="text-xs font-black text-orange-400 flex items-center gap-1 justify-center">
          <Flame className="w-3.5 h-3.5 fill-orange-400" />
          <span>{entry.streak} Days</span>
        </span>
      );
    }
    if (leaderboardCategory === 'coins') {
      return (
        <span className="text-xs font-black text-amber-300 flex items-center gap-1 justify-center">
          <span>🪙</span>
          <span>{entry.coins} Coins</span>
        </span>
      );
    }
    if (leaderboardCategory === 'accuracy') {
      return (
        <span className="text-xs font-black text-emerald-400 flex items-center gap-1 justify-center">
          <Target className="w-3.5 h-3.5" />
          <span>{entry.accuracy}% Accuracy</span>
        </span>
      );
    }
    return (
      <span className="text-xs font-black text-indigo-300 flex items-center gap-1 justify-center">
        <Zap className="w-3.5 h-3.5 fill-indigo-400" />
        <span>{entry.score} XP</span>
      </span>
    );
  };

  const top1 = fullList.find(e => e.rank === 1);
  const top2 = fullList.find(e => e.rank === 2);
  const top3 = fullList.find(e => e.rank === 3);

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
            CHAMPIONS ARENA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Compete & Achieve
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Friendly competition to motivate daily progress. Multiple ways to earn top honors!
          </p>
        </div>

        {/* Teacher Secret Controls & Tab switch */}
        <div className="flex items-center gap-2">
          {profile.role === 'admin' && (
            <button
              onClick={() => {
                setEditXpVal(profile.xp || 0);
                setEditStreakVal(profile.streakDays || 1);
                setEditCoinsVal(profile.coins || 100);
                setShowTeacherEditModal(true);
              }}
              className="px-3 py-2 rounded-2xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Discreet Teacher Stats: Adjust your XP & Streak for the leaderboard"
            >
              <Pencil className="w-3.5 h-3.5 text-indigo-400" />
              <span>Edit My Stats</span>
            </button>
          )}

          {/* Tab switch: Leaderboard vs Achievements vs Mystery Box */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-2xl border border-slate-700">
          <button
            onClick={() => { soundService.playClick(); setActiveTab('leaderboard'); }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => { soundService.playClick(); setActiveTab('achievements'); }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'achievements'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Achievements</span>
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              setScreen('mystery');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border border-amber-300 shadow-glow-gold hover:scale-105 active:scale-95"
            title="Open Mystery Box Prize Wheels"
          >
            <Gift className="w-3.5 h-3.5 text-slate-950" />
            <span>🎁 Mystery Box</span>
          </button>
        </div>
        </div>
      </div>

      {/* 1. LEADERBOARD VIEW */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-5 animate-in fade-in duration-200">

          {/* Group Filter Switcher (Group Isolation) */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                👥 Group Arena:
              </span>
              <span className="text-xs text-slate-300 font-bold">
                {selectedGroupFilter === 'all' 
                  ? 'All School Champions' 
                  : (groups.find(g => g.id === selectedGroupFilter)?.name || 'Class Group')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {currentStudentGroup && (
                <button
                  onClick={() => {
                    soundService.playClick();
                    setSelectedGroupFilter(currentStudentGroup.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap ${
                    selectedGroupFilter === currentStudentGroup.id
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  My Group ({currentStudentGroup.name})
                </button>
              )}

              {groups.map(g => {
                if (currentStudentGroup && g.id === currentStudentGroup.id) return null;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedGroupFilter(g.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                      selectedGroupFilter === g.id
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.name}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  soundService.playClick();
                  setSelectedGroupFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  selectedGroupFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Students
              </button>
            </div>
          </div>
          
          {/* Category Filter Pills (XP, Streak, Coins, Accuracy) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => { soundService.playClick(); setLeaderboardCategory('xp'); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all border-2 ${
                leaderboardCategory === 'xp'
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-game-btn'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>🥇 XP Champions</span>
            </button>

            <button
              onClick={() => { soundService.playClick(); setLeaderboardCategory('streak'); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all border-2 ${
                leaderboardCategory === 'streak'
                  ? 'bg-orange-600 border-orange-400 text-white shadow-game-btn'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>🔥 Streak Masters</span>
            </button>

            <button
              onClick={() => { soundService.playClick(); setLeaderboardCategory('coins'); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all border-2 ${
                leaderboardCategory === 'coins'
                  ? 'bg-amber-600 border-amber-400 text-white shadow-game-btn'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>🪙 Coin Tycoons</span>
            </button>

            <button
              onClick={() => { soundService.playClick(); setLeaderboardCategory('accuracy'); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all border-2 ${
                leaderboardCategory === 'accuracy'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-game-btn'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>🎯 Sharpshooters</span>
            </button>
          </div>

          {/* Visual Top 3 Olympic Champions Podium */}
          {top1 && (
            <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-indigo-500/30 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 inline-flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>CLASSROOM TOP CONTENDERS</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {leaderboardCategory === 'xp' ? 'XP Champions Podium' : leaderboardCategory === 'streak' ? 'Streak Masters Podium' : leaderboardCategory === 'coins' ? 'Coin Tycoons Podium' : 'Accuracy Sharpshooters Podium'}
                </h3>
              </div>

              {/* 3-Pillar Olympic Stage */}
              <div className="flex items-end justify-center gap-2.5 sm:gap-6 pt-4 pb-1 max-w-xl mx-auto">
                {/* 2nd Place (Left) */}
                {top2 && (
                  <div className="flex flex-col items-center text-center space-y-1.5 flex-1 min-w-[75px] max-w-[110px] sm:max-w-[180px]">
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-slate-300 shadow-md overflow-hidden flex items-center justify-center">
                        <ModularCharacter config={top2.character} size={110} animate={false} />
                      </div>
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-300 text-slate-950 font-black text-[11px] shadow-md whitespace-nowrap">
                        🥈 2nd Place
                      </div>
                    </div>
                    <div className="pt-2">
                      <h5 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[130px]">{top2.name}</h5>
                      <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-300/20 text-slate-200 border border-slate-400/30">
                          LVL {Math.floor(Math.sqrt((top2.score || 0) / 40)) + 1}
                        </span>
                        {renderPodiumStat(top2)}
                      </div>
                    </div>
                    {/* 2nd Pillar block */}
                    <div className="w-full h-12 sm:h-20 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700/80 border border-slate-600 flex items-center justify-center text-slate-300 font-black text-xl sm:text-2xl shadow-md">
                      2
                    </div>
                  </div>
                )}

                {/* 1st Place (Center - Majestic & Giant) */}
                <div className="flex flex-col items-center text-center space-y-1.5 flex-1 min-w-[90px] max-w-[130px] sm:max-w-[210px] z-10">
                  <div className="relative">
                    <Crown className="w-8 h-8 text-amber-400 mx-auto animate-bounce filter drop-shadow-lg" />
                    <div className="w-18 h-18 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl bg-slate-900 border-2 sm:border-4 border-amber-400 shadow-glow-gold overflow-hidden flex items-center justify-center">
                      <ModularCharacter config={top1.character} size={150} animate={true} />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-glow-gold whitespace-nowrap">
                      🥇 CHAMPION
                    </div>
                  </div>
                  <div className="pt-3">
                    <h5 className="text-sm sm:text-base font-black text-amber-300 truncate max-w-[150px]">{top1.name}</h5>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-sm">
                        LVL {Math.floor(Math.sqrt((top1.score || 0) / 40)) + 1}
                      </span>
                      {renderPodiumStat(top1)}
                    </div>
                  </div>
                  {/* 1st Tall Gold Pillar */}
                  <div className="w-full h-16 sm:h-32 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-amber-700/40 via-amber-500/30 to-amber-500/50 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-2xl sm:text-4xl shadow-glow-gold">
                    1
                  </div>
                </div>

                {/* 3rd Place (Right) */}
                {top3 && (
                  <div className="flex flex-col items-center text-center space-y-1.5 flex-1 min-w-[75px] max-w-[110px] sm:max-w-[180px]">
                    <div className="relative">
                      <div className="w-14 h-14 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-amber-700 shadow-md overflow-hidden flex items-center justify-center">
                        <ModularCharacter config={top3.character} size={110} animate={false} />
                      </div>
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-800 text-amber-200 font-black text-[11px] shadow-md whitespace-nowrap">
                        🥉 3rd Place
                      </div>
                    </div>
                    <div className="pt-2">
                      <h5 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[130px]">{top3.name}</h5>
                      <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-800/20 text-amber-300 border border-amber-800/40">
                          LVL {Math.floor(Math.sqrt((top3.score || 0) / 40)) + 1}
                        </span>
                        {renderPodiumStat(top3)}
                      </div>
                    </div>
                    {/* 3rd Pillar block */}
                    <div className="w-full h-9 sm:h-16 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-t from-slate-900 to-amber-950/40 border border-amber-900/60 flex items-center justify-center text-amber-600 font-black text-lg sm:text-2xl shadow-md">
                      3
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leaderboard Table / Cards */}
          <div className="card-game p-4 sm:p-6 divide-y divide-slate-800 space-y-3">

            {fullList.map((entry) => {
              const isTop1 = entry.rank === 1;
              const isTop2 = entry.rank === 2;
              const isTop3 = entry.rank === 3;
              const isYou = entry.isCurrentUser;
              const entryLevel = Math.floor(Math.sqrt((entry.score || 0) / 40)) + 1;

              let rankBadge = (
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 text-sm shrink-0">
                  #{entry.rank}
                </div>
              );

              if (isTop1) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center font-black text-amber-400 text-sm shadow-glow-gold shrink-0">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                );
              } else if (isTop2) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-xl bg-slate-300/20 border-2 border-slate-400 flex items-center justify-center font-black text-slate-200 text-sm shrink-0">
                    2
                  </div>
                );
              } else if (isTop3) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-xl bg-amber-800/20 border-2 border-amber-700 flex items-center justify-center font-black text-amber-600 text-sm shrink-0">
                    3
                  </div>
                );
              }

              return (
                <div
                  key={entry.id}
                  className={`pt-3 first:pt-0 flex items-center justify-between gap-3 p-3 rounded-2xl transition-all ${
                    isYou
                      ? 'bg-indigo-950/60 border-2 border-indigo-500 shadow-glow-primary'
                      : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {rankBadge}

                    {/* Character Avatar (Bigger Ratio) */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                      <ModularCharacter config={entry.character || DEFAULT_CHARACTER} size={80} animate={false} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-white">
                          {entry.name}
                        </h4>
                        {isYou && (
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                            YOU
                          </span>
                        )}
                        {(() => {
                          const presence = formatPresence(entry.lastSeenAt, entry.isOnline);
                          return (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                              presence.isOnline
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm'
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${presence.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                              <span>{presence.shortLabel}</span>
                            </span>
                          );
                        })()}
                      </div>
                      <span className="text-xs text-slate-400 capitalize">
                        {(entry.character?.gender || 'man') === 'man' ? '👦 Adventurer' : '👧 Explorer'}
                      </span>
                    </div>
                  </div>

                  {/* Stat Value: Showing BOTH Level and Active Category Metric */}
                  <div className="text-right flex items-center justify-end gap-2.5">
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 whitespace-nowrap shadow-sm">
                      LVL {entryLevel}
                    </span>
                    <div className="min-w-[65px]">
                      {leaderboardCategory === 'streak' ? (
                        <>
                          <span className="text-base sm:text-lg font-black text-orange-400 block leading-tight">
                            {entry.streak}
                          </span>
                          <span className="text-[10px] text-orange-500 font-bold uppercase">Days 🔥</span>
                        </>
                      ) : leaderboardCategory === 'coins' ? (
                        <>
                          <span className="text-base sm:text-lg font-black text-amber-300 block leading-tight">
                            {entry.coins}
                          </span>
                          <span className="text-[10px] text-amber-500 font-bold uppercase">Coins 🪙</span>
                        </>
                      ) : leaderboardCategory === 'accuracy' ? (
                        <>
                          <span className="text-base sm:text-lg font-black text-emerald-400 block leading-tight">
                            {entry.accuracy}%
                          </span>
                          <span className="text-[10px] text-emerald-500 font-bold uppercase">Accuracy 🎯</span>
                        </>
                      ) : (
                        <>
                          <span className="text-base sm:text-lg font-black text-indigo-300 block leading-tight">
                            {entry.score}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-bold uppercase">XP ⚡</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}


          </div>

        </div>
      )}

      {/* 2. ACHIEVEMENTS VIEW */}
      {activeTab === 'achievements' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map(ach => {
              const progressPercent = Math.min(100, Math.round((ach.currentProgress / ach.maxProgress) * 100));

              return (
                <div
                  key={ach.id}
                  className={`card-game p-5 flex flex-col justify-between border-2 transition-all ${
                    ach.isUnlocked
                      ? 'border-emerald-500/50 bg-emerald-950/20'
                      : 'border-slate-700/80 bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shrink-0">
                      {ach.icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white">{ach.title}</h3>
                        {ach.isUnlocked && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{ach.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400">
                        {ach.currentProgress} / {ach.maxProgress}
                      </span>
                      <div className="flex items-center gap-2 text-amber-300">
                        <span>🪙 +{ach.rewardCoins}</span>
                        <span>•</span>
                        <span className="text-indigo-400">⚡ +{ach.rewardXp} XP</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          ach.isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Discreet Teacher Stats Modal (Admin Only) */}
      {showTeacherEditModal && profile.role === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <div>
                  <h3 className="font-black text-base text-white">Teacher Stats Control</h3>
                  <p className="text-xs text-slate-400">Discreetly update your competition stats</p>
                </div>
              </div>
              <button
                onClick={() => setShowTeacherEditModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Set My XP Score:</label>
                <input
                  type="number"
                  value={editXpVal}
                  onChange={e => setEditXpVal(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  step="50"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-black text-sm text-indigo-300 outline-none focus:border-indigo-400"
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  {[
                    { label: '+100', val: editXpVal + 100 },
                    { label: '+500', val: editXpVal + 500 },
                    { label: '+1000', val: editXpVal + 1000 },
                  ].map(chip => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setEditXpVal(chip.val)}
                      className="py-1 px-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-700"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Daily Streak (Days):</label>
                <input
                  type="number"
                  value={editStreakVal}
                  onChange={e => setEditStreakVal(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-black text-sm text-orange-400 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Coins:</label>
                <input
                  type="number"
                  value={editCoinsVal}
                  onChange={e => setEditCoinsVal(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-black text-sm text-amber-300 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowTeacherEditModal(false)}
                className="btn-game-slate py-2 px-3 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOwnStats({ xp: editXpVal, streakDays: editStreakVal, coins: editCoinsVal });
                  setShowTeacherEditModal(false);
                }}
                className="btn-game-primary py-2 px-4 text-xs font-black flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Leaderboard Stats</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
