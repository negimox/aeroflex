'use client'

import { useState, useEffect } from 'react'

export interface ModuleSpec {
  [key: string]: string
}

export interface Module {
  id: string
  name: string
  connected: boolean
  specs: ModuleSpec
}

export interface ModuleStatusData {
  modules: {
    camera: Module
    aqi: Module
    payload: Module
  }
  active_module: string | null
}

interface UseModuleStatusReturn {
  data: ModuleStatusData | null
  isLoading: boolean
  error: string | null
  activeModule: Module | null
}

const PI_URL = 'http://10.97.233.251:8000'
const DETECTOR_URL = 'http://localhost:8001'

export function useModuleStatus(): UseModuleStatusReturn {
  const [data, setData] = useState<ModuleStatusData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      // Check detection server for camera status (mirrors camera-feed.tsx logic)
      let cameraConnected = false
      try {
        const detectorResponse = await fetch(`${DETECTOR_URL}/detections`)
        if (detectorResponse.ok) {
          cameraConnected = true
        }
      } catch {
        // Detection server offline
      }

      try {
        // Fetch module status from Pi
        const piResponse = await fetch(`${PI_URL}/module_status`)
        
        if (!piResponse.ok) {
          throw new Error('Failed to fetch module status')
        }
        
        const piData = await piResponse.json()
        
        // Update camera connected status based on detection server
        const updatedData: ModuleStatusData = {
          ...piData,
          modules: {
            ...piData.modules,
            camera: {
              ...piData.modules.camera,
              connected: cameraConnected
            }
          }
        }
        
        // Recalculate active module
        if (cameraConnected) {
          updatedData.active_module = 'camera'
        } else if (piData.modules.aqi?.connected) {
          updatedData.active_module = 'aqi'
        } else {
          updatedData.active_module = null
        }
        
        setData(updatedData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed')
        
        // Return fallback data when Pi is not reachable
        setData({
          modules: {
            camera: {
              id: 'camera',
              name: 'RGB Camera',
              connected: cameraConnected,
              specs: { resolution: '640x480', fps: '30', fov: '84°', encoding: 'MJPEG' }
            },
            aqi: {
              id: 'aqi',
              name: 'AQI Module',
              connected: false,
              specs: { sensor: 'MQ135', mcu: 'NodeMCU', accuracy: '±5%' }
            },
            payload: {
              id: 'payload',
              name: 'Payload Module',
              connected: false,
              specs: { max_weight: '2.5kg', release: 'Electromagnetic' }
            }
          },
          active_module: cameraConnected ? 'camera' : null
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Get the active module object
  const activeModule = data?.active_module 
    ? data.modules[data.active_module as keyof typeof data.modules] 
    : null

  return { data, isLoading, error, activeModule }
}
