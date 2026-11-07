import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLMotionProps<"div"> {
    interactive?: boolean;
    accent?: 'green' | 'blue' | 'yellow' | 'red' | 'none';
}

const accentStyles: Record<string, React.CSSProperties> = {
    green: {
        borderColor: 'var(--duo-green)',
        boxShadow: '0 4px 0 0 var(--duo-green-border)',
    },
    blue: {
        borderColor: 'var(--duo-blue)',
        boxShadow: '0 4px 0 0 var(--duo-blue-border)',
    },
    yellow: {
        borderColor: 'var(--duo-yellow)',
        boxShadow: '0 4px 0 0 var(--duo-yellow-border)',
    },
    red: {
        borderColor: 'var(--duo-red)',
        boxShadow: '0 4px 0 0 var(--duo-red-border)',
    },
    none: {},
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, interactive = false, accent = 'none', style, ...props }, ref) => (
        <motion.div
            ref={ref}
            className={cn(
                "rounded-2xl",
                interactive && "cursor-pointer",
                className
            )}
            style={{
                backgroundColor: 'var(--surface)',
                border: '2px solid var(--border)',
                boxShadow: '0 4px 0 0 var(--border)',
                ...accentStyles[accent],
                ...style,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            whileHover={interactive ? { y: -2, boxShadow: '0 6px 0 0 var(--border)' } : {}}
            whileTap={interactive ? { y: 3, boxShadow: '0 1px 0 0 var(--border)' } : {}}
            {...props}
        />
    )
)
Card.displayName = "Card"

export { Card }
