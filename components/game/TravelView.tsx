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
      <div className="px-4 py-2.5 border-b border-sol-border bg-sol-card/30">
        <div className="flex items-center justify-between">
          <div>
            {state.currentLocation && (
              <h2 className="font-pixel text-[10px] text-sol-green flex items-center gap-1.5">
                <span className="text-sm">📍</span> {state.currentLocation.name}
              </h2>
            )}
          </div>
          {state.nextLocation && (
            <div className="text-[10px] text-sol-muted text-right">
              <span className="text-sol-purple">{state.nextLocation.name}</span>
              <span className="text-[9px] block">{nextDist} blocks away</span>
            </div>
          )}
        </div>
      </div>

      {/* Pace & Rations — compact dual-row selector */}
      <div className="px-3 py-2 border-b border-sol-border space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-sol-muted uppercase tracking-wide w-10 shrink-0">Pace</span>
          <div className="flex-1 grid grid-cols-3 gap-1">
            {(['steady', 'strenuous', 'grueling'] as Pace[]).map((pace) => (
              <button
                key={pace}
                onClick={() => onSetPace(pace)}
                className={`text-[10px] py-1 rounded-md border transition-all btn-press ${
                  state.pace === pace
                    ? 'bg-sol-green/15 border-sol-green/40 text-sol-green font-semibold'
                    : 'bg-transparent border-sol-border/50 text-sol-muted hover:text-sol-text hover:border-sol-border'
                }`}
              >
                {PACE_INFO[pace].icon} {PACE_INFO[pace].label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-sol-muted uppercase tracking-wide w-10 shrink-0">Data</span>
          <div className="flex-1 grid grid-cols-3 gap-1">
            {(['filling', 'meager', 'bare_bones'] as Rations[]).map((ration) => (
              <button
                key={ration}
                onClick={() => onSetRations(ration)}
                className={`text-[10px] py-1 rounded-md border transition-all btn-press ${
                  state.rations === ration
                    ? 'bg-sol-purple/15 border-sol-purple/40 text-sol-purple font-semibold'
                    : 'bg-transparent border-sol-border/50 text-sol-muted hover:text-sol-text hover:border-sol-border'
                }`}
              >
                {RATIONS_INFO[ration].label}
              </button>
            ))}
          </div>
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
          {showParty ? '← Back to Trail' : '👥 Check Party & Supplies'}
        </Button>
      </div>
    </div>
  )
}
