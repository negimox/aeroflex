'use client'

import { Card } from './ui/card'
import { Wind, RefreshCw, AlertCircle } from 'lucide-react'
import { useAQIData, getAQIColor, getAQILabel } from '@/hooks/use-aqi-data'

export function AQIPanel() {
  const { aqi, status, timestamp, isLoading, error } = useAQIData()

  const color = getAQIColor(aqi)
  const percentage = Math.min((aqi / 500) * 100, 100)

  // Format timestamp
  const formatTime = (ts: string) => {
    if (!ts) return '--:--'
    const date = new Date(ts)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  if (error) {
    return (
      <Card className="p-6 relative overflow-hidden">
        <div className="flex items-center gap-3 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Failed to load AQI data</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Wind className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Air Quality Index
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span 
                className="text-sm font-semibold"
                style={{ color }}
              >
                {isLoading ? 'Loading...' : status}
              </span>
            </div>
          </div>
        </div>
        
        {/* AQI Value */}
        <div className="text-right">
          <p 
            className="font-mono text-4xl font-bold"
            style={{ color }}
          >
            {isLoading ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              aqi
            )}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            MQ135 Sensor
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color 
            }}
          />
        </div>
        {/* Scale labels */}
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-muted-foreground">0</span>
          <span className="text-[9px] text-muted-foreground">Good</span>
          <span className="text-[9px] text-muted-foreground">Moderate</span>
          <span className="text-[9px] text-muted-foreground">Unhealthy</span>
          <span className="text-[9px] text-muted-foreground">500+</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">From AQI Module</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Last update: {formatTime(timestamp)}
        </span>
      </div>
    </Card>
  )
}
