'use client';

import { useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHotkeys } from '@/lib/hooks';
import { cn, pick } from '@/lib/utils';

const PRAISE = [
    { am: 'ጎበዝ!', en: 'Well done!' },
    { am: 'በጣም ጥሩ!', en: 'Very good!' },
    { am: 'ድንቅ!', en: 'Wonderful!' },
    { am: 'ጎበዝ!', en: 'Nailed it!' },
    { am: 'በጣም ጥሩ!', en: 'Spot on!' },
];

export function randomPraise() {
    return pick(PRAISE);
}

export interface Feedback {
    correct: boolean;
    title: string;
    titleAm?: string;
    detail?: string;
    xp?: number;
}

export function FeedbackSheet({
    feedback,
    combo = 0,
    onContinue,
    className,
    continueLabel = 'Continue',
}: {
    feedback: Feedback | null;
    combo?: number;
    onContinue: () => void;
    className?: string;
    continueLabel?: string;
}) {
    useHotkeys(
        useCallback(
            (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onContinue();
                }
            },
            [onContinue],
        ),
        !!feedback,
    );

    return (
        <AnimatePresence>
            {feedback && (
                <motion.div
                    role="status"
                    aria-live="polite"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    className={cn('fixed inset-x-0 bottom-0 z-50 border-t-2 bg-surface', className)}
                    style={{
                        borderColor: feedback.correct ? 'var(--jade)' : 'var(--berbere)',
                        paddingBottom: 'env(safe-area-inset-bottom)',
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{ background: feedback.correct ? 'var(--jade-soft)' : 'var(--berbere-soft)' }}
                    />
                    <div className="relative mx-auto flex max-w-3xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-8 sm:py-6">
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                            <motion.span
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.05 }}
                                className="grid size-14 shrink-0 place-items-center rounded-full text-white"
                                style={{
                                    background: feedback.correct ? 'var(--jade)' : 'var(--berbere)',
                                    boxShadow: `0 4px 0 0 ${feedback.correct ? 'var(--jade-deep)' : 'var(--berbere-deep)'}`,
                                }}
                            >
                                {feedback.correct ? <Check className="size-7" strokeWidth={3.5} /> : <X className="size-7" strokeWidth={3.5} />}
                            </motion.span>
                            <div className="min-w-0">
                                <div
                                    className="flex flex-wrap items-baseline gap-x-2 text-2xl font-extrabold"
                                    style={{ color: feedback.correct ? 'var(--jade-ink)' : 'var(--berbere-ink)' }}
                                >
                                    {feedback.titleAm && <span className="font-geez">{feedback.titleAm}</span>}
                                    <span>{feedback.title}</span>
                                </div>
                                {feedback.detail && (
                                    <div className="mt-0.5 text-[15px] font-semibold text-ink-2">{feedback.detail}</div>
                                )}
                                {feedback.correct && (feedback.xp || combo > 1) ? (
                                    <div className="mt-1.5 flex flex-wrap gap-2">
                                        {feedback.xp ? <span className="chip chip-gold">+{feedback.xp} XP</span> : null}
                                        {combo > 1 && (
                                            <span className="chip chip-berbere">
                                                <Flame className="size-3.5 fill-current" /> {combo} in a row
                                            </span>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <Button
                            autoFocus
                            variant={feedback.correct ? 'jade' : 'berbere'}
                            size="lg"
                            onClick={onContinue}
                            className="w-full sm:w-auto sm:min-w-44"
                        >
                            {continueLabel} <ArrowRight className="size-5" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
