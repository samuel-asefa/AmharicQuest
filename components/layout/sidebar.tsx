'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Flame, Zap } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Tibeb } from '@/components/brand/tibeb';
import { ProgressRing } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { useStats } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, isActive } from './nav';
import { UserAvatar } from './user-avatar';

export function Sidebar() {
    const pathname = usePathname();
    const { streak, today, goal, progress, level } = useStats();
    const { user } = useAuth();
    const goalPct = Math.min(1, today / goal);

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r-2 border-line bg-surface lg:flex">
            <Tibeb height={10} />
            <div className="px-6 pb-7 pt-7">
                <Logo />
            </div>

            <nav aria-label="Main" className="flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? 'page' : undefined}
                            className="group relative flex items-center gap-3.5 rounded-2xl px-3 py-2.5"
                        >
                            {active && (
                                <motion.span
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 rounded-2xl border-2 border-jade/25 bg-jade-soft"
                                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                                />
                            )}
                            <span
                                className={cn(
                                    'relative grid size-10 place-items-center rounded-xl transition-all duration-200',
                                    active
                                        ? 'bg-jade text-white shadow-[0_3px_0_0_var(--jade-deep)]'
                                        : 'bg-paper-2 text-ink-2 group-hover:-rotate-6 group-hover:bg-line group-hover:text-ink',
                                )}
                            >
                                {item.icon ? (
                                    <item.icon className="size-5" strokeWidth={2.4} />
                                ) : (
                                    <span className="font-geez text-lg font-bold leading-none">{item.glyph}</span>
                                )}
                            </span>
                            <span className="relative flex flex-col leading-tight">
                                <span className={cn('text-[15px] font-bold', active ? 'text-jade-ink' : 'text-ink-2 group-hover:text-ink')}>
                                    {item.label}
                                </span>
                                <span className="font-geez text-xs text-ink-3">{item.am}</span>
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-3 p-4">
                <Link href="/profile" className="tile tile-hover block p-4">
                    <div className="flex items-center gap-3.5">
                        <ProgressRing value={goalPct} size={54} stroke={7} accent={goalPct >= 1 ? 'gold' : 'jade'} label="Daily goal">
                            <Zap className={cn('size-5', goalPct >= 1 ? 'fill-gold text-gold' : 'text-jade-ink')} />
                        </ProgressRing>
                        <div className="min-w-0 flex-1">
                            <div className="eyebrow !text-[0.65rem]">Daily goal</div>
                            <div className="tabular text-lg font-extrabold leading-tight">
                                {today}
                                <span className="text-sm font-bold text-ink-3"> / {goal} XP</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center" title={`${streak}-day streak`}>
                            <Flame className={cn('size-6', streak > 0 ? 'animate-flame fill-gold text-berbere' : 'text-ink-3')} />
                            <span className="tabular text-sm font-extrabold">{streak}</span>
                        </div>
                    </div>
                </Link>

                <Link
                    href={user ? '/profile' : '/login'}
                    className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-paper-2"
                >
                    <UserAvatar size={40} />
                    <div className="min-w-0 flex-1 leading-tight">
                        <div className="truncate text-sm font-bold">{user?.displayName || (user ? 'Learner' : 'Guest learner')}</div>
                        <div className="truncate text-xs font-semibold text-ink-3">
                            {user ? `Level ${level.level} · ${progress.totalXP} XP` : 'Sign in to save progress'}
                        </div>
                    </div>
                    <ChevronRight className="size-4 text-ink-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </aside>
    );
}
