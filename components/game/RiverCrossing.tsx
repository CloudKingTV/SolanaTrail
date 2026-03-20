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
  const depthWarning = depth > 4 ? 'text-danger' : depth > 2.5 ? 'text-warning' : 'text-sol-green'

  return (
    <div className="p-4 space-y-5 flex-1 flex flex-col">
      <div className="text-center space-y-2">
        <div className="text-4xl">🌊</div>
        <h2 className="font-pixel text-sm text-sol-blue">
          {location.name}
        </h2>
        <p className="text-xs text-sol-muted leading-relaxed">
          {location.description}
        </p>
      </div>

      {/* River stats */}
      <div className="p-3 rounded-lg bg-sol-darker border border-sol-border text-center space-y-1">
        <div className="text-xs text-sol-muted">Data Stream Depth</div>
        <div className={`text-2xl font-pixel ${depthWarning}`}>
          {depth.toFixed(1)} ft
        </div>
        <div className="text-[10px] text-sol-muted">
          {depth <= 2.5 && 'Safe to ford'}
          {depth > 2.5 && depth <= 4 && 'Risky to ford — consider floating'}
          {depth > 4 && 'Very dangerous! Use the ferry or wait'}
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        <Button variant="primary" fullWidth onClick={() => onChoice('ford')}>
          🚶 Ford the stream
          <span className="block text-[10px] opacity-70">Walk through it — {depth <= 2.5 ? 'safe' : 'risky!'}</span>
        </Button>

        <Button variant="secondary" fullWidth onClick={() => onChoice('caulk_and_float')}>
          🛶 Caulk wagon & float
          <span className="block text-[10px] opacity-70">Seal & float across — moderate risk</span>
        </Button>

        <Button
          variant="primary"
          fullWidth
          onClick={() => onChoice('pay_ferry')}
          disabled={!canAffordFerry}
        >
          ⛴️ Pay for ferry — ◎ {ferryCost} SOL
          <span className="block text-[10px] opacity-70">
            {canAffordFerry ? 'Safest option' : 'Can\'t afford!'}
          </span>
        </Button>

        <Button variant="ghost" fullWidth onClick={() => onChoice('wait')}>
          ⏳ Wait a day
          <span className="block text-[10px] opacity-70">Conditions may improve</span>
        </Button>
      </div>
    </div>
  )
}
