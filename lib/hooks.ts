'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { currentStreak, todayXP, useAppStore } from './store';
import { levelInfo } from './utils';

const noopSubscribe = () => () => {};

/** False during SSR and the first client render, true afterwards. */
export function useIsClient() {
    return useSyncExternalStore(
        noopSubscribe,
        () => true,
        () => false,
    );
}

/** True once saved progress has been loaded from localStorage. */
export function useHydrated() {
    return useSyncExternalStore(
        (cb) => useAppStore.persist.onFinishHydration(cb),
        () => useAppStore.persist.hasHydrated(),
        () => false,
    );
}

export function usePrefersReducedMotion() {
    return useSyncExternalStore(
        (cb) => {
            const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
            mq.addEventListener('change', cb);
            return () => mq.removeEventListener('change', cb);
        },
        () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        () => false,
    );
}

/** Calls `handler` for key presses, ignoring presses inside text fields. */
export function useHotkeys(handler: (e: KeyboardEvent) => void, enabled = true) {
    useEffect(() => {
        if (!enabled) return;
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            handler(e);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [handler, enabled]);
}

/** Everyday numbers the UI shows: streak, today's XP, goal, level. */
export function useStats() {
    const progress = useAppStore((s) => s.progress);
    const goal = useAppStore((s) => s.settings.dailyGoal);
    return {
        progress,
        goal,
        streak: currentStreak(progress),
        today: todayXP(progress),
        level: levelInfo(progress.totalXP),
    };
}
