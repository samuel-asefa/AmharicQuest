'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Flame, Repeat2, Target, Timer, Trophy, X, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ChoiceQuestionView } from '@/components/quiz/choice-question';
import { FeedbackSheet, randomPraise, type Feedback } from '@/components/quiz/feedback-sheet';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Button } from '@/components/ui/button';
import { fireConfetti } from '@/components/ui/confetti';
import { PageHeader } from '@/components/ui/page-header';
import { ProgressRing } from '@/components/ui/progress';
import { VOCAB_CATEGORIES } from '@/lib/data';
import { useStats } from '@/lib/hooks';
import { practiceQuestion, type ChoiceQuestion, type PracticeMode } from '@/lib/quiz';
import { sfx } from '@/lib/sound';
import { useAppStore } from '@/lib/store';
import type { Accent } from '@/lib/types';
import { cn } from '@/lib/utils';

const SPRINT_SECONDS = 60;

interface ModeInfo {
    id: PracticeMode;
    title: string;
    text: string;
    am: string;
    accent: Accent;
    glyph?: string;
    icon?: LucideIcon;
}

const MODES: ModeInfo[] = [
    { id: 'meaning', title: 'Meaning match', text: 'See the Amharic, pick the English.', am: 'ትርጉም', accent: 'lapis', glyph: 'ቃ' },
    { id: 'translate', title: 'Say it in Amharic', text: 'See the English, find the Amharic.', am: 'አማርኛ', accent: 'jade', glyph: 'አ' },
    { id: 'fidel', title: 'Fidel drill', text: 'Match characters to their sounds.', am: 'ፊደል', accent: 'gold', glyph: 'ሀ' },
    { id: 'sprint', title: 'Speed round', text: `${SPRINT_SECONDS} seconds. Everything mixed.`, am: 'ፍጥነት', accent: 'berbere', icon: Timer },
];

interface Session {
    mode: PracticeMode;
    category: string | null;
    question: ChoiceQuestion;
    selected: string | null;
    answered: number;
    correct: number;
    combo: number;
    maxCombo: number;
    xp: number;
    flash: 'right' | 'wrong' | null;
}

interface Summary {
    mode: PracticeMode;
    answered: number;
    correct: number;
    xp: number;
    maxCombo: number;
    newBest: boolean;
}

export default function PracticePage() {
    return (
        <Suspense fallback={null}>
            <Practice />
        </Suspense>
    );
}

function Practice() {
    const params = useSearchParams();
    const initial = params.get('mode');
    const [mode, setMode] = useState<PracticeMode>(
        MODES.some((m) => m.id === initial) ? (initial as PracticeMode) : 'meaning',
    );
    const [category, setCategory] = useState<string | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [timeLeft, setTimeLeft] = useState(SPRINT_SECONDS);
    const sessionRef = useRef<Session | null>(null);
    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    const start = (m: PracticeMode = mode) => {
        sfx.tap();
        const cat = m === 'meaning' || m === 'translate' ? category : null;
        setSummary(null);
        setFeedback(null);
        setTimeLeft(SPRINT_SECONDS);
        setSession({
            mode: m,
            category: cat,
            question: practiceQuestion(m, cat),
            selected: null,
            answered: 0,
            correct: 0,
            combo: 0,
            maxCombo: 0,
            xp: 0,
            flash: null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const end = useCallback(() => {
        const s = sessionRef.current;
        if (!s) return;
        const store = useAppStore.getState();
        let newBest = false;
        if (s.mode === 'sprint') {
            newBest = s.correct > store.progress.bestSprint && s.correct > 0;
            store.recordSprint(s.correct);
        }
        store.recordCombo(s.maxCombo);
        setSummary({ mode: s.mode, answered: s.answered, correct: s.correct, xp: s.xp, maxCombo: s.maxCombo, newBest });
        setSession(null);
        setFeedback(null);
        if (s.correct > 0) {
            sfx.complete();
            fireConfetti({ count: newBest ? 220 : 120 });
        }
    }, []);

    const advance = useCallback(() => {
        setFeedback(null);
        setSession((s) =>
            s
                ? { ...s, question: practiceQuestion(s.mode, s.category, s.question.wordId), selected: null, flash: null }
                : s,
        );
    }, []);

    const answer = (optionId: string) => {
        if (!session || session.selected) return;
        const q = session.question;
        const right = optionId === q.answerId;
        const store = useAppStore.getState();
        store.recordAnswer(right);

        if (right) {
            const combo = session.combo + 1;
            const xp = 5 + Math.min(combo - 1, 5);
            store.awardXP(xp);
            if (q.wordId) store.masterWord(q.wordId);
            sfx.correct();
            setSession({
                ...session,
                selected: optionId,
                answered: session.answered + 1,
                correct: session.correct + 1,
                combo,
                maxCombo: Math.max(session.maxCombo, combo),
                xp: session.xp + xp,
                flash: 'right',
            });
            if (session.mode === 'sprint') setTimeout(advance, 450);
            else {
                const p = randomPraise();
                setFeedback({ correct: true, title: p.en, titleAm: p.am, detail: q.reveal.detail, xp });
            }
        } else {
            sfx.wrong();
            setSession({ ...session, selected: optionId, answered: session.answered + 1, combo: 0, flash: 'wrong' });
            if (session.mode === 'sprint') setTimeout(advance, 1100);
            else
                setFeedback({
                    correct: false,
                    title: 'Not quite',
                    detail: `Answer: ${q.reveal.label}${q.reveal.detail ? ` — ${q.reveal.detail}` : ''}`,
                });
        }
    };

    // Speed round countdown.
    const sprinting = session?.mode === 'sprint';
    useEffect(() => {
        if (!sprinting) return;
        const startedAt = Date.now();
        const id = setInterval(() => {
            const left = Math.max(0, SPRINT_SECONDS - Math.floor((Date.now() - startedAt) / 1000));
            setTimeLeft(left);
            if (left === 0) {
                clearInterval(id);
                end();
            }
        }, 250);
        return () => clearInterval(id);
    }, [sprinting, end]);

    const modeInfo = MODES.find((m) => m.id === (session?.mode ?? mode))!;

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 lg:py-10">
            <AnimatePresence mode="wait">
                {session ? (
                    <motion.div key="session" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <SessionBar session={session} info={modeInfo} timeLeft={timeLeft} onEnd={end} />
                        <div className="mx-auto mt-6 max-w-3xl pb-40">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={session.question.key}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.22 }}
                                >
                                    <ChoiceQuestionView q={session.question} selected={session.selected} onSelect={answer} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="hub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                        <Hub mode={mode} setMode={setMode} category={category} setCategory={setCategory} onStart={() => start()} />
                    </motion.div>
                )}
            </AnimatePresence>

            <FeedbackSheet feedback={feedback} combo={session?.combo ?? 0} onContinue={advance} className="lg:left-[280px]" />

            <AnimatePresence>
                {summary && (
                    <SummaryDialog
                        summary={summary}
                        onAgain={() => start(summary.mode)}
                        onClose={() => setSummary(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---------------- Hub ---------------- */

function Hub({
    mode,
    setMode,
    category,
    setCategory,
    onStart,
}: {
    mode: PracticeMode;
    setMode: (m: PracticeMode) => void;
    category: string | null;
    setCategory: (c: string | null) => void;
    onStart: () => void;
}) {
    const { progress } = useStats();
    const accuracy = progress.totalAnswers ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100) : 0;
    const showTopics = mode === 'meaning' || mode === 'translate';
    const info = MODES.find((m) => m.id === mode)!;

    return (
        <>
            <PageHeader
                eyebrow="Practice"
                am="ልምምድ"
                title={
                    <>
                        Sharpen your <span className="italic text-jade-ink">skills</span>
                    </>
                }
                subtitle="Endless questions, combo streaks, and a speed round to test your reflexes."
            />

            <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                    { label: 'Accuracy', value: `${accuracy}%`, icon: Target, accent: 'jade' },
                    { label: 'Best combo', value: progress.bestCombo, icon: Flame, accent: 'berbere' },
                    { label: 'Best sprint', value: progress.bestSprint, icon: Trophy, accent: 'gold' },
                ].map((s) => (
                    <div key={s.label} className="tile flex items-center gap-3 p-3 sm:p-4">
                        <span className="hidden size-10 place-items-center rounded-xl sm:grid" style={{ background: `var(--${s.accent}-soft)` }}>
                            <s.icon className="size-5" style={{ color: `var(--${s.accent}-ink)` }} />
                        </span>
                        <div>
                            <div className="tabular text-xl font-extrabold leading-tight">{s.value}</div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="font-display mt-10 text-2xl font-semibold">Choose a mode</h2>
            <div role="radiogroup" aria-label="Practice mode" className="mt-4 grid gap-4 sm:grid-cols-2">
                {MODES.map((m, i) => {
                    const active = m.id === mode;
                    return (
                        <motion.button
                            key={m.id}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                                sfx.tap();
                                setMode(m.id);
                            }}
                            onDoubleClick={onStart}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className={cn('tile tile-hover group flex items-center gap-4 p-5 text-left')}
                            style={
                                active
                                    ? { borderColor: `var(--${m.accent})`, boxShadow: `0 4px 0 0 var(--${m.accent}-deep)`, background: `var(--${m.accent}-soft)` }
                                    : undefined
                            }
                        >
                            <span
                                className="grid size-16 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6"
                                style={{
                                    background: `var(--${m.accent})`,
                                    color: m.accent === 'gold' ? 'var(--on-gold)' : '#fff',
                                    boxShadow: `0 4px 0 0 var(--${m.accent}-deep)`,
                                }}
                            >
                                {m.icon ? <m.icon className="size-7" strokeWidth={2.4} /> : <span className="font-geez text-4xl font-bold leading-none">{m.glyph}</span>}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-lg font-extrabold">{m.title}</span>
                                <span className="block text-sm text-ink-2">{m.text}</span>
                                <span className="font-geez mt-1 block text-xs text-ink-3">{m.am}</span>
                            </span>
                            <span
                                className={cn(
                                    'grid size-7 shrink-0 place-items-center rounded-full border-2 transition-all',
                                    active ? 'scale-100 border-transparent text-white' : 'scale-90 border-line-strong',
                                )}
                                style={active ? { background: `var(--${m.accent})` } : undefined}
                            >
                                {active && <Check className="size-4" strokeWidth={3.5} />}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence initial={false}>
                {showTopics && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <h3 className="mt-8 text-sm font-extrabold uppercase tracking-wider text-ink-3">Topic</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {[null, ...VOCAB_CATEGORIES].map((c) => {
                                const active = c === category;
                                return (
                                    <button
                                        key={c ?? 'all'}
                                        type="button"
                                        onClick={() => setCategory(c)}
                                        aria-pressed={active}
                                        className={cn(
                                            'h-10 rounded-full border-2 px-4 text-sm font-bold transition-all',
                                            active
                                                ? 'border-ink bg-ink text-paper'
                                                : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
                                        )}
                                    >
                                        {c ?? 'All topics'}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-10 flex flex-col items-center">
                <Button
                    size="lg"
                    variant={info.accent}
                    className="w-full max-w-sm"
                    onClick={onStart}
                >
                    Start {info.title.toLowerCase()} <ArrowRight className="size-5" />
                </Button>
                <p className="mt-3 text-xs font-semibold text-ink-3">Every right answer earns XP toward your daily goal.</p>
            </div>
        </>
    );
}

/* ---------------- Session ---------------- */

function SessionBar({
    session,
    info,
    timeLeft,
    onEnd,
}: {
    session: Session;
    info: ModeInfo;
    timeLeft: number;
    onEnd: () => void;
}) {
    const sprint = session.mode === 'sprint';
    return (
        <div className="tile flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
            <Button variant="ghost" size="sm" onClick={onEnd} className="shrink-0 px-3">
                <X className="size-4" /> End
            </Button>
            <div className="min-w-0 flex-1">
                <div className="truncate font-extrabold">{info.title}</div>
                <div className="truncate text-xs font-semibold text-ink-3">
                    {session.category ?? (sprint ? 'Words + Fidel' : 'All topics')}
                </div>
            </div>
            <AnimatePresence mode="popLayout">
                {session.combo > 1 && (
                    <motion.span
                        key={session.combo}
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.3, opacity: 0 }}
                        className="chip chip-berbere h-9 px-3 text-sm"
                    >
                        <Flame className="size-4 fill-current" /> ×{session.combo}
                    </motion.span>
                )}
            </AnimatePresence>
            <span className="chip chip-jade h-9 px-3 text-sm">
                <Check className="size-4" strokeWidth={3} /> {session.correct}
            </span>
            <span className="chip chip-gold hidden h-9 px-3 text-sm sm:inline-flex">
                <Zap className="size-4 fill-current" /> {session.xp}
            </span>
            {sprint && (
                <ProgressRing
                    value={timeLeft / SPRINT_SECONDS}
                    size={48}
                    stroke={5}
                    accent={timeLeft <= 10 ? 'berbere' : 'lapis'}
                    label="Time left"
                >
                    <span className={cn('tabular text-sm font-extrabold', timeLeft <= 10 && 'text-berbere-ink')}>{timeLeft}</span>
                </ProgressRing>
            )}
        </div>
    );
}

function SummaryDialog({ summary, onAgain, onClose }: { summary: Summary; onAgain: () => void; onClose: () => void }) {
    const accuracy = summary.answered ? Math.round((summary.correct / summary.answered) * 100) : 0;
    const info = MODES.find((m) => m.id === summary.mode)!;
    const sprint = summary.mode === 'sprint';
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal
                aria-labelledby="summary-title"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="tile w-full max-w-md overflow-hidden text-center"
            >
                <div
                    className="relative px-6 pb-6 pt-8"
                    style={{
                        background: `linear-gradient(160deg, var(--${info.accent}) 0%, var(--${info.accent}-deep) 100%)`,
                        color: info.accent === 'gold' ? 'var(--on-gold)' : '#fff',
                    }}
                >
                    <div className="text-xs font-extrabold uppercase tracking-[0.16em] opacity-75">{info.title}</div>
                    <div className="font-display mt-2 text-6xl font-semibold" id="summary-title">
                        <AnimatedNumber value={summary.correct} />
                    </div>
                    <div className="mt-1 font-bold opacity-85">{sprint ? 'correct this speed round' : 'correct answers'}</div>
                    {summary.newBest && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-berbere-deep"
                        >
                            <Trophy className="size-3.5" /> New personal best
                        </motion.span>
                    )}
                </div>
                <div className="grid grid-cols-3 divide-x-2 divide-line border-b-2 border-line">
                    {[
                        { label: 'Accuracy', value: `${accuracy}%` },
                        { label: 'XP', value: `+${summary.xp}` },
                        { label: 'Best combo', value: summary.maxCombo },
                    ].map((s) => (
                        <div key={s.label} className="py-4">
                            <div className="tabular text-xl font-extrabold">{s.value}</div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{s.label}</div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-3 p-5">
                    <Button autoFocus onClick={onAgain} block>
                        <Repeat2 className="size-5" /> Play again
                    </Button>
                    <Button variant="ghost" onClick={onClose} block>
                        Choose another mode
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
