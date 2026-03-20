import { TokenPrice } from './types'

// Tokens available for trading at forts
// Prices fluctuate each "round" based on volatility
// Buy low, sell high to earn SOL for your journey

export const TOKEN_CATALOG: Omit<TokenPrice, 'price' | 'history'>[] = [
  { name: 'BONK', icon: '🐕', volatility: 0.4 },
  { name: 'JUP', icon: '🪐', volatility: 0.25 },
  { name: 'WIF', icon: '🐶', volatility: 0.5 },
  { name: 'PYTH', icon: '🔮', volatility: 0.2 },
  { name: 'RNDR', icon: '🎨', volatility: 0.3 },
]

// Generate initial prices for a trading session
export function generateTokenPrices(seed?: number): TokenPrice[] {
  const rng = seed !== undefined ? seededRandom(seed) : Math.random
  return TOKEN_CATALOG.map((t) => {
    const basePrice = Math.round((rng() * 40 + 5) * 100) / 100 // 5-45 SOL
    return {
      ...t,
      price: basePrice,
      history: [basePrice],
    }
  })
}

// Simulate one market tick — prices move based on volatility
export function tickPrices(prices: TokenPrice[], seed?: number): TokenPrice[] {
  const rng = seed !== undefined ? seededRandom(seed) : Math.random
  return prices.map((token) => {
    const change = (rng() - 0.48) * token.volatility * token.price // slight upward bias
    const newPrice = Math.max(0.5, Math.round((token.price + change) * 100) / 100)
    return {
      ...token,
      price: newPrice,
      history: [...token.history.slice(-9), newPrice], // keep last 10 prices
    }
  })
}

// Simple seeded PRNG (mulberry32)
export function seededRandom(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Get a numeric seed from a date string like "2024-03-20"
export function dateSeed(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}
