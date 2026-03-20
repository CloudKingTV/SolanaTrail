import { StoreItem, Inventory } from './types'

// Matt's DeFi Supply — Solana-themed general store
// Prices mirror the classic Oregon Trail's Matt's General Store

export const STORE_ITEMS: StoreItem[] = [
  {
    key: 'oxen',
    label: 'Validators',
    icon: '⬡',
    unit: 'validator',
    basePrice: 20,
    description: 'Server nodes to keep your network running. You need at least 1 to move. Matt recommends 6.',
    max: 20,
    step: 2,  // bought in pairs (yokes)
  },
  {
    key: 'food',
    label: 'Bandwidth Packs',
    icon: '⚡',
    unit: 'units',
    basePrice: 0.20,
    description: 'Data to fuel your journey. You need ~100 units per person. Buy in bulk.',
    max: 2000,
    step: 100,
  },
  {
    key: 'clothing',
    label: 'Security Patches',
    icon: '🛡️',
    unit: 'set',
    basePrice: 10,
    description: 'Firewall and security updates. At least 2 per person recommended.',
    max: 50,
    step: 1,
  },
  {
    key: 'ammunition',
    label: 'Bug Bounty Kits',
    icon: '🔫',
    unit: 'box (20 charges)',
    basePrice: 2,
    description: 'Tools for hunting bugs and earning rewards on the trail.',
    max: 99,
    step: 1,
  },
  {
    key: 'spareWheels',
    label: 'Spare GPUs',
    icon: '🖥️',
    unit: 'GPU',
    basePrice: 10,
    description: 'Replacement graphics cards for when yours burns out.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareAxles',
    label: 'Spare SSDs',
    icon: '💾',
    unit: 'SSD',
    basePrice: 10,
    description: 'Replacement storage drives for your validator node.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareTongues',
    label: 'Spare Power Supplies',
    icon: '🔌',
    unit: 'PSU',
    basePrice: 10,
    description: 'Replacement power supplies. They fail more than you\'d think.',
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
    '"You\'ll need at least 6 validators to keep your network running smoothly."',
    '"I\'d recommend starting with at least 500 units of bandwidth — that\'s 100 per person."',
    '"Get at least 2 security patches per person, or you\'ll be vulnerable out there."',
    '"Don\'t forget spare parts! Nothing worse than a GPU failure in the middle of MEV Forest."',
    '"Bug bounty kits are cheap now. Stock up — you can hunt for rewards on the trail."',
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
