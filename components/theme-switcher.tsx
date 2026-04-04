"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const spring = { type: "spring", stiffness: 400, damping: 30 }
const W_ACTIVE = { system: 82, dark: 62, light: 62 }
const W_INACTIVE = 24
const INDICATOR = {
  system: { x: 0, w: 82 },
  dark: { x: 24, w: 62 },
  light: { x: 48, w: 62 },
}

const opts = [
  { key: "system", label: "System" },
  { key: "dark", label: "Dark" },
  { key: "light", label: "Light" },
] as const

type Theme = (typeof opts)[number]["key"]

const icons: Record<Theme, React.ReactNode> = {
  system: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
  ),
  dark: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>
  ),
  light: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
  ),
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-7 w-20 rounded border border-border bg-muted" />
  }

  const active = (theme ?? "system") as Theme
  const ind = INDICATOR[active]

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="relative flex items-center rounded border border-border bg-muted p-0.5"
    >
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-sm bg-background"
        animate={{ x: ind.x, width: ind.w }}
        transition={spring}
      />
      {opts.map((o) => {
        const isActive = active === o.key
        return (
          <motion.button
            key={o.key}
            role="radio"
            aria-checked={isActive}
            aria-label={`${o.label} theme`}
            onClick={() => setTheme(o.key)}
            animate={{ width: isActive ? W_ACTIVE[o.key] : W_INACTIVE }}
            transition={spring}
            className={`relative z-10 flex items-center justify-center gap-1.5 h-6 font-mono text-[10px] uppercase tracking-wider ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {icons[o.key]}
            {isActive && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={spring}
              >
                {o.label}
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
