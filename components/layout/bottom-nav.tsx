'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, isActive } from './nav';

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Main"
            className="glass fixed inset-x-0 bottom-0 z-40 border-t-2 border-line lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className="relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5"
                        >
                            <span className="relative grid h-8 w-12 place-items-center">
                                {active && (
                                    <motion.span
                                        layoutId="bottom-nav-active"
                                        className="absolute inset-0 rounded-full bg-jade-soft"
                                        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                                    />
                                )}
                                {item.icon ? (
                                    <item.icon
                                        className={cn('relative size-[22px]', active ? 'text-jade-ink' : 'text-ink-3')}
                                        strokeWidth={active ? 2.6 : 2.2}
                                    />
                                ) : (
                                    <span
                                        className={cn(
                                            'font-geez relative text-xl font-bold leading-none',
                                            active ? 'text-jade-ink' : 'text-ink-3',
                                        )}
                                    >
                                        {item.glyph}
                                    </span>
                                )}
                            </span>
                            <span className={cn('truncate text-[11px] font-bold', active ? 'text-jade-ink' : 'text-ink-3')}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
