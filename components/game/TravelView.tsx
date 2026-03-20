'use client'

import { GameState, Pace } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'

interface TravelViewProps {
  state: GameState
  onAdvance: () => void
  onRest: () => void
  onTrade: () => void
  onSetPace: (pace: Pace) => void
  showParty: boolean
  onToggleParty: () => void
}

export function TravelView({
  state,
  onAdvance,
  onRest,
  onTrade,
  onSetPace,
  showParty,
  onToggleParty,
}: TravelViewProps) {
  const canTrade = state.currentLocation?.type === 'trading_post'
  const isRestStop = state.currentLocation?.type === 'rest_stop'
  const nextDist = state.nextLocation
    ? state.nextLocation.distance - state.distanceTraveled
    : 0

  return (
    <div className="flex flex-col h-full">
      {/* Location info */}
      <div className="p-4 border-b border-sol-border">
        {state.currentLocation && (
          <div className="space-y-1">
            <h2 className="font-pixel text-xs text-sol-green">
              📍 {state.currentLocation.name}
            </h2>
            <p className="text-xs text-sol-muted leading-relaxed">
              {state.currentLocation.description}
            </p>
          </div>
        )}
        {state.nextLocation && (
          <div className="mt-2 text-[10px] text-sol-muted">
            Next stop: <span className="text-sol-purple">{state.nextLocation.name}</span>{' '}
            ({nextDist} blocks away)
          </div>
        )}
      </div>

      {/* Pace selector */}
      <div className="px-4 py-3 border-b border-sol-border">
        <div className="text-[10px] text-sol-muted mb-2">PACE</div>
        <div className="grid grid-cols-3 gap-2">
          {(['slow', 'steady', 'reckless'] as Pace[]).map((pace) => (
            <button
              key={pace}
              onClick={() => onSetPace(pace)}
              className={`text-xs py-2 rounded-lg border transition-all btn-press ${
                state.pace === pace
                  ? 'bg-sol-green/20 border-sol-green/50 text-sol-green'
                  : 'bg-sol-darker border-sol-border text-sol-muted hover:text-sol-text'
              }`}
            >
              {pace === 'slow' && '🐢'}
              {pace === 'steady' && '🚶'}
              {pace === 'reckless' && '🏃'}
              <br />
              <span className="text-[10px]">{pace}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 space-y-2 mt-auto">
        <Button variant="primary" fullWidth onClick={onAdvance}>
          Continue on the Trail →
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            fullWidth
            onClick={onRest}
            disabled={!isRestStop && state.resources.bandwidth < 5}
          >
            {isRestStop ? '⛺ Rest' : '😴 Rest'}
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={onTrade}
            disabled={!canTrade}
          >
            🏪 Trade
          </Button>
        </div>

        <Button variant="ghost" fullWidth onClick={onToggleParty}>
          {showParty ? 'Hide Party' : '👥 Check Party'}
        </Button>
      </div>
    </div>
  )
}
