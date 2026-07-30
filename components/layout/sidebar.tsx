'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Library, GraduationCap, User, Flame, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

const navItems = [
    { href: '/', label: 'Learn', icon: Home },
    { href: '/fidel', label: 'Alphabet', icon: BookOpen },
    { href: '/lessons', label: 'Lessons', icon: GraduationCap },
    { href: '/practice', label: 'Practice', icon: Library },
    { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
    const pathname = usePathname();
    const { progress } = useAppStore();

    return (
        <nav className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-50"
            style={{
                backgroundColor: 'var(--bg-primary)',
                borderRight: '2px solid var(--border)',
            }}
        >
            {/* Logo */}
            <div className="px-6 py-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black"
                        style={{ backgroundColor: 'var(--duo-green)', color: 'white', boxShadow: '0 3px 0 0 var(--duo-green-border)' }}>
                        አ
                    </div>
                    <span className="text-2xl font-black" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        AmharicQuest
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href}
                            className={cn(
                                'nav-item',
                                isActive && 'nav-item-active'
                            )}
                            style={isActive ? {
                                color: 'var(--duo-blue)',
                                backgroundColor: 'rgba(28, 176, 246, 0.08)',
                                borderColor: 'rgba(28, 176, 246, 0.25)',
                                boxShadow: '0 2px 0 0 rgba(28, 176, 246, 0.15)',
                            } : {}}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-indicator"
                                    className="absolute left-0 inset-y-2 w-1 rounded-full"
                                    style={{ backgroundColor: 'var(--duo-blue)' }}
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* User stats footer */}
            <div className="p-4 m-4 rounded-2xl"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '2px solid var(--border)',
                    boxShadow: '0 3px 0 0 var(--border)',
                }}
            >
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-800 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        Your Stats
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Flame className="w-5 h-5" style={{ color: 'var(--duo-orange)' }} />
                        <span className="font-900 text-base" style={{ color: 'var(--text-primary)' }}>
                            {progress.streak}
                        </span>
                        <span className="text-xs font-700" style={{ color: 'var(--text-muted)' }}>streak</span>
                    </div>
                    <div className="w-px h-4" style={{ backgroundColor: 'var(--border)' }} />
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-5 h-5" style={{ color: 'var(--duo-yellow)' }} />
                        <span className="font-900 text-base" style={{ color: 'var(--text-primary)' }}>
                            {progress.totalXP}
                        </span>
                        <span className="text-xs font-700" style={{ color: 'var(--text-muted)' }}>XP</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
