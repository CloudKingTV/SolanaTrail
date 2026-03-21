'use client'

import { COLLECTIBLES, RARITY_COLORS, getCollectiblesSortedByRarity } from '@/lib/game/collectibles'
import { CollectibleRarity } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'

interface CollectiblesViewProps {
  collectedIds: string[]
  onClose: () => void
}

const RARITY_LABEL: Record<CollectibleRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
}

export function CollectiblesView({ collectedIds, onClose }: CollectiblesViewProps) {
  const collected = new Set(collectedIds)
  const total = COLLECTIBLES.length
  const found = collectedIds.filter(id => COLLECTIBLES.some(c => c.id === id)).length
  const sorted = getCollectiblesSortedByRarity()
  const percent = Math.round((found / total) * 100)

  return (
    <div className="flex flex-col items-center min-h-[100dvh] p-5 space-y-4 animate-fade-in">
      <div className="text-center space-y-1.5">
        <div className="text-4xl">🎒</div>
        <h1 className="font-pixel text-sm text-sol-green glow-green">ITEMS</h1>
        <p className="text-xs text-sol-muted">{found}/{total} collected ({percent}%)</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="h-2 rounded-full bg-sol-darker border border-sol-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sol-purple to-sol-green rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Item grid */}
      <div className="w-full max-w-sm space-y-1.5 overflow-y-auto flex-1 pb-2">
        {sorted.map((item) => {
          const isCollected = collected.has(item.id)
          const colors = RARITY_COLORS[item.rarity]

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-lg border transition-colors ${
                isCollected
                  ? `${colors.border} ${colors.bg}`
                  : 'border-sol-border/50 bg-sol-darker/50 opacity-40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-xl ${isCollected ? '' : 'grayscale'}`}>
                  {isCollected ? item.icon : '🔒'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold ${isCollected ? colors.text : 'text-sol-muted'}`}>
                      {isCollected ? item.name : '???'}
                    </span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text} uppercase tracking-wide`}>
                      {RARITY_LABEL[item.rarity]}
                    </span>
                  </div>
                  <div className="text-[10px] text-sol-muted leading-snug mt-0.5">
                    {isCollected ? item.description : item.source}
                  </div>
                </div>
                {isCollected && (
                  <span className={`text-sm shrink-0 ${colors.text}`}>✓</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Button variant="ghost" fullWidth onClick={onClose} className="max-w-sm">
        ← Back
      </Button>
    </div>
  )
}
