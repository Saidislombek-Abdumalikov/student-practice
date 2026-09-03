import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { MysteryBoxTier, MysteryBoxPrize } from '../../types';
import { MysteryBoxService, MYSTERY_BOX_PRICES } from '../../services/mysteryBoxService';
import { soundService } from '../../services/soundService';
import { 
  Gift, 
  Sparkles, 
  Coins, 
  Trophy, 
  Ticket, 
  Check, 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  Award,
  Crown,
  Lock,
  ChevronRight,
  Disc
} from 'lucide-react';

const SLICE_COLORS = [
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#3B82F6', // Blue
  '#D97706', // Gold
  '#EC4899', // Pink
];

export const MysteryBoxView: React.FC = () => {
  const { profile, openMysteryBox, boxPrices } = useGame();
  
  // Active Wheel Modal State
  const [activeWheelTier, setActiveWheelTier] = useState<MysteryBoxTier | null>(null);
  const [wheelPrizes, setWheelPrizes] = useState<MysteryBoxPrize[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<MysteryBoxPrize | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preview pool modal state
  const [previewTier, setPreviewTier] = useState<MysteryBoxTier | null>(null);

  const boxes: {
    tier: MysteryBoxTier;
    name: string;
    cost: number;
    tag: string;
    accentColor: string;
    borderColor: string;
    glowClass: string;
    bgGrad: string;
    icon: string;
    description: string;
  }[] = [
    {
      tier: 'bronze',
      name: 'Bronze Mystery Box',
      cost: boxPrices.bronze,
      tag: '🥉 LUCKY ROLL',
      accentColor: 'text-amber-500',
      borderColor: 'border-amber-700/60 hover:border-amber-500',
      glowClass: 'shadow-glow-gold',
      bgGrad: 'from-slate-900 via-amber-950/20 to-slate-900',
      icon: '🥉',
      description: 'Sweet candies, bonus coins, and scholar badges!',
    },
    {
      tier: 'platinum',
      name: 'Platinum Mystery Box',
      cost: boxPrices.platinum,
      tag: '💿 CHAMPION VAULT',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/50 hover:border-cyan-400',
      glowClass: 'shadow-glow-primary',
      bgGrad: 'from-slate-900 via-cyan-950/30 to-slate-900',
      icon: '💿',
      description: 'Classroom perks, stationery gifts, big coins, and champion titles!',
    },
    {
      tier: 'gold',
      name: 'Gold Mystery Box',
      cost: boxPrices.gold,
      tag: '🥇 LEGENDARY TREASURE',
      accentColor: 'text-yellow-400',
      borderColor: 'border-amber-400/70 hover:border-amber-300',
      glowClass: 'shadow-glow-gold ring-2 ring-amber-400/20',
      bgGrad: 'from-slate-900 via-yellow-950/40 to-slate-900',
      icon: '👑',
      description: 'Free Homework Passes, Kinder Joy / Chocolate treats, Mega Coins (+1,500), and Sovereign Crown Badges!',
    },
  ];

  // Open Wheel Modal for a Tier
  const handleSelectBox = (tier: MysteryBoxTier) => {
    const cost = MYSTERY_BOX_PRICES[tier];
    if (profile.role !== 'admin' && (profile.diamonds || 0) < cost) {
      soundService.playError();
      setErrorMessage(`You need ${cost} Diamonds 💎 to unlock this box!`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const prizes = MysteryBoxService.getPrizesByTier(tier);
    if (prizes.length === 0) {
      soundService.playError();
      setErrorMessage('No prizes available in this box yet. Please ask teacher to add prizes!');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    soundService.playClick();
    setActiveWheelTier(tier);
    setWheelPrizes(prizes);
    setWonPrize(null);
    setIsSpinning(false);
    setWheelRotation(0);
  };

  // Spin the Wheel Animation
  const handleSpinWheel = () => {
    if (isSpinning || !activeWheelTier || wheelPrizes.length === 0) return;

    const cost = MYSTERY_BOX_PRICES[activeWheelTier];
    if (profile.role !== 'admin' && (profile.diamonds || 0) < cost) {
      soundService.playError();
      return;
    }

    // Call openMysteryBox in context (deducts diamonds, rolls prize, adds coins/ticket)
    const result = openMysteryBox(activeWheelTier);
    if (!result.success || !result.prize) {
      soundService.playError();
      setErrorMessage(result.message || 'Spin failed');
      return;
    }

    const prize = result.prize;
    setIsSpinning(true);
    soundService.playCoin();

    // Find slice index of the won prize
    let prizeIdx = wheelPrizes.findIndex(p => p.id === prize.id);
    if (prizeIdx === -1) prizeIdx = 0;

    const numSlices = wheelPrizes.length;
    const sliceAngle = 360 / numSlices;
    
    // To align slice center with top pointer (270 degrees in SVG coordinates or 0 with offset)
    const prizeCenterAngle = prizeIdx * sliceAngle + sliceAngle / 2;
    // We want the needle at the top (0 deg) to point at this slice
    const targetOffset = 360 - prizeCenterAngle;
    const fullSpins = 360 * 5; // 5 full revolutions
    const totalRotation = wheelRotation + fullSpins + targetOffset;

    setWheelRotation(totalRotation);

    // Audio ticking simulation
    const tickInterval = setInterval(() => {
      soundService.playClick();
    }, 300);

    // Finish Spin after 4.5 seconds
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWonPrize(prize);
      soundService.playLevelUp();
      confetti({
        particleCount: activeWheelTier === 'gold' ? 150 : activeWheelTier === 'platinum' ? 100 : 70,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 4500);
  };

  const handleCloseWheelModal = () => {
    if (isSpinning) return;
    setActiveWheelTier(null);
    setWonPrize(null);
    setIsSpinning(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-cyan-950/40 border-2 border-amber-500/40 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest">
            <Disc className="w-3.5 h-3.5 animate-spin" />
            <span>DIAMOND PRIZE WHEEL & VAULT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Mystery Boxes & Wheel of Fortune 🎡
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Spend diamonds won in 2-Player Duels to spin the wheel! Win real classroom treats from your teacher, free homework passes, and giant coin jackpots!
          </p>
        </div>

        {/* Diamond Balance Indicator: Hidden / Infinite for Admin */}
        {profile.role !== 'admin' ? (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shrink-0">
            <div className="text-left">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Available Diamonds</span>
              <div className="flex items-center gap-1.5 text-xl font-black text-cyan-300">
                <span>💎</span>
                <span>{profile.diamonds || 0}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 shrink-0">
            <span className="text-xl">👑</span>
            <div className="text-left">
              <span className="text-[10px] font-extrabold uppercase text-indigo-300 block">Teacher Mode</span>
              <span className="text-xs font-black text-white">Infinite Spins (Free)</span>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold text-xs text-center animate-in shake">
          {errorMessage}
        </div>
      )}

      {/* The 3 Mystery Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {boxes.map(box => {
          const canAfford = profile.role === 'admin' || (profile.diamonds || 0) >= box.cost;
          const poolCount = MysteryBoxService.getPrizesByTier(box.tier).length;

          return (
            <div
              key={box.tier}
              className={`card-game p-6 flex flex-col justify-between border-2 transition-all duration-300 relative group bg-gradient-to-b ${box.bgGrad} ${box.borderColor}`}
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                    {box.tag}
                  </span>
                  <button
                    onClick={() => setPreviewTier(box.tier)}
                    className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                    title="View all possible prizes on this wheel"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{poolCount} Prizes</span>
                  </button>
                </div>

                {/* 3D Box Illustration Stage */}
                <div className="py-6 flex flex-col items-center justify-center relative">
                  <div className="text-6xl sm:text-7xl transition-transform duration-300 group-hover:scale-110 select-none filter drop-shadow-lg">
                    {box.icon}
                  </div>
                  <div className="w-20 h-4 bg-black/40 rounded-full blur-sm mt-3" />
                </div>

                {/* Box Title & Description */}
                <div className="text-center space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-white">{box.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{box.description}</p>
                </div>
              </div>

              {/* Action Button: Launches the Prize Wheel */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                <button
                  onClick={() => handleSelectBox(box.tier)}
                  disabled={!canAfford}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    canAfford
                      ? 'btn-game-gold text-slate-950'
                      : 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {profile.role === 'admin' ? (
                    <>
                      <Disc className="w-4 h-4" />
                      <span>Spin Wheel (Admin Mode)</span>
                    </>
                  ) : canAfford ? (
                    <>
                      <Disc className="w-4 h-4" />
                      <span>Spin Wheel for 💎 {box.cost}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Requires 💎 {box.cost}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setPreviewTier(box.tier)}
                  className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-200 py-1"
                >
                  Inspect Wheel Prizes ({poolCount} available)
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Won Rewards & Digital Vouchers Section */}
      <div className="card-game p-6 border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-black text-sm sm:text-base">
            <Ticket className="w-5 h-5 text-amber-400" />
            <span>My Won Rewards & Teacher Vouchers</span>
          </div>
          <span className="text-xs text-slate-400 font-bold">
            {(profile.claimedPrizes || []).length} Claimed
          </span>
        </div>

        {(!profile.claimedPrizes || profile.claimedPrizes.length === 0) ? (
          <div className="text-center py-6 text-slate-500 text-xs font-medium italic">
            You haven't spun the Prize Wheel yet. Win diamonds in 2-Player Duels to spin your first wheel!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.claimedPrizes.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-2xl border-2 border-amber-500/40 bg-slate-950/80 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    {record.tier.toUpperCase()} REWARD
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(record.claimedAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-black text-sm text-white">{record.prizeTitle}</h4>
                <p className="text-xs text-slate-400">{record.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Show ticket to teacher to redeem in class!</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE SPINNING PRIZE WHEEL MODAL */}
      {/* ------------------------------------------------------------- */}
      {activeWheelTier && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="card-game p-5 sm:p-6 max-w-md w-full text-center space-y-4 border-2 border-amber-500/60 bg-slate-900 shadow-2xl animate-in zoom-in-95 relative overflow-hidden max-h-[94vh] flex flex-col justify-between">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                  {activeWheelTier.toUpperCase()} PRIZE WHEEL
                </span>
                <h3 className="text-xl font-black text-white">
                  {profile.role === 'admin' ? 'Teacher Spin (Unlimited 💎)' : `Spin for ${boxPrices[activeWheelTier]} Diamonds 💎`}
                </h3>
              </div>

              {!isSpinning && (
                <button
                  onClick={handleCloseWheelModal}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* The Animated Wheel Stage (Balanced Ratio on Mobile & Desktop) */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 aspect-square mx-auto my-1 flex items-center justify-center select-none shrink-0">
              
              {/* Outer Casino Bezel with 16 Lights */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-b from-amber-400 via-yellow-600 to-amber-700 p-2 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-amber-300/40 relative">
                  {[...Array(16)].map((_, i) => {
                    const angle = (i * (360 / 16)) * (Math.PI / 180);
                    const left = 50 + 47 * Math.cos(angle);
                    const top = 50 + 47 * Math.sin(angle);
                    return (
                      <div
                        key={i}
                        className={`absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/30 shadow-sm transition-all duration-300 ${
                          isSpinning
                            ? i % 2 === 0 ? 'bg-yellow-200 shadow-glow-gold scale-110' : 'bg-amber-500'
                            : 'bg-yellow-300'
                        }`}
                        style={{ left: `${left}%`, top: `${top}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* The Spinning Wheel Disk with Ultra-Smooth Deceleration Curve */}
              <div 
                className="w-full h-full rounded-full shadow-2xl overflow-hidden relative border-4 border-slate-950 z-10"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.95, 0.25, 1)' : 'none',
                }}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {wheelPrizes.map((prize, idx) => {
                    const numSlices = wheelPrizes.length;
                    const sliceAngle = 360 / numSlices;
                    const startAngle = (idx * sliceAngle - 90) * (Math.PI / 180);
                    const endAngle = ((idx + 1) * sliceAngle - 90) * (Math.PI / 180);
                    
                    const x1 = 100 + 100 * Math.cos(startAngle);
                    const y1 = 100 + 100 * Math.sin(startAngle);
                    const x2 = 100 + 100 * Math.cos(endAngle);
                    const y2 = 100 + 100 * Math.sin(endAngle);
                    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                    
                    const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    const color = SLICE_COLORS[idx % SLICE_COLORS.length];

                    // Label rotation angle
                    const midAngle = (idx * sliceAngle + sliceAngle / 2);

                    return (
                      <g key={prize.id}>
                        <path d={pathData} fill={color} stroke="#0F172A" strokeWidth="1.8" />
                        <g transform={`rotate(${midAngle} 100 100)`}>
                          {/* Prize Title & Icon */}
                          <text
                            x="100"
                            y="28"
                            fill="#FFFFFF"
                            fontSize="7.5"
                            fontWeight="900"
                            textAnchor="middle"
                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                          >
                            {prize.icon || '🎁'} {prize.title.slice(0, 10)}
                          </text>

                          {/* Drop Chance Percentage Tag */}
                          <text
                            x="100"
                            y="38"
                            fill="#FEF08A"
                            fontSize="6"
                            fontWeight="800"
                            textAnchor="middle"
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
                          >
                            {prize.chancePercent || 20}%
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Center 3D Spin Hub */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning || !!wonPrize}
                  className="w-18 h-18 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 border-4 border-slate-900 shadow-2xl flex flex-col items-center justify-center font-black text-slate-950 text-xs active:scale-95 pointer-events-auto transition-transform disabled:opacity-85 ring-4 ring-amber-400/40 cursor-pointer"
                >
                  <Disc className={`w-5 h-5 text-slate-950 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span className="leading-none mt-1 font-black tracking-wider text-[11px]">{isSpinning ? 'LUCKY...' : 'SPIN!'}</span>
                </button>
              </div>

              {/* Top Pointer Indicator Arrow (Golden 3D Needle) */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none filter drop-shadow-xl">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-900 shadow-md" />
                  <div className="w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[20px] border-t-amber-400 -mt-1" />
                </div>
              </div>

            </div>

            {/* Won Prize Announcement Banner */}
            {wonPrize && (
              <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 space-y-2 animate-in zoom-in-95">
                <span className="text-[10px] font-black uppercase text-amber-300 block">
                  🎉 YOU WON!
                </span>
                <h4 className="text-xl font-black text-white">{wonPrize.title}</h4>
                <p className="text-xs text-slate-300">{wonPrize.description}</p>
                
                {wonPrize.type === 'coins' ? (
                  <span className="inline-block font-black text-xs text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40">
                    +{wonPrize.coinAmount} Coins added to your wallet! 🪙
                  </span>
                ) : (
                  <span className="inline-block font-bold text-xs text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                    🎟️ Saved to your vouchers! Show to teacher in class.
                  </span>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleSpinWheel}
                    disabled={isSpinning || (profile.role !== 'admin' && (profile.diamonds || 0) < MYSTERY_BOX_PRICES[activeWheelTier])}
                    className="btn-game-gold flex-1 py-2.5 text-xs font-black"
                  >
                    Spin Again ({MYSTERY_BOX_PRICES[activeWheelTier]}💎)
                  </button>
                  <button
                    onClick={handleCloseWheelModal}
                    className="btn-game-slate py-2.5 px-4 text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {!wonPrize && (
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="btn-game-primary w-full py-3 px-6 font-black text-sm flex items-center justify-center gap-2 shadow-glow-primary active:scale-98 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isSpinning ? 'Spinning the Wheel...' : `SPIN WHEEL FOR 💎 ${MYSTERY_BOX_PRICES[activeWheelTier]}`}</span>
              </button>
            )}

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PREVIEW POOL MODAL */}
      {/* ------------------------------------------------------------- */}
      {previewTier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="card-game p-6 max-w-md w-full space-y-4 border-2 border-slate-700 bg-slate-900 shadow-2xl animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div>
                <h3 className="text-lg font-black text-white capitalize">
                  {previewTier} Wheel Prize Pool
                </h3>
                <p className="text-xs text-slate-400">
                  Cost to spin: 💎 {MYSTERY_BOX_PRICES[previewTier]} Diamonds
                </p>
              </div>
              <button
                onClick={() => setPreviewTier(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 scrollbar-none">
              {MysteryBoxService.getPrizesByTier(previewTier).map((prize) => (
                <div
                  key={prize.id}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3"
                >
                  <span className="text-2xl shrink-0">{prize.icon || '🎁'}</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{prize.title}</h4>
                    <p className="text-xs text-slate-400">{prize.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">
                        {prize.type === 'coins' ? 'In-Game Coins' : prize.type === 'badge' ? 'Leaderboard Badge' : 'Real-World Classroom Reward'}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        🎯 {prize.chancePercent || 20}% Chance
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPreviewTier(null)}
              className="btn-game-slate w-full py-2.5 text-xs font-bold shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
