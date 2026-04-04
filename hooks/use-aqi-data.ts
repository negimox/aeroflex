'use client'

import { useState, useEffect } from 'react'

interface AQIData {
  aqi: number
  status: string
  timestamp: string
  isLoading: boolean
  error: string | null
}

const THINGSPEAK_URL = 'https://api.thingspeak.com/channels/3325825/feeds.json?api_key=NR1SMHUHGOA4RCDB&results=2'

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#43A047'      // Good - Green
  if (aqi <= 100) return '#FFB300'     // Moderate - Yellow
  if (aqi <= 150) return '#FB8C00'     // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return '#FF5722'     // Unhealthy - Red-Orange
  if (aqi <= 300) return '#E53935'     // Very Unhealthy - Red
  return '#7B1FA2'                      // Hazardous - Purple
}

export function getAQILabel(aqi: number): string {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

export function useAQIData() {
  const [data, setData] = useState<AQIData>({
    aqi: 0,
    status: 'Loading...',
    timestamp: '',
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchAQI = async () => {
      try {
        const response = await fetch(THINGSPEAK_URL)
        if (!response.ok) {
          throw new Error('Failed to fetch AQI data')
        }
        const json = await response.json()
        
        // Get the latest feed entry
        const latestFeed = json.feeds?.[json.feeds.length - 1]
        if (latestFeed) {
          const aqiValue = parseInt(latestFeed.field1, 10)
          setData({
            aqi: aqiValue,
            status: latestFeed.field2 || getAQILabel(aqiValue),
            timestamp: latestFeed.created_at,
            isLoading: false,
            error: null,
          })
        }
      } catch (err) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        }))
      }
    }

    // Initial fetch
    fetchAQI()

    // Poll every 30 seconds
    const interval = setInterval(fetchAQI, 30000)

    return () => clearInterval(interval)
  }, [])

  return data
}
