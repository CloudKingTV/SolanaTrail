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
      {/* Header */}
      <div className="p-3 border-b border-sol-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-pixel text-[10px] text-sol-green glow-green">
              🏪 {location.name}
            </h2>
            <div className="text-[9px] text-sol-muted mt-0.5">
              {multiplier > 1.5 ? '⚠️ ' : ''}Prices: {multiplier}x base
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-sol-darker border border-sol-border">
            <span className="text-[10px] text-sol-green font-bold">◎ {inventory.sol.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {STORE_ITEMS.map((item) => {
          const price = getStorePrice(item, multiplier)
          const stepCost = price * item.step
          const canBuy = inventory.sol >= stepCost
          const currentQty = inventory[item.key] || 0

          return (
            <div
              key={item.key}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-sol-card border border-sol-border"
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-sol-text truncate">{item.label}</span>
                  <span className="text-[10px] text-sol-muted ml-1 shrink-0">own: {currentQty}</span>
                </div>
                <div className="text-[10px] text-sol-muted">
                  ◎ {price.toFixed(2)} ea
                </div>
              </div>
              <button
                disabled={!canBuy}
                onClick={() => onBuy(item.key, item.step)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all btn-press bg-sol-green/15 border border-sol-green/30 text-sol-green hover:bg-sol-green/25 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                +{item.step} <span className="text-[8px] opacity-70">◎{stepCost.toFixed(1)}</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-sol-border">
        <Button variant="ghost" fullWidth onClick={onLeave}>
          ← Back to {location.name}
        </Button>
      </div>
    </div>
  )
}
