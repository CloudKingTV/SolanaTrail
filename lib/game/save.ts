import { GameState } from './types'
import { GameStats } from './achievements'

const SAVE_KEY = 'solana-trail-save'
const STATS_KEY = 'solana-trail-stats'
const DAILY_KEY = 'solana-trail-daily'

export function saveGame(state: GameState, stats: GameStats) {
  if (typeof window === 'undefined') return
  try {
    const serializable = {
      ...state,
      // Serialize the game state (strip non-serializable parts)
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializable))
    localStorage.setItem(STATS_KEY, JSON.stringify({
      ...stats,
      encounteredNpcs: [...stats.encounteredNpcs],
    }))
  } catch {
    // silent fail
  }
}

export function loadGame(): { state: GameState; stats: GameStats } | null {
  if (typeof window === 'undefined') return null
  try {
    const stateData = localStorage.getItem(SAVE_KEY)
    const statsData = localStorage.getItem(STATS_KEY)
    if (!stateData) return null

    const state = JSON.parse(stateData) as GameState
    // Restore defaults for new fields that may not exist in old saves
    state.tokenPrices = state.tokenPrices || []
    state.tokenHoldings = state.tokenHoldings || {}
    state.tradingRoundsLeft = state.tradingRoundsLeft || 0
    state.currentEncounter = state.currentEncounter || null
    state.selectedEncounterChoice = state.selectedEncounterChoice || null
    state.unlockedAchievements = state.unlockedAchievements || []
    state.dailySeed = state.dailySeed || null
    state.isDaily = state.isDaily || false

    let stats: GameStats = {
      bestTradingProfit: 0,
      diamondHanded: false,
      encountersMet: 0,
      helpedLostDegen: false,
      timesRested: 0,
      timesHunted: 0,
      encounteredNpcs: new Set(),
    }
    if (statsData) {
      const parsed = JSON.parse(statsData)
      stats = {
        ...parsed,
        encounteredNpcs: new Set(parsed.encounteredNpcs || []),
      }
    }

    return { state, stats }
  } catch {
    return null
  }
}

export function deleteSave() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SAVE_KEY)
  localStorage.removeItem(STATS_KEY)
}

export function hasSavedGame(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(SAVE_KEY) !== null
}

// Daily challenge: same seed for everyone on the same day
export function getDailySeed(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function hasDailyBeenPlayed(): boolean {
  if (typeof window === 'undefined') return false
  const today = getDailySeed()
  return localStorage.getItem(DAILY_KEY) === today
}

export function markDailyPlayed() {
  if (typeof window === 'undefined') return
  localStorage.setItem(DAILY_KEY, getDailySeed())
}

export function getDailyScore(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(`${DAILY_KEY}-score`)
    return data ? parseInt(data, 10) : null
  } catch {
    return null
  }
}

export function saveDailyScore(score: number) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${DAILY_KEY}-score`, score.toString())
}
