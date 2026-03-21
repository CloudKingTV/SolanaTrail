'use client'

import { useEffect, useState } from 'react'
import { fetchLeaderboardAPI, LeaderboardEntry } from '@/lib/solana/leaderboard'
import Link from 'next/link'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const loadEntries = async () => {
    const data = await fetchLeaderboardAPI()
    setEntries(data)
    setLoading(false)
  }

  useEffect(() => {
    loadEntries()
    // Auto-refresh every 30 seconds for live feel
    const interval = setInterval(loadEntries, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[100dvh] p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-pixel text-sm text-sol-green glow-green">
            LEADERBOARD
          </h1>
          <span className="text-[9px] text-sol-green/50 bg-sol-green/10 px-1.5 py-0.5 rounded animate-pulse">
            LIVE
          </span>
        </div>
        <Link
          href="/"
          className="text-xs text-sol-muted hover:text-sol-text transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-4xl animate-pulse">🏆</div>
          <p className="text-sm text-sol-muted">Loading scores...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="text-4xl">🏆</div>
          <p className="text-sm text-sol-muted">
            No scores yet. Be the first to reach Mainnet!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sol-green/20 border border-sol-green/50 text-sol-green rounded-lg text-sm font-semibold hover:bg-sol-green/30 transition-colors"
          >
            Start Playing
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Header row */}
          <div className="grid grid-cols-[2rem_1fr_3rem_3rem_3rem] gap-1 text-[9px] text-sol-muted px-2 pb-1 border-b border-sol-border font-pixel">
            <span>#</span>
            <span>NAME</span>
            <span className="text-right">SCORE</span>
            <span className="text-right">DAYS</span>
            <span className="text-right">DIST</span>
          </div>

          {/* Entries */}
          {entries.map((entry, i) => (
            <div
              key={`${entry.playerName}-${entry.timestamp}`}
              className={`grid grid-cols-[2rem_1fr_3rem_3rem_3rem] gap-1 items-center px-2 py-2 rounded-lg text-xs transition-colors ${
                i === 0
                  ? 'bg-sol-green/10 border border-sol-green/30'
                  : i === 1
                  ? 'bg-sol-purple/10 border border-sol-purple/20'
                  : i === 2
                  ? 'bg-warning/10 border border-warning/20'
                  : 'hover:bg-sol-card'
              }`}
            >
              <span
                className={`font-pixel text-[11px] ${
                  i === 0
                    ? 'text-sol-green'
                    : i === 1
                    ? 'text-sol-purple'
                    : i === 2
                    ? 'text-warning'
                    : 'text-sol-muted'
                }`}
              >
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </span>
              <span className="truncate text-sol-text flex items-center gap-1">
                {entry.professionIcon && <span className="text-[10px]">{entry.professionIcon}</span>}
                <span className="font-pixel text-[11px]">{entry.playerName || entry.walletAddress.slice(0, 6)}</span>
                {entry.victory && <span className="text-[9px]">✅</span>}
              </span>
              <span className="text-right font-pixel text-[11px] text-sol-green">
                {entry.score}
              </span>
              <span className="text-right text-[10px] text-sol-muted">{entry.day}</span>
              <span className="text-right text-[10px] text-sol-muted">{entry.distanceTraveled || '—'}</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-[9px] text-sol-muted pt-2">
        Top {MAX_DISPLAY} scores · Refreshes every 30s
      </div>
    </div>
  )
}

const MAX_DISPLAY = 50
