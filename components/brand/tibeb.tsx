'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * A woven "tibeb" border — the patterned band found on the hem of a
 * habesha kemis. Used as a signature accent across the app.
 */
export function Tibeb({ className, height = 14 }: { className?: string; height?: number }) {
    const id = useId().replace(/:/g, '');
    return (
        <svg
            aria-hidden
            className={cn('block w-full', className)}
            height={height}
            preserveAspectRatio="none"
        >
            <defs>
                <pattern id={`tibeb-${id}`} width={height * 2} height={height} patternUnits="userSpaceOnUse">
                    <svg viewBox="0 0 28 14" width={height * 2} height={height}>
                        <rect width="28" height="14" fill="#1e1813" />
                        <rect width="28" height="1.6" fill="#f4b000" />
                        <rect y="12.4" width="28" height="1.6" fill="#f4b000" />
                        <path d="M7 3.2 10.8 7 7 10.8 3.2 7Z" fill="#e04a2f" />
                        <path d="M7 5.4 8.6 7 7 8.6 5.4 7Z" fill="#f4b000" />
                        <path d="M21 3.2 24.8 7 21 10.8 17.2 7Z" fill="#12a96f" />
                        <path d="M21 5.4 22.6 7 21 8.6 19.4 7Z" fill="#fff" />
                        <path d="M14 5.2 15.8 7 14 8.8 12.2 7Z" fill="#f4b000" />
                        <path d="M0 5.2 1.8 7 0 8.8Z M28 5.2 26.2 7 28 8.8Z" fill="#f4b000" />
                    </svg>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#tibeb-${id})`} />
        </svg>
    );
}
