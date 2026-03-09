'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Library, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/fidel', label: 'Fidel', icon: BookOpen },
    { href: '/lessons', label: 'Lessons', icon: GraduationCap },
    { href: '/practice', label: 'Practice', icon: Library },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200/50 dark:border-zinc-800/50 pb-safe z-50">
            <div className="flex items-center justify-around p-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link key={item.href} href={item.href} className="relative flex flex-col items-center p-2">
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-active"
                                    className="absolute inset-0 bg-amharic-green/10 dark:bg-amharic-green/20 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "relative flex flex-col items-center gap-1",
                                isActive ? "text-amharic-green" : "text-slate-500 dark:text-slate-400"
                            )}>
                                <item.icon className="w-6 h-6" />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
