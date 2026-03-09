import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLMotionProps<"div"> {
    glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, glass = true, ...props }, ref) => (
        <motion.div
            ref={ref}
            className={cn(
                "rounded-2xl border bg-card text-card-foreground shadow-sm",
                glass && "glass-card",
                className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            {...props}
        />
    )
)
Card.displayName = "Card"

export { Card }
