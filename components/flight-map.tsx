'use client'

export function FlightMap() {
  return (
    <div className="relative w-full bg-card border border-border rounded-sm overflow-hidden" style={{ aspectRatio: '2/1' }}>
      {/* Grid background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 19px, var(--border) 19px, var(--border) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, var(--border) 19px, var(--border) 20px)",
        }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="var(--muted-foreground)" />
          </marker>
        </defs>
      </svg>

      {/* Flight path */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {/* Path line */}
        <polyline
          points="50,200 100,150 150,120 200,100 250,110 300,140 350,180 400,200 450,190 500,160 550,140 600,150"
          stroke="var(--muted-foreground)"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
          strokeDasharray="5,5"
        />

        {/* Waypoints */}
        <circle cx="50" cy="200" r="5" fill="var(--muted-foreground)" opacity="0.6" />
        <circle cx="600" cy="150" r="5" fill="var(--accent)" opacity="0.8" />

        {/* Intermediate markers */}
        {[100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={200 - (i % 3) * 50}
            r="3"
            fill="var(--muted-foreground)"
            opacity="0.3"
          />
        ))}

        {/* Current position */}
        <circle cx="450" cy="190" r="8" fill="var(--accent)" opacity="0.8" />
        <circle
          cx="450"
          cy="190"
          r="8"
          fill="var(--accent)"
          opacity="0.3"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />

        {/* Direction arrow */}
        <line x1="450" y1="190" x2="480" y2="170" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-px bg-muted-foreground/40" />
          <span className="text-muted-foreground/60">Flight Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent/80" />
          <span className="text-muted-foreground/60">Current</span>
        </div>
      </div>

      {/* Coordinates display */}
      <div className="absolute top-4 right-4 bg-card/90 border border-border px-3 py-2 rounded-sm">
        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">Coordinates</p>
        <p className="font-mono text-xs text-foreground mt-1">37.7749° N</p>
        <p className="font-mono text-xs text-foreground">122.4194° W</p>
      </div>

      {/* Status */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
        <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">Live</span>
      </div>
    </div>
  )
}
