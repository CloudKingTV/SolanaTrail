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
        <div className="text-4xl">🌉</div>
        <h2 className="font-pixel text-sm text-sol-blue">
          {location.name}
        </h2>
        <p className="text-xs text-sol-muted leading-relaxed">
          {location.description}
        </p>
      </div>

      {/* Congestion stats */}
      <div className="p-3 rounded-lg bg-sol-darker border border-sol-border text-center space-y-1">
        <div className="text-xs text-sol-muted">Network Congestion</div>
        <div className={`text-2xl font-pixel ${depthWarning}`}>
          {depth.toFixed(1)}/10
        </div>
        <div className="text-[10px] text-sol-muted">
          {depth <= 2.5 && 'Low congestion — safe to bridge directly'}
          {depth > 2.5 && depth <= 4 && 'Moderate congestion — consider wrapped tokens'}
          {depth > 4 && 'High congestion! Use secure bridge or wait'}
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        <Button variant="primary" fullWidth onClick={() => onChoice('ford')}>
          ⚡ Bridge directly
          <span className="block text-[10px] opacity-70">Raw transfer — {depth <= 2.5 ? 'safe' : 'risky!'}</span>
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
          🔒 Pay for secure bridge — ◎ {ferryCost} SOL
          <span className="block text-[10px] opacity-70">
            {canAffordFerry ? 'Guaranteed transfer' : 'Can\'t afford!'}
          </span>
        </Button>

        <Button variant="ghost" fullWidth onClick={() => onChoice('wait')}>
          ⏳ Wait for less congestion
          <span className="block text-[10px] opacity-70">Costs a day but congestion may drop</span>
        </Button>
      </div>
    </div>
  )
}
