'use client'

import { Location, RiverCrossingChoice } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'

interface RiverCrossingProps {
  location: Location
  depth: number
  sol: number
  onChoice: (choice: RiverCrossingChoice) => void
}

export function RiverCrossing({ location, depth, sol, onChoice }: RiverCrossingProps) {
  const ferryCost = Math.round(depth * 5)
  const canAffordFerry = sol >= ferryCost

  // Congestion level indicator
  const level = depth <= 2.5 ? 'low' : depth <= 4 ? 'mid' : 'high'
  const levelConfig = {
    low: { color: 'text-sol-green', barColor: 'bg-sol-green', label: 'Low — safe to bridge', bg: 'bg-sol-green/10' },
    mid: { color: 'text-warning', barColor: 'bg-warning', label: 'Moderate — consider wrapping', bg: 'bg-warning/10' },
    high: { color: 'text-danger', barColor: 'bg-danger', label: 'High — use secure bridge!', bg: 'bg-danger/10' },
  }
  const lc = levelConfig[level]

  return (
    <div className="p-4 space-y-4 flex-1 flex flex-col">
      <div className="text-center space-y-2">
        <div className="text-3xl">🌉</div>
        <h2 className="font-pixel text-xs text-sol-blue">
          {location.name}
        </h2>
        <p className="text-xs text-sol-muted leading-relaxed max-w-[280px] mx-auto">
          {location.description}
        </p>
      </div>

      {/* Congestion meter */}
      <div className={`p-3 rounded-xl border border-sol-border ${lc.bg} space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-sol-muted uppercase tracking-wide">Network Congestion</span>
          <span className={`font-pixel text-sm ${lc.color}`}>{depth.toFixed(1)}/10</span>
        </div>
        <div className="w-full h-2 bg-sol-darker rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${lc.barColor}`}
            style={{ width: `${depth * 10}%` }}
          />
        </div>
        <div className={`text-[10px] ${lc.color}`}>{lc.label}</div>
      </div>

      {/* Choices */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        <Button variant={level === 'low' ? 'primary' : 'danger'} fullWidth onClick={() => onChoice('ford')}>
          ⚡ Bridge directly
          <span className="block text-[10px] opacity-70">Raw transfer — {level === 'low' ? 'safe' : level === 'mid' ? 'risky' : 'dangerous!'}</span>
        </Button>

        <Button variant="secondary" fullWidth onClick={() => onChoice('caulk_and_float')}>
          🔄 Use wrapped tokens
          <span className="block text-[10px] opacity-70">Wrap & bridge — moderate risk</span>
        </Button>

        <Button
          variant="primary"
          fullWidth
          onClick={() => onChoice('pay_ferry')}
          disabled={!canAffordFerry}
        >
          🔒 Secure bridge — ◎ {ferryCost}
          <span className="block text-[10px] opacity-70">
            {canAffordFerry ? 'Guaranteed safe transfer' : 'Not enough SOL'}
          </span>
        </Button>

        <Button variant="ghost" fullWidth onClick={() => onChoice('wait')}>
          ⏳ Wait a day
          <span className="block text-[10px] opacity-70">Congestion may drop</span>
        </Button>
      </div>
    </div>
  )
}
