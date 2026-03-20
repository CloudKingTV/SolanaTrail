'use client'

import { Location, Inventory } from '@/lib/game/types'
import { STORE_ITEMS, getStorePrice } from '@/lib/game/store'
import { Button } from '@/components/ui/Button'

interface TradingPostProps {
  location: Location
  inventory: Inventory
  onBuy: (item: keyof Inventory, quantity: number) => void
  onLeave: () => void
}

export function TradingPost({ location, inventory, onBuy, onLeave }: TradingPostProps) {
  const multiplier = location.priceMultiplier

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sol-border text-center">
        <h2 className="font-pixel text-xs text-sol-green glow-green mb-1">
          {location.name} — Supply Post
        </h2>
        <div className="text-[10px] text-sol-muted">
          Prices: {multiplier}x base
        </div>
        <div className="mt-2 inline-block px-3 py-1 rounded bg-sol-darker border border-sol-border">
          <span className="text-xs text-sol-muted">Your SOL: </span>
          <span className="text-sm font-bold text-sol-green">◎ {inventory.sol.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {STORE_ITEMS.map((item) => {
          const price = getStorePrice(item, multiplier)
          const stepCost = price * item.step
          const canBuy = inventory.sol >= stepCost

          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg bg-sol-card border border-sol-border"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-sol-text truncate">{item.label}</div>
                  <div className="text-[10px] text-sol-muted">
                    ◎ {price.toFixed(2)} each · Have: {inventory[item.key] || 0}
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                className="text-[10px] px-3 py-1.5 min-h-[36px] ml-2"
                disabled={!canBuy}
                onClick={() => onBuy(item.key, item.step)}
              >
                +{item.step}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-sol-border">
        <Button variant="ghost" fullWidth onClick={onLeave}>
          ← Back
        </Button>
      </div>
    </div>
  )
}
