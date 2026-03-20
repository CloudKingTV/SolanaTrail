import { StoreItem, Inventory } from './types'

// Matt's Supply Shop — supplies for the journey through Solana's ecosystem

export const STORE_ITEMS: StoreItem[] = [
  {
    key: 'oxen',
    label: 'Phones',
    icon: '📱',
    unit: 'device',
    basePrice: 20,
    description: 'Your Seeker phones. Can\'t do anything without one. More phones = faster multitasking.',
    max: 20,
    step: 2,  // bought in pairs
  },
  {
    key: 'food',
    label: 'Data',
    icon: '📶',
    unit: 'GB',
    basePrice: 0.20,
    description: 'Mobile data to keep your crew online. ~100 GB per person. No data = no trades.',
    max: 2000,
    step: 100,
  },
  {
    key: 'clothing',
    label: 'VPNs',
    icon: '🛡️',
    unit: 'license',
    basePrice: 10,
    description: 'Security protection from hacks, exploits, and scammers. Need more during bear markets.',
    max: 50,
    step: 1,
  },
  {
    key: 'ammunition',
    label: 'Alpha Passes',
    icon: '🎫',
    unit: 'box (20 uses)',
    basePrice: 2,
    description: 'Intel for scouting the next play before everyone else. More alpha = more gains.',
    max: 99,
    step: 1,
  },
  {
    key: 'spareWheels',
    label: 'Portable Chargers',
    icon: '🔋',
    unit: 'charger',
    basePrice: 10,
    description: 'When your phone dies mid-swap, you\'ll wish you had one of these.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareAxles',
    label: 'Hardware Wallets',
    icon: '🔐',
    unit: 'wallet',
    basePrice: 10,
    description: 'Cold storage backup for when your hot wallet gets drained.',
    max: 3,
    step: 1,
  },
  {
    key: 'spareTongues',
    label: 'Burner Phones',
    icon: '📵',
    unit: 'phone',
    basePrice: 10,
    description: 'Backup device for when your Seeker gets bricked. Trust us, it happens.',
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
    '"You\'ll need at least 6 phones to keep your crew running at full speed. Can\'t trade on a dead screen."',
    '"I\'d recommend at least 500 GB of data — that\'s 100 per person. No signal = no swaps."',
    '"Get at least 2 VPNs per person. Bear markets bring out the scammers and exploiters."',
    '"Don\'t forget spare gear! A dead phone battery in MEV Forest is a death sentence."',
    '"Alpha passes are cheap right now. Stock up — you can scout for the next play on the trail."',
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
