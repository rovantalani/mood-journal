export type MoodLevel = 'great' | 'good' | 'okay' | 'bad' | 'awful';

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD local date
  mood: MoodLevel;
  note: string;
  timestamp: number;
}

export interface MoodConfig {
  level: MoodLevel;
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: MoodConfig[] = [
  { level: 'great', emoji: '😄', label: 'Great',  color: '#B5EAD7' },
  { level: 'good',  emoji: '🙂', label: 'Good',   color: '#C7CEEA' },
  { level: 'okay',  emoji: '😐', label: 'Okay',   color: '#FFDAC1' },
  { level: 'bad',   emoji: '😕', label: 'Bad',    color: '#FFB7B2' },
  { level: 'awful', emoji: '😢', label: 'Awful',  color: '#FF9AA2' },
];
