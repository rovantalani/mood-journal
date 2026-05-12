import { MoodEntry } from '../types';

const ENTRIES_KEY = 'moodjournal_entries';
const API_KEY_KEY = 'moodjournal_apikey';

export function getEntries(): MoodEntry[] {
  try {
    return JSON.parse(localStorage.getItem(ENTRIES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveEntry(entry: MoodEntry): MoodEntry[] {
  const entries = getEntries();
  const idx = entries.findIndex(e => e.date === entry.date);
  if (idx >= 0) entries[idx] = entry;
  else entries.push(entry);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  return [...entries];
}

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_KEY) ?? '';
}

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_KEY, key);
}
