import { Location } from './types'

// 18 landmarks on the journey through Solana's ecosystem:
// Each stop is both a real Solana protocol AND a development milestone
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
    newcomerLearn: 'This is where your journey begins! A "genesis block" is the very first block in a blockchain — where it all starts.',
    builderContext: 'Your team gathers supplies before the long road to launching your project on Mainnet.',
    explorerContext: 'Your crew stocks up before heading into the wild Solana ecosystem.',
    talkTexts: [
      '"Stock up on phones before you leave. Can\'t do anything out there without a device."',
      '"I heard the pump.fun plains are wild right now. Bring extra data."',
      '"My cousin tried the trail last epoch. Got rugged before he even reached Raydium."',
    ],
  },
  // 2. BRIDGE — first crossing
  {
    id: 'token-creek',
    name: 'Token Creek Bridge',
    description: 'Your first bridge crossing. Network congestion varies — time it right or pay for priority.',
    distance: 100,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
    newcomerLearn: 'Bridges move tokens between networks. They can be risky — if the bridge is congested, you might lose fees or experience delays.',
    builderContext: 'Your first integration test — bridging tokens across networks for your project.',
    explorerContext: 'Your crew\'s first real obstacle. Time to see if your prep was worth it.',
  },
  // 3. BRIDGE — deeper liquidity
  {
    id: 'liquidity-river',
    name: 'Liquidity Pool Crossing',
    description: 'A massive liquidity pool between you and the next protocol. Slippage is real if you rush it.',
    distance: 200,
    type: 'river_crossing',
    hasStore: false,
    priceMultiplier: 1.0,
    newcomerLearn: 'A liquidity pool is a collection of tokens locked in a smart contract. Traders swap against this pool. "Slippage" means the price moves against you during a trade.',
    builderContext: 'You need to navigate liquidity pools to integrate DEX swaps into your project.',
    explorerContext: 'The liquidity is deep here. Cross carefully or the slippage will eat your bags.',
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
    newcomerLearn: 'Phantom is the most popular wallet app on Solana. Think of it like your bank account for crypto — it stores your tokens and lets you interact with apps.',
    veteranFlavor: 'The Phantom team just shipped another banger update. Swap speed is insane here.',
    builderContext: 'Time to integrate Phantom wallet support into your project. Essential for any Solana app.',
    explorerContext: 'Your crew discovers Phantom — the gateway wallet to the Solana ecosystem.',
    talkTexts: [
      '"The trail ahead is long. Make sure you have enough data."',
      '"A group ahead of us lost 3 phones to a pool party incident. Protect your devices."',
      '"I traded 2 VPNs for 50 GB data at the last stop. Not bad."',
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
    newcomerLearn: 'pump.fun is a platform where anyone can create and launch a new token in seconds. Most tokens here lose all their value quickly, but some become huge.',
    veteranFlavor: 'Every 10 seconds a new token launches here. You can smell the rugs from a mile away. But that one in a thousand...',
    builderContext: 'You study pump.fun\'s token launch mechanics. Maybe your project could integrate fair launches.',
    explorerContext: 'Your crew stumbles into the wildest part of Solana. Tokens launching faster than you can read the tickers.',
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
    newcomerLearn: 'Raydium is a DEX (Decentralized Exchange) on Solana. Unlike Coinbase or Binance, there\'s no company running it — trades happen directly between users via smart contracts.',
    veteranFlavor: 'Raydium pools are deep here. The concentrated liquidity is *chef\'s kiss*.',
    builderContext: 'You integrate Raydium\'s AMM (Automated Market Maker) into your project. Deep liquidity = better UX.',
    explorerContext: 'Your crew trades at one of Solana\'s oldest and most trusted DEXs.',
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
    newcomerLearn: 'A "hash" is a unique fingerprint for data on the blockchain. This monument marks the halfway point of your journey.',
    builderContext: 'Halfway to launch. Your project is taking shape. Keep building.',
    explorerContext: 'Your crew signs the monument. Halfway through the Solana ecosystem.',
    talkTexts: [
      '"Sign the block with your wallet for good luck."',
      '"We\'re halfway there. Keep your head down and your data stocked."',
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
    newcomerLearn: 'MEV (Maximum Extractable Value) means bots try to profit from your transactions. "Sandwich attacks" place trades before and after yours to steal value. Use private transaction tools to protect yourself.',
    veteranFlavor: 'Jito bundles are your best friend here. Without them you\'re getting sandwiched on every swap.',
    builderContext: 'Critical to understand MEV protection for your users. You study Jito and private transactions.',
    explorerContext: 'Your crew navigates carefully. The bots here will front-run you before you can blink.',
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
    newcomerLearn: 'Wormhole is a bridge that connects Solana to other blockchains like Ethereum. You can move tokens between chains, but bridges carry risk.',
    veteranFlavor: 'The Wormhole hack of \'22 left scars. Everyone triple-checks their bridge transactions now.',
    builderContext: 'Cross-chain integration time. Your project needs to work beyond just Solana.',
    explorerContext: 'The biggest bridge crossing yet. Your crew needs to move carefully between chains.',
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
    newcomerLearn: 'Jupiter is Solana\'s largest swap aggregator. Instead of trading on one DEX, Jupiter checks ALL the DEXs and finds you the best price. It\'s like a price comparison tool for crypto.',
    veteranFlavor: 'JUP airdrop eligibility was the real treasure. Check if your interactions here qualify.',
    builderContext: 'You integrate Jupiter\'s swap API. Your users will get the best swap routes across all Solana DEXs.',
    explorerContext: 'Your crew discovers Jupiter — the one place where you always get the best deal on any token.',
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
    newcomerLearn: 'A DAO (Decentralized Autonomous Organization) is like a company run by its community. Token holders vote on decisions instead of a CEO making them.',
    builderContext: 'You design governance for your project. Token holders will vote on key decisions.',
    explorerContext: 'Your crew rests at the springs and votes on a community proposal. Democracy in action.',
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
    newcomerLearn: 'Marinade is a popular staking protocol. "Staking" means locking your SOL to help run the network. In return, you earn rewards — like interest on a savings account.',
    veteranFlavor: 'mSOL yields aren\'t what they used to be, but liquid staking is still the play.',
    builderContext: 'You integrate staking into your project. Users can earn yield while using your app.',
    explorerContext: 'Your crew stakes some SOL for passive income. It\'s not much, but it\'s honest work.',
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
    newcomerLearn: 'Honeypot tokens are designed so you can buy them but can\'t sell. Scammers create them to steal your money. Always check if a token can be sold before buying.',
    veteranFlavor: 'Every token in this swamp has "safe" or "moon" in the name. That\'s your first red flag.',
    builderContext: 'You build token verification tools into your project to protect users from honeypots.',
    explorerContext: 'Your crew wades through the sketchiest corner of the ecosystem. Eyes peeled for scams.',
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
    newcomerLearn: 'OtterSec is a security firm that audits smart contracts. An "audit" checks code for bugs and vulnerabilities before it handles real money.',
    veteranFlavor: 'The OtterSec team found 3 critical vulnerabilities in the last project that passed through. Audits save lives.',
    builderContext: 'Your project gets audited. Critical bugs are found and fixed before launch. This is non-negotiable.',
    explorerContext: 'Your crew rests while the auditors check everything. Security first.',
    talkTexts: [
      '"Everything gets audited here. If your code is clean, you\'re good."',
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
    newcomerLearn: 'Liquidation happens when you borrow crypto to trade (leverage) and the price moves against you. The platform automatically sells your position — often at a big loss.',
    veteranFlavor: 'The long-short ratio is at 5:1. Someone\'s about to get liquidated hard.',
    builderContext: 'You stress-test your project against market volatility. Can your protocol handle a crash?',
    explorerContext: 'Your crew watches overleveraged positions get wiped in real-time. Stay humble.',
    talkTexts: [
      '"I got liquidated three times up here. Don\'t use leverage on the trail."',
      '"The bear markets hit harder at this altitude. Keep your VPNs active."',
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
    newcomerLearn: 'Devnet is Solana\'s testing network. Developers test their apps here with fake SOL before launching on Mainnet (the real network with real money).',
    veteranFlavor: 'Devnet faucet is rate-limited again. Classic.',
    builderContext: 'Final testing on devnet. Your project is almost ready for mainnet launch.',
    explorerContext: 'Last stop before the big leagues. Your crew stocks up on everything they can afford.',
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
    newcomerLearn: 'The mempool is where transactions wait to be processed. During high traffic, transactions pile up here. You can pay higher fees to skip ahead.',
    veteranFlavor: 'The queue is backed up worse than a Tensor mint day. Priority fees are your only hope.',
    builderContext: 'The final congestion gauntlet. Your project needs to handle this for your users.',
    explorerContext: 'Almost there. Your crew pushes through the final bottleneck before Mainnet.',
    talkTexts: [
      '"The mempool is backed up. Could take days to get through."',
      '"Pay priority fees and you\'ll skip the queue. Worth it this close to the end."',
    ],
  },
  // 18. END
  {
    id: 'mainnet-launch',
    name: 'Mainnet Launch',
    description: 'You made it. The Solana ecosystem is behind you, and Mainnet awaits.',
    distance: 2000,
    type: 'end',
    hasStore: false,
    priceMultiplier: 1.0,
    newcomerLearn: 'Mainnet is the real, live Solana network where actual value is transacted. Making it here means you\'ve learned to navigate the entire ecosystem!',
    builderContext: 'Your project is officially live on Mainnet! The Solana ecosystem welcomes your creation.',
    explorerContext: 'Your crew has navigated every corner of the Solana ecosystem. You\'re officially on Mainnet.',
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
