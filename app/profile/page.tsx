'use client';

import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { BookOpen, Check, Flame, Lock, LogOut, Monitor, Moon, RotateCcw, Sun, Target, Trophy, Volume2, VolumeX, Zap } from 'lucide-react';
import { Tibeb } from '@/components/brand/tibeb';
import { UserAvatar } from '@/components/layout/user-avatar';
import { ActivityChart } from '@/components/profile/activity-chart';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Button, ButtonLink } from '@/components/ui/button';
import { ProgressBar, ProgressRing } from '@/components/ui/progress';
import { ACHIEVEMENTS, achievementState } from '@/lib/achievements';
import { useAuth } from '@/lib/auth';
import { lessons, vocabularyData } from '@/lib/data';
import { auth } from '@/lib/firebase';
import { useStats } from '@/lib/hooks';
import { sfx } from '@/lib/sound';
import { useAppStore } from '@/lib/store';
import type { ThemePref } from '@/lib/types';
import { cn } from '@/lib/utils';

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const rise: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProfilePage() {
    const { progress, streak, level, goal } = useStats();
    const { user, ready } = useAuth();
    const setUid = useAppStore((s) => s.setUid);
    const earned = ACHIEVEMENTS.filter((a) => achievementState(a, progress).earned).length;
    const accuracy = progress.totalAnswers ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100) : 0;

    const handleSignOut = async () => {
        await signOut(auth);
        setUid(null);
    };

    const stats = [
        { label: 'Day streak', value: streak, sub: `Longest: ${progress.longestStreak}`, icon: Flame, accent: 'berbere' },
        { label: 'Total XP', value: progress.totalXP, sub: `Level ${level.level} · ${level.title}`, icon: Zap, accent: 'gold' },
        { label: 'Words learned', value: progress.masteredWords.length, sub: `of ${vocabularyData.length}`, icon: BookOpen, accent: 'lapis' },
        { label: 'Lessons done', value: progress.completedLessons.length, sub: `of ${lessons.length} stops`, icon: Trophy, accent: 'jade' },
        { label: 'Accuracy', value: accuracy, suffix: '%', sub: `${progress.totalAnswers} answers`, icon: Target, accent: 'plum' },
        { label: 'Best combo', value: progress.bestCombo, sub: `Best sprint: ${progress.bestSprint}`, icon: Flame, accent: 'berbere' },
    ] as const;

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-5xl px-4 py-6 sm:px-8 lg:px-10 lg:py-10"
        >
            {/* Hero */}
            <motion.section variants={rise} className="hero-ink relative overflow-hidden rounded-[2rem]">
                <span
                    aria-hidden
                    className="font-geez pointer-events-none absolute -right-8 -top-20 select-none text-[18rem] font-bold leading-none text-white/[0.05]"
                >
                    መ
                </span>
                <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-10">
                    <ProgressRing value={level.pct} size={124} stroke={7} accent="gold" track="rgb(255 255 255 / 0.12)" label="Level progress">
                        <UserAvatar size={96} />
                    </ProgressRing>
                    <div className="min-w-0 flex-1">
                        <div className="eyebrow !text-white/55">
                            <span className="h-[2px] w-6 rounded-full bg-gold" />
                            Profile <span className="font-geez normal-case tracking-normal">· መገለጫ</span>
                        </div>
                        {ready ? (
                            <>
                                <h1 className="font-display mt-2 truncate text-4xl font-semibold text-white sm:text-5xl">
                                    {user?.displayName || (user ? 'Amharic learner' : 'Guest learner')}
                                </h1>
                                <p className="mt-1 truncate font-semibold text-white/60">
                                    {user?.email ?? 'Your progress is saved on this device.'}
                                </p>
                            </>
                        ) : (
                            <div className="mt-3 space-y-2">
                                <div className="h-10 w-64 animate-pulse rounded-xl bg-white/10" />
                                <div className="h-5 w-40 animate-pulse rounded-lg bg-white/10" />
                            </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="chip bg-gold text-on-gold">
                                Level {level.level} · {level.title}
                            </span>
                            <span className="chip chip-glass">{level.toNext} XP to next level</span>
                            <span className="chip chip-glass">
                                <Trophy className="size-3.5" /> {earned}/{ACHIEVEMENTS.length} badges
                            </span>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-3 sm:flex-col">
                        {ready && user ? (
                            <Button variant="glass" size="sm" onClick={handleSignOut}>
                                <LogOut className="size-4" /> Sign out
                            </Button>
                        ) : ready ? (
                            <>
                                <ButtonLink href="/signup" variant="gold" size="sm">
                                    Create account
                                </ButtonLink>
                                <ButtonLink href="/login" variant="glass" size="sm">
                                    Log in
                                </ButtonLink>
                            </>
                        ) : null}
                    </div>
                </div>
                <Tibeb height={10} />
            </motion.section>

            {/* Stats */}
            <motion.section variants={rise} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {stats.map((s) => (
                    <div key={s.label} className="tile flex items-center gap-4 p-4 sm:p-5">
                        <span
                            className="grid size-12 shrink-0 place-items-center rounded-2xl"
                            style={{ background: `var(--${s.accent}-soft)` }}
                        >
                            <s.icon className="size-6" style={{ color: `var(--${s.accent}-ink)` }} />
                        </span>
                        <div className="min-w-0">
                            <div className="tabular text-2xl font-extrabold leading-tight">
                                <AnimatedNumber value={s.value} />
                                {'suffix' in s ? s.suffix : ''}
                            </div>
                            <div className="truncate text-xs font-bold uppercase tracking-wider text-ink-3">{s.label}</div>
                            <div className="truncate text-xs font-semibold text-ink-3">{s.sub}</div>
                        </div>
                    </div>
                ))}
            </motion.section>

            {/* Activity */}
            <motion.section variants={rise} className="tile mt-6 p-5 sm:p-7">
                <h2 className="font-display text-2xl font-semibold">Activity</h2>
                <p className="mb-5 text-sm text-ink-3">XP earned each day over the last two weeks.</p>
                <ActivityChart history={progress.xpHistory} goal={goal} />
            </motion.section>

            {/* Achievements */}
            <motion.section variants={rise} className="mt-10">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-semibold">Badges</h2>
                        <p className="text-sm text-ink-3">
                            {earned} of {ACHIEVEMENTS.length} earned
                        </p>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {ACHIEVEMENTS.map((a, i) => {
                        const st = achievementState(a, progress);
                        return (
                            <motion.div
                                key={a.id}
                                initial={{ opacity: 0, scale: 0.92 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 4) * 0.05 }}
                                className={cn('tile flex flex-col items-center p-4 text-center', !st.earned && 'bg-surface-2')}
                                title={a.description}
                            >
                                <span
                                    className={cn('relative grid size-16 place-items-center rounded-full', !st.earned && 'grayscale')}
                                    style={
                                        st.earned
                                            ? {
                                                  background: `radial-gradient(circle at 32% 26%, color-mix(in srgb, var(--${a.accent}) 55%, white) 0%, var(--${a.accent}) 55%, var(--${a.accent}-deep) 100%)`,
                                                  boxShadow: `0 4px 0 0 var(--${a.accent}-deep)`,
                                                  color: a.accent === 'gold' ? 'var(--on-gold)' : '#fff',
                                              }
                                            : { background: 'var(--paper-2)', color: 'var(--ink-3)', boxShadow: '0 4px 0 0 var(--line)' }
                                    }
                                >
                                    <a.icon className="size-7" strokeWidth={2.2} />
                                    {!st.earned && (
                                        <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-surface-2 bg-line-strong text-surface">
                                            <Lock className="size-3" strokeWidth={3} />
                                        </span>
                                    )}
                                    {st.earned && (
                                        <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full border-2 border-surface bg-jade text-white">
                                            <Check className="size-3" strokeWidth={4} />
                                        </span>
                                    )}
                                </span>
                                <div className={cn('mt-3 text-sm font-extrabold', !st.earned && 'text-ink-2')}>{a.title}</div>
                                <div className="mt-0.5 text-xs text-ink-3">{a.description}</div>
                                {!st.earned && (
                                    <div className="mt-3 w-full">
                                        <ProgressBar value={st.pct} accent={a.accent} height={8} label={`${a.title} progress`} />
                                        <div className="tabular mt-1 text-[11px] font-bold text-ink-3">
                                            {st.value} / {a.goal}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            <Settings />
        </motion.div>
    );
}

/* ---------------- Settings ---------------- */

const GOALS = [
    { xp: 20, label: 'Casual', text: '~5 min a day' },
    { xp: 50, label: 'Regular', text: '~10 min a day' },
    { xp: 100, label: 'Serious', text: '~20 min a day' },
    { xp: 150, label: 'Intense', text: '~30 min a day' },
];

const THEMES: { id: ThemePref; label: string; icon: typeof Sun }[] = [
    { id: 'system', label: 'System', icon: Monitor },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
];

function Settings() {
    const settings = useAppStore((s) => s.settings);
    const { setTheme, setSound, setDailyGoal, resetProgress } = useAppStore.getState();
    const [confirmReset, setConfirmReset] = useState(false);

    return (
        <motion.section variants={rise} id="settings" className="mt-10 scroll-mt-24">
            <h2 className="font-display text-2xl font-semibold">Settings</h2>
            <div className="tile mt-4 divide-y-2 divide-line">
                {/* Daily goal */}
                <div className="p-5 sm:p-6">
                    <div className="font-extrabold">Daily goal</div>
                    <p className="text-sm text-ink-3">How much XP you aim for each day.</p>
                    <div role="radiogroup" aria-label="Daily goal" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {GOALS.map((g) => {
                            const active = settings.dailyGoal === g.xp;
                            return (
                                <button
                                    key={g.xp}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => {
                                        sfx.tap();
                                        setDailyGoal(g.xp);
                                    }}
                                    className={cn(
                                        'rounded-2xl border-2 p-3 text-left transition-all',
                                        active
                                            ? 'border-jade bg-jade-soft shadow-[0_4px_0_0_var(--jade-deep)]'
                                            : 'border-line shadow-[0_4px_0_0_var(--line)] hover:-translate-y-0.5 hover:border-line-strong',
                                    )}
                                >
                                    <div className={cn('font-extrabold', active && 'text-jade-ink')}>{g.label}</div>
                                    <div className="tabular text-sm font-bold text-ink-2">{g.xp} XP</div>
                                    <div className="text-xs text-ink-3">{g.text}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Theme */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                        <div className="font-extrabold">Appearance</div>
                        <p className="text-sm text-ink-3">Parchment by day, coffee-dark by night.</p>
                    </div>
                    <div className="flex rounded-2xl border-2 border-line bg-paper-2 p-1" role="radiogroup" aria-label="Theme">
                        {THEMES.map((t) => {
                            const active = settings.theme === t.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setTheme(t.id)}
                                    className={cn(
                                        'relative flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors',
                                        active ? 'text-ink' : 'text-ink-3 hover:text-ink',
                                    )}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="theme-pill"
                                            className="absolute inset-0 rounded-xl bg-surface shadow-[0_2px_0_0_var(--line)]"
                                            transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                                        />
                                    )}
                                    <t.icon className="relative size-4" />
                                    <span className="relative">{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                    <div>
                        <div className="font-extrabold">Sound effects</div>
                        <p className="text-sm text-ink-3">Chimes for right answers and a fanfare when you finish.</p>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={settings.sound}
                        aria-label="Sound effects"
                        onClick={() => {
                            setSound(!settings.sound);
                            if (!settings.sound) setTimeout(() => sfx.correct(), 30);
                        }}
                        className={cn(
                            'relative h-9 w-16 shrink-0 rounded-full border-2 transition-colors',
                            settings.sound ? 'border-jade-deep bg-jade' : 'border-line-strong bg-paper-2',
                        )}
                    >
                        <motion.span
                            layout
                            transition={{ type: 'spring', stiffness: 600, damping: 32 }}
                            className={cn(
                                'absolute top-0.5 grid size-7 place-items-center rounded-full bg-white shadow',
                                settings.sound ? 'right-0.5' : 'left-0.5',
                            )}
                        >
                            {settings.sound ? <Volume2 className="size-4 text-jade-ink" /> : <VolumeX className="size-4 text-ink-3" />}
                        </motion.span>
                    </button>
                </div>

                {/* Reset */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                        <div className="font-extrabold text-berbere-ink">Reset progress</div>
                        <p className="text-sm text-ink-3">Start the journey over. XP, streaks and badges are cleared.</p>
                    </div>
                    <AnimatePresence mode="wait" initial={false}>
                        {confirmReset ? (
                            <motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="berbere"
                                    size="sm"
                                    onClick={() => {
                                        resetProgress();
                                        setConfirmReset(false);
                                    }}
                                >
                                    Yes, reset everything
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)} className="text-berbere-ink">
                                    <RotateCcw className="size-4" /> Reset
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    );
}
