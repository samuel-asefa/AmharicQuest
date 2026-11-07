'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, BookOpen, Check, Crown, Flame, Languages, MapPin, Sparkles, Zap } from 'lucide-react';
import { Tibeb } from '@/components/brand/tibeb';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { ButtonLink } from '@/components/ui/button';
import { ProgressBar, ProgressRing } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { lessonIndex, lessons, nextLessonFor, vocabularyData, wordOfTheDay } from '@/lib/data';
import { CHAR_ROMAN, FIDEL, FIDEL_COUNT } from '@/lib/fidel';
import { useIsClient, useStats } from '@/lib/hooks';
import { cn, currentHour, dayKey, greetingFor, lastDays, weekdayLetter } from '@/lib/utils';

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const rise: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomePage() {
    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:px-10 lg:py-10"
        >
            <QuestHero />
            <StatsRow />
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
                <WordOfTheDay />
                <PracticeShortcuts />
            </div>
            <FidelShowcase />
        </motion.div>
    );
}

/* ---------------- Hero ---------------- */

function QuestHero() {
    const { progress } = useStats();
    const { user } = useAuth();
    const isClient = useIsClient();
    const next = nextLessonFor(progress.completedLessons);
    const stop = next ? lessonIndex(next.id) + 1 : lessons.length;
    const greeting = isClient ? greetingFor(currentHour()) : { am: 'ሰላም', en: 'Welcome' };
    const firstName = user?.displayName?.split(' ')[0];
    const glyph = next?.glyph ?? 'ጎ';

    return (
        <motion.section variants={rise} className="hero-jade relative overflow-hidden rounded-[2rem]">
            <span
                aria-hidden
                className="font-geez pointer-events-none absolute -right-10 -top-16 select-none text-[20rem] font-bold leading-none text-white/[0.06] sm:text-[26rem]"
            >
                {glyph}
            </span>
            <div
                aria-hidden
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.45) 1px, transparent 0)',
                    backgroundSize: '22px 22px',
                    maskImage: 'linear-gradient(100deg, transparent 30%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(100deg, transparent 30%, black 100%)',
                }}
            />

            <div className="relative grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto] md:items-center lg:p-12">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="chip chip-glass">
                            <MapPin className="size-3.5" />
                            {next ? `Stop ${stop} of ${lessons.length}` : 'Journey complete'}
                        </span>
                        {next && <span className="chip chip-glass font-geez">{next.place.am}</span>}
                    </div>

                    <p className="mt-6 font-semibold text-white/80">
                        <span className="font-geez">{greeting.am}</span>
                        <span className="mx-2 text-white/40">·</span>
                        {greeting.en}
                        {firstName ? `, ${firstName}` : ''}
                    </p>
                    <h1 className="font-display mt-2 text-[2.6rem] font-semibold leading-[1.02] text-white sm:text-6xl">
                        {next ? (
                            <>
                                Next stop:{' '}
                                <span className="italic text-[#ffd560]">{next.place.en}</span>
                            </>
                        ) : (
                            <>
                                You crossed <span className="italic text-[#ffd560]">Ethiopia!</span>
                            </>
                        )}
                    </h1>
                    <p className="mt-4 max-w-md text-lg text-white/80">
                        {next ? (
                            <>
                                <strong className="font-bold text-white">{next.title}.</strong> {next.description}
                            </>
                        ) : (
                            'Every stop on the journey is complete. ጎበዝ! Keep your skills sharp with practice.'
                        )}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <ButtonLink href={next ? `/lessons/${next.id}` : '/practice'} variant="white" size="lg" className="w-full sm:w-auto">
                            {next ? (progress.completedLessons.length ? 'Continue quest' : 'Start your quest') : 'Practice now'}
                            <ArrowRight className="size-5" />
                        </ButtonLink>
                        <ButtonLink href="/lessons" variant="glass" size="lg" className="w-full sm:w-auto">
                            View journey
                        </ButtonLink>
                    </div>

                    {next && (
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-white/75">
                            <span className="inline-flex items-center gap-1.5">
                                <BookOpen className="size-4" /> {next.items.length} new words
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Zap className="size-4 fill-[#ffd560] text-[#ffd560]" /> +{next.xpReward} XP
                            </span>
                        </div>
                    )}
                </div>

                <Medallion glyph={glyph} done={!next} />
            </div>

            <JourneyTrack completed={progress.completedLessons} />
            <Tibeb height={12} />
        </motion.section>
    );
}

function Medallion({ glyph, done }: { glyph: string; done: boolean }) {
    return (
        <div className="relative mx-auto hidden size-56 place-items-center md:grid lg:size-64">
            <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-white/30">
                {[0, 72, 144, 216, 288].map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    return (
                        <span
                            key={deg}
                            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                left: `${50 + 50 * Math.sin(rad)}%`,
                                top: `${50 - 50 * Math.cos(rad)}%`,
                                background: ['#ffd560', '#e04a2f', '#fff', '#12c486', '#ffd560'][i],
                            }}
                        />
                    );
                })}
            </div>
            <div className="absolute inset-5 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm sm:inset-6" />
            <motion.div
                className="relative grid size-32 place-items-center rounded-full sm:size-40"
                style={{
                    background: 'radial-gradient(circle at 32% 26%, #ffe9a6 0%, #f4b000 46%, #c78700 100%)',
                    boxShadow:
                        '0 8px 0 0 #8a5d00, 0 24px 50px -12px rgb(0 0 0 / 0.55), inset 0 3px 0 rgb(255 255 255 / 0.55)',
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span className="absolute inset-2.5 rounded-full border-2 border-[#8a5d00]/30" />
                {done ? (
                    <Crown className="size-16 text-on-gold" strokeWidth={2.2} />
                ) : (
                    <span className="font-geez text-7xl font-bold leading-none text-on-gold sm:text-8xl">{glyph}</span>
                )}
            </motion.div>
        </div>
    );
}

function JourneyTrack({ completed }: { completed: string[] }) {
    return (
        <div className="relative flex items-center gap-1.5 px-6 pb-6 sm:px-10 lg:px-12" aria-label="Journey progress">
            {lessons.map((l, i) => {
                const done = completed.includes(l.id);
                return (
                    <motion.span
                        key={l.id}
                        title={`${l.place.en} — ${l.title}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                        className={cn(
                            'h-2 flex-1 origin-left rounded-full',
                            done ? 'bg-[#ffd560] shadow-[0_0_12px_rgb(255_213_96/0.6)]' : 'bg-white/20',
                        )}
                    />
                );
            })}
        </div>
    );
}

/* ---------------- Stats ---------------- */

function StatsRow() {
    const { progress, streak, today, goal, level } = useStats();
    const week = lastDays(7);
    const goalPct = Math.min(1, today / goal);
    const vocab = vocabularyData.length;

    return (
        <motion.section variants={rise} className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Link href="/profile#settings" className="tile tile-hover flex items-center gap-4 p-4 sm:p-5">
                <ProgressRing value={goalPct} size={64} stroke={8} accent={goalPct >= 1 ? 'gold' : 'jade'} label="Daily goal">
                    {goalPct >= 1 ? (
                        <Check className="size-6 text-gold-ink" strokeWidth={3} />
                    ) : (
                        <span className="tabular text-sm font-extrabold">{Math.round(goalPct * 100)}%</span>
                    )}
                </ProgressRing>
                <div className="min-w-0">
                    <div className="eyebrow !text-[0.65rem]">Daily goal</div>
                    <div className="tabular text-xl font-extrabold">
                        {today}
                        <span className="text-sm font-bold text-ink-3">/{goal}</span>
                    </div>
                    <div className="truncate text-xs font-semibold text-ink-3">
                        {goalPct >= 1 ? 'Goal reached! ጎበዝ!' : `${goal - today} XP to go`}
                    </div>
                </div>
            </Link>

            <div className="tile p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="eyebrow !text-[0.65rem]">Streak</div>
                        <div className="tabular flex items-baseline gap-1 text-xl font-extrabold">
                            <AnimatedNumber value={streak} />
                            <span className="text-sm font-bold text-ink-3">{streak === 1 ? 'day' : 'days'}</span>
                        </div>
                    </div>
                    <Flame className={cn('size-9', streak > 0 ? 'animate-flame fill-gold text-berbere' : 'text-line-strong')} />
                </div>
                <div className="mt-3 flex justify-between gap-0.5">
                    {week.map((d) => {
                        const active = (progress.xpHistory[d] ?? 0) > 0;
                        const isToday = d === dayKey();
                        return (
                            <div key={d} className="flex flex-col items-center gap-1">
                                <span
                                    className={cn(
                                        'grid size-4 place-items-center rounded-full min-[400px]:size-5 sm:size-6',
                                        active ? 'bg-berbere text-white' : 'bg-paper-2',
                                        isToday && !active && 'ring-2 ring-berbere/40',
                                    )}
                                >
                                    {active && <Check className="size-2.5 sm:size-3" strokeWidth={4} />}
                                </span>
                                <span className={cn('text-[10px] font-bold', isToday ? 'text-berbere-ink' : 'text-ink-3')}>
                                    {weekdayLetter(d)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="tile p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="eyebrow !text-[0.65rem]">Level {level.level}</div>
                        <div className="tabular flex items-baseline gap-1 text-xl font-extrabold">
                            <AnimatedNumber value={progress.totalXP} />
                            <span className="text-sm font-bold text-ink-3">XP</span>
                        </div>
                    </div>
                    <span className="grid size-10 place-items-center rounded-xl bg-gold-soft">
                        <Zap className="size-5 fill-gold text-gold-deep" />
                    </span>
                </div>
                <ProgressBar value={level.pct} accent="gold" height={10} className="mt-4" label="Level progress" />
                <div className="mt-2 truncate text-xs font-semibold text-ink-3">
                    {level.title} · {level.toNext} XP to level {level.level + 1}
                </div>
            </div>

            <div className="tile p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="eyebrow !text-[0.65rem]">Words</div>
                        <div className="tabular flex items-baseline gap-1 text-xl font-extrabold">
                            <AnimatedNumber value={progress.masteredWords.length} />
                            <span className="text-sm font-bold text-ink-3">/ {vocab}</span>
                        </div>
                    </div>
                    <span className="grid size-10 place-items-center rounded-xl bg-lapis-soft">
                        <BookOpen className="size-5 text-lapis-ink" />
                    </span>
                </div>
                <ProgressBar value={progress.masteredWords.length / vocab} accent="lapis" height={10} className="mt-4" label="Words learned" />
                <div className="mt-2 truncate text-xs font-semibold text-ink-3">
                    {progress.completedLessons.length} of {lessons.length} lessons done
                </div>
            </div>
        </motion.section>
    );
}

/* ---------------- Word of the day ---------------- */

function WordOfTheDay() {
    const isClient = useIsClient();
    const word = isClient ? wordOfTheDay(dayKey()) : null;
    const chars = word ? Array.from(word.amharic).filter((c) => c.trim() && c !== '?') : [];

    return (
        <motion.section variants={rise} className="tile min-w-0 overflow-hidden lg:col-span-3">
            <Tibeb height={8} />
            <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3">
                    <div className="eyebrow">
                        <Sparkles className="size-3.5 text-gold" />
                        Word of the day
                        <span className="font-geez normal-case tracking-normal">· የዕለቱ ቃል</span>
                    </div>
                    {word && <span className="chip chip-gold">{word.category}</span>}
                </div>

                {word ? (
                    <motion.div key={word.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5">
                        <div className="font-geez text-6xl font-bold leading-tight sm:text-7xl">{word.amharic}</div>
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="font-display text-2xl font-medium italic text-ink-2">{word.phonetic}</span>
                            <span className="text-ink-3">—</span>
                            <span className="font-display text-2xl font-semibold">{word.english}</span>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {chars.map((c, i) => (
                                <motion.div
                                    key={`${c}-${i}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.06 }}
                                    className="flex min-w-14 flex-col items-center rounded-2xl border-2 border-line bg-surface-2 px-3 py-2"
                                >
                                    <span className="font-geez text-2xl font-bold leading-tight">{c}</span>
                                    <span className="text-xs font-bold text-jade-ink">{CHAR_ROMAN[c] ?? '·'}</span>
                                </motion.div>
                            ))}
                        </div>
                        <p className="mt-3 text-sm text-ink-3">Each Fidel character is one syllable — read it one tile at a time.</p>
                    </motion.div>
                ) : (
                    <div className="mt-5 h-48 animate-pulse rounded-2xl bg-paper-2" />
                )}
            </div>
        </motion.section>
    );
}

/* ---------------- Practice shortcuts ---------------- */

const shortcuts = [
    {
        href: '/practice?mode=meaning',
        title: 'Vocabulary sprint',
        text: 'Quick-fire word quizzes with combos',
        accent: 'lapis',
        icon: Languages,
    },
    {
        href: '/practice?mode=fidel',
        title: 'Fidel drill',
        text: 'Read characters by sound',
        accent: 'gold',
        glyph: 'ሀ',
    },
    {
        href: '/practice?mode=sprint',
        title: 'Speed round',
        text: '60 seconds. How far can you go?',
        accent: 'berbere',
        icon: Zap,
    },
] as const;

function PracticeShortcuts() {
    return (
        <motion.section variants={rise} className="flex min-w-0 flex-col gap-4 lg:col-span-2">
            <div className="flex items-center justify-between px-1">
                <h2 className="font-display text-2xl font-semibold">Practice</h2>
                <Link href="/practice" className="text-sm font-bold text-jade-ink hover:underline">
                    See all
                </Link>
            </div>
            {shortcuts.map((s) => (
                <Link key={s.href} href={s.href} className="tile tile-hover group flex items-center gap-4 p-4">
                    <span
                        className="grid size-14 shrink-0 place-items-center rounded-2xl text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
                        style={{ background: `var(--${s.accent})`, boxShadow: `0 4px 0 0 var(--${s.accent}-deep)` }}
                    >
                        {'icon' in s ? (
                            <s.icon className="size-6" strokeWidth={2.4} />
                        ) : (
                            <span className="font-geez text-3xl font-bold leading-none">{s.glyph}</span>
                        )}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-bold">{s.title}</span>
                        <span className="block truncate text-sm text-ink-3">{s.text}</span>
                    </span>
                    <ArrowRight className="size-5 text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
            ))}
        </motion.section>
    );
}

/* ---------------- Fidel showcase ---------------- */

const rowA = FIDEL.slice(0, 17).flatMap((f) => f.forms.map((x) => x.char));
const rowB = FIDEL.slice(17).flatMap((f) => f.forms.map((x) => x.char));

function GlyphRow({ chars, reverse }: { chars: string[]; reverse?: boolean }) {
    return (
        <div className="mask-fade-x overflow-hidden">
            <div
                className={cn(
                    'flex w-max gap-3 hover:[animation-play-state:paused]',
                    reverse ? 'animate-marquee-reverse' : 'animate-marquee',
                )}
            >
                {[...chars, ...chars].map((c, i) => (
                    <span
                        key={i}
                        aria-hidden={i >= chars.length}
                        className="font-geez grid size-16 shrink-0 place-items-center rounded-2xl bg-white/[0.07] text-3xl font-bold text-white ring-1 ring-white/12 transition-all duration-200 hover:scale-110 hover:bg-[#f4b000] hover:text-[#3f2b00]"
                    >
                        {c}
                    </span>
                ))}
            </div>
        </div>
    );
}

function FidelShowcase() {
    return (
        <motion.section variants={rise} className="hero-ink relative mt-6 overflow-hidden rounded-[2rem]">
            <div className="grid grid-cols-1 items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:py-12">
                <div className="px-6 sm:px-10">
                    <div className="eyebrow !text-white/60">
                        <span className="h-[2px] w-6 rounded-full bg-gold" />
                        The Fidel <span className="font-geez normal-case tracking-normal">· ፊደል</span>
                    </div>
                    <h2 className="font-display mt-3 text-4xl font-semibold leading-[1.05] text-white xl:text-[2.75rem]">
                        {FIDEL_COUNT} characters.
                        <br />
                        <span className="italic text-[#ffd560]">One</span> beautiful script.
                    </h2>
                    <p className="mt-4 max-w-sm text-white/70">
                        Learn {FIDEL.length} shapes and 7 vowel patterns, and you can sound out any Amharic word.
                    </p>
                    <ButtonLink href="/fidel" variant="gold" size="lg" className="mt-6">
                        Explore the Fidel <ArrowRight className="size-5" />
                    </ButtonLink>
                </div>
                <div className="space-y-3">
                    <GlyphRow chars={rowA} />
                    <GlyphRow chars={rowB} reverse />
                </div>
            </div>
        </motion.section>
    );
}
