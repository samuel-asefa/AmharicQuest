'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, BookOpen, Library, GraduationCap, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Learn', icon: Home },
    { href: '/fidel', label: 'Fidel', icon: BookOpen },
    { href: '/lessons', label: 'Lessons', icon: GraduationCap },
    { href: '/practice', label: 'Practice', icon: Library },
    { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
            style={{
                backgroundColor: 'var(--bg-primary)',
                borderTop: '2px solid var(--border)',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            <div className="flex items-center justify-around px-2 pt-1 pb-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-pill"
                                    className="absolute inset-0 rounded-xl"
                                    style={{ backgroundColor: 'rgba(28, 176, 246, 0.1)', border: '1.5px solid rgba(28, 176, 246, 0.2)' }}
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}
                            <item.icon
                                className="w-5 h-5 relative"
                                style={{ color: isActive ? 'var(--duo-blue)' : 'var(--text-muted)' }}
                            />
                            <span
                                className="text-[10px] font-800 relative"
                                style={{ color: isActive ? 'var(--duo-blue)' : 'var(--text-muted)' }}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
