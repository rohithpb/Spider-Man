import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "spidey" | "web" | "amber" | "purple"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const baseStyles = "btn-liquid-glass inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold tracking-wide ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer select-none"
    
    const variants = {
      default: "btn-liquid-spidey",
      spidey: "btn-liquid-spidey",
      destructive: "btn-liquid-spidey",
      web: "btn-liquid-web",
      secondary: "btn-liquid-dark",
      outline: "border border-white/30 bg-white/5 backdrop-blur-xl text-slate-100 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_6px_20px_rgba(0,0,0,0.4)] hover:bg-white/15 hover:border-white/60 hover:text-white hover:-translate-y-0.5",
      ghost: "hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-white/20 hover:backdrop-blur-xl hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]",
      link: "text-spidey-web underline-offset-4 hover:underline",
      amber: "btn-liquid-amber",
      purple: "btn-liquid-purple",
    }

    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 rounded-xl px-3.5 text-xs",
      lg: "h-14 rounded-2xl px-8 text-base tracking-wide font-extrabold",
      icon: "h-10 w-10 p-0 rounded-xl",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"
