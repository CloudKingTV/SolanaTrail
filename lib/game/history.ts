import { GameState } from './types'
import { getAliveCount } from './party'

export interface GameHistoryEntry {
  id: string
  date: string           // ISO date string
  score: number
  days: number
  distanceTraveled: number
  totalDistance: number
  victory: boolean
  profession: string | null
  professionIcon: string | null
  teamType: string
  mode: string
  partySurvivors: number
  partyTotal: number
  partyNames: string[]
  solRemaining: number
  isDaily: boolean
  timestamp: number
}

const HISTORY_KEY = 'solana-trail-history'
const MAX_ENTRIES = 50

export function getGameHistory(): GameHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    if (!data) return []
    const entries: GameHistoryEntry[] = JSON.parse(data)
    return entries.sort((a, b) => b.timestamp - a.timestamp)
  } catch {
    return []
  }
}

export function addGameToHistory(state: GameState): void {
  if (typeof window === 'undefined') return
  const alive = getAliveCount(state.party)

  const entry: GameHistoryEntry = {
    id: `game-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
    score: state.score,
    days: state.day,
    distanceTraveled: state.distanceTraveled,
    totalDistance: state.totalDistance,
    victory: state.phase === 'victory',
    profession: state.profession?.name || null,
    professionIcon: state.profession?.icon || null,
    teamType: state.teamType,
    mode: state.mode,
    partySurvivors: alive,
    partyTotal: state.party.length,
    partyNames: state.party.map(p => p.name),
    solRemaining: Math.round(state.inventory.sol),
    isDaily: state.isDaily,
    timestamp: Date.now(),
  }

  const entries = getGameHistory()
  entries.unshift(entry)
  const trimmed = entries.slice(0, MAX_ENTRIES)

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
}

export function getGameHistoryCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    if (!data) return 0
    return JSON.parse(data).length
  } catch {
    return 0
  }
}
