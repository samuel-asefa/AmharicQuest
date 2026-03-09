'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Library, GraduationCap, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/fidel', label: 'Alphabet', icon: BookOpen },
    { href: '/lessons', label: 'Lessons', icon: GraduationCap },
    { href: '/practice', label: 'Practice', icon: Library },
    { href: '/profile', label: 'Profile', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amharic-green to-amharic-yellow flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    A
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amharic-green to-amharic-yellow">
                    AmharicQuest
                </h1>
            </div>

            <div className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href} className="block relative">
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-amharic-green/10 dark:bg-amharic-green/20 rounded-xl border border-amharic-green/20"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                                isActive ? "text-amharic-green font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-slate-200"
                            )}>
                                <item.icon className={cn("w-5 h-5", isActive && "text-amharic-green")} />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Mini Streak/User Info placeholder at bottom */}
            <div className="mt-auto glass-card p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
                    🔥
                </div>
                <div>
                    <div className="text-sm font-semibold">2 Day Streak!</div>
                    <div className="text-xs text-slate-500">Keep it up!</div>
                </div>
            </div>
        </nav>
    );
}
