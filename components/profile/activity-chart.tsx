'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, dayKey, lastDays, weekdayLetter } from '@/lib/utils';

const HEIGHT = 150;

function formatDay(key: string) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

/** XP earned per day over the last two weeks, with the daily goal as a reference line. */
export function ActivityChart({ history, goal }: { history: Record<string, number>; goal: number }) {
    const days = lastDays(14);
    const values = days.map((d) => history[d] ?? 0);
    const max = Math.max(goal, ...values) * 1.15;
    const today = dayKey();
    const [hover, setHover] = useState<number | null>(null);
    const total = values.reduce((a, b) => a + b, 0);
    const activeDays = values.filter((v) => v > 0).length;
    const goalY = HEIGHT - (goal / max) * HEIGHT;

    return (
        <div>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <div>
                    <span className="tabular text-3xl font-extrabold">{total}</span>
                    <span className="ml-1.5 text-sm font-bold text-ink-3">XP in 14 days</span>
                </div>
                <div>
                    <span className="tabular text-3xl font-extrabold">{activeDays}</span>
                    <span className="ml-1.5 text-sm font-bold text-ink-3">active days</span>
                </div>
            </div>

            <div className="relative mt-6" style={{ height: HEIGHT }} onMouseLeave={() => setHover(null)}>
                {/* Daily goal reference line */}
                <div className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-line-strong" style={{ top: goalY }}>
                    <span className="absolute -top-5 left-0 text-[11px] font-bold text-ink-3">Daily goal · {goal} XP</span>
                </div>
                {/* Baseline */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-line" />

                <div className="absolute inset-0 flex items-end gap-[2px] sm:gap-1.5">
                    {values.map((v, i) => {
                        const h = v > 0 ? Math.max(6, (v / max) * HEIGHT) : 0;
                        return (
                            <div
                                key={days[i]}
                                className="relative flex h-full flex-1 items-end justify-center"
                                onMouseEnter={() => setHover(i)}
                                onFocus={() => setHover(i)}
                                onBlur={() => setHover(null)}
                                tabIndex={0}
                                aria-label={`${formatDay(days[i])}: ${v} XP`}
                            >
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: h }}
                                    transition={{ delay: 0.15 + i * 0.03, type: 'spring', stiffness: 120, damping: 18 }}
                                    className={cn(
                                        'w-full max-w-7 rounded-t-[4px] transition-opacity',
                                        hover !== null && hover !== i ? 'opacity-45' : 'opacity-100',
                                    )}
                                    style={{ background: 'var(--jade)' }}
                                />
                                {hover === i && (
                                    <div
                                        className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-center text-paper shadow-lg"
                                        style={{ bottom: h + 4 }}
                                    >
                                        <div className="tabular text-sm font-extrabold">{v} XP</div>
                                        <div className="text-[11px] font-semibold opacity-70">{formatDay(days[i])}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-2 flex gap-[2px] sm:gap-1.5" aria-hidden>
                {days.map((d) => (
                    <span
                        key={d}
                        className={cn('flex-1 text-center text-[11px] font-bold', d === today ? 'text-ink' : 'text-ink-3')}
                    >
                        {weekdayLetter(d)}
                    </span>
                ))}
            </div>

            {total === 0 && (
                <p className="mt-4 text-center text-sm font-semibold text-ink-3">
                    No activity yet. Finish a lesson or practice to fill this chart.
                </p>
            )}

            <table className="sr-only">
                <caption>XP earned per day, last 14 days</caption>
                <thead>
                    <tr>
                        <th scope="col">Day</th>
                        <th scope="col">XP</th>
                    </tr>
                </thead>
                <tbody>
                    {days.map((d, i) => (
                        <tr key={d}>
                            <td>{formatDay(d)}</td>
                            <td>{values[i]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
