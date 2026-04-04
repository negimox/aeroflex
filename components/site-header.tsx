import { ThemeSwitcher } from "./theme-switcher"

export function SiteHeader() {
  return (
    <header className="relative overflow-hidden border-b border-border bg-card px-6 py-10 sm:px-10 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-mono text-[clamp(72px,12vw,140px)] font-bold uppercase tracking-[0.3em] text-transparent"
        style={{ WebkitTextStroke: "1px var(--border)" }}
      >
        AEROFLEX
      </div>
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            Live Drone Operations
          </p>
          <h1 className="font-sans text-[clamp(22px,3vw,36px)] font-semibold uppercase tracking-[0.18em] leading-none text-foreground">
            AeroFlex
          </h1>
          <p className="font-sans text-[11px] tracking-[0.08em] text-muted-foreground max-w-md">
            Real-time drone telemetry and flight data monitoring system
          </p>
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  )
}
