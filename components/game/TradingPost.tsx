'use client'

import { Location, Resources } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'

interface TradingPostProps {
  location: Location
  resources: Resources
  onBuy: (item: keyof Resources, quantity: number) => void
  onLeave: () => void
}

const itemInfo: Record<string, { icon: string; label: string; description: string }> = {
  validators: { icon: '⬡', label: 'Validators', description: 'Keep the network running' },
  bandwidth: { icon: '⚡', label: 'Bandwidth', description: 'Fuel for your journey' },
  morale: { icon: '♥', label: 'Morale Boost', description: 'Stickers, memes & vibes' },
}

export function TradingPost({ location, resources, onBuy, onLeave }: TradingPostProps) {
  if (!location.trading) return null

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="font-pixel text-sm text-sol-green glow-green mb-1">
          {location.name}
        </h2>
        <p className="text-xs text-sol-muted">Trading Post</p>
      </div>

      <div className="p-2 rounded-lg bg-sol-darker border border-sol-border text-center">
        <span className="text-xs text-sol-muted">Your SOL: </span>
        <span className="text-sm font-bold text-sol-green">◎ {resources.sol.toFixed(1)}</span>
      </div>

      <div className="space-y-3">
        {Object.entries(location.trading).map(([key, item]) => {
          const info = itemInfo[key]
          if (!info || item.stock <= 0) return null
          const canBuy = resources.sol >= item.price

          return (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-lg bg-sol-card border border-sol-border"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{info.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{info.label}</div>
                  <div className="text-[10px] text-sol-muted">
                    ◎ {item.price} SOL · {item.stock} in stock
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                className="text-xs px-3 py-2 min-h-[40px]"
                disabled={!canBuy}
                onClick={() => onBuy(key as keyof Resources, 1)}
              >
                Buy
              </Button>
            </div>
          )
        })}
      </div>

      <Button variant="ghost" fullWidth onClick={onLeave}>
        Leave Trading Post
      </Button>
    </div>
  )
}
