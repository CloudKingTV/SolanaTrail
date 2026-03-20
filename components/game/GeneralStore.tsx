'use client'

import { Inventory } from '@/lib/game/types'
import { STORE_ITEMS, getStorePrice, getMattsAdvice } from '@/lib/game/store'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

interface GeneralStoreProps {
  inventory: Inventory
  onBuy: (item: keyof Inventory, quantity: number) => void
  onLeave: () => void
}

export function GeneralStore({ inventory, onBuy, onLeave }: GeneralStoreProps) {
  const [showAdvice, setShowAdvice] = useState(false)

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Header */}
      <div className="p-4 border-b border-sol-border text-center">
        <h1 className="font-pixel text-xs text-sol-green glow-green mb-1">
          MATT&apos;S SUPPLY SHOP
        </h1>
        <p className="text-[10px] text-sol-muted">Genesis Block, Solana</p>
        <div className="mt-2 inline-block px-3 py-1 rounded bg-sol-darker border border-sol-border">
          <span className="text-xs text-sol-muted">Your SOL: </span>
          <span className="text-sm font-bold text-sol-green">◎ {inventory.sol.toFixed(2)}</span>
        </div>
      </div>

      {/* Advice toggle */}
      <button
        onClick={() => setShowAdvice(!showAdvice)}
        className="mx-4 mt-3 text-[10px] text-sol-purple hover:text-sol-green transition-colors text-left"
      >
        {showAdvice ? '▼ Hide Matt\'s advice' : '▶ Ask Matt for advice'}
      </button>
      {showAdvice && (
        <div className="mx-4 mt-2 p-3 rounded-lg bg-sol-darker border border-sol-border space-y-1">
          {getMattsAdvice().map((tip, i) => (
            <p key={i} className="text-[10px] text-sol-muted italic leading-relaxed">{tip}</p>
          ))}
        </div>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {STORE_ITEMS.map((item) => {
          const price = getStorePrice(item, 1.0)
          const currentQty = inventory[item.key] || 0
          const stepCost = price * item.step
          const canBuy = inventory.sol >= stepCost && currentQty + item.step <= item.max

          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 rounded-lg bg-sol-card border border-sol-border"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xl">{item.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-sol-text truncate">{item.label}</div>
                  <div className="text-[10px] text-sol-muted">
                    ◎ {price.toFixed(2)} per {item.unit} · Have: {currentQty}
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

      {/* Current inventory summary */}
      <div className="p-4 border-t border-sol-border space-y-3">
        <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
          <div><span className="text-sol-muted">Phones</span><br /><span className="font-bold">{inventory.oxen}</span></div>
          <div><span className="text-sol-muted">Data</span><br /><span className="font-bold">{inventory.food}</span></div>
          <div><span className="text-sol-muted">VPNs</span><br /><span className="font-bold">{inventory.clothing}</span></div>
          <div><span className="text-sol-muted">Alpha</span><br /><span className="font-bold">{inventory.ammunition}</span></div>
        </div>

        <Button variant="secondary" fullWidth onClick={onLeave}>
          Hit the Trail!
        </Button>
      </div>
    </div>
  )
}
