'use client'

import * as React from 'react'
import {
  Camera,
  Wind,
  Package,
  ChevronRight,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { useModuleStatus, Module } from '@/hooks/use-module-status'

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  camera: Camera,
  aqi: Wind,
  payload: Package,
}

const MODULE_COLORS: Record<string, string> = {
  camera: '#E53935',
  aqi: '#43A047',
  payload: '#1E88E5',
}

interface AppSidebarProps {
  children: React.ReactNode
}

export function AppSidebar({ children }: AppSidebarProps) {
  const { data, isLoading, activeModule } = useModuleStatus()

  return (
    <SidebarProvider>
      <Sidebar>
        {/* Header */}
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.22em] text-sidebar-foreground/60">
              Modular Drones of the Future.
            </span>
            <h1 className="text-xl font-bold tracking-[0.15em] text-sidebar-foreground">
              AEROFLEX
            </h1>
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          {/* Attached Module Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em]">
              Attached Module
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              {isLoading ? (
                <div className="bg-sidebar-accent/50 rounded-lg p-3 animate-pulse">
                  <div className="h-20 bg-sidebar-accent rounded" />
                </div>
              ) : activeModule ? (
                <AttachedModuleCard module={activeModule} />
              ) : (
                <NoModuleCard />
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Available Modules */}
          {data && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em]">
                Available Modules
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-1 px-2">
                {Object.values(data.modules)
                  .filter((m) => !m.connected)
                  .map((module) => (
                    <InactiveModuleItem key={module.id} module={module} />
                  ))}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t border-sidebar-border">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs text-sidebar-foreground/60">Theme</span>
            <ThemeSwitcher />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

interface AttachedModuleCardProps {
  module: Module
}

function AttachedModuleCard({ module }: AttachedModuleCardProps) {
  const Icon = MODULE_ICONS[module.id] || Package
  const color = MODULE_COLORS[module.id] || '#666'

  return (
    <div
      className="rounded-lg p-3 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
      }}
    >
      {/* Status badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full">
          <Package className="h-3 w-3 text-white" />
          <span className="text-[8px] font-bold text-white tracking-wider">
            MODULAR
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/15 px-2 py-0.5 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[8px] font-bold text-white tracking-wider">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Module info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <p className="text-white font-bold text-sm">{module.name}</p>
          <p className="text-white/70 text-[10px]">
            {Object.values(module.specs).slice(0, 2).join(' • ')}
          </p>
        </div>
      </div>

      {/* Specs bar */}
      <div className="mt-3 flex items-center gap-2 bg-black/15 rounded-md p-2">
        {Object.entries(module.specs).slice(0, 3).map(([key, value]) => (
          <div key={key} className="flex-1 text-center">
            <p className="text-white text-[10px] font-semibold">{value}</p>
            <p className="text-white/50 text-[8px] uppercase">{key}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function NoModuleCard() {
  return (
    <div className="bg-sidebar-accent/50 border border-dashed border-sidebar-border rounded-lg p-4 text-center">
      <Package className="h-6 w-6 text-sidebar-foreground/40 mx-auto mb-2" />
      <p className="text-xs text-sidebar-foreground/60">No module attached</p>
      <p className="text-[10px] text-sidebar-foreground/40 mt-1">
        Connect a module to see status
      </p>
    </div>
  )
}

interface InactiveModuleItemProps {
  module: Module
}

function InactiveModuleItem({ module }: InactiveModuleItemProps) {
  const Icon = MODULE_ICONS[module.id] || Package
  const color = MODULE_COLORS[module.id] || '#666'

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
      <div
        className="w-6 h-6 rounded flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <span className="text-xs">{module.name}</span>
      <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
    </div>
  )
}
