import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProgress } from './types'

interface AppState {
    progress: UserProgress;
    addXP: (amount: number) => void;
    completeLesson: (lessonId: string) => void;
    masterWord: (wordId: string) => void;
    updateStreak: () => void;
}

const initialProgress: UserProgress = {
    completedLessons: [],
    totalXP: 0,
    level: 1,
    streak: 0,
    masteredWords: [],
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            progress: initialProgress,

            addXP: (amount) => set((state) => {
                const newXP = state.progress.totalXP + amount;
                const newLevel = Math.floor(Math.sqrt(newXP / 50)) + 1; // calculateLevel logic
                return {
                    progress: {
                        ...state.progress,
                        totalXP: newXP,
                        level: newLevel
                    }
                }
            }),

            completeLesson: (lessonId) => set((state) => {
                if (state.progress.completedLessons.includes(lessonId)) return state;
                return {
                    progress: {
                        ...state.progress,
                        completedLessons: [...state.progress.completedLessons, lessonId]
                    }
                }
            }),

            masterWord: (wordId) => set((state) => {
                if (state.progress.masteredWords.includes(wordId)) return state;
                return {
                    progress: {
                        ...state.progress,
                        masteredWords: [...state.progress.masteredWords, wordId]
                    }
                }
            }),

            updateStreak: () => set((state) => {
                return {
                    progress: {
                        ...state.progress,
                        streak: state.progress.streak + 1
                    }
                }
            })
        }),
        {
            name: 'amharicquest-storage',
        }
    )
)
