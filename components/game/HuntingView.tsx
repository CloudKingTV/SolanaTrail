'use client'

import { MessageEntry } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'
import { MessageLog } from './MessageLog'

interface HuntingViewProps {
  ammoRemaining: number
  foodGained: number
  onShoot: (targetId: string) => void
  onFinish: () => void
  messages: MessageEntry[]
}

const TARGETS = [
  { id: 'rabbit', name: 'Shitcoin Flip', icon: '🪙', reward: 5, hitRate: '80%', difficulty: 'Easy', color: 'text-sol-green' },
  { id: 'deer', name: 'NFT Snipe', icon: '🖼️', reward: 35, hitRate: '50%', difficulty: 'Medium', color: 'text-warning' },
  { id: 'bear', name: 'Airdrop Farm', icon: '🌾', reward: 80, hitRate: '25%', difficulty: 'Hard', color: 'text-sol-purple' },
  { id: 'buffalo', name: 'Gem Find', icon: '💎', reward: 100, hitRate: '15%', difficulty: 'Rare', color: 'text-sol-blue' },
]

export function HuntingView({ ammoRemaining, foodGained, onShoot, onFinish, messages }: HuntingViewProps) {
  const maxFood = 100
  const atMax = foodGained >= maxFood
  const outOfAmmo = ammoRemaining <= 0
  const done = atMax || outOfAmmo
  const progress = Math.min(100, (foodGained / maxFood) * 100)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-sol-border space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-pixel text-[10px] text-sol-green glow-green">
            ALPHA HUNT
          </h2>
          <div className="flex items-center gap-3 text-[10px]">
            <span className={outOfAmmo ? 'text-danger' : 'text-sol-muted'}>
              🎫 {ammoRemaining}
            </span>
            <span className="text-sol-green font-bold">
              📶 {foodGained}/{maxFood} GB
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-sol-darker rounded-full overflow-hidden">
          <div
            className="h-full bg-sol-green rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {done && (
          <p className={`text-[10px] font-semibold text-center ${atMax ? 'text-sol-green' : 'text-danger'}`}>
            {atMax ? 'Max data reached! Finish to collect.' : 'Out of alpha passes!'}
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <MessageLog messages={messages} />
      </div>

      {/* Targets */}
      <div className="p-2.5 space-y-2 border-t border-sol-border">
        <div className="grid grid-cols-2 gap-1.5">
          {TARGETS.map((target) => (
            <button
              key={target.id}
              onClick={() => onShoot(target.id)}
              disabled={done}
              className="p-2 rounded-lg border border-sol-border bg-sol-card hover:bg-sol-darker active:scale-95 disabled:opacity-30 transition-all text-center"
            >
              <div className="text-xl">{target.icon}</div>
              <div className="text-[10px] font-semibold text-sol-text">{target.name}</div>
              <div className="text-[9px] text-sol-muted">
                +{target.reward} GB <span className={target.color}>({target.hitRate})</span>
              </div>
            </button>
          ))}
        </div>

        <Button variant={done ? 'primary' : 'ghost'} fullWidth onClick={onFinish}>
          {done ? `Collect ${foodGained} GB Data →` : `Done (${foodGained} GB)`}
        </Button>
      </div>
    </div>
  )
}
