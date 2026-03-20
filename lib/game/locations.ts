import { Location } from './types'

// 18 landmarks matching the classic Oregon Trail structure:
// Start → River crossings → Forts → Landmarks → Danger zones → End
// Total distance: 2000 blocks

export const TOTAL_DISTANCE = 2000

export const LOCATIONS: Location[] = [
  // 1. START
  {
    id: 'genesis-block',
    name: 'Genesis Block',
    description: 'Independence, but make it crypto. Your journey to Mainnet begins here. Matt\'s DeFi Supply has everything you need.',
    distance: 0,
    type: 'start',
    hasStore: true,
    priceMultiplier: 1.0,
    talkTexts: [
      '"Don\'t forget to stock up on validators before you leave. You\'ll need \'em."',
      '"I heard the DeFi Swamp is rough this epoch. Bring extra bandwidth."',
      '"My cousin tried the trail last epoch. Lost all his SOL in a rug pull at Token Creek."',
    ],
  },
  // 2. RIVER CROSSING
  {
    id: 'token-creek',
    name: 'Token Creek Crossing',
    description: 'A swift stream of liquidity. Cross carefully — many have lost their bags here.',
    distance: 100,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 3. RIVER CROSSING
  {
    id: 'liquidity-river',
    name: 'Liquidity Pool River',
    description: 'A deep pool of paired tokens. The current is strong and the impermanent loss is real.',
    distance: 200,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 4. FORT
  {
    id: 'fort-faucet',
    name: 'Fort Faucet',
    description: 'A small outpost where devnet SOL flows freely. Resupply here — prices are still reasonable.',
    distance: 325,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.25,
    talkTexts: [
      '"The trail ahead is long. Make sure you have enough bandwidth."',
      '"A group ahead of us lost 3 validators to overheating. Keep your hardware cool."',
      '"I traded 2 security patches for 50 units of bandwidth at the last stop. Good deal."',
    ],
  },
  // 5. LANDMARK
  {
    id: 'chimney-hash',
    name: 'Chimney Hash',
    description: 'A towering stack of hash computations rises from the plains. A famous landmark for all trailblazers.',
    distance: 450,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"Beautiful, isn\'t it? Each hash a testament to proof of work... er, history."',
      '"Some say if you mine at the base, you\'ll find rare inscriptions."',
    ],
  },
  // 6. FORT
  {
    id: 'fort-validator',
    name: 'Fort Validator',
    description: 'A heavily fortified data center. The hum of validators fills the air. Prices are climbing.',
    distance: 600,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.5,
    talkTexts: [
      '"Careful in the DeFi Swamp ahead. The yields look good but the risks are real."',
      '"My party caught a smart contract virus last week. Took 3 days to patch."',
      '"A whale passed through yesterday. Bought every validator in the store."',
    ],
  },
  // 7. LANDMARK
  {
    id: 'independence-block',
    name: 'Independence Block',
    description: 'A massive monolith inscribed with the Declaration of Decentralization. Halfway to Mainnet.',
    distance: 750,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"Register your wallet address on the block for good luck!"',
      '"We\'re halfway there. If you made it this far, you can make it all the way."',
    ],
  },
  // 8. LANDMARK (South Pass equivalent)
  {
    id: 'consensus-pass',
    name: 'Consensus Pass',
    description: 'The great divide. From here the terrain shifts. Choose your path wisely.',
    distance: 900,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"The network splits here. Both paths lead to Mainnet, but neither is easy."',
      '"Stock up on ammo. The bug bounty basin ahead is crawling with vulnerabilities."',
    ],
  },
  // 9. RIVER CROSSING
  {
    id: 'bridge-canyon',
    name: 'Bridge Canyon Crossing',
    description: 'A vast chasm between two chains. The cross-chain bridge sways in the wind.',
    distance: 1000,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 10. FORT
  {
    id: 'fort-bridger-protocol',
    name: 'Fort Bridge Protocol',
    description: 'An outpost at the bridge. Supplies are expensive this far from Genesis Block.',
    distance: 1050,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.75,
    talkTexts: [
      '"The MEV Forest is ahead. Those sandwich bots will eat you alive if you\'re not careful."',
      '"I lost half my food supply to a phishing attack last week. Don\'t click anything."',
    ],
  },
  // 11. LANDMARK
  {
    id: 'soda-springs-dao',
    name: 'DAO Springs',
    description: 'A natural gathering place where governance proposals bubble up from the ground.',
    distance: 1150,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"We voted to increase validator rewards here. Passed 67% to 33%."',
      '"The springs have healing properties. Rest here if your party is sick."',
    ],
  },
  // 12. FORT
  {
    id: 'fort-hall-staking',
    name: 'Fort Staking Hall',
    description: 'The largest staking facility on the trail. Prices are steep but the selection is good.',
    distance: 1300,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.0,
    talkTexts: [
      '"Stake your claim here. The APY isn\'t what it used to be, but it\'s honest work."',
      '"The Snake River ahead is treacherous. Many wagons have been lost."',
    ],
  },
  // 13. RIVER CROSSING
  {
    id: 'snake-river',
    name: 'Snake Protocol River',
    description: 'A winding river of bytecode. The current is unpredictable and the depths unknown.',
    distance: 1400,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 14. FORT
  {
    id: 'fort-audit',
    name: 'Fort Audit',
    description: 'A security checkpoint. Auditors inspect every line of code passing through.',
    distance: 1550,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.0,
    talkTexts: [
      '"Everything gets audited here. Better have your code clean."',
      '"The Blue Screen Mountains ahead are brutal. Make sure your hardware is solid."',
    ],
  },
  // 15. LANDMARK (Blue Mountains equivalent)
  {
    id: 'blue-screen-mountains',
    name: 'Blue Screen Mountains',
    description: 'Treacherous peaks where systems crash without warning. The air is thin and the errors are many.',
    distance: 1700,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"My server blue-screened three times on the way up. Terrible."',
      '"The descent is worse than the climb. Hold onto your spare parts."',
    ],
  },
  // 16. FORT
  {
    id: 'fort-testnet',
    name: 'Fort Testnet',
    description: 'The last outpost before Mainnet. Last chance to buy supplies. Everything\'s expensive.',
    distance: 1800,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.5,
    talkTexts: [
      '"This is it. Mainnet is just ahead. Stock up on everything you can."',
      '"I heard the final stretch has network congestion. Plan accordingly."',
    ],
  },
  // 17. LANDMARK (The Dalles equivalent — final challenge)
  {
    id: 'the-mempool',
    name: 'The Mempool',
    description: 'A churning mass of pending transactions. You can try to push through or take the toll road around.',
    distance: 1900,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"The mempool is backed up. Could take days to confirm."',
      '"Pay the priority fee and you\'ll be through in no time."',
    ],
  },
  // 18. END
  {
    id: 'mainnet-launch',
    name: 'Mainnet Launch',
    description: 'You made it! Confetti rains down as validators confirm the genesis of a new era. The protocol is live!',
    distance: 2000,
    type: 'end',
    hasStore: false,
    priceMultiplier: 1.0,
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

export function getLocationByDistance(distance: number): Location | null {
  return LOCATIONS.find((loc) => loc.distance === distance) || null
}
