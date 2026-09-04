import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { peerDuelService, ActiveDuelMatch } from '../../services/peerDuelService';
import { ModularCharacter } from '../character/ModularCharacter';
import { soundService } from '../../services/soundService';
import { Swords, Check, X, Clock, AlertCircle } from 'lucide-react';

interface IncomingDuelModalProps {
  onAcceptDuel: (match: ActiveDuelMatch) => void;
}

export const IncomingDuelModal: React.FC<IncomingDuelModalProps> = ({ onAcceptDuel }) => {
  const { profile, setScreen } = useGame();
  const [incomingMatch, setIncomingMatch] = useState<ActiveDuelMatch | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(25);

  useEffect(() => {
    const unsubscribe = peerDuelService.subscribe((match, eventType) => {
      // If someone challenged ME and status is pending
      if (
        eventType === 'challenge_sent' && 
        match.opponentId === profile.id && 
        match.status === 'pending'
      ) {
        soundService.playLevelUp();
        setIncomingMatch(match);
        const remaining = Math.max(1, Math.round((match.expiresAt - Date.now()) / 1000));
        setSecondsLeft(remaining > 25 ? 25 : remaining);
      }

      // If challenger cancelled or expired
      if (
        incomingMatch && 
        match.matchId === incomingMatch.matchId && 
        (eventType === 'challenge_declined' || match.status === 'expired')
      ) {
        setIncomingMatch(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [profile.id, incomingMatch]);

  // 25s Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (incomingMatch) {
      timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            peerDuelService.declineChallenge(incomingMatch);
            setIncomingMatch(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [incomingMatch]);

  if (!incomingMatch) return null;

  const handleAccept = () => {
    soundService.playSuccess();
    const updated = peerDuelService.acceptChallenge(incomingMatch);
    setIncomingMatch(null);
    setScreen('play');
    onAcceptDuel(updated);
  };

  const handleDecline = () => {
    soundService.playClick();
    peerDuelService.declineChallenge(incomingMatch);
    setIncomingMatch(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="card-game p-6 sm:p-8 max-w-md w-full text-center space-y-6 border-2 border-indigo-500/60 bg-slate-900 shadow-2xl animate-in zoom-in-95">
        
        {/* Pulsing Duel Badge */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-amber-400 animate-spin" />
          <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-indigo-500/60 flex flex-col items-center justify-center shadow-glow-primary">
            <Swords className="w-7 h-7 text-amber-400 animate-bounce" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
            {secondsLeft}s
          </div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            INCOMING DUEL CHALLENGE!
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            {incomingMatch.challengerName} Challenges You!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Respond within {secondsLeft} seconds to enter the arena.
          </p>
        </div>

        {/* Challenger Card & Stakes */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-indigo-500/60 overflow-hidden flex items-center justify-center">
              <ModularCharacter config={incomingMatch.challengerCharacter} size="sm" animate={false} />
            </div>
            <div className="text-left">
              <h4 className="font-extrabold text-sm text-white">{incomingMatch.challengerName}</h4>
              <span className="text-xs text-indigo-300 font-bold block">
                {incomingMatch.roundSize} Words • {incomingMatch.drillType.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-slate-800 text-xs font-black flex-wrap">
            <span className="text-emerald-400 font-extrabold">🎮 Free Friendly Game (No Stakes)</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 flex items-center gap-1">
              Prize: {incomingMatch.diamondReward === 2 ? '💎💎 2 Diamonds' : '💎 1 Diamond'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleAccept}
            className="btn-game-primary w-full py-3.5 px-6 font-black text-sm flex items-center justify-center gap-2 shadow-glow-primary active:scale-98"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Accept Challenge ({secondsLeft}s)</span>
          </button>

          <button
            onClick={handleDecline}
            className="btn-game-slate w-full py-2.5 text-xs font-bold text-slate-400 hover:text-white"
          >
            Decline
          </button>
        </div>

      </div>
    </div>
  );
};
