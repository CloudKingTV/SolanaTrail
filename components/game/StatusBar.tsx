'use client'

import { Inventory } from '@/lib/game/types'

interface StatusBarProps {
  inventory: Inventory
  day: number
  distance: number
  totalDistance: number
  health: string
  weather: string
}

const weatherConfig: Record<string, { icon: string; label: string; color: string }> = {
  bull: { icon: '📈', label: 'Bull', color: 'text-sol-green' },
  crab: { icon: '🦀', label: 'Crab', color: 'text-sol-muted' },
  bear: { icon: '📉', label: 'Bear', color: 'text-danger' },
  fomo: { icon: '🔥', label: 'FOMO', color: 'text-warning' },
  winter: { icon: '❄️', label: 'Winter', color: 'text-sol-blue' },
}

const healthConfig: Record<string, { label: string; color: string }> = {
  good: { label: 'Good', color: 'text-sol-green' },
  fair: { label: 'Fair', color: 'text-warning' },
  poor: { label: 'Poor', color: 'text-danger' },
  very_poor: { label: 'Critical', color: 'text-danger animate-pulse-warning' },
}

export function StatusBar({ inventory, day, distance, totalDistance, health, weather }: StatusBarProps) {
  const progress = Math.round((distance / totalDistance) * 100)
  const wc = weatherConfig[weather] || weatherConfig.bull
  const hc = healthConfig[health] || healthConfig.good

  return (
    <div className="bg-sol-card border-b border-sol-border px-3 py-2.5 space-y-2">
      {/* Top row: Day / Market / Health */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-pixel text-sol-text">DAY {day}</span>
        <div className={`flex items-center gap-1 ${wc.color}`}>
          <span>{wc.icon}</span>
          <span className="font-semibold">{wc.label}</span>
        </div>
        <div className={`flex items-center gap-1 ${hc.color}`}>
          <span className="text-[8px] uppercase tracking-wide">HP</span>
          <span className="font-semibold">{hc.label}</span>
        </div>
      </div>

      {/* Progress bar — trail progress to Mainnet */}
      <div className="flex items-center gap-2">
        <span className="text-[8px] text-sol-muted">GEN</span>
        <div className="flex-1 h-1.5 bg-sol-darker rounded-full overflow-hidden border border-sol-border/50">
          <div
            className="h-full bg-gradient-to-r from-sol-purple to-sol-green rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[8px] text-sol-muted">NET</span>
        <span className="text-[9px] font-mono text-sol-muted w-8 text-right">{progress}%</span>
      </div>

      {/* Resources row */}
      <div className="grid grid-cols-4 gap-1.5">
        <ResourcePill icon="◎" value={inventory.sol.toFixed(0)} warn={inventory.sol < 10} color="text-sol-green" />
        <ResourcePill icon="📱" value={inventory.oxen.toString()} warn={inventory.oxen < 2} />
        <ResourcePill icon="📶" value={`${inventory.food}`} warn={inventory.food < 100} />
        <ResourcePill icon="🛡️" value={inventory.clothing.toString()} warn={inventory.clothing < 1} />
      </div>
    </div>
  )
}

function ResourcePill({ icon, value, warn = false, color }: { icon: string; value: string; warn?: boolean; color?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 rounded-md py-0.5 text-[10px] transition-colors ${
      warn ? 'bg-danger/10 border border-danger/20' : 'bg-sol-darker/50'
    }`}>
      <span className={color}>{icon}</span>
      <span className={`font-semibold ${warn ? 'text-danger' : 'text-sol-text'}`}>{value}</span>
    </div>
  )
}
