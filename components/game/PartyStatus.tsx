'use client'

import { PartyMember } from '@/lib/game/types'

interface PartyStatusProps {
  party: PartyMember[]
}

const statusEmoji: Record<string, string> = {
  healthy: '💚',
  sick: '🤢',
  injured: '🤕',
  rugged: '💀',
  dead: '⚰️',
}

const statusColor: Record<string, string> = {
  healthy: 'text-sol-green',
  sick: 'text-warning',
  injured: 'text-warning',
  rugged: 'text-danger',
  dead: 'text-sol-muted line-through',
}

export function PartyStatus({ party }: PartyStatusProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-pixel text-[10px] text-sol-purple">PARTY</h3>
      <div className="grid gap-1.5">
        {party.map((member) => (
          <div
            key={member.name}
            className={`flex items-center justify-between text-xs px-2 py-1.5 rounded bg-sol-darker border border-sol-border ${
              member.status === 'dead' ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{statusEmoji[member.status]}</span>
              <div>
                <span className={statusColor[member.status]}>
                  {member.isLeader ? '⭐ ' : ''}{member.name}
                </span>
              </div>
            </div>
            {member.status !== 'dead' && (
              <div className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-sol-darker rounded-full overflow-hidden border border-sol-border">
                  <div
                    className={`h-full rounded-full transition-all ${
                      member.health > 50 ? 'bg-sol-green' : member.health > 25 ? 'bg-warning' : 'bg-danger'
                    }`}
                    style={{ width: `${member.health}%` }}
                  />
                </div>
                <span className="text-[10px] text-sol-muted w-6 text-right">{member.health}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
