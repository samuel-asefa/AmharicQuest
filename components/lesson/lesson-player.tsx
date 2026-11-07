'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Crown, Flame, Repeat2, Sparkles, Target, X, Zap } from 'lucide-react';
import { Tibeb } from '@/components/brand/tibeb';
import { ChoiceQuestionView } from '@/components/quiz/choice-question';
import { FeedbackSheet, randomPraise, type Feedback } from '@/components/quiz/feedback-sheet';
import { Flashcard } from '@/components/quiz/flashcard';
import { MatchQuestionView } from '@/components/quiz/match-question';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Button, ButtonLink } from '@/components/ui/button';
import { celebrate } from '@/components/ui/confetti';
import { ProgressBar } from '@/components/ui/progress';
import { getLesson, lessonIndex, lessons } from '@/lib/data';
import { useHotkeys } from '@/lib/hooks';
import { buildLessonQuiz, lessonQuizLength, type ChoiceQuestion, type Question } from '@/lib/quiz';
import { sfx } from '@/lib/sound';
import { useAppStore } from '@/lib/store';
import { cn, LEVEL_TITLES, levelInfo, shuffle } from '@/lib/utils';

type Phase = 'intro' | 'learn' | 'quiz' | 'done';

interface Result {
    xp: number;
    bonus: number;
    accuracy: number;
    seconds: number;
    maxCombo: number;
    perfect: boolean;
    firstTime: boolean;
    newLevel: number | null;
}

export function LessonPlayer({ lessonId }: { lessonId: string }) {
    const lesson = getLesson(lessonId)!;
    const idx = lessonIndex(lessonId);
    const nextLesson = lessons[idx + 1] ?? null;
    const router = useRouter();

    const [phase, setPhase] = useState<Phase>('intro');
    const [card, setCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [queue, setQueue] = useState<Question[]>([]);
    const [qi, setQi] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [doneSteps, setDoneSteps] = useState(0);
    const [combo, setCombo] = useState(0);
    const [confirmExit, setConfirmExit] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const tally = useRef({ correct: 0, wrong: 0, maxCombo: 0, startedAt: 0 });

    const n = lesson.items.length;
    const total = n + lessonQuizLength(lesson);
    const pct =
        phase === 'intro' ? 0 : phase === 'learn' ? card / total : phase === 'quiz' ? (n + doneSteps) / total : 1;

    /* ---------- Flow ---------- */

    const startLearning = () => {
        tally.current = { correct: 0, wrong: 0, maxCombo: 0, startedAt: Date.now() };
        sfx.tap();
        setPhase('learn');
    };

    const startQuiz = () => {
        const qs = buildLessonQuiz(lesson);
        setQueue(qs);
        setQi(0);
        setDoneSteps(0);
        setPhase('quiz');
    };

    const nextCard = () => {
        if (card < n - 1) {
            setCard(card + 1);
            setFlipped(false);
        } else {
            startQuiz();
        }
    };
    const prevCard = () => {
        if (card > 0) {
            setCard(card - 1);
            setFlipped(false);
        }
    };
    const flip = () => {
        sfx.flip();
        setFlipped((f) => !f);
    };

    const markCorrect = () => {
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        tally.current.correct += 1;
        tally.current.maxCombo = Math.max(tally.current.maxCombo, nextCombo);
        useAppStore.getState().recordAnswer(true);
        setDoneSteps((d) => d + 1);
        return nextCombo;
    };

    const answerChoice = (optionId: string) => {
        if (selected) return;
        const q = queue[qi] as ChoiceQuestion;
        setSelected(optionId);
        if (optionId === q.answerId) {
            markCorrect();
            if (q.wordId) useAppStore.getState().masterWord(q.wordId);
            sfx.correct();
            const praise = randomPraise();
            setFeedback({ correct: true, title: praise.en, titleAm: praise.am, detail: q.reveal.detail });
        } else {
            setCombo(0);
            tally.current.wrong += 1;
            useAppStore.getState().recordAnswer(false);
            sfx.wrong();
            setFeedback({ correct: false, title: 'Not quite', detail: `Answer: ${q.reveal.label}${q.reveal.detail ? ` — ${q.reveal.detail}` : ''}` });
            // Ask once more at the end; a second miss just moves on.
            if (!q.key.endsWith('-retry')) {
                setQueue((qs) => [...qs, { ...q, key: `${q.key}-retry`, options: shuffle(q.options) }]);
            } else {
                setDoneSteps((d) => d + 1);
            }
        }
    };

    const matchDone = (mistakes: number) => {
        tally.current.wrong += mistakes;
        markCorrect();
        sfx.correct();
        setFeedback({
            correct: true,
            titleAm: 'ጎበዝ!',
            title: mistakes === 0 ? 'Perfect pairs!' : 'All matched!',
            detail: mistakes === 0 ? 'Not a single slip.' : `${mistakes} mismatch${mistakes === 1 ? '' : 'es'} along the way.`,
        });
    };

    const finish = () => {
        const store = useAppStore.getState();
        const before = store.progress;
        const firstTime = !before.completedLessons.includes(lesson.id);
        const { correct, wrong, maxCombo, startedAt } = tally.current;
        const perfect = wrong === 0;
        const xp = firstTime ? lesson.xpReward : Math.max(10, Math.round(lesson.xpReward / 4));
        const bonus = perfect ? 10 : 0;
        const levelBefore = levelInfo(before.totalXP).level;
        const levelAfter = levelInfo(before.totalXP + xp + bonus).level;

        store.awardXP(xp + bonus);
        store.completeLesson(lesson.id, { perfect, wordIds: lesson.items.map((i) => i.id) });
        store.recordCombo(maxCombo);

        setResult({
            xp,
            bonus,
            accuracy: correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 100,
            seconds: Math.round((Date.now() - startedAt) / 1000),
            maxCombo,
            perfect,
            firstTime,
            newLevel: levelAfter > levelBefore ? levelAfter : null,
        });
        setPhase('done');
        sfx.complete();
        setTimeout(celebrate, 150);
    };

    const continueNext = useCallback(() => {
        setFeedback(null);
        setSelected(null);
        if (qi + 1 < queue.length) setQi(qi + 1);
        else finish();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qi, queue.length]);

    const replay = () => {
        setCard(0);
        setFlipped(false);
        setCombo(0);
        setResult(null);
        setPhase('intro');
    };

    /* ---------- Keyboard ---------- */

    useHotkeys(
        useCallback(
            (e: KeyboardEvent) => {
                if (phase === 'intro' && e.key === 'Enter') {
                    e.preventDefault();
                    startLearning();
                } else if (phase === 'learn') {
                    if (e.key === ' ') {
                        e.preventDefault();
                        flip();
                    } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        nextCard();
                    } else if (e.key === 'ArrowLeft') {
                        prevCard();
                    }
                } else if (phase === 'done' && e.key === 'Enter') {
                    router.push('/lessons');
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [phase, card],
        ),
        !feedback,
    );

    const current = queue[qi];

    return (
        <div className="flex min-h-dvh flex-col">
            {/* Top bar */}
            <header className="glass sticky top-0 z-30">
                <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-4 sm:px-6">
                    <button
                        type="button"
                        onClick={() => (phase === 'learn' || phase === 'quiz' ? setConfirmExit(true) : router.push('/lessons'))}
                        className="grid size-10 shrink-0 place-items-center rounded-xl text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
                        aria-label="Leave lesson"
                    >
                        <X className="size-6" strokeWidth={2.5} />
                    </button>
                    <ProgressBar value={pct} height={16} className="flex-1" label="Lesson progress" />
                    <AnimatePresence mode="popLayout">
                        {combo > 1 ? (
                            <motion.span
                                key={combo}
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.4, opacity: 0 }}
                                className="chip chip-berbere h-9 px-3 text-sm"
                            >
                                <Flame className="size-4 fill-current" /> {combo}
                            </motion.span>
                        ) : (
                            <motion.span key="place" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-geez hidden text-sm font-semibold text-ink-3 sm:block">
                                {lesson.place.am}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-56 pt-6 sm:px-6 sm:pt-10">
                <AnimatePresence mode="wait">
                    {phase === 'intro' && (
                        <motion.section
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="relative mt-4 grid size-44 place-items-center">
                                <span className="animate-ping-soft absolute inset-4 rounded-full bg-jade/40" />
                                <span className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-line-strong" />
                                <motion.span
                                    initial={{ scale: 0.6, rotate: -12 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                                    className="relative grid size-32 place-items-center rounded-full"
                                    style={{
                                        background: 'radial-gradient(circle at 32% 26%, #3ee0a2 0%, var(--jade) 55%, var(--jade-deep) 100%)',
                                        boxShadow: '0 7px 0 0 var(--jade-deep), inset 0 2px 0 rgb(255 255 255 / 0.35)',
                                    }}
                                >
                                    <span className="font-geez text-7xl font-bold text-white">{lesson.glyph}</span>
                                </motion.span>
                            </div>
                            <div className="eyebrow mt-6">
                                Stop {idx + 1} of {lessons.length} ·{' '}
                                <span className="font-geez normal-case tracking-normal">{lesson.place.am}</span>
                            </div>
                            <h1 className="font-display mt-2 text-5xl font-semibold sm:text-6xl">{lesson.place.en}</h1>
                            <p className="mt-3 text-xl font-bold text-ink-2">{lesson.title}</p>
                            <p className="mt-1 max-w-md text-ink-3">{lesson.description}</p>
                            <div className="mt-5 flex flex-wrap justify-center gap-2">
                                <span className="chip">
                                    <BookOpen className="size-3.5" /> {n} words
                                </span>
                                <span className="chip">
                                    <Target className="size-3.5" /> {lessonQuizLength(lesson)} challenges
                                </span>
                                <span className="chip chip-gold">
                                    <Zap className="size-3.5 fill-current" /> +{lesson.xpReward} XP
                                </span>
                            </div>
                            <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2">
                                {lesson.items.map((w, i) => (
                                    <motion.span
                                        key={w.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + i * 0.05 }}
                                        className="font-geez rounded-xl border-2 border-line bg-surface px-3 py-1 text-lg font-bold"
                                    >
                                        {w.amharic}
                                    </motion.span>
                                ))}
                            </div>
                            <Button size="lg" className="mt-9 min-w-56" onClick={startLearning}>
                                Let&apos;s go <ArrowRight className="size-5" />
                            </Button>
                            <p className="mt-3 hidden text-xs font-semibold text-ink-3 sm:block">or press Enter</p>
                        </motion.section>
                    )}

                    {phase === 'learn' && (
                        <motion.section
                            key="learn"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                        >
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="eyebrow">
                                        New word {card + 1} of {n}
                                    </div>
                                    <h2 className="font-display mt-1 text-3xl font-semibold">Meet the words</h2>
                                </div>
                                <span className="chip chip-jade">
                                    <Sparkles className="size-3.5" /> New
                                </span>
                            </div>
                            <div className="mt-5">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={card}
                                        initial={{ opacity: 0, x: 40, rotate: 2 }}
                                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                                        exit={{ opacity: 0, x: -40, rotate: -2 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                    >
                                        <Flashcard item={lesson.items[card]} flipped={flipped} onFlip={flip} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <div className="mt-5 flex items-center justify-center gap-1.5">
                                {lesson.items.map((w, i) => (
                                    <span
                                        key={w.id}
                                        className={cn(
                                            'h-2 rounded-full transition-all duration-300',
                                            i === card ? 'w-7 bg-jade' : i < card ? 'w-2 bg-jade/50' : 'w-2 bg-line-strong',
                                        )}
                                    />
                                ))}
                            </div>
                            <div className="mt-6 grid grid-cols-[auto_1fr_1fr] gap-3">
                                <Button variant="outline" size="icon" className="h-[3.25rem] w-[3.25rem]" onClick={prevCard} disabled={card === 0} aria-label="Previous word">
                                    <ArrowLeft className="size-5" />
                                </Button>
                                <Button variant="outline" onClick={flip}>
                                    <Repeat2 className="size-5" /> Flip
                                </Button>
                                <Button onClick={nextCard}>
                                    {card < n - 1 ? 'Next' : 'Start quiz'} <ArrowRight className="size-5" />
                                </Button>
                            </div>
                            <p className="mt-3 hidden text-center text-xs font-semibold text-ink-3 sm:block">
                                Space to flip · Enter for next
                            </p>
                        </motion.section>
                    )}

                    {phase === 'quiz' && current && (
                        <motion.section
                            key={current.key}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {current.key.endsWith('-retry') && (
                                <span className="chip chip-berbere mb-3">
                                    <Repeat2 className="size-3.5" /> Second chance
                                </span>
                            )}
                            {current.kind === 'choice' ? (
                                <ChoiceQuestionView q={current} selected={selected} onSelect={answerChoice} />
                            ) : (
                                <MatchQuestionView q={current} onDone={matchDone} />
                            )}
                        </motion.section>
                    )}

                    {phase === 'done' && result && (
                        <LessonComplete
                            key="done"
                            result={result}
                            lessonTitle={lesson.title}
                            place={lesson.place.en}
                            words={lesson.items.map((w) => w.amharic)}
                            nextLesson={nextLesson}
                            onReplay={replay}
                        />
                    )}
                </AnimatePresence>
            </main>

            <FeedbackSheet feedback={feedback} combo={combo} onContinue={continueNext} />

            <AnimatePresence>
                {confirmExit && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
                        onClick={() => setConfirmExit(false)}
                    >
                        <motion.div
                            role="alertdialog"
                            aria-modal
                            aria-labelledby="exit-title"
                            initial={{ scale: 0.92, y: 16 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 16 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="tile w-full max-w-sm p-6 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="font-geez text-6xl font-bold text-berbere">ቆይ</div>
                            <h2 id="exit-title" className="font-display mt-3 text-2xl font-semibold">
                                Wait — leave this stop?
                            </h2>
                            <p className="mt-2 text-sm text-ink-3">You will lose your progress in this lesson.</p>
                            <div className="mt-6 flex flex-col gap-3">
                                <Button autoFocus onClick={() => setConfirmExit(false)} block>
                                    Keep learning
                                </Button>
                                <Button variant="ghost" onClick={() => router.push('/lessons')} block className="text-berbere-ink">
                                    Leave lesson
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---------------- Completion ---------------- */

function LessonComplete({
    result,
    lessonTitle,
    place,
    words,
    nextLesson,
    onReplay,
}: {
    result: Result;
    lessonTitle: string;
    place: string;
    words: string[];
    nextLesson: (typeof lessons)[number] | null;
    onReplay: () => void;
}) {
    const mins = Math.floor(result.seconds / 60);
    const secs = String(result.seconds % 60).padStart(2, '0');
    const stats = [
        { label: 'XP earned', value: result.xp + result.bonus, icon: Zap, accent: 'gold', suffix: '' },
        { label: 'Accuracy', value: result.accuracy, icon: Target, accent: 'jade', suffix: '%' },
        { label: 'Best combo', value: result.maxCombo, icon: Flame, accent: 'berbere', suffix: '' },
    ] as const;

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center"
        >
            <motion.div
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.1 }}
                className="relative mt-2 grid size-36 place-items-center rounded-full"
                style={{
                    background: 'radial-gradient(circle at 32% 26%, #ffe9a6 0%, #f4b000 50%, #c78700 100%)',
                    boxShadow: '0 8px 0 0 var(--gold-deep), 0 0 80px rgb(244 176 0 / 0.5), inset 0 3px 0 rgb(255 255 255 / 0.55)',
                }}
            >
                <span className="absolute inset-3 rounded-full border-2 border-[#8a5d00]/30" />
                <Crown className="size-16 text-on-gold" strokeWidth={2.2} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <div className="font-geez mt-6 text-4xl font-bold text-gold-ink">ጎበዝ!</div>
                <h1 className="font-display mt-1 text-4xl font-semibold sm:text-5xl">Lesson complete</h1>
                <p className="mt-2 text-ink-2">
                    You finished <strong>{lessonTitle}</strong> in {place}
                    {result.perfect ? ' without a single mistake.' : '.'}
                </p>
            </motion.div>

            <div className="mt-8 grid w-full max-w-xl grid-cols-3 gap-3">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                        className="overflow-hidden rounded-2xl border-2"
                        style={{ borderColor: `var(--${s.accent})`, boxShadow: `0 4px 0 0 var(--${s.accent}-deep)` }}
                    >
                        <div
                            className="py-1.5 text-[11px] font-extrabold uppercase tracking-wider"
                            style={{ background: `var(--${s.accent})`, color: s.accent === 'gold' ? 'var(--on-gold)' : '#fff' }}
                        >
                            {s.label}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 bg-surface py-4 text-2xl font-extrabold" style={{ color: `var(--${s.accent}-ink)` }}>
                            <s.icon className="size-5" />
                            <span className="tabular">
                                <AnimatedNumber value={s.value} />
                                {s.suffix}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-4 flex flex-wrap justify-center gap-2"
            >
                <span className="chip">
                    <Clock className="size-3.5" /> {mins}:{secs}
                </span>
                {result.bonus > 0 && (
                    <span className="chip chip-plum">
                        <Sparkles className="size-3.5" /> Perfect bonus +{result.bonus}
                    </span>
                )}
                {!result.firstTime && <span className="chip">Replay XP</span>}
            </motion.div>

            {result.newLevel && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, type: 'spring' }}
                    className="hero-ink mt-6 flex w-full max-w-xl items-center gap-4 rounded-2xl p-4 text-left"
                >
                    <span className="grid size-12 place-items-center rounded-xl bg-gold text-xl font-extrabold text-on-gold">
                        {result.newLevel}
                    </span>
                    <div>
                        <div className="font-extrabold text-white">Level up!</div>
                        <div className="text-sm text-white/70">
                            You reached level {result.newLevel}: {LEVEL_TITLES[Math.min(result.newLevel - 1, LEVEL_TITLES.length - 1)]}.
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="tile mt-6 w-full max-w-xl overflow-hidden text-left"
            >
                <Tibeb height={8} />
                <div className="p-5">
                    <div className="eyebrow !text-[0.65rem]">Words you learned</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {words.map((w) => (
                            <span key={w} className="font-geez rounded-xl bg-jade-soft px-3 py-1 text-lg font-bold text-jade-ink">
                                {w}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                {nextLesson ? (
                    <ButtonLink href={`/lessons/${nextLesson.id}`} size="lg" className="flex-1">
                        Next stop: {nextLesson.place.en} <ArrowRight className="size-5" />
                    </ButtonLink>
                ) : (
                    <ButtonLink href="/lessons" variant="gold" size="lg" className="flex-1">
                        See your journey <ArrowRight className="size-5" />
                    </ButtonLink>
                )}
                <Button variant="outline" size="lg" onClick={onReplay}>
                    <Repeat2 className="size-5" /> Replay
                </Button>
            </div>
            <Link href="/lessons" className="mt-4 text-sm font-bold text-ink-3 hover:text-ink">
                Back to the map
            </Link>
        </motion.section>
    );
}
