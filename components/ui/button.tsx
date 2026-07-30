import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "default" | "secondary" | "blue" | "destructive" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

const variantStyles: Record<string, React.CSSProperties> = {
    default: {
        backgroundColor: 'var(--duo-green)',
        color: '#ffffff',
        boxShadow: '0 4px 0 0 var(--duo-green-border)',
        border: 'none',
    },
    secondary: {
        backgroundColor: 'var(--duo-yellow)',
        color: '#5d4100',
        boxShadow: '0 4px 0 0 var(--duo-yellow-border)',
        border: 'none',
    },
    blue: {
        backgroundColor: 'var(--duo-blue)',
        color: '#ffffff',
        boxShadow: '0 4px 0 0 var(--duo-blue-border)',
        border: 'none',
    },
    destructive: {
        backgroundColor: 'var(--duo-red)',
        color: '#ffffff',
        boxShadow: '0 4px 0 0 var(--duo-red-border)',
        border: 'none',
    },
    outline: {
        backgroundColor: 'transparent',
        color: 'var(--duo-blue)',
        border: '2px solid var(--border)',
        boxShadow: '0 4px 0 0 var(--border)',
    },
    ghost: {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: 'none',
        boxShadow: 'none',
    },
};

const sizeStyles: Record<string, string> = {
    default: 'h-12 px-6 text-sm',
    sm: 'h-9 px-4 text-xs rounded-xl',
    lg: 'h-14 px-8 text-base',
    icon: 'h-12 w-12',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", style, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileTap={{ y: 4 }}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-800 tracking-wide uppercase text-sm",
                    "transition-[filter] duration-75",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    sizeStyles[size],
                    className
                )}
                style={{ ...variantStyles[variant], ...style }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.05)';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
                }}
                onMouseDown={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    const currentShadow = btn.style.boxShadow;
                    btn.dataset.prevShadow = currentShadow;
                    btn.style.boxShadow = currentShadow.replace(/0 4px/, '0 0px').replace(/0 3px/, '0 0px');
                }}
                onMouseUp={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    btn.style.boxShadow = btn.dataset.prevShadow || '';
                }}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
