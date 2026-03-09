'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = pathname === '/login' || pathname === '/signup';

    if (isAuthRoute) {
        return <main className="flex-1 min-h-screen relative overflow-x-hidden">{children}</main>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen relative overflow-x-hidden">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
