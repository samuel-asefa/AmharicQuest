'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Accent } from '@/lib/types';

export function ProgressBar({
    value,
    accent = 'jade',
    className,
    height = 14,
    label,
}: {
    value: number;
    accent?: Accent;
    className?: string;
    height?: number;
    label?: string;
}) {
    const pct = Math.max(0, Math.min(1, value)) * 100;
    return (
        <div
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            className={cn('relative w-full overflow-hidden rounded-full bg-paper-2', className)}
            style={{ height, boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.08)' }}
        >
            <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: `var(--${accent})` }}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            >
                {pct > 4 && (
                    <span
                        className="absolute left-[6px] right-[6px] top-[3px] rounded-full bg-white/35"
                        style={{ height: Math.max(2, height / 4) }}
                    />
                )}
            </motion.div>
        </div>
    );
}

export function ProgressRing({
    value,
    size = 120,
    stroke = 12,
    accent = 'jade',
    track = 'var(--paper-2)',
    children,
    className,
    label,
}: {
    value: number;
    size?: number;
    stroke?: number;
    accent?: Accent | 'white';
    track?: string;
    children?: React.ReactNode;
    className?: string;
    label?: string;
}) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(1, value));
    const color = accent === 'white' ? '#fff' : `var(--${accent})`;
    return (
        <div
            className={cn('relative inline-grid place-items-center', className)}
            style={{ width: size, height: size }}
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct * 100)}
        >
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    initial={false}
                    animate={{ strokeDashoffset: c * (1 - pct) }}
                    transition={{ type: 'spring', stiffness: 60, damping: 16 }}
                />
            </svg>
            <div className="absolute inset-0 grid place-items-center">{children}</div>
        </div>
    );
}
