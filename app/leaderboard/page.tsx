'use client'

import { useEffect, useState } from 'react'
import { getLeaderboard, LeaderboardEntry } from '@/lib/solana/leaderboard'
import Link from 'next/link'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    setEntries(getLeaderboard())
  }, [])

  return (
    <div className="min-h-[100dvh] p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          LEADERBOARD
        </h1>
        <Link
          href="/"
          className="text-xs text-sol-muted hover:text-sol-text transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Table */}
      {entries.length === 0 ? (
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
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-[2rem_1fr_4rem_3rem] gap-2 text-[10px] text-sol-muted px-2 pb-1 border-b border-sol-border">
            <span>#</span>
            <span>Player</span>
            <span className="text-right">Score</span>
            <span className="text-right">Days</span>
          </div>

          {/* Entries */}
          {entries.map((entry, i) => (
            <div
              key={`${entry.walletAddress}-${entry.timestamp}`}
              className={`grid grid-cols-[2rem_1fr_4rem_3rem] gap-2 items-center px-2 py-2 rounded-lg text-xs ${
                i < 3 ? 'bg-sol-card border border-sol-border' : ''
              }`}
            >
              <span
                className={
                  i === 0
                    ? 'text-sol-green font-bold'
                    : i === 1
                    ? 'text-sol-purple'
                    : i === 2
                    ? 'text-warning'
                    : 'text-sol-muted'
                }
              >
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </span>
              <span className="truncate text-sol-text">
                {entry.walletAddress.slice(0, 4)}...{entry.walletAddress.slice(-4)}
                {entry.victory && ' ✅'}
              </span>
              <span className="text-right font-semibold text-sol-green">
                {entry.score}
              </span>
              <span className="text-right text-sol-muted">{entry.day}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
