'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Grid3x3, Search, Shuffle, Table2, X } from 'lucide-react';
import { Tibeb } from '@/components/brand/tibeb';
import { ButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ProgressRing } from '@/components/ui/progress';
import { FIDEL, FIDEL_COUNT, VOWEL_ORDERS, familyLabel, type FidelFamily } from '@/lib/fidel';
import { useHotkeys, useStats } from '@/lib/hooks';
import { sfx } from '@/lib/sound';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type View = 'grid' | 'chart';

export default function FidelPage() {
    const { progress } = useStats();
    const explored = progress.exploredFamilies;
    const [order, setOrder] = useState(1);
    const [view, setView] = useState<View>('grid');
    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState<number | null>(null);

    const families = useMemo(() => {
        const q = query.trim().toLowerCase().replace(/['’]/g, '');
        if (!q) return FIDEL;
        return FIDEL.filter(
            (f) =>
                f.forms.some((form) => form.char === query.trim()) ||
                familyLabel(f).replace(/'/g, '').startsWith(q) ||
                f.forms.some((form) => form.roman.replace(/'/g, '') === q),
        );
    }, [query]);

    const open = (id: number) => {
        sfx.tap();
        useAppStore.getState().exploreFamily(id);
        setOpenId(id);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:px-10 lg:py-10">
            <PageHeader
                eyebrow="The alphabet"
                am="ፊደል"
                title={
                    <>
                        The <span className="italic text-jade-ink">Fidel</span>
                    </>
                }
                subtitle={`Amharic is written in Fidel, where every character is a consonant plus a vowel. Learn ${FIDEL.length} shapes and 7 vowel patterns, and you can read all ${FIDEL_COUNT}.`}
                actions={
                    <div className="tile flex items-center gap-3 px-4 py-3">
                        <ProgressRing value={explored.length / FIDEL.length} size={48} stroke={6} accent="plum" label="Families explored">
                            <span className="tabular text-xs font-extrabold">{explored.length}</span>
                        </ProgressRing>
                        <div className="leading-tight">
                            <div className="text-sm font-extrabold">Explored</div>
                            <div className="text-xs font-semibold text-ink-3">
                                {explored.length} of {FIDEL.length} families
                            </div>
                        </div>
                    </div>
                }
            />

            <HowItWorks />

            {/* Vowel orders */}
            <section className="mt-10" aria-labelledby="orders-title">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 id="orders-title" className="font-display text-2xl font-semibold">
                            The seven vowel orders
                        </h2>
                        <p className="mt-1 text-sm text-ink-3">Pick one to see every family wearing that vowel.</p>
                    </div>
                </div>
                <div role="radiogroup" aria-label="Vowel order" className="no-scrollbar -mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-7 sm:px-0">
                    {VOWEL_ORDERS.map((o) => {
                        const active = o.order === order;
                        return (
                            <button
                                key={o.order}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => {
                                    sfx.tap();
                                    setOrder(o.order);
                                }}
                                className={cn(
                                    'flex min-w-[6.5rem] shrink-0 flex-col items-center rounded-2xl border-2 px-2 py-3 text-center transition-all duration-150',
                                    active
                                        ? 'border-jade bg-jade text-white shadow-[0_4px_0_0_var(--jade-deep)]'
                                        : 'border-line bg-surface shadow-[0_4px_0_0_var(--line)] hover:-translate-y-0.5 hover:border-line-strong',
                                )}
                            >
                                <span className={cn('text-[10px] font-extrabold uppercase tracking-widest', active ? 'text-white/75' : 'text-ink-3')}>
                                    {o.label}
                                </span>
                                <span className="font-display text-3xl font-semibold leading-tight">{o.vowel}</span>
                                <span className={cn('text-[11px] font-semibold leading-tight', active ? 'text-white/85' : 'text-ink-3')}>
                                    {o.hint}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Controls */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-3" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find a sound (sh, ch’, ny…) or paste a character"
                        aria-label="Search the Fidel"
                        className="field pl-12"
                    />
                </div>
                <div className="flex rounded-2xl border-2 border-line bg-paper-2 p-1" role="tablist" aria-label="Layout">
                    {(
                        [
                            { id: 'grid', label: 'Families', icon: Grid3x3 },
                            { id: 'chart', label: 'Full chart', icon: Table2 },
                        ] as const
                    ).map((v) => (
                        <button
                            key={v.id}
                            type="button"
                            role="tab"
                            aria-selected={view === v.id}
                            onClick={() => setView(v.id)}
                            className={cn(
                                'relative flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors',
                                view === v.id ? 'text-ink' : 'text-ink-3 hover:text-ink',
                            )}
                        >
                            {view === v.id && (
                                <motion.span
                                    layoutId="fidel-view"
                                    className="absolute inset-0 rounded-xl bg-surface shadow-[0_2px_0_0_var(--line)]"
                                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                                />
                            )}
                            <v.icon className="relative size-4" />
                            <span className="relative">{v.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {families.length === 0 ? (
                <div className="tile mt-6 grid place-items-center px-6 py-16 text-center">
                    <div className="font-geez text-6xl font-bold text-line-strong">?</div>
                    <p className="mt-3 font-bold">No family matches “{query}”.</p>
                    <button type="button" onClick={() => setQuery('')} className="mt-2 text-sm font-bold text-jade-ink hover:underline">
                        Clear search
                    </button>
                </div>
            ) : view === 'grid' ? (
                <FamilyGrid families={families} order={order} explored={explored} onOpen={open} />
            ) : (
                <FullChart families={families} order={order} onOpen={open} />
            )}

            <AnimatePresence>
                {openId !== null && (
                    <FamilyDialog
                        family={FIDEL[openId]}
                        onClose={() => setOpenId(null)}
                        onNavigate={(dir) => open((openId + dir + FIDEL.length) % FIDEL.length)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---------------- How it works ---------------- */

function HowItWorks() {
    const [familyId, setFamilyId] = useState(1);
    const [step, setStep] = useState(0);
    const family = FIDEL[familyId];
    const form = family.forms[step];

    useEffect(() => {
        const id = setInterval(() => setStep((s) => (s + 1) % 7), 1500);
        return () => clearInterval(id);
    }, []);

    const shuffleFamily = () => {
        sfx.tap();
        const pool = FIDEL.filter((f) => f.id !== familyId && f.variantOf === undefined && f.consonant);
        setFamilyId(pool[Math.floor(Math.random() * pool.length)].id);
        setStep(0);
    };

    return (
        <section className="hero-ink relative mt-8 overflow-hidden rounded-[2rem]">
            <div className="grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[auto_1fr]">
                <div className="relative mx-auto grid size-56 place-items-center sm:size-64">
                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(244_176_0/0.25),transparent_65%)]" />
                    <span className="animate-spin-slow absolute inset-3 rounded-full border-2 border-dashed border-white/20" />
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={form.char}
                            initial={{ opacity: 0, scale: 0.7, filter: 'blur(6px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.2, filter: 'blur(6px)' }}
                            transition={{ duration: 0.35 }}
                            className="relative flex flex-col items-center"
                        >
                            <span className="font-geez text-[8rem] font-bold leading-none text-white sm:text-[9.5rem]">{form.char}</span>
                            <span className="font-display mt-1 text-3xl font-semibold italic text-[#ffd560]">{form.roman}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div>
                    <div className="eyebrow !text-white/60">
                        <span className="h-[2px] w-6 rounded-full bg-gold" />
                        How it works
                    </div>
                    <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                        One consonant, <span className="italic text-[#ffd560]">seven</span> vowels.
                    </h2>
                    <p className="mt-3 max-w-lg text-white/70">
                        Watch the base shape <span className="font-geez font-bold text-white">{family.forms[0].char}</span> ({family.consonant}) change. A
                        small stroke, loop or foot added to it changes the vowel.
                    </p>
                    <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2.5">
                        {family.forms.map((f, i) => (
                            <button
                                key={f.char}
                                type="button"
                                onClick={() => setStep(i)}
                                className={cn(
                                    'flex flex-col items-center rounded-xl py-2 ring-1 transition-all duration-300',
                                    i === step
                                        ? 'scale-105 bg-[#f4b000] text-[#3f2b00] ring-[#f4b000]'
                                        : 'bg-white/[0.06] text-white ring-white/10 hover:bg-white/10',
                                )}
                                aria-label={`${f.char}, ${f.roman}`}
                            >
                                <span className="font-geez text-2xl font-bold leading-tight sm:text-3xl">{f.char}</span>
                                <span className={cn('text-[10px] font-bold sm:text-xs', i === step ? 'text-[#3f2b00]/80' : 'text-white/55')}>
                                    {f.roman}
                                </span>
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={shuffleFamily}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/15 transition-colors hover:bg-white/15"
                    >
                        <Shuffle className="size-4" /> Try another letter
                    </button>
                </div>
            </div>
            <Tibeb height={10} />
        </section>
    );
}

/* ---------------- Grid ---------------- */

function FamilyGrid({
    families,
    order,
    explored,
    onOpen,
}: {
    families: FidelFamily[];
    order: number;
    explored: number[];
    onOpen: (id: number) => void;
}) {
    return (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(5.6rem,1fr))] gap-3">
            {families.map((f, i) => {
                const form = f.forms[order - 1];
                const seen = explored.includes(f.id);
                return (
                    <motion.button
                        key={f.id}
                        type="button"
                        onClick={() => onOpen(f.id)}
                        initial={{ opacity: 0, y: 12, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: Math.min(i * 0.015, 0.4) }}
                        className="tile tile-hover group relative flex aspect-square flex-col items-center justify-center !rounded-[1.25rem]"
                        aria-label={`${form.char}, ${form.roman}. Open the ${familyLabel(f)} family.`}
                    >
                        {f.variantOf !== undefined && (
                            <span className="font-geez absolute left-2 top-1.5 text-[10px] font-bold text-ink-3" title={f.hint}>
                                ≈{FIDEL[f.variantOf].forms[0].char}
                            </span>
                        )}
                        {seen && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-plum" title="Explored" />}
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={form.char}
                                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.8 }}
                                transition={{ duration: 0.22, delay: Math.min(i * 0.008, 0.25) }}
                                className="font-geez text-4xl font-bold leading-none transition-transform group-hover:scale-110"
                            >
                                {form.char}
                            </motion.span>
                        </AnimatePresence>
                        <span className="mt-2 text-xs font-extrabold text-jade-ink">{form.roman}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}

/* ---------------- Chart ---------------- */

function FullChart({ families, order, onOpen }: { families: FidelFamily[]; order: number; onOpen: (id: number) => void }) {
    const [hover, setHover] = useState<{ row: number; col: number } | null>(null);

    return (
        <div className="tile mt-6 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-center" onMouseLeave={() => setHover(null)}>
                    <thead>
                        <tr className="border-b-2 border-line">
                            <th scope="col" className="sticky left-0 z-10 bg-surface px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-ink-3">
                                Sound
                            </th>
                            {VOWEL_ORDERS.map((o, c) => (
                                <th
                                    key={o.order}
                                    scope="col"
                                    className={cn(
                                        'px-2 py-3 transition-colors',
                                        o.order === order && 'bg-jade-soft',
                                        hover?.col === c && 'bg-paper-2',
                                    )}
                                >
                                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-ink-3">{o.label}</div>
                                    <div className="font-display text-xl font-semibold">{o.vowel}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {families.map((f, r) => (
                            <tr key={f.id} className="border-b border-line last:border-b-0">
                                <th
                                    scope="row"
                                    className={cn(
                                        'sticky left-0 z-10 bg-surface px-4 py-2 text-left transition-colors',
                                        hover?.row === r && 'bg-paper-2',
                                    )}
                                >
                                    <button type="button" onClick={() => onOpen(f.id)} className="flex items-center gap-2 font-extrabold hover:text-jade-ink">
                                        <span className="w-8">{familyLabel(f)}</span>
                                        {f.variantOf !== undefined && (
                                            <span className="font-geez text-[10px] font-bold text-ink-3">≈{FIDEL[f.variantOf].forms[0].char}</span>
                                        )}
                                    </button>
                                </th>
                                {f.forms.map((form, c) => {
                                    const cross = hover && (hover.row === r || hover.col === c);
                                    const exact = hover && hover.row === r && hover.col === c;
                                    return (
                                        <td
                                            key={form.char}
                                            onMouseEnter={() => setHover({ row: r, col: c })}
                                            className={cn(
                                                'p-1 transition-colors duration-100',
                                                form.order === order && 'bg-jade-soft/60',
                                                cross && 'bg-paper-2',
                                            )}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => onOpen(f.id)}
                                                className={cn(
                                                    'flex w-full flex-col items-center rounded-xl py-1.5 transition-all duration-150',
                                                    exact && 'scale-110 bg-ink text-paper shadow-lg',
                                                )}
                                                aria-label={`${form.char}, ${form.roman}`}
                                            >
                                                <span className="font-geez text-[1.7rem] font-bold leading-tight">{form.char}</span>
                                                <span className={cn('text-[10px] font-bold', exact ? 'text-gold' : 'text-ink-3')}>{form.roman}</span>
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ---------------- Family dialog ---------------- */

function FamilyDialog({
    family,
    onClose,
    onNavigate,
}: {
    family: FidelFamily;
    onClose: () => void;
    onNavigate: (dir: 1 | -1) => void;
}) {
    useHotkeys(
        useCallback(
            (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
                else if (e.key === 'ArrowRight') onNavigate(1);
                else if (e.key === 'ArrowLeft') onNavigate(-1);
            },
            [onClose, onNavigate],
        ),
    );

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    const base = family.forms[0];
    const twin = family.variantOf !== undefined ? FIDEL[family.variantOf] : FIDEL.find((f) => f.variantOf === family.id);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal
                aria-labelledby="family-title"
                initial={{ y: 60, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className="tile max-h-[92dvh] w-full max-w-3xl overflow-y-auto !rounded-b-none sm:!rounded-[1.75rem]"
            >
                <Tibeb height={10} />
                <div className="p-5 sm:p-8">
                    <div className="flex items-start gap-4 sm:gap-6">
                        <motion.div
                            key={base.char}
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="grid size-20 shrink-0 place-items-center rounded-3xl sm:size-24"
                            style={{
                                background: 'radial-gradient(circle at 32% 26%, #3ee0a2 0%, var(--jade) 55%, var(--jade-deep) 100%)',
                                boxShadow: '0 5px 0 0 var(--jade-deep)',
                            }}
                        >
                            <span className="font-geez text-5xl font-bold text-white sm:text-6xl">{base.char}</span>
                        </motion.div>
                        <div className="min-w-0 flex-1">
                            <div className="eyebrow !text-[0.65rem]">
                                Family {family.id + 1} of {FIDEL.length}
                            </div>
                            <h2 id="family-title" className="font-display mt-1 text-3xl font-semibold sm:text-4xl">
                                {family.consonant ? (
                                    <>
                                        The <span className="italic text-jade-ink">{family.consonant}</span> family
                                    </>
                                ) : (
                                    'The vowel carrier'
                                )}
                            </h2>
                            <p className="mt-1 text-ink-2">{family.hint}</p>
                            {twin && (
                                <p className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-gold-soft px-3 py-1.5 text-sm font-semibold text-gold-ink">
                                    Sounds the same as <span className="font-geez text-base font-bold">{twin.forms[0].char}</span> — both are kept
                                    for traditional spelling.
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            autoFocus
                            aria-label="Close"
                            className="grid size-10 shrink-0 place-items-center rounded-xl text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
                        >
                            <X className="size-6" />
                        </button>
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-3 min-[480px]:grid-cols-4 md:grid-cols-7">
                        {family.forms.map((form, i) => {
                            const o = VOWEL_ORDERS[i];
                            return (
                                <motion.div
                                    key={form.char}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="flex flex-col items-center rounded-2xl border-2 border-line bg-surface-2 px-2 pb-3 pt-4 shadow-[0_3px_0_0_var(--line)]"
                                >
                                    <span className="font-geez text-5xl font-bold leading-none">{form.char}</span>
                                    <span className="mt-3 rounded-lg bg-jade px-2.5 py-0.5 text-sm font-extrabold text-white shadow-[0_2px_0_0_var(--jade-deep)]">
                                        {form.roman}
                                    </span>
                                    <span className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-ink-3">{o.label} order</span>
                                    <span className="text-center text-[10px] font-semibold leading-tight text-ink-3">{o.hint}</span>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-2">
                            <button type="button" onClick={() => onNavigate(-1)} className="btn btn-outline btn-sm flex-1 sm:flex-none" aria-label="Previous family">
                                <ChevronLeft className="size-4" /> Prev
                            </button>
                            <button type="button" onClick={() => onNavigate(1)} className="btn btn-outline btn-sm flex-1 sm:flex-none" aria-label="Next family">
                                Next <ChevronRight className="size-4" />
                            </button>
                        </div>
                        <ButtonLink href="/practice?mode=fidel" variant="gold" size="sm">
                            Drill the Fidel <ArrowRight className="size-4" />
                        </ButtonLink>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
