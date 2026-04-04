'use client'

import { Card } from './ui/card'
import { Thermometer, Droplets, Gauge } from 'lucide-react'

interface EnvironmentData {
  temperature: number
  humidity: number
  pressure: number
}

interface EnvironmentPanelProps {
  data: EnvironmentData
}

export function EnvironmentPanel({ data }: EnvironmentPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Temperature */}
      <Card className="p-4 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/10">
          <Thermometer className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Temperature
        </p>
        <div className="flex items-baseline gap-1">
          <p className="font-mono text-2xl font-semibold text-foreground">
            {data.temperature}
          </p>
          <span className="text-sm text-muted-foreground">°C</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Ambient</p>
        <div className="mt-3 h-1 w-full bg-secondary rounded-sm overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${Math.min((data.temperature / 50) * 100, 100)}%` }}
          />
        </div>
      </Card>

      {/* Humidity */}
      <Card className="p-4 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-3 right-3 p-2 rounded-lg bg-blue-500/10">
          <Droplets className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Humidity
        </p>
        <div className="flex items-baseline gap-1">
          <p className="font-mono text-2xl font-semibold text-foreground">
            {data.humidity}
          </p>
          <span className="text-sm text-muted-foreground">%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Relative</p>
        <div className="mt-3 h-1 w-full bg-secondary rounded-sm overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${data.humidity}%` }}
          />
        </div>
      </Card>

      {/* Pressure */}
      <Card className="p-4 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-3 right-3 p-2 rounded-lg bg-purple-500/10">
          <Gauge className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Pressure
        </p>
        <div className="flex items-baseline gap-1">
          <p className="font-mono text-2xl font-semibold text-foreground">
            {data.pressure}
          </p>
          <span className="text-sm text-muted-foreground">hPa</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Barometric</p>
        <div className="mt-3 h-1 w-full bg-secondary rounded-sm overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${Math.min(((data.pressure - 950) / 100) * 100, 100)}%` }}
          />
        </div>
      </Card>
    </div>
  )
}
