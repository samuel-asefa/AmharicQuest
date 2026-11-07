import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings, ThemePref, UserProgress } from './types';
import { dayKey, shiftDay } from './utils';

interface AppState {
    progress: UserProgress;
    settings: Settings;
    uid: string | null;

    /** Adds XP, logs it for today, and keeps the daily streak going. */
    awardXP: (amount: number) => void;
    recordAnswer: (correct: boolean) => void;
    recordCombo: (combo: number) => void;
    recordSprint: (score: number) => void;
    completeLesson: (lessonId: string, opts: { perfect: boolean; wordIds: string[] }) => void;
    masterWord: (wordId: string) => void;
    exploreFamily: (familyId: number) => void;
    resetProgress: () => void;

    setTheme: (theme: ThemePref) => void;
    setSound: (sound: boolean) => void;
    setDailyGoal: (goal: number) => void;
    setUid: (uid: string | null) => void;
}

export const initialProgress: UserProgress = {
    completedLessons: [],
    perfectLessons: [],
    totalXP: 0,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    masteredWords: [],
    exploredFamilies: [],
    xpHistory: {},
    correctAnswers: 0,
    totalAnswers: 0,
    bestCombo: 0,
    bestSprint: 0,
};

export const initialSettings: Settings = {
    theme: 'system',
    sound: true,
    dailyGoal: 50,
};

const addUnique = <T,>(list: T[], items: T[]) => {
    const next = [...list];
    for (const item of items) if (!next.includes(item)) next.push(item);
    return next;
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            progress: initialProgress,
            settings: initialSettings,
            uid: null,

            awardXP: (amount) =>
                set((state) => {
                    const p = state.progress;
                    const today = dayKey();
                    let { streak, longestStreak, lastActiveDate } = p;
                    if (lastActiveDate !== today) {
                        streak = lastActiveDate === shiftDay(today, -1) ? streak + 1 : 1;
                        longestStreak = Math.max(longestStreak, streak);
                        lastActiveDate = today;
                    }
                    return {
                        progress: {
                            ...p,
                            totalXP: p.totalXP + amount,
                            xpHistory: { ...p.xpHistory, [today]: (p.xpHistory[today] ?? 0) + amount },
                            streak,
                            longestStreak,
                            lastActiveDate,
                        },
                    };
                }),

            recordAnswer: (correct) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        totalAnswers: state.progress.totalAnswers + 1,
                        correctAnswers: state.progress.correctAnswers + (correct ? 1 : 0),
                    },
                })),

            recordCombo: (combo) =>
                set((state) =>
                    combo > state.progress.bestCombo
                        ? { progress: { ...state.progress, bestCombo: combo } }
                        : state,
                ),

            recordSprint: (score) =>
                set((state) =>
                    score > state.progress.bestSprint
                        ? { progress: { ...state.progress, bestSprint: score } }
                        : state,
                ),

            completeLesson: (lessonId, { perfect, wordIds }) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        completedLessons: addUnique(state.progress.completedLessons, [lessonId]),
                        perfectLessons: perfect
                            ? addUnique(state.progress.perfectLessons, [lessonId])
                            : state.progress.perfectLessons,
                        masteredWords: addUnique(state.progress.masteredWords, wordIds),
                    },
                })),

            masterWord: (wordId) =>
                set((state) =>
                    state.progress.masteredWords.includes(wordId)
                        ? state
                        : {
                              progress: {
                                  ...state.progress,
                                  masteredWords: [...state.progress.masteredWords, wordId],
                              },
                          },
                ),

            exploreFamily: (familyId) =>
                set((state) =>
                    state.progress.exploredFamilies.includes(familyId)
                        ? state
                        : {
                              progress: {
                                  ...state.progress,
                                  exploredFamilies: [...state.progress.exploredFamilies, familyId],
                              },
                          },
                ),

            resetProgress: () => set({ progress: initialProgress }),

            setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
            setSound: (sound) => set((state) => ({ settings: { ...state.settings, sound } })),
            setDailyGoal: (dailyGoal) => set((state) => ({ settings: { ...state.settings, dailyGoal } })),
            setUid: (uid) => set({ uid }),
        }),
        {
            name: 'amharic-quest-storage',
            version: 2,
            // Hydrated manually after mount so server and client render the same first frame.
            skipHydration: true,
            migrate: (persisted, version) => {
                const old = (persisted ?? {}) as {
                    progress?: Partial<UserProgress>;
                    settings?: Partial<Settings>;
                    uid?: string | null;
                };
                if (version < 2) {
                    const p = old.progress ?? {};
                    return {
                        progress: {
                            ...initialProgress,
                            completedLessons: p.completedLessons ?? [],
                            totalXP: p.totalXP ?? 0,
                            masteredWords: p.masteredWords ?? [],
                        },
                        settings: initialSettings,
                        uid: old.uid ?? null,
                    };
                }
                return old;
            },
            merge: (persisted, current) => {
                const p = (persisted ?? {}) as Partial<AppState>;
                return {
                    ...current,
                    ...p,
                    progress: { ...initialProgress, ...p.progress },
                    settings: { ...initialSettings, ...p.settings },
                };
            },
        },
    ),
);

/* ---------- Derived values ---------- */

/** The streak as it stands today: it resets to 0 once a full day is missed. */
export function currentStreak(progress: UserProgress) {
    if (!progress.lastActiveDate) return 0;
    const today = dayKey();
    if (progress.lastActiveDate === today || progress.lastActiveDate === shiftDay(today, -1)) {
        return progress.streak;
    }
    return 0;
}

export function todayXP(progress: UserProgress) {
    return progress.xpHistory[dayKey()] ?? 0;
}
