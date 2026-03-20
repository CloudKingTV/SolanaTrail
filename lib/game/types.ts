export type GamePhase =
  | 'title'
  | 'setup'
  | 'traveling'
  | 'event'
  | 'trading'
  | 'resting'
  | 'gameOver'
  | 'victory'

export type PartyRole =
  | 'Developer'
  | 'Validator Operator'
  | 'NFT Artist'
  | 'DeFi Degen'
  | 'Protocol Founder'

export type PartyStatus = 'healthy' | 'sick' | 'injured' | 'rugged' | 'dead'

export type Pace = 'slow' | 'steady' | 'reckless'

export interface PartyMember {
  name: string
  role: PartyRole
  health: number // 0-100
  status: PartyStatus
}

export interface Resources {
  sol: number
  validators: number
  bandwidth: number
  morale: number
}

export interface Location {
  id: string
  name: string
  description: string
  distance: number // distance from start in "blocks"
  type: 'landmark' | 'trading_post' | 'danger_zone' | 'rest_stop'
  trading?: TradingInventory
}

export interface TradingInventory {
  validators: { price: number; stock: number }
  bandwidth: { price: number; stock: number }
  morale: { price: number; stock: number }
}

export interface GameEvent {
  id: string
  title: string
  description: string
  choices: EventChoice[]
  minDay?: number
  maxDay?: number
  weight: number // probability weight
  category: 'positive' | 'negative' | 'neutral' | 'choice'
}

export interface EventChoice {
  id: string
  text: string
  outcome: EventOutcome
}

export interface EventOutcome {
  description: string
  resourceChanges: Partial<Resources>
  partyEffect?: {
    type: 'damage' | 'heal' | 'status'
    value: number
    status?: PartyStatus
    target: 'random' | 'all'
  }
  moraleMod?: number
}

export interface GameState {
  phase: GamePhase
  day: number
  distanceTraveled: number
  totalDistance: number
  resources: Resources
  party: PartyMember[]
  pace: Pace
  currentLocation: Location | null
  nextLocation: Location | null
  currentEvent: GameEvent | null
  selectedChoice: EventChoice | null
  messageLog: MessageEntry[]
  score: number
  startTime: number
  walletAddress?: string
}

export interface MessageEntry {
  id: string
  text: string
  type: 'info' | 'success' | 'warning' | 'danger' | 'system'
  day: number
}

export type GameAction =
  | { type: 'START_GAME'; walletAddress?: string }
  | { type: 'ADVANCE_DAY' }
  | { type: 'SET_PACE'; pace: Pace }
  | { type: 'HANDLE_CHOICE'; choiceId: string }
  | { type: 'DISMISS_EVENT' }
  | { type: 'ENTER_TRADING' }
  | { type: 'BUY_ITEM'; item: keyof Resources; quantity: number }
  | { type: 'LEAVE_TRADING' }
  | { type: 'REST' }
  | { type: 'CONTINUE' }
