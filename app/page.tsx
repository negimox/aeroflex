import { CameraFeed } from "@/components/camera-feed"
import { TelemetryPanel } from "@/components/telemetry-panel"
import { EnvironmentPanel } from "@/components/environment-panel"
import { AQIPanel } from "@/components/aqi-panel"
import { AppSidebar } from "@/components/app-sidebar"

export default function Page() {
  // Mock drone telemetry data
  const telemetryData = {
    altitude: 245,
    speed: 12.5,
    battery: 87,
    flightTime: "18:45",
    latitude: 37.7749,
    longitude: -122.4194,
    status: "Active",
  }

  // Environment sensor data
  const environmentData = {
    temperature: 26,
    humidity: 36,
    pressure: 1013,
  }

  return (
    <AppSidebar>
      <div className="px-6 py-8">
        <div className="space-y-8">
          {/* Live Camera Feed Section */}
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-4 font-semibold">
              Live Camera Feed
            </h2>
            <CameraFeed />
          </section>

          {/* Environment Sensors Section */}
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-4 font-semibold">
              Environment Sensors
            </h2>
            <EnvironmentPanel data={environmentData} />
          </section>

          {/* Air Quality Section */}
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-4 font-semibold">
              Air Quality
            </h2>
            <AQIPanel />
          </section>

          {/* Telemetry Data Section */}
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-4 font-semibold">
              Telemetry Data
            </h2>
            <TelemetryPanel data={telemetryData} />
          </section>

          {/* System Status */}
          <section>
            <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-4 font-semibold">
              System Status
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="bg-card border border-border p-4 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">GPS Signal</p>
                <p className="font-mono text-lg font-semibold text-foreground">Strong</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Gimbal</p>
                <p className="font-mono text-lg font-semibold text-foreground">Nominal</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Propellers</p>
                <p className="font-mono text-lg font-semibold text-foreground">OK</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-sm">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">IMU</p>
                <p className="font-mono text-lg font-semibold text-foreground">Calibrated</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppSidebar>
  )
}
