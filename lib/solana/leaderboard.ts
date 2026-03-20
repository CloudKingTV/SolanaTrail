export interface LeaderboardEntry {
  walletAddress: string
  score: number
  day: number
  survived: number
  totalParty: number
  victory: boolean
  timestamp: number
}

const STORAGE_KEY = 'solana-trail-leaderboard'

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const entries: LeaderboardEntry[] = JSON.parse(data)
    return entries.sort((a, b) => b.score - a.score).slice(0, 50)
  } catch {
    return []
  }
}

export function submitScore(entry: LeaderboardEntry): LeaderboardEntry[] {
  const entries = getLeaderboard()
  entries.push(entry)
  entries.sort((a, b) => b.score - a.score)
  const top50 = entries.slice(0, 50)

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top50))
  }

  return top50
}
