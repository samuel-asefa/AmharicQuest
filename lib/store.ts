import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress } from './types';

interface AppState {
    progress: UserProgress;
    addXP: (amount: number) => void;
    completeLesson: (lessonId: string) => void;
    masterWord: (wordId: string) => void;
    updateStreak: () => void;
    // Auth state
    uid: string | null;
    setUid: (uid: string | null) => void;
}

const initialProgress: UserProgress = {
    completedLessons: [],
    totalXP: 0,
    level: 1,
    streak: 0,
    lastLoginDate: new Date().toISOString().split('T')[0],
    masteredWords: [],
};

const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            progress: initialProgress,
            uid: null,

            setUid: (uid) => set({ uid }),

            addXP: (amount) =>
                set((state) => {
                    const newXP = state.progress.totalXP + amount;
                    return {
                        progress: {
                            ...state.progress,
                            totalXP: newXP,
                            level: calculateLevel(newXP),
                        },
                    };
                }),

            completeLesson: (lessonId) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        completedLessons: state.progress.completedLessons.includes(lessonId)
                            ? state.progress.completedLessons
                            : [...state.progress.completedLessons, lessonId],
                    },
                })),

            masterWord: (wordId) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        masteredWords: state.progress.masteredWords.includes(wordId)
                            ? state.progress.masteredWords
                            : [...state.progress.masteredWords, wordId],
                    },
                })),

            updateStreak: () =>
                set((state) => {
                    const today = new Date().toISOString().split('T')[0];
                    const lastLogin = state.progress.lastLoginDate;

                    if (today === lastLogin) return state;

                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    const newStreak = lastLogin === yesterday ? state.progress.streak + 1 : 1;

                    return {
                        progress: {
                            ...state.progress,
                            streak: newStreak,
                            lastLoginDate: today,
                        },
                    };
                }),
        }),
        {
            name: 'amharic-quest-storage',
        }
    )
);
