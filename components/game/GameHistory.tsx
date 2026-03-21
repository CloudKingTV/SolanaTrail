'use client'

import { useState } from 'react'
import { GameHistoryEntry } from '@/lib/game/history'
import { Button } from '@/components/ui/Button'

interface GameHistoryProps {
  entries: GameHistoryEntry[]
  onClose: () => void
}

export function GameHistory({ entries, onClose }: GameHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const wins = entries.filter(e => e.victory).length

  return (
    <div className="flex flex-col min-h-[100dvh] p-5 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="text-4xl">📜</div>
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          GAME HISTORY
        </h1>
        {entries.length > 0 && (
          <p className="text-xs text-sol-muted">{entries.length} games played · {wins} victories</p>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <p className="text-sm text-sol-muted">
            No games played yet.
          </p>
          <p className="text-xs text-sol-muted/50">
            Start your first journey!
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 overflow-y-auto flex-1 pb-2">
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id
            const dateStr = new Date(entry.timestamp).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric',
            })
            const timeStr = new Date(entry.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric', minute: '2-digit',
            })

            return (
              <button
                key={entry.id}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className={`w-full text-left rounded-lg border transition-all ${
                  entry.victory
                    ? 'border-sol-green/20 bg-sol-green/5'
                    : 'border-sol-border/50 bg-sol-darker/50'
                } ${isExpanded ? 'ring-1 ring-sol-purple/30' : ''}`}
              >
                {/* Card Header */}
                <div className="p-2.5 flex items-center gap-2.5">
                  <span className="text-lg shrink-0">
                    {entry.victory ? '🏆' : '💀'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-pixel text-[10px] ${entry.victory ? 'text-sol-green' : 'text-danger'}`}>
                        {entry.victory ? 'VICTORY' : 'GAME OVER'}
                      </span>
                      {entry.isTurbo && (
                        <span className="text-[8px] text-warning bg-warning/10 px-1 py-0.5 rounded">⚡</span>
                      )}
                      {entry.isDaily && (
                        <span className="text-[8px] text-sol-blue bg-sol-blue/10 px-1 py-0.5 rounded">📅</span>
                      )}
                      {entry.professionIcon && (
                        <span className="text-[10px]">{entry.professionIcon}</span>
                      )}
                    </div>
                    <div className="text-[9px] text-sol-muted mt-0.5">
                      {dateStr} · {timeStr} · Day {entry.days}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {entry.victory && (
                      <div className="font-pixel text-xs text-sol-green">{entry.score}</div>
                    )}
                    <div className="text-[9px] text-sol-muted">
                      {entry.partySurvivors}/{entry.partyTotal} survived
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-2.5 pb-2.5 space-y-2 border-t border-sol-border/20 pt-2 animate-fade-in">
                    <div className="grid grid-cols-3 gap-1.5">
                      <DetailBox label="Profession" value={entry.profession || '?'} />
                      <DetailBox label="Team" value={entry.teamType === 'builders' ? 'Builders' : 'Explorers'} />
                      <DetailBox label="Mode" value={entry.mode === 'newcomer' ? 'New' : 'Vet'} />
                      <DetailBox label="Distance" value={`${entry.distanceTraveled}`} />
                      <DetailBox label="SOL" value={`◎${entry.solRemaining}`} />
                      <DetailBox label="Survivors" value={`${entry.partySurvivors}/${entry.partyTotal}`} />
                    </div>
                    <div className="text-[10px] text-sol-muted">
                      Party: <span className="text-sol-text">{entry.partyNames.join(', ')}</span>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      <Button variant="ghost" fullWidth onClick={onClose}>
        ← Back
      </Button>
    </div>
  )
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1 px-1.5 rounded-md bg-sol-darker/50 text-center">
      <div className="text-[8px] text-sol-muted uppercase tracking-wide">{label}</div>
      <div className="text-[10px] text-sol-text font-semibold truncate">{value}</div>
    </div>
  )
}
