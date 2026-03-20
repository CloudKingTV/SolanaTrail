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
  { id: 'rabbit', name: 'Shitcoin Flip', icon: '🪙', reward: 5, difficulty: 'Easy' },
  { id: 'deer', name: 'NFT Snipe', icon: '🖼️', reward: 35, difficulty: 'Medium' },
  { id: 'bear', name: 'Airdrop Farm', icon: '🌾', reward: 80, difficulty: 'Hard' },
  { id: 'buffalo', name: 'Gem Find', icon: '💎', reward: 100, difficulty: 'Very Hard' },
]

export function HuntingView({ ammoRemaining, foodGained, onShoot, onFinish, messages }: HuntingViewProps) {
  const maxFood = 100

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sol-border text-center space-y-2">
        <h2 className="font-pixel text-xs text-sol-green glow-green">
          ALPHA HUNT
        </h2>
        <div className="flex justify-center gap-4 text-xs">
          <div>
            <span className="text-sol-muted">Alpha: </span>
            <span className={ammoRemaining <= 0 ? 'text-danger' : 'text-sol-text'}>
              {ammoRemaining}
            </span>
          </div>
          <div>
            <span className="text-sol-muted">Data found: </span>
            <span className="text-sol-green">{foodGained}/{maxFood}</span>
          </div>
        </div>
        <p className="text-[10px] text-sol-muted">
          Scout for alpha to earn data rewards. Max {maxFood} GB per session.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0">
        <MessageLog messages={messages} />
      </div>

      {/* Targets */}
      <div className="p-3 space-y-2 border-t border-sol-border">
        <div className="grid grid-cols-2 gap-2">
          {TARGETS.map((target) => (
            <button
              key={target.id}
              onClick={() => onShoot(target.id)}
              disabled={ammoRemaining <= 0 || foodGained >= maxFood}
              className="p-3 rounded-lg border border-sol-border bg-sol-card hover:bg-sol-darker active:bg-sol-darker disabled:opacity-40 transition-all btn-press text-center"
            >
              <div className="text-2xl">{target.icon}</div>
              <div className="text-[10px] font-semibold text-sol-text">{target.name}</div>
              <div className="text-[10px] text-sol-muted">+{target.reward} GB · {target.difficulty}</div>
            </button>
          ))}
        </div>

        <Button variant="secondary" fullWidth onClick={onFinish}>
          Done Scouting (gain {foodGained} GB data)
        </Button>
      </div>
    </div>
  )
}
