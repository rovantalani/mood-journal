import { MoodEntry } from '../types';

export function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateStreak(entries: MoodEntry[]): number {
  if (!entries.length) return 0;

  const dateSet = new Set(entries.map(e => e.date));
  const today = new Date();
  const todayStr = toLocalDateStr(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = toLocalDateStr(yesterday);

  // Don't penalise for not logging today yet — preserve streak from yesterday
  if (!dateSet.has(todayStr) && !dateSet.has(yesterdayStr)) return 0;

  const cur = new Date(dateSet.has(todayStr) ? today : yesterday);
  let streak = 0;

  while (dateSet.has(toLocalDateStr(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }

  return streak;
}
