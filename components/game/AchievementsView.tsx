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
  const percent = Math.round((earned / total) * 100)

  return (
    <div className="flex flex-col items-center min-h-[100dvh] p-5 space-y-4 animate-fade-in">
      <div className="text-center space-y-1.5">
        <div className="text-4xl">🏅</div>
        <h1 className="font-pixel text-sm text-sol-green glow-green">ACHIEVEMENTS</h1>
        <p className="text-xs text-sol-muted">{earned}/{total} unlocked ({percent}%)</p>
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

      {/* Achievement grid */}
      <div className="w-full max-w-sm space-y-1.5 overflow-y-auto flex-1 pb-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.id)
          const isHidden = achievement.secret && !isUnlocked

          return (
            <div
              key={achievement.id}
              className={`p-2.5 rounded-lg border transition-colors ${
                isUnlocked
                  ? 'border-sol-green/30 bg-sol-green/5'
                  : 'border-sol-border/50 bg-sol-darker/50 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`text-xl ${isUnlocked ? '' : 'grayscale'}`}>
                  {isHidden ? '❓' : achievement.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold ${isUnlocked ? 'text-sol-green' : 'text-sol-muted'}`}>
                    {isHidden ? '???' : achievement.name}
                  </div>
                  <div className="text-[10px] text-sol-muted leading-snug">
                    {isHidden ? 'Complete a secret objective to reveal' : achievement.description}
                  </div>
                </div>
                {isUnlocked && (
                  <span className="text-sol-green text-sm shrink-0">✓</span>
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
