import { Location } from './types'

// 18 landmarks on the journey through Solana's ecosystem:
// Start at Genesis Block → navigate DEXs, bridges, protocols → reach Mainnet Launch
// Total distance: 2000 blocks

export const TOTAL_DISTANCE = 2000

export const LOCATIONS: Location[] = [
  // 1. START
  {
    id: 'genesis-block',
    name: 'Genesis Block',
    description: 'Where every journey starts. Matt\'s Supply Shop has everything you need before heading into the Solana ecosystem.',
    distance: 0,
    type: 'start',
    hasStore: true,
    priceMultiplier: 1.0,
    talkTexts: [
      '"Stock up on laptops before you leave. Can\'t do anything out there without a rig."',
      '"I heard the pump.fun plains are wild right now. Bring extra ramen."',
      '"My cousin tried the trail last epoch. Got rugged before he even reached Raydium."',
    ],
  },
  // 2. BRIDGE — first liquidity obstacle
  {
    id: 'token-creek',
    name: 'Token Creek Bridge',
    description: 'Your first bridge crossing. Network congestion varies — time it right or pay for priority.',
    distance: 100,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 3. BRIDGE — deeper liquidity pool
  {
    id: 'liquidity-river',
    name: 'Liquidity Pool Crossing',
    description: 'A massive liquidity pool between you and the next protocol. Slippage is real if you rush it.',
    distance: 200,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 4. FORT — Phantom Wallet outpost
  {
    id: 'fort-phantom',
    name: 'Phantom Outpost',
    description: 'A Phantom wallet hub where travelers resupply. Prices are still fair this close to Genesis Block.',
    distance: 325,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.25,
    talkTexts: [
      '"The trail ahead is long. Make sure you have enough ramen."',
      '"A group ahead of us lost 3 laptops to a coffee spill. Protect your rigs."',
      '"I traded 2 hoodies for 50 ramen at the last stop. Not bad."',
    ],
  },
  // 5. LANDMARK — pump.fun
  {
    id: 'pump-fun-plains',
    name: 'pump.fun Plains',
    description: 'An endless field of freshly launched tokens. 99% will rug, but the 1% can change your life. Tread carefully.',
    distance: 450,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"I watched a token go from 0 to $10M market cap in 20 minutes out here. Then it rugged."',
      '"Someone launched a coin called $FART and made six figures. This place is wild."',
    ],
  },
  // 6. FORT — Raydium trading hub
  {
    id: 'fort-raydium',
    name: 'Raydium Trading Post',
    description: 'The main DEX hub on this stretch of trail. Deep liquidity, good routes, but prices are climbing.',
    distance: 600,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.5,
    talkTexts: [
      '"Careful past here. The MEV bots are thick in the next stretch."',
      '"My party member approved a sketchy contract last week. Took 3 days to recover."',
      '"A whale passed through yesterday. Bought everything in the shop."',
    ],
  },
  // 7. LANDMARK — halfway point
  {
    id: 'halfway-block',
    name: 'The Halfway Hash',
    description: 'A monument marking the halfway point to Mainnet. If you made it here, you\'ve got a shot.',
    distance: 750,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"Sign the block with your wallet for good luck."',
      '"We\'re halfway there. Keep your head down and your ramen stocked."',
    ],
  },
  // 8. LANDMARK — MEV Forest
  {
    id: 'mev-forest',
    name: 'MEV Forest',
    description: 'A dense forest of sandwich bots and front-runners. Every transaction here is a gamble. Stay alert.',
    distance: 900,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"I got sandwiched three times before I figured out to use Jito bundles."',
      '"The bots here will front-run you before you can blink. Set your slippage low."',
    ],
  },
  // 9. BRIDGE — Wormhole bridge
  {
    id: 'wormhole-bridge',
    name: 'Wormhole Bridge',
    description: 'The main cross-chain bridge. Congestion spikes when everyone is bridging at once. Pick your moment.',
    distance: 1000,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 10. FORT — Jupiter hub
  {
    id: 'fort-jupiter',
    name: 'Jupiter Exchange',
    description: 'The biggest swap aggregator on the trail. Best routes, best prices — but supplies cost more this far out.',
    distance: 1050,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 1.75,
    talkTexts: [
      '"Jupiter routes are the best out here. But everything costs more this far from Genesis."',
      '"I heard the next bridge is sketchy. Full of unverified tokens."',
    ],
  },
  // 11. LANDMARK — DAO governance zone
  {
    id: 'dao-springs',
    name: 'DAO Springs',
    description: 'A gathering place where governance proposals are debated. Rest here and vote on community decisions.',
    distance: 1150,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"We voted to increase staking rewards. Passed 67% to 33%."',
      '"Rest up here. The springs heal faster than anywhere else on the trail."',
    ],
  },
  // 12. FORT — Marinade staking outpost
  {
    id: 'fort-marinade',
    name: 'Marinade Staking Hall',
    description: 'A staking hub where travelers lock up SOL for yield. Supplies are expensive but the selection is solid.',
    distance: 1300,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.0,
    talkTexts: [
      '"Stake some SOL here if you can. The APY isn\'t what it used to be, but it helps."',
      '"The Honeypot Swamp ahead is nasty. Don\'t buy any token that looks too good to be true."',
    ],
  },
  // 13. BRIDGE — dangerous token swap
  {
    id: 'honeypot-swamp',
    name: 'Honeypot Swamp',
    description: 'A treacherous swap zone full of unverified tokens and hidden honeypots. Bridge through carefully.',
    distance: 1400,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
  },
  // 14. FORT — audit checkpoint
  {
    id: 'fort-audit',
    name: 'OtterSec Checkpoint',
    description: 'A security audit station. Contracts get inspected here. Resupply before the final stretch.',
    distance: 1550,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.0,
    talkTexts: [
      '"Everything gets audited here. If your bags are clean, you\'re good."',
      '"Liquidation Range ahead is brutal. Make sure your gear is in order."',
    ],
  },
  // 15. LANDMARK — leveraged danger zone
  {
    id: 'liquidation-range',
    name: 'Liquidation Range',
    description: 'A brutal stretch where overleveraged positions get wiped. Market swings hit hardest here.',
    distance: 1700,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"I got liquidated three times up here. Don\'t use leverage on the trail."',
      '"The bear markets hit harder at this altitude. Keep your hoodies on."',
    ],
  },
  // 16. FORT — last resupply
  {
    id: 'fort-testnet',
    name: 'Devnet Outpost',
    description: 'The last outpost before Mainnet. Final chance to stock up. Prices are at their highest.',
    distance: 1800,
    type: 'fort',
    hasStore: true,
    priceMultiplier: 2.5,
    talkTexts: [
      '"This is it. Mainnet is just ahead. Buy everything you can afford."',
      '"The final stretch has crazy congestion. Don\'t rush it."',
    ],
  },
  // 17. LANDMARK — final gauntlet
  {
    id: 'the-mempool',
    name: 'The Mempool',
    description: 'A massive queue of pending transactions. The final bottleneck before Mainnet. Push through or pay up.',
    distance: 1900,
    type: 'landmark',
    hasStore: false,
    priceMultiplier: 1.0,
    talkTexts: [
      '"The mempool is backed up. Could take days to get through."',
      '"Pay priority fees and you\'ll skip the queue. Worth it this close to the end."',
    ],
  },
  // 18. END
  {
    id: 'mainnet-launch',
    name: 'Mainnet Launch',
    description: 'You made it. Your party survived the entire Solana ecosystem. You\'re officially on Mainnet.',
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
