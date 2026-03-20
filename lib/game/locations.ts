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
    description: 'Where every degen\'s journey begins. Matt\'s Supply Shop has everything you need for the trail to Mainnet.',
    distance: 0,
    type: 'start',
    hasStore: true,
    priceMultiplier: 1.0,
    talkTexts: [
      '"Don\'t forget to stock up on laptops before you leave. Can\'t trade without \'em."',
      '"I heard the DeFi Swamp is rough this time of year. Bring extra ramen."',
      '"My cousin tried the trail last month. Lost all his SOL in a rug pull at Token Creek."',
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
      '"The trail ahead is long. Make sure you have enough ramen."',
      '"A group ahead of us lost 3 laptops to a coffee spill. Keep your drinks away from your rigs."',
      '"I traded 2 hoodies for 50 ramen packs at the last stop. Fair deal."',
    ],
  },
  // 5. LANDMARK
  {
    id: 'chimney-hash',
    name: 'Memecoin Mountain',
    description: 'A towering monument built from the ashes of a thousand rugged tokens. A reminder of what was.',
    distance: 450,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"So many memecoins have died on this mountain. Pour one out for $BONK v1."',
      '"They say if you hold a coin that rugs here, the ghost of the dev still follows you."',
    ],
  },
  // 6. FORT
  {
    id: 'fort-hodl',
    name: 'Fort HODL',
    description: 'A fortress of diamond hands. The traders here never sell, no matter what. Prices are climbing.',
    distance: 600,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.5,
    talkTexts: [
      '"Careful in the DeFi Swamp ahead. The yields look good but the risks are real."',
      '"My party member clicked a phishing link last week. Took 3 days to recover."',
      '"A whale passed through yesterday. Bought every laptop in the store."',
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
      '"Sign your wallet address on the block for good luck!"',
      '"We\'re halfway there. If you made it this far, you\'re gonna make it."',
    ],
  },
  // 8. LANDMARK (South Pass equivalent)
  {
    id: 'fomo-pass',
    name: 'FOMO Pass',
    description: 'The great divide. From here, every choice feels urgent. Choose your path wisely — or ape recklessly.',
    distance: 900,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"The trail splits here. Both paths lead to Mainnet, but neither is easy."',
      '"Stock up on alpha passes. The scouting grounds ahead are full of opportunities."',
    ],
  },
  // 9. RIVER CROSSING
  {
    id: 'bridge-canyon',
    name: 'Bridge Canyon Crossing',
    description: 'A vast chasm between two chains. The cross-chain bridge sways in the wind. DYOR before crossing.',
    distance: 1000,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 10. FORT
  {
    id: 'fort-wormhole',
    name: 'Fort Wormhole',
    description: 'An outpost at the bridge. Supplies are expensive this far from Genesis Block.',
    distance: 1050,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.75,
    talkTexts: [
      '"The MEV Forest is ahead. Those sandwich bots will eat your lunch if you\'re not careful."',
      '"I lost half my ramen to a scam airdrop last week. Don\'t click anything suspicious."',
    ],
  },
  // 11. LANDMARK
  {
    id: 'dao-springs',
    name: 'DAO Springs',
    description: 'A natural gathering place where governance proposals bubble up from the ground.',
    distance: 1150,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"We voted to increase staking rewards here. Passed 67% to 33%."',
      '"The springs have healing properties. Rest here if your party is sick."',
    ],
  },
  // 12. FORT
  {
    id: 'fort-jupiter',
    name: 'Fort Jupiter',
    description: 'The largest trading hub on the trail. Every swap route runs through here. Prices are steep.',
    distance: 1300,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.0,
    talkTexts: [
      '"Jupiter has the best routes. But the prices... everything costs more out here."',
      '"The Snake River ahead is treacherous. Many degens have been lost."',
    ],
  },
  // 13. RIVER CROSSING
  {
    id: 'snake-river',
    name: 'Snake Token River',
    description: 'A winding river of unverified tokens. The current is unpredictable and full of honeypots.',
    distance: 1400,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 14. FORT
  {
    id: 'fort-audit',
    name: 'Fort Audit',
    description: 'A security checkpoint. Auditors inspect every contract passing through. Better have your code clean.',
    distance: 1550,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.0,
    talkTexts: [
      '"Everything gets audited here. If your bags are clean, you\'ll be fine."',
      '"Liquidation Mountains ahead are brutal. Make sure your rigs are charged."',
    ],
  },
  // 15. LANDMARK (Blue Mountains equivalent)
  {
    id: 'liquidation-mountains',
    name: 'Liquidation Mountains',
    description: 'Treacherous peaks where leveraged positions get wrecked. The air is thin and the margin calls are many.',
    distance: 1700,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"I got liquidated three times on the way up. Lost everything."',
      '"The descent is worse than the climb. Keep your leverage low."',
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
      '"I heard the final stretch has insane congestion. Plan accordingly."',
    ],
  },
  // 17. LANDMARK (The Dalles equivalent — final challenge)
  {
    id: 'the-mempool',
    name: 'The Mempool',
    description: 'A churning mass of pending transactions. You can try to push through or pay to skip the queue.',
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
    description: 'You made it! Confetti rains down as your journey reaches its end. You\'re officially on Mainnet. LFG!',
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
