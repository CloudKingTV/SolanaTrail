'use client'

import { Button } from '@/components/ui/Button'

interface EpochSelectProps {
  onSelect: (epoch: number) => void
}

const EPOCHS = [
  { id: 1, name: 'Epoch 1 (Early)', month: 'March', description: 'Cold start. Grass is scarce but you\'ll avoid the late-trail winter.', icon: '🌱' },
  { id: 2, name: 'Epoch 2', month: 'April', description: 'Still chilly, but the network is warming up.', icon: '🌤️' },
  { id: 3, name: 'Epoch 3 (Recommended)', month: 'May', description: 'Ideal conditions. Balanced weather for the whole journey.', icon: '☀️' },
  { id: 4, name: 'Epoch 4', month: 'June', description: 'Warm start, but risk crypto winter at the end.', icon: '🔥' },
  { id: 5, name: 'Epoch 5 (Late)', month: 'July', description: 'Hot start, high risk of harsh conditions at journey\'s end.', icon: '❄️' },
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
          Leaving too early or too late affects weather on the trail.
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
        Tip: Epoch 3 (May) gives the best balance of weather conditions.
      </div>
    </div>
  )
}
