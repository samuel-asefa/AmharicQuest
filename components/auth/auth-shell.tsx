'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo, LogoMark } from '@/components/brand/logo';
import { Tibeb } from '@/components/brand/tibeb';
import { lessons, vocabularyData } from '@/lib/data';
import { FIDEL, FIDEL_COUNT } from '@/lib/fidel';

const FLOATERS = [
    { c: 'አ', x: '8%', y: '12%', s: 7, d: 0, r: -10 },
    { c: 'ሰ', x: '72%', y: '8%', s: 5, d: 1.2, r: 8 },
    { c: 'ላ', x: '80%', y: '46%', s: 8, d: 0.6, r: 12 },
    { c: 'ም', x: '12%', y: '58%', s: 5.5, d: 2, r: -6 },
    { c: 'ቡ', x: '58%', y: '74%', s: 6.5, d: 1.6, r: -12 },
    { c: 'ና', x: '30%', y: '84%', s: 4.5, d: 0.3, r: 6 },
    { c: 'ፊ', x: '44%', y: '30%', s: 4, d: 2.4, r: -4 },
];

export function AuthShell({
    children,
    headline,
    text,
    aside,
    flip = false,
}: {
    children: React.ReactNode;
    headline: React.ReactNode;
    text: string;
    aside?: React.ReactNode;
    flip?: boolean;
}) {
    return (
        <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
            <motion.aside
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className={`hero-jade relative hidden flex-col overflow-hidden !shadow-none lg:flex ${flip ? 'lg:order-2' : ''}`}
            >
                {FLOATERS.map((f, i) => (
                    <span
                        key={i}
                        aria-hidden
                        className="font-geez animate-float pointer-events-none absolute select-none font-bold leading-none text-white/[0.09]"
                        style={
                            {
                                left: f.x,
                                top: f.y,
                                fontSize: `${f.s}rem`,
                                animationDelay: `${f.d}s`,
                                '--r': `${f.r}deg`,
                            } as React.CSSProperties
                        }
                    >
                        {f.c}
                    </span>
                ))}

                <div className="relative flex flex-1 flex-col justify-between p-12 xl:p-16">
                    <Link href="/" className="inline-flex items-center gap-3" aria-label="AmharicQuest home">
                        <LogoMark size={44} />
                        <span className="font-display text-2xl font-semibold text-white">
                            Amharic<span className="italic text-[#ffd560]">Quest</span>
                        </span>
                    </Link>

                    <div className="max-w-lg">
                        <h1 className="font-display text-5xl font-semibold leading-[1.03] text-white xl:text-6xl">{headline}</h1>
                        <p className="mt-5 text-lg text-white/75">{text}</p>
                        {aside}
                        <div className="mt-10 grid grid-cols-4 gap-3">
                            {[
                                { v: FIDEL.length, l: 'Letter families' },
                                { v: FIDEL_COUNT, l: 'Characters' },
                                { v: lessons.length, l: 'Journey stops' },
                                { v: vocabularyData.length, l: 'Words' },
                            ].map((s) => (
                                <div key={s.l} className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm">
                                    <div className="tabular text-2xl font-extrabold text-white">{s.v}</div>
                                    <div className="text-[11px] font-bold uppercase leading-tight tracking-wider text-white/60">{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <figure className="max-w-md">
                        <blockquote className="font-geez text-xl font-semibold text-white/90">ቀስ በቀስ እንቁላል በእግሩ ይሄዳል።</blockquote>
                        <figcaption className="mt-1 text-sm text-white/60">
                            “Little by little, the egg will walk on its own legs.” — Ethiopian proverb
                        </figcaption>
                    </figure>
                </div>
                <Tibeb height={14} />
            </motion.aside>

            <main className="flex flex-col items-center justify-center px-5 py-10 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm"
                >
                    <Logo className="mb-10 lg:hidden" />
                    {children}
                </motion.div>
            </main>
        </div>
    );
}

export function PasswordStrength({ value }: { value: string }) {
    const score = [value.length >= 6, value.length >= 10, /\d/.test(value), /[^A-Za-z0-9]/.test(value) || /[A-Z]/.test(value)].filter(Boolean).length;
    const labels = ['Too short', 'Okay', 'Good', 'Strong', 'Excellent'];
    const colors = ['var(--berbere)', 'var(--gold)', 'var(--gold)', 'var(--jade)', 'var(--jade)'];
    if (!value) return null;
    return (
        <div className="mt-2 flex items-center gap-2" aria-live="polite">
            <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                        style={{ background: i < score ? colors[score] : 'var(--line)' }}
                    />
                ))}
            </div>
            <span className="w-20 text-right text-xs font-bold text-ink-3">{labels[value.length < 6 ? 0 : score]}</span>
        </div>
    );
}
