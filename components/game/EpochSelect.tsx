'use client'

import { Button } from '@/components/ui/Button'

interface EpochSelectProps {
  onSelect: (epoch: number) => void
}

const EPOCHS = [
  { id: 1, name: 'Epoch 1 (Early)', description: 'Bear market start. Tough conditions early but you\'ll dodge late-trail crypto winter.', icon: '📉' },
  { id: 2, name: 'Epoch 2', description: 'Crab market. Sideways action but the ecosystem is warming up.', icon: '🦀' },
  { id: 3, name: 'Epoch 3 (Recommended)', description: 'Bull market conditions. Best balance of market conditions for the whole journey.', icon: '📈' },
  { id: 4, name: 'Epoch 4', description: 'FOMO season start. Hot early but risk crypto winter at the end.', icon: '🔥' },
  { id: 5, name: 'Epoch 5 (Late)', description: 'Peak FOMO. Everyone\'s leveraged. High risk of brutal winter at journey\'s end.', icon: '❄️' },
]

export function EpochSelect({ onSelect }: EpochSelectProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          CHOOSE DEPARTURE
        </h1>
        <p className="text-xs text-sol-muted leading-relaxed">
          Which epoch would you like to depart?
          <br />
          Leaving too early or too late affects market conditions on the trail.
        </p>
      </div>

      <div className="space-y-2 flex-1">
        {EPOCHS.map((epoch) => (
          <button
            key={epoch.id}
            onClick={() => onSelect(epoch.id)}
            className={`w-full text-left p-3 rounded-lg border transition-all btn-press ${
              epoch.id === 3
                ? 'border-sol-green/50 bg-sol-green/10 hover:bg-sol-green/20'
                : 'border-sol-border bg-sol-card hover:bg-sol-darker'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{epoch.icon}</span>
              <div>
                <div className="text-sm font-semibold text-sol-text">
                  {epoch.name}
                </div>
                <div className="text-[10px] text-sol-muted">
                  {epoch.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-[10px] text-sol-muted text-center">
        Tip: Epoch 3 gives the best balance of market conditions for your journey.
      </div>
    </div>
  )
}
