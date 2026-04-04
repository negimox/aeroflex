"use client"

import { useState } from "react"
import { Check } from "iconoir-react"
import type { Texture } from "@/lib/textures"
import { getPrompt } from "@/lib/textures"

export function TextureCard({ t, index }: { t: Texture; index: number }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPrompt(t))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const id = String(index + 1).padStart(3, "0")

  return (
    <div className="group flex flex-col border border-card-border bg-card overflow-hidden hover:border-primary/40 transition-colors">
      <div
        className="aspect-[4/3] border-b border-border"
        style={{ color: "var(--pattern)", ...t.css, ...(t.slug !== "blueprint" && { opacity: 0.5 }) }}
      />
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[10px] text-primary">{id}</span>
          <h3 className="flex-1 font-sans text-xs font-medium text-card-foreground truncate">
            {t.name}
          </h3>
          <span className="font-sans text-[9px] uppercase tracking-widest text-muted-foreground">
            {t.tag}
          </span>
        </div>
        <p className="font-sans text-[10px] text-muted-foreground/70">
          {t.category}
        </p>
        <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1 py-1.5 px-2 font-sans text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 4H6C4.89543 4 4 4.89543 4 6V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V6C20 4.89543 19.1046 4 18 4H15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M8 6.4V4.5C8 4.22386 8.22386 4 8.5 4C8.77614 4 9.00422 3.77604 9.05152 3.50398C9.19968 2.65171 9.77399 1 12 1C14.226 1 14.8003 2.65171 14.9485 3.50398C14.9958 3.77604 15.2239 4 15.5 4C15.7761 4 16 4.22386 16 4.5V6.4C16 6.73137 15.7314 7 15.4 7H8.6C8.26863 7 8 6.73137 8 6.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            )}
            {copied ? "Copied" : "Prompt"}
          </button>
        </div>
      </div>
    </div>
  )
}
