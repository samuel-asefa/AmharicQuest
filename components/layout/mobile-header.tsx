'use client';

import Link from 'next/link';
import { Flame, Zap } from 'lucide-react';
import { LogoMark } from '@/components/brand/logo';
import { useStats } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { UserAvatar } from './user-avatar';

export function MobileHeader() {
    const { streak, progress } = useStats();
    return (
        <header className="glass sticky top-0 z-40 border-b-2 border-line lg:hidden">
            <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2.5" aria-label="AmharicQuest home">
                    <LogoMark size={34} />
                    <span className="font-display text-lg font-semibold leading-none max-[380px]:hidden">
                        Amharic<span className="italic text-jade-ink">Quest</span>
                    </span>
                </Link>
                <div className="ml-auto flex items-center gap-2">
                    <span className="chip chip-berbere h-8 text-sm" title={`${streak}-day streak`}>
                        <Flame className={cn('size-4', streak > 0 && 'fill-gold')} />
                        <span className="tabular">{streak}</span>
                    </span>
                    <span className="chip chip-gold h-8 text-sm" title="Total XP">
                        <Zap className="size-4 fill-current" />
                        <span className="tabular">{progress.totalXP}</span>
                    </span>
                    <Link href="/profile" aria-label="Profile" className="ml-1">
                        <UserAvatar size={34} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
