'use client'

import { useState } from 'react'
import { GameHistoryEntry } from '@/lib/game/history'

interface GameHistoryProps {
  entries: GameHistoryEntry[]
  onClose: () => void
}

export function GameHistory({ entries, onClose }: GameHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-[100dvh] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          GAME HISTORY
        </h1>
        <button
          onClick={onClose}
          className="text-xs text-sol-muted hover:text-sol-text transition-colors"
        >
          ← Back
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-4xl">📜</div>
          <p className="text-sm text-sol-muted">
            No games played yet. Start your first journey!
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id
            const dateStr = new Date(entry.timestamp).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })
            const timeStr = new Date(entry.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric', minute: '2-digit',
            })

            return (
              <button
                key={entry.id}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className={`w-full text-left rounded-xl border transition-all ${
                  entry.victory
                    ? 'border-sol-green/30 bg-sol-green/5'
                    : 'border-danger/20 bg-danger/5'
                } ${isExpanded ? 'ring-1 ring-sol-green/30' : ''}`}
              >
                {/* Card Header */}
                <div className="p-3 flex items-center gap-3">
                  <div className="text-2xl">
                    {entry.victory ? '🏆' : '💀'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-pixel text-xs ${entry.victory ? 'text-sol-green' : 'text-danger'}`}>
                        {entry.victory ? 'VICTORY' : 'GAME OVER'}
                      </span>
                      {entry.isDaily && (
                        <span className="text-[10px] text-sol-blue bg-sol-blue/10 px-1.5 py-0.5 rounded">
                          DAILY
                        </span>
                      )}
                      {entry.professionIcon && (
                        <span className="text-xs">{entry.professionIcon}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-sol-muted mt-0.5">
                      {dateStr} at {timeStr}
                    </div>
                  </div>
                  <div className="text-right">
                    {entry.victory && (
                      <div className="font-pixel text-sm text-sol-green">{entry.score}</div>
                    )}
                    <div className="text-[10px] text-sol-muted">
                      Day {entry.days} · {entry.distanceTraveled}/{entry.totalDistance}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2 border-t border-sol-border/30 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <DetailBox label="Profession" value={entry.profession || 'Unknown'} />
                      <DetailBox label="Team" value={entry.teamType === 'builders' ? 'Builders' : 'Explorers'} />
                      <DetailBox label="Survivors" value={`${entry.partySurvivors}/${entry.partyTotal}`} />
                      <DetailBox label="SOL Left" value={`◎ ${entry.solRemaining}`} />
                      <DetailBox label="Distance" value={`${entry.distanceTraveled} blocks`} />
                      <DetailBox label="Mode" value={entry.mode === 'newcomer' ? 'Newcomer' : 'Veteran'} />
                    </div>
                    <div>
                      <div className="text-[10px] text-sol-muted mb-1">PARTY</div>
                      <div className="text-xs text-sol-text">
                        {entry.partyNames.join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-1.5 rounded bg-sol-darker border border-sol-border/30 text-center">
      <div className="text-[9px] text-sol-muted">{label}</div>
      <div className="text-[11px] text-sol-text font-semibold">{value}</div>
    </div>
  )
}
