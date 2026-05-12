import React from 'react';
import { MoodLevel, MOODS } from '../types';

interface Props {
  selected: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
}

export default function MoodPicker({ selected, onChange }: Props) {
  return (
    <div className="mood-picker">
      {MOODS.map(({ level, emoji, label, color }) => (
        <button
          key={level}
          className={`mood-btn${selected === level ? ' mood-btn--selected' : ''}`}
          style={selected === level ? { backgroundColor: color, borderColor: color } : undefined}
          onClick={() => onChange(level)}
          title={label}
          aria-label={label}
          aria-pressed={selected === level}
        >
          <span className="mood-emoji">{emoji}</span>
          <span className="mood-label">{label}</span>
        </button>
      ))}
    </div>
  );
}
