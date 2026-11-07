'use client';

import { initialsOf, useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function UserAvatar({ size = 40, className }: { size?: number; className?: string }) {
    const { user } = useAuth();
    const initials = initialsOf(user?.displayName, user?.email);
    return (
        <span
            aria-hidden
            className={cn('grid shrink-0 place-items-center rounded-full font-extrabold text-white', className)}
            style={{
                width: size,
                height: size,
                fontSize: size * 0.38,
                background: 'conic-gradient(from 210deg, #9b4dca, #3b5bdb, #0a8f62, #f4b000, #e04a2f, #9b4dca)',
            }}
        >
            <span
                className="grid place-items-center rounded-full bg-[#1e1813]/85"
                style={{ width: size - 5, height: size - 5 }}
            >
                {initials || <span className="font-geez" style={{ fontSize: size * 0.42 }}>እ</span>}
            </span>
        </span>
    );
}
