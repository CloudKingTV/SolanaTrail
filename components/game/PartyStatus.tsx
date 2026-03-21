'use client'

import { PartyMember } from '@/lib/game/types'

interface PartyStatusProps {
  party: PartyMember[]
}

const statusEmoji: Record<string, string> = {
  healthy: '💚',
  sick: '🤢',
  injured: '🤕',
  exhausted: '😩',
  rugged: '💀',
  dead: '⚰️',
}

const statusColor: Record<string, string> = {
  healthy: 'text-sol-green',
  sick: 'text-warning',
  injured: 'text-warning',
  exhausted: 'text-warning',
  rugged: 'text-danger',
  dead: 'text-sol-muted',
}

function healthBarColor(hp: number): string {
  if (hp > 60) return 'bg-sol-green'
  if (hp > 30) return 'bg-warning'
  return 'bg-danger'
}

export function PartyStatus({ party }: PartyStatusProps) {
  const alive = party.filter(m => m.status !== 'dead').length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-pixel text-[10px] text-sol-purple">PARTY</h3>
        <span className="text-[10px] text-sol-muted">{alive}/{party.length} active</span>
      </div>
      <div className="grid gap-1.5">
        {party.map((member) => {
          const isDead = member.status === 'dead'
          return (
            <div
              key={member.name}
              className={`px-2.5 py-2 rounded-lg border transition-colors ${
                isDead
                  ? 'bg-sol-darker/50 border-sol-border/30 opacity-40'
                  : member.health <= 25
                    ? 'bg-danger/5 border-danger/20'
                    : 'bg-sol-darker border-sol-border'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{statusEmoji[member.status] || '💚'}</span>
                  <span className={`text-xs font-semibold ${statusColor[member.status] || 'text-sol-text'}`}>
                    {member.isLeader ? '⭐ ' : ''}{member.name}
                  </span>
                  {member.role && (
                    <span className="text-[9px] text-sol-muted">({member.role})</span>
                  )}
                </div>
                {!isDead && (
                  <span className={`text-[10px] font-mono ${
                    member.health > 60 ? 'text-sol-green' : member.health > 30 ? 'text-warning' : 'text-danger'
                  }`}>
                    {member.health}%
                  </span>
                )}
              </div>
              {!isDead && (
                <div className="w-full h-1 bg-sol-darker rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${healthBarColor(member.health)}`}
                    style={{ width: `${member.health}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
