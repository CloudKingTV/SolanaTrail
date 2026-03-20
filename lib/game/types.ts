// ============================================
// SOLANA TRAIL — Complete Game Type System
// Crypto-themed Oregon Trail on Solana
// ============================================

// --- GAME PHASES (matches classic Oregon Trail flow) ---
export type GamePhase =
  | 'title'
  | 'profession_select'
  | 'party_naming'
  | 'epoch_select'
  | 'general_store'
  | 'traveling'
  | 'event'
  | 'river_crossing'
  | 'trading'         // at a fort/trading post
  | 'landmark'        // arrived at a landmark, can look around
  | 'hunting'         // alpha scouting mini-game
  | 'resting'
  | 'gameOver'
  | 'victory'

// --- PROFESSIONS (like Banker/Carpenter/Farmer) ---
export interface Profession {
  id: string
  name: string
  description: string
  startingSol: number
  scoreMultiplier: number
  icon: string
}

export const PROFESSIONS: Profession[] = [
  {
    id: 'whale',
    name: 'Crypto Whale',
    description: 'You got in early and have bags for days. Easiest start, but lowest score multiplier.',
    startingSol: 1600,
    scoreMultiplier: 1,
    icon: '🐋',
  },
  {
    id: 'flipper',
    name: 'NFT Flipper',
    description: 'You flip JPEGs and ride trends. Moderate funds, 2x score multiplier.',
    startingSol: 800,
    scoreMultiplier: 2,
    icon: '🖼️',
  },
  {
    id: 'degen',
    name: 'Memecoin Degen',
    description: 'You ape\'d into every dog coin and have barely any SOL left. Hardest start, but 3x score multiplier!',
    startingSol: 400,
    scoreMultiplier: 3,
    icon: '🦍',
  },
]

// --- PARTY ---
export type PartyStatus = 'healthy' | 'sick' | 'injured' | 'exhausted' | 'rugged' | 'dead'

export interface PartyMember {
  name: string
  health: number // 0-100
  status: PartyStatus
  isLeader: boolean
}

// --- PACE (like Steady/Strenuous/Grueling) ---
export type Pace = 'steady' | 'strenuous' | 'grueling'

export const PACE_INFO: Record<Pace, { label: string; description: string; icon: string; milesPerDay: number }> = {
  steady: {
    label: 'Steady',
    description: 'Travel 8 hrs/day. Many rests, rarely tired.',
    icon: '🚶',
    milesPerDay: 12,
  },
  strenuous: {
    label: 'Strenuous',
    description: 'Travel 12 hrs/day. Rest only when needed. Finish tired.',
    icon: '🏃',
    milesPerDay: 18,
  },
  grueling: {
    label: 'Grueling',
    description: 'Travel 16 hrs/day. Rarely rest. Health suffers.',
    icon: '💀',
    milesPerDay: 25,
  },
}

// --- RATIONS (like Filling/Meager/Bare Bones) ---
export type Rations = 'filling' | 'meager' | 'bare_bones'

export const RATIONS_INFO: Record<Rations, { label: string; description: string; foodPerPersonPerDay: number }> = {
  filling: {
    label: 'Filling',
    description: '3 units of food per person per day.',
    foodPerPersonPerDay: 3,
  },
  meager: {
    label: 'Meager',
    description: '2 units of food per person per day.',
    foodPerPersonPerDay: 2,
  },
  bare_bones: {
    label: 'Bare Bones',
    description: '1 unit of food per person per day. Health may suffer.',
    foodPerPersonPerDay: 1,
  },
}

// --- RESOURCES/INVENTORY ---
export interface Inventory {
  sol: number                // cash (like dollars)
  oxen: number               // laptops/rigs that keep you moving (need at least 1)
  food: number               // ramen packs (pounds equivalent)
  clothing: number           // hoodies (crypto uniform, protection)
  ammunition: number         // alpha passes (boxes of 20 tips)
  spareWheels: number        // backup chargers
  spareAxles: number         // hardware wallets
  spareTongues: number       // burner phones
}

// --- STORE ITEMS ---
export interface StoreItem {
  key: keyof Inventory
  label: string
  icon: string
  unit: string
  basePrice: number
  description: string
  max: number
  step: number
}

// --- LOCATIONS ---
export type LocationType = 'start' | 'river_crossing' | 'fort' | 'landmark' | 'end'

export interface Location {
  id: string
  name: string
  description: string
  distance: number        // distance from start in "blocks"
  type: LocationType
  hasStore: boolean        // can buy supplies here (forts)
  priceMultiplier: number  // prices go up further along trail
  riverDepth?: number      // for river crossings (randomized at runtime)
  talkTexts?: string[]     // things NPCs say at this location
}

// --- RIVER CROSSING ---
export type RiverCrossingChoice = 'ford' | 'caulk_and_float' | 'pay_ferry' | 'wait'

// --- EVENTS ---
export interface GameEvent {
  id: string
  title: string
  description: string
  choices: EventChoice[]
  weight: number
  category: 'disease' | 'breakdown' | 'weather' | 'theft' | 'trail' | 'positive' | 'choice'
}

export interface EventChoice {
  id: string
  text: string
  outcome: EventOutcome
}

export interface EventOutcome {
  description: string
  inventoryChanges?: Partial<Inventory>
  partyEffect?: {
    type: 'damage' | 'heal' | 'status'
    value: number
    status?: PartyStatus
    target: 'random' | 'all' | 'leader'
  }
  healthChange?: number  // direct health modifier for whole party
  daysLost?: number
}

// --- HUNTING (Alpha Scouting) ---
export interface HuntingTarget {
  id: string
  name: string
  icon: string
  reward: number    // food/bounty reward
  speed: number     // how fast it moves (1-10)
  size: number      // tap target size
  points: number    // score value
}

// --- GAME STATE ---
export interface GameState {
  phase: GamePhase
  profession: Profession | null
  party: PartyMember[]
  day: number
  distanceTraveled: number
  totalDistance: number
  inventory: Inventory
  pace: Pace
  rations: Rations
  health: 'good' | 'fair' | 'poor' | 'very_poor'
  currentLocation: Location | null
  nextLocation: Location | null
  currentEvent: GameEvent | null
  selectedChoice: EventChoice | null
  riverDepth: number
  messageLog: MessageEntry[]
  score: number
  startTime: number
  walletAddress?: string
  // Hunting state
  huntingAmmoUsed: number
  huntingFoodGained: number
  // Departure epoch
  startEpoch: number // 1-5 (like March-July)
  currentWeather: 'clear' | 'rainy' | 'cold' | 'hot' | 'snowy'
}

export interface MessageEntry {
  id: string
  text: string
  type: 'info' | 'success' | 'warning' | 'danger' | 'system'
  day: number
}

// --- ACTIONS ---
export type GameAction =
  | { type: 'SELECT_PROFESSION'; profession: Profession }
  | { type: 'SET_PARTY_NAMES'; names: string[] }
  | { type: 'SET_EPOCH'; epoch: number }
  | { type: 'BUY_INITIAL'; item: keyof Inventory; quantity: number }
  | { type: 'LEAVE_STORE' }
  | { type: 'START_TRAIL' }
  | { type: 'ADVANCE_DAY' }
  | { type: 'SET_PACE'; pace: Pace }
  | { type: 'SET_RATIONS'; rations: Rations }
  | { type: 'HANDLE_CHOICE'; choiceId: string }
  | { type: 'DISMISS_EVENT' }
  | { type: 'ENTER_TRADING' }
  | { type: 'BUY_ITEM'; item: keyof Inventory; quantity: number }
  | { type: 'LEAVE_TRADING' }
  | { type: 'REST' }
  | { type: 'CONTINUE_FROM_LANDMARK' }
  | { type: 'LOOK_AROUND' }
  | { type: 'TALK_TO_PEOPLE' }
  | { type: 'START_HUNTING' }
  | { type: 'HUNT_SHOOT'; targetId: string }
  | { type: 'END_HUNTING' }
  | { type: 'RIVER_CHOICE'; choice: RiverCrossingChoice }
  | { type: 'PLAY_AGAIN' }
