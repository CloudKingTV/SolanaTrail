'use client'

import { Resources } from '@/lib/game/types'

interface StatusBarProps {
  resources: Resources
  day: number
  distance: number
  totalDistance: number
}

function ResourceIcon({ type }: { type: string }) {
  switch (type) {
    case 'sol':
      return <span className="text-sol-green">◎</span>
    case 'validators':
      return <span className="text-sol-purple">⬡</span>
    case 'bandwidth':
      return <span className="text-sol-blue">⚡</span>
    case 'morale':
      return <span className="text-warning">♥</span>
    default:
      return null
  }
}

function getResourceColor(type: string, value: number): string {
  if (type === 'sol' && value < 10) return 'text-danger animate-pulse-warning'
  if (type === 'bandwidth' && value < 20) return 'text-danger animate-pulse-warning'
  if (type === 'morale' && value < 20) return 'text-danger animate-pulse-warning'
  if (type === 'validators' && value < 2) return 'text-danger animate-pulse-warning'
  return 'text-sol-text'
}

export function StatusBar({ resources, day, distance, totalDistance }: StatusBarProps) {
  const progress = Math.round((distance / totalDistance) * 100)

  return (
    <div className="bg-sol-card border-b border-sol-border p-3 space-y-2">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-pixel text-sol-muted whitespace-nowrap">DAY {day}</span>
        <div className="flex-1 h-2 bg-sol-darker rounded-full overflow-hidden border border-sol-border">
          <div
            className="h-full bg-gradient-to-r from-sol-purple to-sol-green rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-pixel text-sol-muted whitespace-nowrap">{progress}%</span>
      </div>

      {/* Resources row */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(resources).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1 justify-center">
            <ResourceIcon type={key} />
            <span className={`text-xs font-semibold ${getResourceColor(key, value)}`}>
              {key === 'sol' ? value.toFixed(1) : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
