'use client'

import { ACHIEVEMENTS } from '@/lib/game/achievements'
import { Button } from '@/components/ui/Button'

interface AchievementsViewProps {
  unlockedIds: string[]
  onClose: () => void
}

export function AchievementsView({ unlockedIds, onClose }: AchievementsViewProps) {
  const unlocked = new Set(unlockedIds)
  const total = ACHIEVEMENTS.length
  const earned = unlockedIds.length

  return (
    <div className="flex flex-col items-center min-h-[100dvh] p-6 space-y-4">
      <div className="text-center space-y-2">
        <div className="text-4xl">🏅</div>
        <h1 className="font-pixel text-lg text-sol-green glow-green">ACHIEVEMENTS</h1>
        <p className="text-xs text-sol-muted">{earned}/{total} unlocked</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm h-2 rounded-full bg-sol-darker border border-sol-border overflow-hidden">
        <div
          className="h-full bg-sol-green transition-all"
          style={{ width: `${(earned / total) * 100}%` }}
        />
      </div>

      {/* Achievement grid */}
      <div className="w-full max-w-sm space-y-2 overflow-y-auto flex-1">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.id)
          const isHidden = achievement.secret && !isUnlocked

          return (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border ${
                isUnlocked
                  ? 'border-sol-green/30 bg-sol-green/5'
                  : 'border-sol-border bg-sol-darker opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {isHidden ? '❓' : achievement.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${isUnlocked ? 'text-sol-green' : 'text-sol-muted'}`}>
                    {isHidden ? '???' : achievement.name}
                  </div>
                  <div className="text-[10px] text-sol-muted">
                    {isHidden ? 'Complete a secret objective to reveal' : achievement.description}
                  </div>
                </div>
                {isUnlocked && (
                  <span className="text-sol-green text-xs">✓</span>
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
