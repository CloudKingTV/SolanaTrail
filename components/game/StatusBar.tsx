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

const weatherIcons: Record<string, string> = {
  bull: '📈',
  crab: '🦀',
  bear: '📉',
  fomo: '🔥',
  winter: '❄️',
}

const weatherLabels: Record<string, string> = {
  bull: 'Bull',
  crab: 'Crab',
  bear: 'Bear',
  fomo: 'FOMO',
  winter: 'Winter',
}

const healthColors: Record<string, string> = {
  good: 'text-sol-green',
  fair: 'text-warning',
  poor: 'text-danger',
  very_poor: 'text-danger animate-pulse-warning',
}

export function StatusBar({ inventory, day, distance, totalDistance, health, weather }: StatusBarProps) {
  const progress = Math.round((distance / totalDistance) * 100)

  return (
    <div className="bg-sol-card border-b border-sol-border p-3 space-y-2">
      {/* Day + Market + Health */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-pixel text-sol-muted">DAY {day}</span>
        <span>{weatherIcons[weather] || '📈'} {weatherLabels[weather] || weather}</span>
        <span className={healthColors[health] || 'text-sol-text'}>
          Health: {health.replace('_', ' ')}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-sol-darker rounded-full overflow-hidden border border-sol-border">
          <div
            className="h-full bg-gradient-to-r from-sol-purple to-sol-green rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-pixel text-sol-muted whitespace-nowrap">{distance}/{totalDistance}</span>
      </div>

      {/* Key resources */}
      <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
        <div>
          <span className="text-sol-green">◎</span>
          <span className={`font-semibold ml-1 ${inventory.sol < 10 ? 'text-danger' : 'text-sol-text'}`}>
            {inventory.sol.toFixed(0)}
          </span>
        </div>
        <div>
          <span>📱</span>
          <span className={`font-semibold ml-1 ${inventory.oxen < 2 ? 'text-danger' : 'text-sol-text'}`}>
            {inventory.oxen}
          </span>
        </div>
        <div>
          <span>📶</span>
          <span className={`font-semibold ml-1 ${inventory.food < 100 ? 'text-danger' : 'text-sol-text'}`}>
            {inventory.food}
          </span>
        </div>
        <div>
          <span>🛡️</span>
          <span className="font-semibold ml-1 text-sol-text">{inventory.clothing}</span>
        </div>
      </div>
    </div>
  )
}
