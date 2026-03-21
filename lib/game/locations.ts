import { Location } from './types'

// 18 landmarks on the journey through Solana's ecosystem:
// Each stop is both a real Solana protocol AND a development milestone
// Start at Genesis Block → navigate DEXs, bridges, protocols → reach Mainnet Launch
// Total distance: 2000 blocks

export const TOTAL_DISTANCE = 2000

// Generic talk lines that can appear at ANY location
const GENERIC_TALK: string[] = [
  '"You hear about that new DeFi protocol? 500% APY. Definitely not a scam..."',
  '"My buddy sold his bags last week. Next day it pumped 10x. Classic."',
  '"If you see a token with a dog logo, just buy it. That\'s not financial advice."',
  '"I\'ve been living off staking rewards for three epochs now. It\'s not much, but it\'s honest work."',
  '"Always check the contract address twice. Trust nobody."',
  '"I lost everything in the last crash. Now I\'m back with 50 SOL and a dream."',
  '"Don\'t tell anyone, but I heard there\'s an airdrop coming for anyone who made it past the Halfway Hash."',
  '"Some guy was selling \'trail insurance\' back at the last fort. Total scam."',
  '"The best trade I ever made was buying VPNs before a bear market hit."',
  '"My phone died mid-swap once. Lost 200 SOL. Always carry a portable charger."',
  '"You can tell a lot about a person by their wallet history."',
  '"I used to day-trade on three screens. Now I just diamond hands on my phone."',
  '"Never ape into something right after someone on CT shills it. Always late."',
  '"The trail changes people. Some find themselves. Most just find rugs."',
  '"I met a guy who made it to Mainnet with only 1 phone and 50 GB of data. Legend."',
  '"Keep your seed phrase offline. I know a guy who stored his in a Discord DM. Yeah."',
  '"You look tired. Have you tried staking? Passive income does wonders for stress."',
  '"I started as a degen. Now I\'m a builder. The trail humbles you."',
  '"The whales out here will eat you alive if you\'re not careful with your SOL."',
  '"Every time I think I\'ve figured out the market, it reminds me I haven\'t."',
  '"There\'s a rumor that the Mempool is backed up worse than ever. Stock up before you get there."',
  '"I heard someone got through Honeypot Swamp without losing a single SOL. I don\'t believe it."',
  '"Pro tip: always keep at least 10 SOL in reserve. You never know when you\'ll need to pay a bridge fee."',
  '"They say the OG degens used to trade without VPNs. Absolute madmen."',
  '"My crew lost two members to exhaustion. Take breaks. Touch grass. For real."',
]

// Generic look-around lines that can appear at ANY location
const GENERIC_LOOK: string[] = [
  'You notice scratch marks on a server rack — someone was here before you, in a hurry.',
  'Graffiti on the wall reads: "WAGMI" in faded green paint.',
  'A discarded hardware wallet sits in the corner. The screen is cracked. No funds on it.',
  'You spot a bulletin board covered in QR codes and "HIRING" flyers for various protocols.',
  'An old monitor flickers in the corner, showing a price chart frozen mid-crash.',
  'Someone left a sticky note: "If you\'re reading this, don\'t buy $RUGME."',
  'You find a stash of energy drinks behind some equipment. The degens fuel of choice.',
  'A torn poster reads: "Solana Breakpoint 2024 — See you there!"',
  'You notice a leaderboard etched into the wall with party names and scores. Yours isn\'t up there yet.',
  'The air smells like burnt silicon and Red Bull. Classic degen environment.',
  'You find a notebook with someone\'s trading journal. The last entry just says "WHY."',
  'A row of Seeker phones sits charging on a shelf. None of them are yours, though.',
  'You spot a faded meme printout taped to a pillar. It\'s the "this is fine" dog in a bear market.',
  'There\'s a small shrine in the corner with candles around a Solana logo. Someone\'s praying for a pump.',
  'You see boot prints in the dust. Another party passed through recently.',
]

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
      '"Matt\'s prices are the best you\'ll find. Everything gets more expensive down the trail."',
      '"A party left yesterday with only 2 phones. They won\'t make it past the first bridge."',
      '"Get at least one hardware wallet. When your hot wallet gets drained — and it will — you\'ll thank me."',
      '"I\'ve seen three groups leave today. Only one had enough VPNs. The others... good luck."',
      '"The trick is to buy more data than you think you need. You always burn through it faster than expected."',
    ],
    lookAroundTexts: [
      'Matt\'s Supply Shop is bustling with travelers preparing for the journey ahead.',
      'A large map on the wall shows the trail from Genesis Block to Mainnet. Red X marks show where previous parties were lost.',
      'Shelves are stacked with phones, chargers, and VPN licenses. Matt runs a tight operation.',
      'You notice a "Wall of Fame" near the exit with names of parties that made it to Mainnet.',
      'A sign reads: "NO REFUNDS. NO RETURNS. DYOR." Classic Matt.',
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
      '"Phantom just pushed a new update. Swap speeds are crazy fast now."',
      '"I set up my wallet here on my first trail. Changed my life."',
      '"Someone tried to drain my wallet through a fake Phantom site. Always double-check the URL."',
      '"The pump.fun plains ahead? Don\'t even look at the tokens. Just keep walking."',
      '"A whale came through yesterday and bought every charger in the shop. Prices spiked."',
      '"If your phone dies on the trail, you\'re done. Stock up on chargers here."',
    ],
    lookAroundTexts: [
      'The Phantom Outpost is a sleek, modern setup with charging stations and free WiFi.',
      'A holographic Phantom ghost logo floats above the entrance. Very on-brand.',
      'You see travelers setting up new wallets on the public terminals.',
      'A "Phantom Power Users" leaderboard shows the top swappers who passed through.',
      'There\'s a workshop in the corner where someone is teaching wallet security basics.',
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
      '"Don\'t buy anything here unless you can afford to lose it all in 5 minutes."',
      '"I made 50 SOL in an hour flipping memecoins. Then I lost 80 SOL the next hour."',
      '"The devs here don\'t even pretend to have a roadmap. Just vibes."',
      '"If the Telegram group has more rocket emojis than words, it\'s a rug."',
      '"A new token launches every 10 seconds here. It\'s beautiful and terrifying."',
      '"My strategy? I just buy anything with a cute animal logo. It works 1% of the time."',
    ],
    lookAroundTexts: [
      'Token tickers flash across makeshift screens everywhere. Most are already red.',
      'A graveyard of dead token logos stretches out behind the main plaza. Thousands of failed projects.',
      'You see someone launching a new token in real-time. It takes them about 30 seconds.',
      'Confetti cannons go off in the distance — someone just hit a 100x. The crowd cheers.',
      'A sign reads: "Past this point, DYOR or die." Someone crossed out "or" and wrote "and."',
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
      '"Raydium\'s liquidity is deep. Best place to swap before Jupiter."',
      '"Don\'t try to trade large amounts here without checking slippage first."',
      '"I saw someone provide liquidity and get impermanent-loss\'d into oblivion. RIP."',
      '"The concentrated liquidity pools are where the real money is. If you know what you\'re doing."',
      '"Prices here are fair, but don\'t expect bargains. This is a DEX, not a charity."',
      '"I\'ve been stuck here for 3 days trying to find the best swap route. Jupiter would be faster but it\'s miles away."',
    ],
    lookAroundTexts: [
      'Trading terminals line the walls. Candlestick charts glow green and red on every screen.',
      'A massive pool of tokens sits in the center of the trading floor. The liquidity hums.',
      'You notice a "Top Traders" board. The #1 spot has been held by the same wallet for weeks.',
      'Raydium\'s logo is etched into the floor in glowing purple. Degens bow as they walk over it.',
      'A librarian-looking person is carefully analyzing LP positions in the corner. True DeFi scholar energy.',
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
      '"I\'ve seen too many parties give up at this point. Don\'t be one of them."',
      '"The second half is harder than the first. Way harder."',
      '"Take a moment to appreciate how far you\'ve come. Not many make it here."',
      '"A party made it to the Halfway Hash last epoch in just 30 days. Speed demons."',
      '"Don\'t get cocky. MEV Forest is next, and it\'ll eat your lunch."',
    ],
    lookAroundTexts: [
      'A massive stone monument marks the halfway point. Names of past travelers are carved into it.',
      'You count the signatures on the monument. Hundreds of parties have passed through, but the wall of names who made it to Mainnet is much shorter.',
      'Someone left a small Solana sticker on the monument. It\'s weathered but still glowing faintly.',
      'The view from here is incredible — you can see Genesis Block in the distance behind you, and the faint glow of Mainnet ahead.',
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
      '"I saw a sandwich bot extract 40 SOL from a single swap. Brutal."',
      '"Use private transactions if you can. Public mempool out here is a death trap."',
      '"The bots are getting smarter. They\'re using AI now to predict your trades."',
      '"Jito tips are the cost of survival here. Consider it a tax."',
      '"A dev told me they made more money running MEV bots than from their actual project. Dark."',
      '"Keep your transactions small through here. Big swaps attract the bots like sharks to blood."',
    ],
    lookAroundTexts: [
      'You can hear the hum of servers running MEV bots in the undergrowth. They never sleep.',
      'Abandoned trading terminals litter the forest floor — victims of sandwich attacks.',
      'Warning signs are posted everywhere: "CAUTION: HIGH MEV ACTIVITY ZONE."',
      'You spot a bot operator\'s camp through the trees. Dozens of monitors showing mempool activity.',
      'The trees here have binary code carved into their bark. Someone was very bored or very paranoid.',
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
      '"Jupiter checks every DEX and finds the best route. It\'s like having a cheat code for swaps."',
      '"The JUP airdrop changed lives, ser. Keep interacting — you never know."',
      '"I swapped 100 SOL here and saved 3% vs doing it on Raydium directly. Aggregation is king."',
      '"Limit orders on Jupiter are underrated. Set it and forget it."',
      '"Don\'t forget DCA — dollar cost averaging through Jupiter is the smoothest way to accumulate."',
      '"Someone told me Jupiter is just a frontend. I told them that frontend saves you hundreds in slippage."',
    ],
    lookAroundTexts: [
      'The Jupiter Exchange is massive. Swap routes visualized on giant screens show paths across dozens of DEXs.',
      'A leaderboard shows the top volume traders. The numbers are staggering.',
      'Free JUP stickers and merch are piled on a table near the entrance. Everyone grabs a handful.',
      'You notice a "Route Optimizer" terminal where travelers can simulate swaps before committing.',
      'The Jupiter logo — a massive planet — hangs from the ceiling, slowly rotating.',
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
      '"Governance is the future. Token holders decide everything here."',
      '"We\'re debating whether to fund a new trail marker. The vote\'s been going for 3 days."',
      '"Some DAOs move fast. This one moves at the speed of democracy."',
      '"I submitted a proposal last epoch. It passed! My first on-chain governance win."',
      '"Be careful with governance tokens. Great power, great responsibility, great rug potential."',
    ],
    lookAroundTexts: [
      'A natural spring bubbles up through rocks carved with governance proposal IDs.',
      'The springs are warm and the WiFi is fast. A perfect place to recover.',
      'Proposal boards are plastered everywhere — votes on everything from fee structures to trail maintenance.',
      'A group of delegates is passionately debating a treasury spending proposal under a canopy.',
      'You notice a meditation garden nearby. A sign reads: "Touch grass. Then vote."',
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
      '"mSOL is the play. Liquid staking means your SOL works for you while you travel."',
      '"I staked everything and just lived off rewards for two epochs. Slow but sustainable."',
      '"Some validators have better APY than others. Do your research before delegating."',
      '"Marinade takes the hassle out of picking validators. They spread your stake automatically."',
      '"Prices are steep here, but you won\'t find another shop until Devnet Outpost."',
      '"I wish I\'d bought more supplies at Jupiter. Everything costs double here."',
    ],
    lookAroundTexts: [
      'The Staking Hall is an elegant building with glowing SOL symbols etched into marble floors.',
      'A massive counter shows total SOL staked through Marinade. The number ticks up every second.',
      'Validators\' uptime scores are displayed on a wall of monitors. Green lights everywhere.',
      'You spot a "Staking Calculator" terminal. Travelers punch in numbers and nod approvingly.',
      'The smell of marinara sauce wafts from the kitchen. Someone took the "Marinade" branding too literally.',
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
      '"OtterSec found a critical in the last project that came through. Saved millions."',
      '"An unaudited protocol is like a car without brakes. Sure, it goes fast..."',
      '"I\'ve seen projects pass audit and still get exploited. An audit is necessary but not sufficient."',
      '"The auditors here work 24/7. There\'s always a line of projects waiting for review."',
      '"This is the last proper supply stop before Devnet. Stock up while you can."',
      '"I failed my first audit. Rewrote everything. Passed the second time. Worth it."',
    ],
    lookAroundTexts: [
      'Rows of auditors sit at terminals, methodically reviewing smart contract code line by line.',
      'A wall displays recent audit reports — green checkmarks and red warnings in equal measure.',
      'You see a "Hall of Shame" showing famous exploits and how they could have been prevented.',
      'Security scanners line the entrance. Everyone gets checked before entering.',
      'An otter mascot statue sits in the lobby holding a magnifying glass. Very on-brand.',
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
      '"I saw a 50x leveraged position get wiped in a single candle. The trader just stared at his screen."',
      '"This is where overleveraged dreams come to die."',
      '"If you must use leverage, keep it under 5x. Anything more is gambling."',
      '"The volatility here is insane. One minute you\'re up 200%, next minute you\'re liquidated."',
      '"I knew a guy who said \'liquidation is just a fancy word for buying high and selling low.\' He wasn\'t wrong."',
    ],
    lookAroundTexts: [
      'Price charts on display swing violently. Liquidation alerts flash in red across every screen.',
      'You see the wreckage of blown-up positions everywhere — margin call notifications frozen on dead screens.',
      'A scoreboard shows "Liquidations Today: 1,847." It\'s not even noon.',
      'The wind howls through abandoned leveraged positions. It sounds like crying.',
      'Someone painted "LEVERAGE IS A TOOL, NOT A STRATEGY" on a boulder. Someone else painted over "NOT."',
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
      '"Devnet faucet is rate-limited. Don\'t even bother asking for free test SOL."',
      '"I\'ve been testing my project here for three epochs. It\'s almost ready."',
      '"The Mempool ahead is backed up. Be patient or pay priority fees."',
      '"This is the last place to buy supplies. Prices are insane but you have no choice."',
      '"I met a party that ran out of data in the Mempool. They never made it to Mainnet."',
      '"Pro tip: test everything here before going live. Mainnet mistakes cost real money."',
    ],
    lookAroundTexts: [
      'The Devnet Outpost is a scrappy collection of testing terminals and debug consoles.',
      'A sign reads: "DEVNET SOL HAS NO VALUE" in big letters. Someone added: "neither does my portfolio."',
      'Developers huddle over laptops, running test transactions before the big launch.',
      'You see a deployment pipeline visualization. Green checkmarks lead toward Mainnet.',
      'The prices here are eye-watering. But you\'re too close to the end to turn back now.',
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
      '"I\'ve been stuck in this queue for 2 days. My transactions keep getting dropped."',
      '"Priority fees are robbery, but they work. Just pay up and get through."',
      '"Someone told me to just wait. I waited. My transaction expired. Don\'t wait."',
      '"The congestion here is worse than a hot NFT mint day. And that\'s saying something."',
      '"You\'re so close to Mainnet. Don\'t cheap out on fees now."',
      '"I can see the Mainnet glow from here. We\'re going to make it."',
    ],
    lookAroundTexts: [
      'Transactions queue up in glowing lines stretching to the horizon. The backlog is massive.',
      'A counter shows "Pending Transactions: 847,293." It ticks up faster than it goes down.',
      'You see frustrated travelers refreshing their phone screens, waiting for confirmations.',
      'The glow of Mainnet is visible in the distance. So close, yet so far.',
      'Priority fee bidding wars play out on screens overhead. The numbers climb fast.',
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

// Get a talk text that hasn't been shown recently (picks from location + generic pool)
export function getTalkText(location: Location, recentMessages: string[]): string {
  const locTexts = location.talkTexts || []
  const allTexts = [...locTexts, ...GENERIC_TALK]
  // Filter out recently shown texts
  const recentSet = new Set(recentMessages.slice(-10).map(m => m.replace(/^\[\d+\]\s*/, '')))
  const fresh = allTexts.filter(t => !recentSet.has(t))
  const pool = fresh.length > 0 ? fresh : allTexts
  return pool[Math.floor(Math.random() * pool.length)]
}

// Get a look-around text that hasn't been shown recently (picks from location + generic pool)
export function getLookAroundText(location: Location, recentMessages: string[]): string {
  const locTexts = location.lookAroundTexts || []
  const allTexts = [...locTexts, ...GENERIC_LOOK]
  const recentSet = new Set(recentMessages.slice(-10))
  const fresh = allTexts.filter(t => !recentSet.has(t))
  const pool = fresh.length > 0 ? fresh : allTexts
  return pool[Math.floor(Math.random() * pool.length)]
}
