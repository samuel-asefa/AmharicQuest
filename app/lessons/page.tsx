'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Check, Crown, Lock, Sparkles, Zap } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button, ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress';
import { isLessonUnlocked, lessonIndex, lessons, units } from '@/lib/data';
import { useHydrated, useStats } from '@/lib/hooks';
import type { Lesson, Unit } from '@/lib/types';
import { cn } from '@/lib/utils';

const ROW = 128;
const NODE = 84;
const GROUP = 290; // node + label width used for the winding indent
const WAVE = [0.5, 0.82, 1, 0.82, 0.5, 0.18, 0, 0.18];

type NodeState = 'done' | 'current' | 'locked';

export default function JourneyPage() {
    const { progress } = useStats();
    const hydrated = useHydrated();
    const completed = progress.completedLessons;
    const [openId, setOpenId] = useState<string | null>(null);
    const doneCount = completed.filter((id) => lessons.some((l) => l.id === id)).length;
    const xpCollected = lessons.filter((l) => completed.includes(l.id)).reduce((s, l) => s + l.xpReward, 0);
    const allDone = doneCount === lessons.length;

    return (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 lg:py-10">
            <PageHeader
                eyebrow="The Journey"
                am="ጉዞ"
                title={
                    <>
                        Your quest across <span className="italic text-jade-ink">Ethiopia</span>
                    </>
                }
                subtitle="Twelve stops, from the capital to the Simien Mountains. Finish one to unlock the next."
            />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="tile mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
                <div className="flex-1">
                    <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-ink-2">
                            <span className="tabular text-lg font-extrabold text-ink">{doneCount}</span> of {lessons.length} stops
                        </span>
                        <span className="tabular text-sm font-extrabold text-jade-ink">
                            {Math.round((doneCount / lessons.length) * 100)}%
                        </span>
                    </div>
                    <ProgressBar value={doneCount / lessons.length} label="Journey progress" />
                </div>
                <div className="flex gap-2 sm:pl-2">
                    <span className="chip chip-gold h-9 px-3 text-sm">
                        <Zap className="size-4 fill-current" /> {xpCollected} XP
                    </span>
                    <span className="chip chip-lapis h-9 px-3 text-sm">
                        <BookOpen className="size-4" /> {progress.masteredWords.length} words
                    </span>
                </div>
            </motion.div>

            {units.map((unit) => (
                <UnitSection
                    key={unit.id}
                    unit={unit}
                    completed={completed}
                    hydrated={hydrated}
                    openId={openId}
                    setOpenId={setOpenId}
                />
            ))}

            <FinalCrest done={allDone} />
        </div>
    );
}

/* ---------------- Unit ---------------- */

function UnitSection({
    unit,
    completed,
    hydrated,
    openId,
    setOpenId,
}: {
    unit: Unit;
    completed: string[];
    hydrated: boolean;
    openId: string | null;
    setOpenId: (id: string | null) => void;
}) {
    const unitLessons = lessons.filter((l) => l.unit === unit.id);
    const done = unitLessons.filter((l) => completed.includes(l.id)).length;
    const onAccent = unit.accent === 'gold' ? 'var(--on-gold)' : '#fff';

    return (
        <section className="mt-12" aria-labelledby={`unit-${unit.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                className="relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7"
                style={{
                    color: onAccent,
                    background: `linear-gradient(135deg, var(--${unit.accent}) 0%, var(--${unit.accent}-deep) 100%)`,
                    boxShadow: `0 5px 0 0 color-mix(in srgb, var(--${unit.accent}-deep) 80%, black)`,
                }}
            >
                <span
                    aria-hidden
                    className="font-geez pointer-events-none absolute -bottom-12 right-2 select-none text-[9rem] font-bold leading-none opacity-[0.12]"
                >
                    {unitLessons[0]?.glyph}
                </span>
                <div className="relative flex items-center justify-between gap-4">
                    <div>
                        <div className="text-xs font-extrabold uppercase tracking-[0.16em] opacity-75">Unit {unit.id}</div>
                        <h2 id={`unit-${unit.id}`} className="font-display mt-1 text-3xl font-semibold" style={{ color: onAccent }}>
                            {unit.title}
                        </h2>
                        <p className="mt-1 max-w-sm text-sm font-medium opacity-85">{unit.subtitle}</p>
                    </div>
                    <div className="shrink-0 rounded-2xl bg-black/15 px-4 py-3 text-center">
                        <div className="tabular text-2xl font-extrabold leading-none">
                            {done}/{unitLessons.length}
                        </div>
                        <div className="mt-1 text-[10px] font-extrabold uppercase tracking-wider opacity-75">stops</div>
                    </div>
                </div>
            </motion.div>

            <Road lessons={unitLessons} completed={completed} hydrated={hydrated} openId={openId} setOpenId={setOpenId} />
        </section>
    );
}

/* ---------------- Road ---------------- */

function Road({
    lessons: list,
    completed,
    hydrated,
    openId,
    setOpenId,
}: {
    lessons: Lesson[];
    completed: string[];
    hydrated: boolean;
    openId: string | null;
    setOpenId: (id: string | null) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const span = Math.max(0, width - GROUP);
    const states: NodeState[] = list.map((l) => {
        const idx = lessonIndex(l.id);
        if (completed.includes(l.id)) return 'done';
        return isLessonUnlocked(idx, completed) ? 'current' : 'locked';
    });
    const points = list.map((l, i) => {
        const wave = WAVE[lessonIndex(l.id) % WAVE.length];
        return { x: span * wave + NODE / 2, y: i * ROW + ROW / 2, indent: span * wave };
    });

    const pathFor = (pts: typeof points) =>
        pts.reduce((d, p, i) => {
            if (i === 0) return `M ${p.x} ${p.y - ROW / 2} L ${p.x} ${p.y}`;
            const prev = pts[i - 1];
            const mid = (p.y - prev.y) / 2;
            return `${d} C ${prev.x} ${prev.y + mid}, ${p.x} ${p.y - mid}, ${p.x} ${p.y}`;
        }, '');

    const fullPath = pathFor(points);
    const lastDone = states.lastIndexOf('done');
    const reach = states.includes('current') ? lastDone + 1 : lastDone;
    const donePath = reach >= 0 ? pathFor(points.slice(0, reach + 1)) : '';
    const height = list.length * ROW;

    return (
        <div ref={ref} className="relative mt-4" style={{ height }}>
            {width > 0 && (
                <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden>
                    <path d={fullPath} fill="none" stroke="var(--line)" strokeWidth={18} strokeLinecap="round" />
                    {donePath && (
                        <motion.path
                            d={donePath}
                            fill="none"
                            stroke="var(--gold)"
                            strokeWidth={18}
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: hydrated ? 1 : 0 }}
                            transition={{ duration: 1.1, ease: 'easeInOut' }}
                        />
                    )}
                    <path
                        d={fullPath}
                        fill="none"
                        stroke="var(--paper)"
                        strokeWidth={2.5}
                        strokeDasharray="2 12"
                        strokeLinecap="round"
                        opacity={0.9}
                    />
                </svg>
            )}

            {width > 0 &&
                list.map((lesson, i) => (
                    <Stop
                        key={lesson.id}
                        lesson={lesson}
                        state={states[i]}
                        top={i * ROW + (ROW - NODE) / 2}
                        indent={points[i].indent}
                        width={width}
                        open={openId === lesson.id}
                        onToggle={() => setOpenId(openId === lesson.id ? null : lesson.id)}
                        onClose={() => setOpenId(null)}
                    />
                ))}
        </div>
    );
}

/* ---------------- Stop ---------------- */

function Stop({
    lesson,
    state,
    top,
    indent,
    width,
    open,
    onToggle,
    onClose,
}: {
    lesson: Lesson;
    state: NodeState;
    top: number;
    indent: number;
    width: number;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
}) {
    const { progress } = useStats();
    const nodeRef = useRef<HTMLButtonElement>(null);
    const idx = lessonIndex(lesson.id);
    const prev = idx > 0 ? lessons[idx - 1] : null;
    const perfect = progress.perfectLessons.includes(lesson.id);

    // Bring the current stop into view on arrival.
    useEffect(() => {
        if (state === 'current' && idx > 1) {
            nodeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [state, idx]);

    const cardWidth = Math.min(340, width);
    const cardLeft = Math.max(0, Math.min(indent - 16, width - cardWidth));

    const medallion: React.CSSProperties =
        state === 'done'
            ? {
                  background: 'radial-gradient(circle at 32% 26%, #ffe9a6 0%, #f4b000 50%, #c78700 100%)',
                  boxShadow: '0 6px 0 0 var(--gold-deep), inset 0 2px 0 rgb(255 255 255 / 0.5)',
                  color: 'var(--on-gold)',
              }
            : state === 'current'
              ? {
                    background: 'radial-gradient(circle at 32% 26%, #3ee0a2 0%, var(--jade) 55%, var(--jade-deep) 100%)',
                    boxShadow: '0 6px 0 0 var(--jade-deep), inset 0 2px 0 rgb(255 255 255 / 0.35)',
                    color: '#fff',
                }
              : {
                    background: 'var(--surface-2)',
                    boxShadow: '0 6px 0 0 var(--line), inset 0 0 0 3px var(--line)',
                    color: 'var(--ink-3)',
                };

    return (
        <div className="absolute inset-x-0" style={{ top, height: NODE }}>
            <div className="absolute flex items-center gap-4" style={{ left: indent }}>
                <div className="relative">
                    {state === 'current' && (
                        <>
                            <span className="animate-ping-soft absolute inset-0 rounded-full bg-jade" />
                            <span
                                className="animate-bob absolute -top-11 left-1/2 whitespace-nowrap rounded-xl border-2 border-line bg-surface px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-jade-ink shadow-[0_3px_0_0_var(--line)]"
                            >
                                {progress.completedLessons.length ? 'Up next' : 'Start'}
                                <span className="absolute -bottom-[7px] left-1/2 size-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-line bg-surface" />
                            </span>
                        </>
                    )}
                    <motion.button
                        ref={nodeRef}
                        type="button"
                        onClick={onToggle}
                        aria-expanded={open}
                        aria-label={`${lesson.place.en}: ${lesson.title}${state === 'locked' ? ' (locked)' : state === 'done' ? ' (completed)' : ''}`}
                        whileHover={{ y: -3, scale: 1.04 }}
                        whileTap={{ y: 4, scale: 0.98 }}
                        className="relative grid place-items-center rounded-full"
                        style={{ width: NODE, height: NODE, ...medallion }}
                    >
                        <span className="font-geez text-[2.6rem] font-bold leading-none">{lesson.glyph}</span>
                        {state === 'done' && (
                            <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full border-[3px] border-paper bg-jade text-white">
                                <Check className="size-3.5" strokeWidth={4} />
                            </span>
                        )}
                        {state === 'done' && perfect && (
                            <span className="absolute -left-1 -top-1 grid size-7 place-items-center rounded-full border-[3px] border-paper bg-plum text-white" title="Perfect">
                                <Sparkles className="size-3.5" />
                            </span>
                        )}
                        {state === 'locked' && (
                            <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-[3px] border-paper bg-line-strong text-surface">
                                <Lock className="size-3.5" strokeWidth={3} />
                            </span>
                        )}
                    </motion.button>
                </div>
                <button type="button" onClick={onToggle} className="min-w-0 max-w-[180px] text-left sm:max-w-[220px]" tabIndex={-1}>
                    <div className="font-geez text-xs font-semibold text-ink-3">{lesson.place.am}</div>
                    <div className={cn('truncate font-bold leading-tight', state === 'locked' ? 'text-ink-3' : 'text-ink')}>
                        {lesson.place.en}
                    </div>
                    <div className="truncate text-sm text-ink-3">{lesson.title}</div>
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-20" onClick={onClose} aria-hidden />
                        <motion.div
                            role="dialog"
                            aria-label={lesson.title}
                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                            className="tile absolute z-30 p-5"
                            style={{ top: NODE + 16, left: cardLeft, width: cardWidth, boxShadow: '0 4px 0 0 var(--line), var(--shadow-pop)' }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="eyebrow !text-[0.65rem]">
                                        Stop {idx + 1} · <span className="font-geez normal-case tracking-normal">{lesson.place.am}</span>
                                    </div>
                                    <h3 className="font-display mt-1 text-2xl font-semibold leading-tight">{lesson.title}</h3>
                                </div>
                                {state === 'done' && (
                                    <span className="chip chip-jade">
                                        <Check className="size-3.5" strokeWidth={3} /> Done
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-ink-2">{lesson.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="chip">
                                    <BookOpen className="size-3.5" /> {lesson.items.length} words
                                </span>
                                <span className="chip chip-gold">
                                    <Zap className="size-3.5 fill-current" /> +{lesson.xpReward} XP
                                </span>
                                <span className="chip capitalize">{lesson.difficulty}</span>
                            </div>
                            <div className="mt-4">
                                {state === 'locked' ? (
                                    <>
                                        <Button variant="outline" block disabled>
                                            <Lock className="size-4" /> Locked
                                        </Button>
                                        <p className="mt-2 text-center text-xs font-semibold text-ink-3">
                                            Finish {prev?.place.en} to unlock this stop
                                        </p>
                                    </>
                                ) : (
                                    <ButtonLink href={`/lessons/${lesson.id}`} variant={state === 'done' ? 'gold' : 'jade'} block>
                                        {state === 'done' ? 'Practice again' : 'Start lesson'}
                                    </ButtonLink>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---------------- Finale ---------------- */

function FinalCrest({ done }: { done: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn('mt-12 flex flex-col items-center text-center', !done && 'opacity-70')}
        >
            <div
                className="grid size-28 place-items-center rounded-full"
                style={
                    done
                        ? {
                              background: 'radial-gradient(circle at 32% 26%, #ffe9a6 0%, #f4b000 50%, #c78700 100%)',
                              boxShadow: '0 7px 0 0 var(--gold-deep), 0 0 60px rgb(244 176 0 / 0.45)',
                          }
                        : { background: 'var(--surface-2)', boxShadow: '0 7px 0 0 var(--line), inset 0 0 0 3px var(--line)' }
                }
            >
                <Crown className={cn('size-12', done ? 'text-on-gold' : 'text-ink-3')} strokeWidth={2.2} />
            </div>
            <h3 className="font-display mt-5 text-2xl font-semibold">{done ? 'Quest complete!' : "Journey's end"}</h3>
            <p className="mt-1 max-w-xs text-sm text-ink-3">
                {done
                    ? 'You crossed the whole map. ጎበዝ — well done!'
                    : 'Complete every stop to claim the crown.'}
            </p>
        </motion.div>
    );
}
