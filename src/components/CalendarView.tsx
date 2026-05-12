import React from 'react';
import { MoodEntry, MOODS } from '../types';
import { toLocalDateStr } from '../utils/streak';

interface Props {
  entries: MoodEntry[];
  currentMonth: Date;
  onMonthChange: (d: Date) => void;
}

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarView({ entries, currentMonth, onMonthChange }: Props) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const entryMap = new Map(entries.map(e => [e.date, e]));

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = toLocalDateStr(new Date());

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function dayStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function moodColor(date: string): string | undefined {
    const e = entryMap.get(date);
    return e ? MOODS.find(m => m.level === e.mood)?.color : undefined;
  }

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="card calendar-card">
      <div className="calendar-header">
        <button
          className="cal-nav"
          onClick={() => onMonthChange(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="calendar-month">{monthLabel}</h2>
        <button
          className="cal-nav"
          onClick={() => onMonthChange(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {DAY_NAMES.map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const ds = dayStr(day);
          const color = moodColor(ds);
          const entry = entryMap.get(ds);
          return (
            <div
              key={ds}
              className={`cal-day${ds === todayStr ? ' cal-day--today' : ''}${color ? ' cal-day--has-entry' : ''}`}
              title={entry ? `${ds} — ${entry.mood}${entry.note ? `: "${entry.note.slice(0, 40)}"` : ''}` : ds}
            >
              {day}
              {color && <span className="cal-dot" style={{ background: color }} />}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        {MOODS.map(({ level, emoji, color }) => (
          <div key={level} className="legend-item" title={level}>
            <span className="legend-dot" style={{ background: color }} />
            <span className="legend-emoji">{emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
