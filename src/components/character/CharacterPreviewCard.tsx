import React from 'react';
import { CharacterConfig } from '../../types';
import { ModularCharacter } from './ModularCharacter';
import { Sparkles } from 'lucide-react';

interface CharacterPreviewCardProps {
  config: CharacterConfig;
  name?: string;
  levelNumber?: number;
  streakDays?: number;
  className?: string;
  size?: 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const CharacterPreviewCard: React.FC<CharacterPreviewCardProps> = ({
  config,
  name,
  levelNumber = 1,
  streakDays = 1,
  className = '',
  size = 'lg',
  showBadge = true,
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-4 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/70 shadow-game-card ${className}`}>
      {showBadge && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wide shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>LVL {levelNumber}</span>
        </div>
      )}

      {showBadge && streakDays > 0 && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide shadow-sm">
          <span className="text-sm">🔥</span>
          <span>{streakDays}d</span>
        </div>
      )}

      {/* Modular Character Display */}
      <div className="my-2 filter drop-shadow-2xl">
        <ModularCharacter config={config} size={size} animate={true} />
      </div>

      {name && (
        <div className="mt-2 text-center">
          <h3 className="text-base font-bold text-white tracking-wide">{name}</h3>
          <span className="text-xs text-slate-400 capitalize">
            {config.gender === 'man' ? '👦 Adventurer' : '👧 Explorer'}
          </span>
        </div>
      )}
    </div>
  );
};
