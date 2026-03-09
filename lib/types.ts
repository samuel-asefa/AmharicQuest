export interface VocabularyItem {
  id: string;
  amharic: string;
  english: string;
  phonetic: string;
  category: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  items: VocabularyItem[];
  xpReward: number;
}

export interface UserProgress {
  completedLessons: string[];
  totalXP: number;
  level: number;
  streak: number;
  lastLoginDate: string;
  masteredWords: string[];
}