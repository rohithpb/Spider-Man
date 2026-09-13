import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "spidey" | "web" | "gold"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-spidey-red text-white border-transparent shadow-sm",
    secondary: "bg-slate-800 text-slate-200 border-slate-700",
    destructive: "bg-red-900/80 text-red-200 border-red-700",
    outline: "text-slate-200 border-slate-700",
    spidey: "bg-spidey-red/20 text-red-300 border-spidey-red/50 shadow-sm",
    web: "bg-sky-500/15 text-sky-300 border-sky-400/40",
    gold: "bg-amber-500/15 text-amber-300 border-amber-400/40",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
