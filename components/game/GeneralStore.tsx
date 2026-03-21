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
      <div className="p-4 border-b border-sol-border text-center space-y-2">
        <div className="text-2xl">🏪</div>
        <h1 className="font-pixel text-xs text-sol-green glow-green">
          MATT&apos;S SUPPLY SHOP
        </h1>
        <p className="text-[10px] text-sol-muted">Genesis Block, Solana</p>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-sol-darker border border-sol-border">
          <span className="text-[10px] text-sol-muted">Balance:</span>
          <span className="text-sm font-bold text-sol-green">◎ {inventory.sol.toFixed(1)}</span>
        </div>
      </div>

      {/* Matt's advice — prominent animated banner */}
      {!showAdvice ? (
        <button
          onClick={() => setShowAdvice(true)}
          className="mx-3 mt-3 p-2.5 rounded-lg border border-sol-purple/40 bg-sol-purple/10 hover:bg-sol-purple/20 transition-all animate-pulse-subtle group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl animate-bounce-slow">🧑‍💼</span>
            <div className="text-left flex-1">
              <div className="text-[11px] font-bold text-sol-purple">
                Not sure what to buy?
              </div>
              <div className="text-[10px] text-sol-muted group-hover:text-sol-text transition-colors">
                Tap for Matt&apos;s tips →
              </div>
            </div>
            <span className="text-sol-purple animate-ping-slow">💡</span>
          </div>
        </button>
      ) : (
        <div className="mx-3 mt-3 p-3 rounded-lg border border-sol-purple/30 bg-sol-purple/5 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🧑‍💼</span>
            <span className="text-[11px] font-bold text-sol-purple">Matt says:</span>
            <button
              onClick={() => setShowAdvice(false)}
              className="ml-auto text-[10px] text-sol-muted hover:text-sol-text px-1"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5">
            {getMattsAdvice().map((tip, i) => (
              <p key={i} className="text-[11px] text-sol-text leading-relaxed pl-2 border-l-2 border-sol-purple/30">
                {tip}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {STORE_ITEMS.map((item) => {
          const price = getStorePrice(item, 1.0)
          const currentQty = inventory[item.key] || 0
          const stepCost = price * item.step
          const canBuy = inventory.sol >= stepCost && currentQty + item.step <= item.max

          return (
            <div
              key={item.key}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-sol-card border border-sol-border"
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-sol-text truncate">{item.label}</span>
                  <span className="text-[10px] text-sol-muted ml-1 shrink-0">{currentQty}</span>
                </div>
                <div className="text-[10px] text-sol-muted">
                  ◎ {price.toFixed(2)} per {item.unit}
                </div>
              </div>
              <button
                disabled={!canBuy}
                onClick={() => onBuy(item.key, item.step)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all btn-press bg-sol-green/15 border border-sol-green/30 text-sol-green hover:bg-sol-green/25 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                +{item.step}
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer with inventory summary + leave button */}
      <div className="p-3 border-t border-sol-border space-y-2.5">
        <div className="grid grid-cols-4 gap-1.5">
          <InvPill icon="📱" label="Phone" value={inventory.oxen} />
          <InvPill icon="📶" label="Data" value={inventory.food} />
          <InvPill icon="🛡️" label="VPN" value={inventory.clothing} />
          <InvPill icon="🎫" label="Alpha" value={inventory.ammunition} />
        </div>
        <Button variant="secondary" fullWidth onClick={onLeave}>
          Hit the Trail! →
        </Button>
      </div>
    </div>
  )
}

function InvPill({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="text-center py-1 rounded-md bg-sol-darker/50 text-[9px]">
      <span>{icon}</span>
      <div className="font-bold text-sol-text">{value}</div>
      <div className="text-sol-muted">{label}</div>
    </div>
  )
}
