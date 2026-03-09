import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "glass";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-[#009E60] text-white hover:bg-[#33b180] shadow-md shadow-[#009E60]/20": variant === "default",
                        "bg-[#FCD116] text-slate-900 hover:bg-[#fde05f] shadow-md shadow-[#FCD116]/20": variant === "secondary",
                        "bg-[#CE1126] text-white hover:bg-[#d84151] shadow-md shadow-[#CE1126]/20": variant === "destructive",
                        "border-2 border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50": variant === "outline",
                        "hover:bg-slate-100 dark:hover:bg-slate-800": variant === "ghost",
                        "glass text-foreground hover:bg-white/90 dark:hover:bg-black/50": variant === "glass",
                        "h-12 px-6 py-2": size === "default",
                        "h-9 rounded-lg px-4": size === "sm",
                        "h-14 rounded-2xl px-8 text-lg": size === "lg",
                        "h-12 w-12": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
