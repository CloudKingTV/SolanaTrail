'use client'

import { GameState, Pace, Rations, PACE_INFO, RATIONS_INFO } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'

interface TravelViewProps {
  state: GameState
  onAdvance: () => void
  onRest: () => void
  onTrade: () => void
  onSetPace: (pace: Pace) => void
  onSetRations: (rations: Rations) => void
  onHunt: () => void
  showParty: boolean
  onToggleParty: () => void
}

export function TravelView({
  state, onAdvance, onRest, onTrade, onSetPace, onSetRations, onHunt, showParty, onToggleParty,
}: TravelViewProps) {
  const canTrade = state.currentLocation?.hasStore === true
  const nextDist = state.nextLocation ? state.nextLocation.distance - state.distanceTraveled : 0

  return (
    <div className="flex flex-col">
      {/* Location info */}
      <div className="px-4 py-3 border-b border-sol-border">
        {state.currentLocation && (
          <div className="space-y-1">
            <h2 className="font-pixel text-[10px] text-sol-green">
              📍 {state.currentLocation.name}
            </h2>
          </div>
        )}
        {state.nextLocation && (
          <div className="text-[10px] text-sol-muted">
            Next: <span className="text-sol-purple">{state.nextLocation.name}</span>{' '}
            ({nextDist} blocks)
          </div>
        )}
      </div>

      {/* Pace selector */}
      <div className="px-4 py-2 border-b border-sol-border">
        <div className="text-[10px] text-sol-muted mb-1">PACE</div>
        <div className="grid grid-cols-3 gap-1">
          {(['steady', 'strenuous', 'grueling'] as Pace[]).map((pace) => (
            <button
              key={pace}
              onClick={() => onSetPace(pace)}
              className={`text-[10px] py-1.5 rounded border transition-all btn-press ${
                state.pace === pace
                  ? 'bg-sol-green/20 border-sol-green/50 text-sol-green'
                  : 'bg-sol-darker border-sol-border text-sol-muted hover:text-sol-text'
              }`}
            >
              {PACE_INFO[pace].icon} {PACE_INFO[pace].label}
            </button>
          ))}
        </div>
      </div>

      {/* Rations selector */}
      <div className="px-4 py-2 border-b border-sol-border">
        <div className="text-[10px] text-sol-muted mb-1">RATIONS</div>
        <div className="grid grid-cols-3 gap-1">
          {(['filling', 'meager', 'bare_bones'] as Rations[]).map((ration) => (
            <button
              key={ration}
              onClick={() => onSetRations(ration)}
              className={`text-[10px] py-1.5 rounded border transition-all btn-press ${
                state.rations === ration
                  ? 'bg-sol-purple/20 border-sol-purple/50 text-sol-purple'
                  : 'bg-sol-darker border-sol-border text-sol-muted hover:text-sol-text'
              }`}
            >
              {RATIONS_INFO[ration].label}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-3 space-y-2">
        <Button variant="primary" fullWidth onClick={onAdvance}>
          Continue on the Trail →
        </Button>

        <div className="grid grid-cols-3 gap-1.5">
          <Button variant="ghost" fullWidth onClick={onRest} className="text-[10px] px-2">
            😴 Rest
          </Button>
          <Button variant="ghost" fullWidth onClick={onHunt} disabled={state.inventory.ammunition <= 0} className="text-[10px] px-2">
            🎫 Scout
          </Button>
          <Button variant="secondary" fullWidth onClick={onTrade} disabled={!canTrade} className="text-[10px] px-2">
            🏪 Trade
          </Button>
        </div>

        <Button variant="ghost" fullWidth onClick={onToggleParty} className="text-[10px]">
          {showParty ? 'Hide Party' : '👥 Check Party & Supplies'}
        </Button>
      </div>
    </div>
  )
}
