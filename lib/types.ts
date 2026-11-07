export interface VocabularyItem {
  id: string;
  amharic: string;
  english: string;
  phonetic: string;
  category: string;
}

export type Accent = 'jade' | 'gold' | 'berbere' | 'lapis' | 'plum';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  unit: number;
  /** The stop on the journey map, in English and Amharic. */
  place: { en: string; am: string };
  /** A single Fidel character used as the lesson's emblem. */
  glyph: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  items: VocabularyItem[];
  xpReward: number;
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  accent: Accent;
}

export type ThemePref = 'system' | 'light' | 'dark';

export interface UserProgress {
  completedLessons: string[];
  perfectLessons: string[];
  totalXP: number;
  streak: number;
  longestStreak: number;
  /** Local date (YYYY-MM-DD) of the last day XP was earned. */
  lastActiveDate: string | null;
  masteredWords: string[];
  exploredFamilies: number[];
  /** XP earned per local date (YYYY-MM-DD). */
  xpHistory: Record<string, number>;
  correctAnswers: number;
  totalAnswers: number;
  bestCombo: number;
  bestSprint: number;
}

export interface Settings {
  theme: ThemePref;
  sound: boolean;
  dailyGoal: number;
}
