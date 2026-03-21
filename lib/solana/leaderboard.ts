export interface LeaderboardEntry {
  playerName: string
  walletAddress: string
  score: number
  day: number
  distanceTraveled: number
  survived: number
  totalParty: number
  victory: boolean
  profession?: string
  professionIcon?: string
  isDaily?: boolean
  isTurbo?: boolean
  timestamp: number
}

export type LeaderboardType = 'normal' | 'daily' | 'turbo'

function getEntryType(entry: LeaderboardEntry): LeaderboardType {
  if (entry.isTurbo) return 'turbo'
  if (entry.isDaily) return 'daily'
  return 'normal'
}

function storageKey(type: LeaderboardType): string {
  if (type === 'daily') return 'solana-trail-leaderboard-daily'
  if (type === 'turbo') return 'solana-trail-leaderboard-turbo'
  return 'solana-trail-leaderboard'
}

// Local storage fallback
export function getLeaderboard(type: LeaderboardType = 'normal'): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(storageKey(type))
    if (!data) return []
    const entries: LeaderboardEntry[] = JSON.parse(data)
    return entries.sort((a, b) => b.score - a.score).slice(0, 50)
  } catch {
    return []
  }
}

export function submitScore(entry: LeaderboardEntry): LeaderboardEntry[] {
  const type = getEntryType(entry)
  const entries = getLeaderboard(type)
  entries.push(entry)
  entries.sort((a, b) => b.score - a.score)
  const top50 = entries.slice(0, 50)

  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey(type), JSON.stringify(top50))
  }

  return top50
}

// API-based leaderboard functions
export async function fetchLeaderboardAPI(type: LeaderboardType = 'normal'): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`/api/leaderboard?type=${type}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch')
    const apiEntries: LeaderboardEntry[] = await res.json()
    // Merge with localStorage entries (in case API write failed but localStorage succeeded)
    const localEntries = getLeaderboard(type)
    const merged = mergeEntries(apiEntries, localEntries)
    return merged
  } catch {
    // Fallback to localStorage
    return getLeaderboard(type)
  }
}

function mergeEntries(a: LeaderboardEntry[], b: LeaderboardEntry[]): LeaderboardEntry[] {
  const seen = new Set<number>()
  const merged: LeaderboardEntry[] = []
  for (const entry of [...a, ...b]) {
    if (!seen.has(entry.timestamp)) {
      seen.add(entry.timestamp)
      merged.push(entry)
    }
  }
  return merged.sort((x, y) => y.score - x.score).slice(0, 50)
}

export async function submitScoreAPI(entry: LeaderboardEntry): Promise<{ rank: number; entries: LeaderboardEntry[] }> {
  // Always save to localStorage so leaderboard page can find it
  submitScore(entry)

  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    if (!res.ok) throw new Error('Failed to submit')
    const result = await res.json()
    // Sync localStorage with server data to avoid duplicates on merge
    const type = getEntryType(entry)
    if (typeof window !== 'undefined' && result.entries) {
      localStorage.setItem(storageKey(type), JSON.stringify(result.entries))
    }
    return result
  } catch {
    // API failed but localStorage has it
    const type = getEntryType(entry)
    const entries = getLeaderboard(type)
    const rank = entries.findIndex(e => e.timestamp === entry.timestamp) + 1
    return { rank, entries }
  }
}
