import { StoreItem, Inventory } from './types'

// Matt's Supply Shop — Solana degen-themed general store
// Prices mirror the classic Oregon Trail's Matt's General Store

export const STORE_ITEMS: StoreItem[] = [
  {
    key: 'oxen',
    label: 'Laptops',
    icon: '💻',
    unit: 'laptop',
    basePrice: 20,
    description: 'Trading rigs to keep you moving. You need at least 1. Matt recommends 6.',
    max: 20,
    step: 2,  // bought in pairs (yokes)
  },
  {
    key: 'food',
    label: 'Ramen Packs',
    icon: '🍜',
    unit: 'packs',
    basePrice: 0.20,
    description: 'A degen\'s gotta eat. You need ~100 packs per person. Buy in bulk.',
    max: 2000,
    step: 100,
  },
  {
    key: 'clothing',
    label: 'Hoodies',
    icon: '🧥',
    unit: 'hoodie',
    basePrice: 10,
    description: 'The official crypto uniform. Protection from cold and haters. 2+ per person.',
    max: 50,
    step: 1,
  },
  {
    key: 'ammunition',
    label: 'Alpha Passes',
    icon: '🎫',
    unit: 'box (20 tips)',
    basePrice: 2,
    description: 'Intel for scouting opportunities on the trail. More alpha = more gains.',
    max: 99,
    step: 1,
  },
  {
    key: 'spareWheels',
    label: 'Backup Chargers',
    icon: '🔋',
    unit: 'charger',
    basePrice: 10,
    description: 'When your laptop dies mid-trade, you\'ll wish you had one.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareAxles',
    label: 'Hardware Wallets',
    icon: '🔐',
    unit: 'wallet',
    basePrice: 10,
    description: 'Cold storage for when your hot wallet gets compromised.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareTongues',
    label: 'Burner Phones',
    icon: '📱',
    unit: 'phone',
    basePrice: 10,
    description: 'Backup devices for when your main phone gets bricked.',
    max: 3,
    step: 1,
  },
]

export function getStorePrice(item: StoreItem, priceMultiplier: number): number {
  return Math.round(item.basePrice * priceMultiplier * 100) / 100
}

export function getStoreTotalCost(item: StoreItem, quantity: number, priceMultiplier: number): number {
  return Math.round(getStorePrice(item, priceMultiplier) * quantity * 100) / 100
}

export function canAfford(sol: number, cost: number): boolean {
  return sol >= cost
}

export function getMattsAdvice(): string[] {
  return [
    '"You\'ll need at least 6 laptops to keep your trading operation running smooth."',
    '"I\'d recommend at least 500 ramen packs — that\'s 100 per person. Degens gotta eat."',
    '"Get at least 2 hoodies per person. It gets cold out there and you\'ll look sus without one."',
    '"Don\'t forget backup gear! Nothing worse than a dead laptop in the middle of a pump."',
    '"Alpha passes are cheap right now. Stock up — you can scout for gains on the trail."',
  ]
}

export const INITIAL_INVENTORY: Inventory = {
  sol: 0,  // set by profession
  oxen: 0,
  food: 0,
  clothing: 0,
  ammunition: 0,
  spareWheels: 0,
  spareAxles: 0,
  spareTongues: 0,
}
