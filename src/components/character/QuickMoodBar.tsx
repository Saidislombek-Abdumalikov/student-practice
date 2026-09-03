import React from 'react';
import { useGame } from '../../context/GameContext';
import { CharacterExpression } from '../../types';

interface QuickMoodBarProps {
  className?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md';
}

const MOODS: { id: CharacterExpression; label: string; emoji: string }[] = [
  { id: 'happy', label: 'Happy', emoji: '😄' },
  { id: 'victory', label: 'Victory', emoji: '😎' },
  { id: 'thinking', label: 'Focus', emoji: '🤔' },
  { id: 'idle', label: 'Calm', emoji: '🙂' },
  { id: 'oops', label: 'Oops', emoji: '😮' },
];

export const QuickMoodBar: React.FC<QuickMoodBarProps> = ({
  className = '',
  showLabels = false,
  size = 'md',
}) => {
  const { profile, setCharacterMood } = useGame();
  const currentMood = profile.character.expression || 'idle';

  return (
    <div className={`flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl backdrop-blur-md ${className}`}>
      {MOODS.map(mood => {
        const isSelected = currentMood === mood.id;
        return (
          <button
            key={mood.id}
            onClick={(e) => {
              e.stopPropagation();
              setCharacterMood(mood.id);
            }}
            title={`Set mood: ${mood.label}`}
            className={`flex items-center justify-center gap-1 rounded-xl transition-all active:scale-95 ${
              size === 'sm' ? 'py-1 px-1.5 text-xs min-w-[32px]' : 'py-1.5 px-2.5 text-sm min-w-[40px]'
            } ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-game-btn border border-indigo-400 scale-105 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-base leading-none">{mood.emoji}</span>
            {showLabels && (
              <span className="text-xs font-bold hidden sm:inline">{mood.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
