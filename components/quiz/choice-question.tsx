'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useHotkeys } from '@/lib/hooks';
import type { ChoiceQuestion } from '@/lib/quiz';
import { cn } from '@/lib/utils';

export function ChoiceQuestionView({
    q,
    selected,
    onSelect,
}: {
    q: ChoiceQuestion;
    selected: string | null;
    onSelect: (id: string) => void;
}) {
    const answered = selected !== null;

    useHotkeys(
        useCallback(
            (e: KeyboardEvent) => {
                if (answered) return;
                const n = Number(e.key);
                if (n >= 1 && n <= q.options.length) {
                    e.preventDefault();
                    onSelect(q.options[n - 1].id);
                }
            },
            [answered, q, onSelect],
        ),
    );

    const single = q.variant === 'fidel-sound';

    return (
        <div>
            <div className="eyebrow">{q.instruction}</div>

            <div className="tile dot-grid relative mt-4 grid min-h-[200px] place-items-center overflow-hidden px-6 py-10 text-center sm:min-h-[240px]">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--jade),var(--gold),var(--berbere),var(--lapis))]" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                >
                    {q.promptIsGeez ? (
                        <div
                            className={cn(
                                'font-geez font-bold leading-tight',
                                single ? 'text-[7rem] sm:text-[9rem]' : 'text-6xl sm:text-7xl',
                            )}
                        >
                            {q.prompt}
                        </div>
                    ) : (
                        <div className="font-display text-4xl font-semibold leading-tight sm:text-5xl">{q.prompt}</div>
                    )}
                    {q.promptSub && <div className="mt-3 text-lg font-semibold italic text-ink-3">{q.promptSub}</div>}
                </motion.div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {q.options.map((o, i) => {
                    const isAnswer = o.id === q.answerId;
                    const state = !answered
                        ? ''
                        : isAnswer
                          ? 'is-correct'
                          : o.id === selected
                            ? 'is-wrong animate-shake'
                            : 'is-dim';
                    return (
                        <motion.button
                            key={o.id}
                            type="button"
                            className={cn('option', state)}
                            disabled={answered}
                            onClick={() => onSelect(o.id)}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: state === 'is-dim' ? 0.4 : 1, y: 0 }}
                            transition={answered ? { duration: 0.2 } : { delay: 0.08 + i * 0.05, duration: 0.3 }}
                        >
                            <span className="key">{i + 1}</span>
                            <span className="min-w-0 flex-1">
                                <span
                                    className={cn(
                                        'block',
                                        o.geez ? 'font-geez text-2xl font-bold leading-snug' : 'text-[17px] font-bold',
                                    )}
                                >
                                    {o.label}
                                </span>
                                {o.sub && <span className="block text-xs font-semibold opacity-70">{o.sub}</span>}
                            </span>
                            {answered && isAnswer && <CheckCircle2 className="size-6 shrink-0" />}
                            {answered && !isAnswer && o.id === selected && <XCircle className="size-6 shrink-0" />}
                        </motion.button>
                    );
                })}
            </div>
            <p className="mt-4 hidden text-center text-xs font-semibold text-ink-3 sm:block">
                Tip: press <kbd className="rounded-md border-2 border-line px-1.5 font-bold">1</kbd>–
                <kbd className="rounded-md border-2 border-line px-1.5 font-bold">{q.options.length}</kbd> to answer
            </p>
        </div>
    );
}
