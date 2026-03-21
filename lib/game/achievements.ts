import { Achievement, GameState } from './types'
import { getAliveCount } from './party'

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // === COMPLETION ===
  { id: 'mainnet_reached', name: 'Mainnet Maxi', icon: '🏆', description: 'Complete the trail and reach Mainnet Launch' },
  { id: 'all_survived', name: 'Diamond Crew', icon: '💎', description: 'Reach Mainnet with all 5 party members alive' },
  { id: 'speed_run', name: 'Speedrun Any%', icon: '⚡', description: 'Reach Mainnet in under 100 days' },
  { id: 'slow_and_steady', name: 'Patience is a Virtue', icon: '🐢', description: 'Reach Mainnet in over 200 days' },

  // === DIFFICULTY ===
  { id: 'degen_win', name: 'True Degen', icon: '🦍', description: 'Win the game as a Memecoin Degen' },
  { id: 'whale_win', name: 'Whale of a Time', icon: '🐋', description: 'Win the game as a Crypto Whale' },
  { id: 'flipper_win', name: 'Master Flipper', icon: '🖼️', description: 'Win the game as an NFT Flipper' },
  { id: 'veteran_win', name: 'Crypto Veteran', icon: '🎖️', description: 'Win the game in Veteran mode' },

  // === TRADING ===
  { id: 'trading_profit', name: 'Buy Low Sell High', icon: '📈', description: 'Earn 50+ SOL profit from token trading in a single session' },
  { id: 'diamond_hands', name: 'Diamond Hands', icon: '💎', description: 'Hold a token through a 30%+ price drop without selling' },
  { id: 'rich_finish', name: 'Paper Millionaire', icon: '💰', description: 'Finish the game with 500+ SOL' },

  // === ENCOUNTERS ===
  { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', description: 'Meet 5 different NPCs on the trail' },
  { id: 'helper', name: 'Good Samaritan', icon: '🤝', description: 'Help the Lost Degen' },

  // === SURVIVAL ===
  { id: 'close_call', name: 'Close Call', icon: '😰', description: 'Have a party member survive with 5 HP or less' },
  { id: 'never_rested', name: 'Sleep is for the Weak', icon: '☕', description: 'Reach Mainnet without ever resting' },
  { id: 'no_hunting', name: 'Pacifist Run', icon: '🕊️', description: 'Reach Mainnet without hunting' },

  // === SECRET ===
  { id: 'full_team_dead', name: 'Total Wipe', icon: '💀', description: 'Lose all party members', secret: true },
  { id: 'max_score', name: 'High Roller', icon: '🎰', description: 'Score over 5000 points', secret: true },
  { id: 'daily_winner', name: 'Daily Champion', icon: '📅', description: 'Complete a Daily Challenge', secret: true },
]

const STORAGE_KEY = 'solana-trail-achievements'

// Check which achievements were just earned based on game state
export function checkAchievements(state: GameState, stats: GameStats): string[] {
  const newAchievements: string[] = []
  const already = new Set(state.unlockedAchievements)

  function check(id: string, condition: boolean) {
    if (!already.has(id) && condition) newAchievements.push(id)
  }

  const isVictory = state.phase === 'victory'
  const alive = getAliveCount(state.party)
  const minHp = state.party.filter(m => m.status !== 'dead').reduce((min, m) => Math.min(min, m.health), 100)

  // Completion
  check('mainnet_reached', isVictory)
  check('all_survived', isVictory && alive === 5)
  check('speed_run', isVictory && state.day < 100)
  check('slow_and_steady', isVictory && state.day > 200)

  // Difficulty
  check('degen_win', isVictory && state.profession?.id === 'degen')
  check('whale_win', isVictory && state.profession?.id === 'whale')
  check('flipper_win', isVictory && state.profession?.id === 'flipper')
  check('veteran_win', isVictory && state.mode === 'veteran')

  // Trading
  check('trading_profit', stats.bestTradingProfit >= 50)
  check('rich_finish', isVictory && state.inventory.sol >= 500)
  check('diamond_hands', stats.diamondHanded)

  // Encounters
  check('social_butterfly', stats.encountersMet >= 5)
  check('helper', stats.helpedLostDegen)

  // Survival
  check('close_call', minHp > 0 && minHp <= 5)
  check('never_rested', isVictory && stats.timesRested === 0)
  check('no_hunting', isVictory && stats.timesHunted === 0)

  // Secret
  check('full_team_dead', state.phase === 'gameOver' && alive === 0)
  check('max_score', state.score > 5000)
  check('daily_winner', isVictory && state.isDaily)

  return newAchievements
}

// Stats tracked across the game for achievement checking
export interface GameStats {
  bestTradingProfit: number
  diamondHanded: boolean
  encountersMet: number
  helpedLostDegen: boolean
  timesRested: number
  timesHunted: number
  encounteredNpcs: Set<string>
}

export function createInitialStats(): GameStats {
  return {
    bestTradingProfit: 0,
    diamondHanded: false,
    encountersMet: 0,
    helpedLostDegen: false,
    timesRested: 0,
    timesHunted: 0,
    encounteredNpcs: new Set(),
  }
}

// Persist achievements to localStorage
export function loadAchievements(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveAchievements(ids: string[]) {
  if (typeof window === 'undefined') return
  try {
    const existing = loadAchievements()
    const merged = [...new Set([...existing, ...ids])]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch {
    // silent fail
  }
}

// Server-synced versions

export async function loadAchievementsServer(walletAddress?: string): Promise<string[]> {
  try {
    const params = walletAddress ? `?wallet=${walletAddress}` : ''
    const res = await fetch(`/api/achievements${params}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch')
    const serverIds: string[] = await res.json()
    const localIds = loadAchievements()
    const merged = [...new Set([...serverIds, ...localIds])]
    // Sync localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    }
    return merged
  } catch {
    return loadAchievements()
  }
}

export async function saveAchievementsServer(ids: string[], walletAddress?: string) {
  // Save locally first
  saveAchievements(ids)
  // Sync to server
  try {
    await fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, walletAddress: walletAddress || 'anonymous' }),
    })
  } catch {
    // localStorage has it as fallback
  }
}
