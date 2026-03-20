'use client'

import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '@/lib/game/achievements'

interface AchievementToastProps {
  achievementIds: string[]
  onDone: () => void
}

export function AchievementToast({ achievementIds, onDone }: AchievementToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onDone])

  if (achievementIds.length === 0) return null

  const achievements = achievementIds
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean)

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="bg-sol-card border-2 border-sol-green/50 rounded-xl px-4 py-3 shadow-2xl space-y-1 min-w-[250px]">
        <div className="text-[10px] text-sol-green font-pixel text-center">ACHIEVEMENT UNLOCKED!</div>
        {achievements.map((a) => a && (
          <div key={a.id} className="flex items-center gap-2 text-sm">
            <span>{a.icon}</span>
            <span className="text-sol-text font-semibold">{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
