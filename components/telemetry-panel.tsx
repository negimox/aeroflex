'use client'

import { Card } from './ui/card'

interface TelemetryData {
  altitude: number
  speed: number
  battery: number
  flightTime: string
  latitude: number
  longitude: number
  status: string
}

interface TelemetryPanelProps {
  data: TelemetryData
}

export function TelemetryPanel({ data }: TelemetryPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {/* Altitude */}
      <Card className="p-4 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Altitude</p>
        <div className="flex items-baseline gap-1">
          <p className="font-mono text-lg sm:text-xl font-semibold text-foreground">{data.altitude}</p>
          <span className="text-xs text-muted-foreground">m</span>
        </div>
        <div className="mt-2 h-1 w-full bg-secondary rounded-sm overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${Math.min((data.altitude / 500) * 100, 100)}%` }}
          />
        </div>
      </Card>

      {/* Speed */}
      <Card className="p-4 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Speed</p>
        <div className="flex items-baseline gap-1">
          <p className="font-mono text-lg sm:text-xl font-semibold text-foreground">{data.speed}</p>
          <span className="text-xs text-muted-foreground">m/s</span>
        </div>
        <div className="mt-2 h-1 w-full bg-secondary rounded-sm overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${Math.min((data.speed / 30) * 100, 100)}%` }}
          />
        </div>
      </Card>

      {/* Battery */}
      <Card className="p-4 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Battery</p>
        <div className="flex items-baseline gap-1">
          <p className="font-mono text-lg sm:text-xl font-semibold text-foreground">{data.battery}</p>
          <span className="text-xs text-muted-foreground">%</span>
        </div>
        <div className="mt-2 h-1 w-full bg-secondary rounded-sm overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${data.battery}%` }}
          />
        </div>
      </Card>

      {/* Flight Time */}
      <Card className="p-4 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Flight Time</p>
        <p className="font-mono text-lg sm:text-xl font-semibold text-foreground">{data.flightTime}</p>
      </Card>

      {/* Latitude */}
      <Card className="p-4 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Latitude</p>
        <p className="font-mono text-xs sm:text-sm font-semibold text-foreground break-all">{data.latitude.toFixed(6)}</p>
      </Card>

      {/* Longitude */}
      <Card className="p-4 flex flex-col justify-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Longitude</p>
        <p className="font-mono text-xs sm:text-sm font-semibold text-foreground break-all">{data.longitude.toFixed(6)}</p>
      </Card>
    </div>
  )
}
