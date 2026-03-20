'use client'

import { Location, Inventory, MessageEntry } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'
import { MessageLog } from './MessageLog'

interface LandmarkViewProps {
  location: Location
  inventory: Inventory
  onContinue: () => void
  onLookAround: () => void
  onTalk: () => void
  onTrade: () => void
  onRest: () => void
  onTokenTrade?: () => void
  messages: MessageEntry[]
}

export function LandmarkView({
  location, inventory, onContinue, onLookAround, onTalk, onTrade, onRest, onTokenTrade, messages,
}: LandmarkViewProps) {
  const isFort = location.hasStore

  return (
    <div className="flex flex-col h-full">
      {/* Location header */}
      <div className="p-4 border-b border-sol-border text-center space-y-2">
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

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <MessageLog messages={messages} />
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2 border-t border-sol-border">
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
        <div className={`grid ${onTokenTrade ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
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
