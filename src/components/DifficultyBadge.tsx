import React from 'react';
import { Difficulty } from '../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md' | 'lg';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const configs: Record<Difficulty, { label: string; bg: string; text: string; dot: string }> = {
    easy: {
      label: 'Easy',
      bg: 'bg-emerald-50 border-emerald-200/80',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500'
    },
    moderate: {
      label: 'Moderate',
      bg: 'bg-amber-50 border-amber-200/80',
      text: 'text-amber-700',
      dot: 'bg-amber-500'
    },
    hard: {
      label: 'Hard',
      bg: 'bg-orange-50 border-orange-200/80',
      text: 'text-orange-700',
      dot: 'bg-orange-500'
    },
    expert: {
      label: 'Expert',
      bg: 'bg-rose-50 border-rose-200/80',
      text: 'text-rose-700',
      dot: 'bg-rose-600'
    }
  };

  const config = configs[difficulty] || configs.moderate;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-bold gap-2'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${sizeClasses} transition-all`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0 animate-pulse`} />
      {config.label}
    </span>
  );
};
