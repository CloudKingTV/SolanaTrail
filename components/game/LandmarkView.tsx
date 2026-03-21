'use client'

import { useState } from 'react'
import { Location, Inventory, MessageEntry } from '@/lib/game/types'
import { COLLECTIBLES, RARITY_COLORS } from '@/lib/game/collectibles'
import { Button } from '@/components/ui/Button'
import { MessageLog } from './MessageLog'

interface LandmarkViewProps {
  location: Location
  inventory: Inventory
  foundCollectibles: string[]
  onContinue: () => void
  onLookAround: () => void
  onTalk: () => void
  onTrade: () => void
  onRest: () => void
  onSellCollectible: (id: string) => void
  onTokenTrade?: () => void
  messages: MessageEntry[]
}

export function LandmarkView({
  location, inventory, foundCollectibles, onContinue, onLookAround, onTalk, onTrade, onRest, onSellCollectible, onTokenTrade, messages,
}: LandmarkViewProps) {
  const isFort = location.hasStore
  const [showSellPanel, setShowSellPanel] = useState(false)

  const sellableItems = foundCollectibles
    .map(id => COLLECTIBLES.find(c => c.id === id))
    .filter(Boolean) as typeof COLLECTIBLES

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Location header — fixed at top */}
      <div className="shrink-0 p-4 border-b border-sol-border text-center space-y-2">
        <div className="text-3xl">
          {isFort ? '🏰' : location.type === 'landmark' ? '🗿' : '📍'}
        </div>
        <h2 className="font-pixel text-xs text-sol-green glow-green">
          {location.name}
        </h2>
        <p className="text-xs text-sol-muted leading-relaxed">
          {location.description}
        </p>
        {isFort && (
          <div className="text-[10px] text-sol-purple">
            Prices here: {location.priceMultiplier}x base price
          </div>
        )}
      </div>

      {/* Messages — scrollable middle section */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {showSellPanel && isFort ? (
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-pixel text-[10px] text-sol-green">SELL ITEMS</span>
              <span className="text-[10px] text-sol-muted">{inventory.sol.toFixed(1)} SOL</span>
            </div>
            {sellableItems.length === 0 ? (
              <div className="text-center py-6 text-sol-muted text-xs">
                No items to sell. Find collectibles on the trail!
              </div>
            ) : (
              sellableItems.map(item => {
                const colors = RARITY_COLORS[item.rarity]
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-lg border ${colors.border} bg-sol-card`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-sol-text truncate">{item.name}</div>
                      <div className={`text-[10px] ${colors.text} capitalize`}>{item.rarity}</div>
                    </div>
                    <button
                      onClick={() => onSellCollectible(item.id)}
                      className="shrink-0 px-3 py-1 rounded-lg bg-sol-green/20 border border-sol-green/30 text-sol-green text-[10px] font-bold hover:bg-sol-green/30 transition-colors"
                    >
                      Sell {item.sellValue} SOL
                    </button>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <MessageLog messages={messages} />
        )}
      </div>

      {/* Actions — fixed at bottom */}
      <div className="shrink-0 p-3 space-y-2 border-t border-sol-border bg-sol-darker">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" fullWidth onClick={onLookAround} className="text-[10px]">
            👀 Look Around
          </Button>
          <Button
            variant="ghost" fullWidth onClick={onTalk}
            disabled={!location.talkTexts?.length}
            className="text-[10px]"
          >
            💬 Talk to People
          </Button>
        </div>
        <div className={`grid ${onTokenTrade || (isFort && foundCollectibles.length > 0) ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
          <Button
            variant="secondary" fullWidth onClick={onTrade}
            disabled={!isFort}
            className="text-[10px]"
          >
            🏪 Supplies
          </Button>
          {onTokenTrade && (
            <Button variant="secondary" fullWidth onClick={onTokenTrade} className="text-[10px]">
              📊 Tokens
            </Button>
          )}
          {isFort && foundCollectibles.length > 0 && (
            <Button
              variant="secondary" fullWidth
              onClick={() => setShowSellPanel(!showSellPanel)}
              className={`text-[10px] ${showSellPanel ? 'ring-1 ring-sol-green' : ''}`}
            >
              💎 Sell ({foundCollectibles.length})
            </Button>
          )}
          <Button variant="ghost" fullWidth onClick={onRest} className="text-[10px]">
            😴 Rest
          </Button>
        </div>
        <Button variant="primary" fullWidth onClick={onContinue}>
          Continue on the Trail →
        </Button>
      </div>
    </div>
  )
}
