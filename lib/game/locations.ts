import { Location } from './types'

export const TOTAL_DISTANCE = 2000 // Total "blocks" to Mainnet Launch

export const LOCATIONS: Location[] = [
  {
    id: 'genesis-block',
    name: 'Genesis Block',
    description: 'Where it all begins. The first block has been mined, and your journey to Mainnet starts here.',
    distance: 0,
    type: 'landmark',
  },
  {
    id: 'faucet-falls',
    name: 'Faucet Falls',
    description: 'A generous waterfall of devnet SOL. Travelers stop here to fill their wallets before the long road ahead.',
    distance: 150,
    type: 'rest_stop',
  },
  {
    id: 'token-mint-meadow',
    name: 'Token Mint Meadow',
    description: 'A bustling marketplace where tokens spring up like wildflowers. Some are valuable, most are not.',
    distance: 300,
    type: 'trading_post',
    trading: {
      validators: { price: 12, stock: 3 },
      bandwidth: { price: 2, stock: 50 },
      morale: { price: 5, stock: 10 },
    },
  },
  {
    id: 'validator-valley',
    name: 'Validator Valley',
    description: 'Rows of humming servers line the valley floor. The heart of consensus beats strong here.',
    distance: 450,
    type: 'landmark',
  },
  {
    id: 'defi-swamp',
    name: 'DeFi Swamp',
    description: 'Murky waters hide untold yields... and untold risks. Many have entered seeking riches, few return whole.',
    distance: 600,
    type: 'danger_zone',
  },
  {
    id: 'nft-marketplace-mesa',
    name: 'NFT Marketplace Mesa',
    description: 'A flat-topped mountain covered in digital art galleries. Trade your rare finds or pick up new gear.',
    distance: 800,
    type: 'trading_post',
    trading: {
      validators: { price: 15, stock: 2 },
      bandwidth: { price: 3, stock: 40 },
      morale: { price: 4, stock: 15 },
    },
  },
  {
    id: 'bridge-canyon',
    name: 'Bridge Canyon',
    description: 'A vast chasm separating two chains. The bridge looks sturdy... but bridges have failed before.',
    distance: 1000,
    type: 'danger_zone',
  },
  {
    id: 'mev-forest',
    name: 'MEV Forest',
    description: 'Dark woods where sandwich bots lurk behind every transaction. Keep your slippage tight and your wits tighter.',
    distance: 1200,
    type: 'danger_zone',
  },
  {
    id: 'governance-gorge',
    name: 'Governance Gorge',
    description: 'A narrow pass where every step requires a vote. Democracy in action — slow but sure.',
    distance: 1350,
    type: 'landmark',
  },
  {
    id: 'staking-summit',
    name: 'Staking Summit',
    description: 'The peak offers a breathtaking view and passive rewards. A perfect place to rest and earn.',
    distance: 1500,
    type: 'rest_stop',
  },
  {
    id: 'bug-bounty-basin',
    name: 'Bug Bounty Basin',
    description: 'Sharp-eyed auditors patrol these lowlands. Find a vulnerability and you might just get rewarded.',
    distance: 1650,
    type: 'landmark',
  },
  {
    id: 'audit-trail-pass',
    name: 'Audit Trail Pass',
    description: 'The final security checkpoint before Testnet. Only verified code shall pass.',
    distance: 1800,
    type: 'trading_post',
    trading: {
      validators: { price: 18, stock: 2 },
      bandwidth: { price: 4, stock: 30 },
      morale: { price: 3, stock: 20 },
    },
  },
  {
    id: 'testnet-township',
    name: 'Testnet Township',
    description: 'Almost there! The last outpost before Mainnet. Stock up — there\'s no turning back after this.',
    distance: 1900,
    type: 'trading_post',
    trading: {
      validators: { price: 20, stock: 3 },
      bandwidth: { price: 5, stock: 25 },
      morale: { price: 6, stock: 10 },
    },
  },
  {
    id: 'mainnet-launch',
    name: 'Mainnet Launch',
    description: 'You made it! The protocol is live. Confetti rains down as validators confirm the genesis of a new era.',
    distance: 2000,
    type: 'landmark',
  },
]

export function getCurrentLocation(distance: number): Location | null {
  for (let i = LOCATIONS.length - 1; i >= 0; i--) {
    if (distance >= LOCATIONS[i].distance) {
      return LOCATIONS[i]
    }
  }
  return LOCATIONS[0]
}

export function getNextLocation(distance: number): Location | null {
  for (const loc of LOCATIONS) {
    if (loc.distance > distance) {
      return loc
    }
  }
  return null
}
