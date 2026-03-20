import { StoreItem, Inventory } from './types'

// Matt's Supply Shop — supplies for the journey through Solana's ecosystem

export const STORE_ITEMS: StoreItem[] = [
  {
    key: 'oxen',
    label: 'Validators',
    icon: '⬡',
    unit: 'node',
    basePrice: 20,
    description: 'Validator nodes to keep your operation running. Need at least 1 to move. 6 for max speed.',
    max: 20,
    step: 2,  // bought in pairs
  },
  {
    key: 'food',
    label: 'Bandwidth',
    icon: '⚡',
    unit: 'GB',
    basePrice: 0.20,
    description: 'Network bandwidth to keep your party connected. ~100 GB per person. Buy in bulk.',
    max: 2000,
    step: 100,
  },
  {
    key: 'clothing',
    label: 'Firewalls',
    icon: '🛡️',
    unit: 'license',
    basePrice: 10,
    description: 'Security layers to protect against exploits and bear market conditions. 2+ per person.',
    max: 50,
    step: 1,
  },
  {
    key: 'ammunition',
    label: 'Alpha Passes',
    icon: '🎫',
    unit: 'box (20 uses)',
    basePrice: 2,
    description: 'Intel passes for scouting opportunities on the trail. More alpha = more gains.',
    max: 99,
    step: 1,
  },
  {
    key: 'spareWheels',
    label: 'Spare GPUs',
    icon: '🖥️',
    unit: 'GPU',
    basePrice: 10,
    description: 'Replacement GPUs for when your validator hardware overheats.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareAxles',
    label: 'Spare SSDs',
    icon: '💾',
    unit: 'SSD',
    basePrice: 10,
    description: 'Backup storage drives for when your validator data gets corrupted.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareTongues',
    label: 'Spare PSUs',
    icon: '🔌',
    unit: 'PSU',
    basePrice: 10,
    description: 'Backup power supplies. Validators need power and PSUs fail more than you\'d think.',
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
    '"You\'ll need at least 6 validators to keep your network running at full speed."',
    '"I\'d recommend at least 500 GB of bandwidth — that\'s 100 per person."',
    '"Get at least 2 firewalls per person. Bear markets and exploits will wreck you without them."',
    '"Don\'t forget spare parts! A GPU failure in the middle of MEV Forest is a death sentence."',
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
