'use client';

import { motion } from 'framer-motion';
import { Repeat2 } from 'lucide-react';
import { Tibeb } from '@/components/brand/tibeb';
import { CHAR_ROMAN } from '@/lib/fidel';
import type { VocabularyItem } from '@/lib/types';

/** A 3D flip card: Amharic on the front, meaning and letter breakdown on the back. */
export function Flashcard({ item, flipped, onFlip }: { item: VocabularyItem; flipped: boolean; onFlip: () => void }) {
    const chars = Array.from(item.amharic).filter((c) => c.trim() && c !== '?');

    return (
        <button
            type="button"
            onClick={onFlip}
            aria-label={flipped ? `${item.english}. Tap to see the Amharic.` : `${item.amharic}. Tap to reveal the meaning.`}
            className="perspective block w-full text-left focus-visible:outline-none"
        >
            <motion.div
                className="preserve-3d relative h-[340px] w-full sm:h-[380px]"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
                {/* Front */}
                <div className="tile backface-hidden absolute inset-0 flex flex-col overflow-hidden">
                    <Tibeb height={10} />
                    <div className="dot-grid relative flex flex-1 flex-col items-center justify-center px-6 text-center">
                        <span className="chip chip-jade absolute left-5 top-5">{item.category}</span>
                        <div className="font-geez text-7xl font-bold leading-tight sm:text-8xl">{item.amharic}</div>
                        <div className="font-display mt-3 text-2xl italic text-ink-2">{item.phonetic}</div>
                        <div className="absolute bottom-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-3">
                            <Repeat2 className="size-4" /> Tap to reveal
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div
                    className="backface-hidden hero-jade absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[1.5rem] px-6 text-center"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <span
                        aria-hidden
                        className="font-geez pointer-events-none absolute -right-6 -top-10 select-none text-[12rem] font-bold leading-none text-white/[0.07]"
                    >
                        {chars[0]}
                    </span>
                    <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/60">Meaning</div>
                    <div className="font-display mt-2 text-4xl font-semibold text-white sm:text-5xl">{item.english}</div>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {chars.map((c, i) => (
                            <div key={`${c}-${i}`} className="flex min-w-12 flex-col items-center rounded-xl bg-white/12 px-2.5 py-1.5 ring-1 ring-white/20">
                                <span className="font-geez text-2xl font-bold leading-tight text-white">{c}</span>
                                <span className="text-[11px] font-bold text-[#ffd560]">{CHAR_ROMAN[c] ?? '·'}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white/70">
                        <span className="font-geez">{item.amharic}</span> · {item.phonetic}
                    </div>
                </div>
            </motion.div>
        </button>
    );
}
