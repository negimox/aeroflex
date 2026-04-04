"use client";

import { useState, useEffect, useCallback } from "react";

// Detection server running on localhost
const DETECTOR_URL = "http://localhost:8001";
const RAW_PI_URL = "http://10.97.233.251:8000";

interface Detection {
  label: string;
  confidence: number;
  bbox: number[];
}

interface DetectionStats {
  fps: number;
  detections: Detection[];
  count: number;
}

type FeedMode = "detection" | "raw";

export function CameraFeed() {
  const [mode, setMode] = useState<FeedMode>("detection");
  const [stats, setStats] = useState<DetectionStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch detection stats periodically
  useEffect(() => {
    if (mode !== "detection") return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${DETECTOR_URL}/detections`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          setIsConnected(true);
          setError(null);
        }
      } catch {
        setIsConnected(false);
        setError("Detection server offline");
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 500);
    return () => clearInterval(interval);
  }, [mode]);

  // Get the video source URL
  const getVideoUrl = useCallback(() => {
    return mode === "detection"
      ? `${DETECTOR_URL}/video_feed`
      : `${RAW_PI_URL}/video_feed`;
  }, [mode]);

  // Group detections by label for display
  const getDetectionSummary = () => {
    if (!stats?.detections) return {};
    const summary: Record<string, number> = {};
    stats.detections.forEach((d) => {
      summary[d.label] = (summary[d.label] || 0) + 1;
    });
    return summary;
  };

  const summary = getDetectionSummary();

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("detection")}
          className={`px-3 py-1.5 text-xs font-mono tracking-wider rounded-sm border transition-colors ${
            mode === "detection"
              ? "bg-chart-1 text-background border-chart-1"
              : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
          }`}
        >
          AI DETECTION
        </button>
        <button
          onClick={() => setMode("raw")}
          className={`px-3 py-1.5 text-xs font-mono tracking-wider rounded-sm border transition-colors ${
            mode === "raw"
              ? "bg-chart-1 text-background border-chart-1"
              : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
          }`}
        >
          RAW FEED
        </button>
      </div>

      {/* Video Feed */}
      <div className="relative w-full aspect-video bg-card border border-border rounded-sm overflow-hidden">
        {/* Live stream image */}
        <img
          src={getVideoUrl()}
          alt="Camera Feed"
          className="w-full h-full object-contain bg-black"
          onLoad={() => setIsConnected(true)}
          onError={() => {
            setIsConnected(false);
            setError(
              mode === "detection"
                ? "Detection server offline"
                : "Pi stream offline",
            );
          }}
        />

        {/* Scanning lines effect overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)",
            }}
          />
        </div>

        {/* Status overlay - top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          />
          <span className="text-xs font-mono text-white/80 tracking-widest drop-shadow-lg">
            {isConnected
              ? mode === "detection"
                ? "AI ACTIVE"
                : "STREAMING"
              : "OFFLINE"}
          </span>
        </div>

        {/* Detection info overlay - bottom left */}
        <div className="absolute bottom-4 left-4 text-xs font-mono text-white/90 tracking-widest drop-shadow-lg">
          {mode === "detection" && stats && (
            <>
              <p>FPS: {stats.fps}</p>
              <p>OBJECTS: {stats.count}</p>
            </>
          )}
          {mode === "raw" && (
            <>
              <p>CAM: PI_3</p>
              <p>RES: 640x480</p>
            </>
          )}
        </div>

        {/* Error overlay */}
        {error && !isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-center">
              <p className="text-red-400 font-mono text-sm mb-2">{error}</p>
              <p className="text-muted-foreground text-xs">
                {mode === "detection"
                  ? "Start detector.py on your PC"
                  : "Check Pi connection"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Detection Summary Panel */}
      {mode === "detection" && stats && stats.count > 0 && (
        <div className="bg-card border border-border p-4 rounded-sm">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Detected Objects
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(summary).map(([label, count]) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-muted px-2 py-1 rounded-sm"
              >
                <span className="text-sm font-mono text-foreground capitalize">
                  {label}
                </span>
                <span className="text-xs font-mono text-chart-1">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
