import React, { useState, useEffect } from 'react';
import { MoodEntry, MoodLevel, MOODS } from './types';
import { getEntries, saveEntry } from './utils/storage';
import { toLocalDateStr, calculateStreak } from './utils/streak';
import MoodPicker from './components/MoodPicker';
import CalendarView from './components/CalendarView';
import AIReflection from './components/AIReflection';
import './App.css';

export default function App() {
  const today = toLocalDateStr(new Date());

  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const loaded = getEntries();
    setEntries(loaded);
    const todayEntry = loaded.find(e => e.date === today);
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setNote(todayEntry.note);
      setSaved(true);
    }
  }, [today]);

  const streak = calculateStreak(entries);
  const last7 = [...entries]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 7);

  const handleSave = () => {
    if (!selectedMood) return;
    const entry: MoodEntry = {
      id: `${today}-${Date.now()}`,
      date: today,
      mood: selectedMood,
      note,
      timestamp: Date.now(),
    };
    const updated = saveEntry(entry);
    setEntries(updated);
    setSaved(true);
  };

  return (
    <div className="app">
      {/* ─── Header ─── */}
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-emoji">🌸</span>
          <div>
            <h1 className="brand-name">My Mood Journal</h1>
            <p className="brand-sub">A little check-in for your heart</p>
          </div>
        </div>
        <div className="streak-widget">
          <span className="streak-fire">🔥</span>
          <div>
            <div className="streak-number">{streak}</div>
            <div className="streak-label">day streak</div>
          </div>
        </div>
      </header>

      {/* ─── Main grid ─── */}
      <main className="app-grid">
        {/* Left: today's entry + AI */}
        <div className="left-col">
          <div className="card today-card">
            <div className="today-header">
              <h2 className="section-title">Today's Check-in</h2>
              <p className="today-date">{formatDate(today)}</p>
            </div>

            <MoodPicker
              selected={selectedMood}
              onChange={mood => { setSelectedMood(mood); setSaved(false); }}
            />

            <textarea
              className="note-input"
              placeholder="Write a few words about your day… 💭"
              value={note}
              onChange={e => { setNote(e.target.value); setSaved(false); }}
              rows={4}
            />

            <button
              className={`save-btn${!selectedMood ? ' save-btn--disabled' : ''}${saved ? ' save-btn--saved' : ''}`}
              onClick={handleSave}
              disabled={!selectedMood}
            >
              {saved ? '✓ Saved for today!' : "Save Today's Mood"}
            </button>
          </div>

          <AIReflection entries={last7} />
        </div>

        {/* Right: calendar + stats */}
        <div className="right-col">
          <CalendarView
            entries={entries}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />

          <div className="card stats-card">
            <h3 className="section-title">Your Story</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{entries.length}</span>
                <span className="stat-label">total entries</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{streak}</span>
                <span className="stat-label">day streak</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{topMoodEmoji(entries)}</span>
                <span className="stat-label">most common</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function topMoodEmoji(entries: MoodEntry[]): string {
  if (!entries.length) return '—';
  const counts: Record<string, number> = {};
  for (const e of entries) counts[e.mood] = (counts[e.mood] ?? 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as MoodEntry['mood'];
  return MOODS.find(m => m.level === top)?.emoji ?? '—';
}
