'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { MatchQuestion } from '@/lib/quiz';
import { sfx } from '@/lib/sound';
import { cn, shuffle } from '@/lib/utils';

/** Tap a word on each side to pair them up. */
export function MatchQuestionView({ q, onDone }: { q: MatchQuestion; onDone: (mistakes: number) => void }) {
    const [left] = useState(() => shuffle(q.pairs));
    const [right] = useState(() => shuffle(q.pairs));
    const [selL, setSelL] = useState<string | null>(null);
    const [selR, setSelR] = useState<string | null>(null);
    const [matched, setMatched] = useState<string[]>([]);
    const [wrong, setWrong] = useState<{ l: string; r: string } | null>(null);
    const mistakes = useRef(0);

    const attempt = (l: string, r: string) => {
        setSelL(null);
        setSelR(null);
        if (l === r) {
            const next = [...matched, l];
            setMatched(next);
            sfx.match();
            if (next.length === q.pairs.length) setTimeout(() => onDone(mistakes.current), 450);
        } else {
            mistakes.current += 1;
            setWrong({ l, r });
            sfx.wrong();
            setTimeout(() => setWrong(null), 650);
        }
    };

    const pickLeft = (id: string) => {
        if (matched.includes(id) || wrong) return;
        sfx.tap();
        if (selR) attempt(id, selR);
        else setSelL(selL === id ? null : id);
    };
    const pickRight = (id: string) => {
        if (matched.includes(id) || wrong) return;
        sfx.tap();
        if (selL) attempt(selL, id);
        else setSelR(selR === id ? null : id);
    };

    const stateFor = (id: string, side: 'l' | 'r') => {
        if (matched.includes(id)) return 'is-correct';
        if (wrong && wrong[side] === id) return 'is-wrong animate-shake';
        if ((side === 'l' ? selL : selR) === id) return 'is-picked';
        return '';
    };

    return (
        <div>
            <div className="eyebrow">Match the pairs</div>
            <h2 className="font-display mt-2 text-3xl font-semibold">Tap each word and its meaning</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-3">
                    {left.map((p, i) => (
                        <motion.button
                            key={p.id}
                            type="button"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: matched.includes(p.id) ? 0.55 : 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => pickLeft(p.id)}
                            disabled={matched.includes(p.id)}
                            className={cn('option min-h-[4.5rem] justify-center text-center', stateFor(p.id, 'l'))}
                        >
                            <span>
                                <span className="font-geez block text-xl font-bold leading-snug sm:text-2xl">{p.left}</span>
                                <span className="block text-xs font-semibold opacity-60">{p.leftSub}</span>
                            </span>
                            {matched.includes(p.id) && <Check className="absolute right-2 top-2 size-4" strokeWidth={3} />}
                        </motion.button>
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    {right.map((p, i) => (
                        <motion.button
                            key={p.id}
                            type="button"
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: matched.includes(p.id) ? 0.55 : 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => pickRight(p.id)}
                            disabled={matched.includes(p.id)}
                            className={cn('option min-h-[4.5rem] justify-center text-center', stateFor(p.id, 'r'))}
                        >
                            <span className="text-[15px] font-bold leading-snug sm:text-base">{p.right}</span>
                            {matched.includes(p.id) && <Check className="absolute right-2 top-2 size-4" strokeWidth={3} />}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
