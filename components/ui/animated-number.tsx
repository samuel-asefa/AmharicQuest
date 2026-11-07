'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

/** Counts up (or down) to `value` whenever it changes. */
export function AnimatedNumber({ value, duration = 0.9, className }: { value: number; duration?: number; className?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const from = useRef(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            node.textContent = value.toLocaleString();
            from.current = value;
            return;
        }
        const controls = animate(from.current, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                node.textContent = Math.round(v).toLocaleString();
            },
        });
        from.current = value;
        return () => controls.stop();
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            0
        </span>
    );
}
