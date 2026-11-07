'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MotionConfig, motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useHydrated } from '@/lib/hooks';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { MobileHeader } from './mobile-header';

/** Full-screen routes that hide the app chrome. */
function isFocusRoute(pathname: string) {
    return pathname === '/login' || pathname === '/signup' || /^\/lessons\/[^/]+/.test(pathname);
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hydrated = useHydrated();
    const theme = useAppStore((s) => s.settings.theme);

    // Load saved progress after the first render so server and client markup match.
    useEffect(() => {
        void useAppStore.persist.rehydrate();
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        const root = document.documentElement;
        if (theme === 'system') delete root.dataset.theme;
        else root.dataset.theme = theme;
    }, [theme, hydrated]);

    const page = (
        <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );

    return (
        <MotionConfig reducedMotion="user">
            {isFocusRoute(pathname) ? (
                <main className="relative min-h-dvh">{page}</main>
            ) : (
                <div className="min-h-dvh">
                    <Sidebar />
                    <MobileHeader />
                    <main className="relative pb-28 lg:pb-0 lg:pl-[280px]">{page}</main>
                    <BottomNav />
                </div>
            )}
        </MotionConfig>
    );
}
