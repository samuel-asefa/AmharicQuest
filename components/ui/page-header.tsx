'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PageHeader({
    eyebrow,
    am,
    title,
    subtitle,
    actions,
    className,
}: {
    eyebrow: string;
    am?: string;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn('flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between', className)}
        >
            <div className="max-w-2xl">
                <div className="eyebrow">
                    <span className="h-[2px] w-6 rounded-full bg-gold" />
                    {eyebrow}
                    {am && <span className="font-geez normal-case tracking-normal text-ink-3">· {am}</span>}
                </div>
                <h1 className="font-display mt-3 text-4xl font-semibold leading-[1.05] sm:text-5xl">{title}</h1>
                {subtitle && <p className="mt-3 text-lg text-ink-2">{subtitle}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
        </motion.header>
    );
}
