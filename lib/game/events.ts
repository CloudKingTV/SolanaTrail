import { GameEvent } from './types'

// Events modeled after the classic Oregon Trail's random events
// Rethemed for everyday Solana degen culture
// Categories: disease, breakdown, weather, theft, trail, positive, choice

export const GAME_EVENTS: GameEvent[] = [
  // ==================== DISEASES ====================
  {
    id: 'dysentery',
    title: 'Bad Ramen!',
    description: 'A party member ate some sketchy gas station ramen. They\'re not doing well — the crypto equivalent of dysentery.',
    weight: 6,
    category: 'disease',
    choices: [{
      id: 'rest',
      text: 'Rest and hydrate',
      outcome: {
        description: 'They\'re laid up for a day. Should have stuck with the name-brand stuff.',
        partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
        daysLost: 1,
      },
    }],
  },
  {
    id: 'cholera',
    title: 'Scam Link Clicked!',
    description: 'A party member clicked a "free airdrop" link in their DMs. Their wallet is compromised!',
    weight: 4,
    category: 'disease',
    choices: [{
      id: 'treat',
      text: 'Revoke approvals immediately',
      outcome: {
        description: 'The damage is done. Most approvals revoked, but they\'re shaken up.',
        partyEffect: { type: 'damage', value: 25, status: 'sick', target: 'random' },
      },
    }],
  },
  {
    id: 'typhoid',
    title: 'Doomscrolling Sickness!',
    description: 'A party member has been doomscrolling CT for 48 hours straight. They\'re seeing red candles everywhere.',
    weight: 4,
    category: 'disease',
    choices: [{
      id: 'resync',
      text: 'Force them to touch grass',
      outcome: {
        description: 'They need time offline. The timeline will still be there tomorrow.',
        partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
        daysLost: 2,
      },
    }],
  },
  {
    id: 'measles',
    title: 'Phishing Rash!',
    description: 'A party member connected their wallet to too many sketchy sites. Now every dApp is popping up with drainer requests.',
    weight: 5,
    category: 'disease',
    choices: [{
      id: 'antivirus',
      text: 'Clear browser cache & revoke all',
      outcome: {
        description: 'Cleaning up the mess. They should recover in a few days.',
        partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
      },
    }],
  },
  {
    id: 'snakebite',
    title: 'Honeypot Token!',
    description: 'A party member bought a token they can\'t sell! It was a honeypot. Their portfolio is wrecked.',
    weight: 3,
    category: 'disease',
    choices: [{
      id: 'patch',
      text: 'Accept the L and move on',
      outcome: {
        description: 'The SOL is gone. An expensive lesson in DYOR.',
        partyEffect: { type: 'damage', value: 40, target: 'random' },
      },
    }],
  },
  {
    id: 'exhaustion',
    title: 'Burnout!',
    description: 'A party member has been chart-watching and aping non-stop. They\'re completely burnt out.',
    weight: 7,
    category: 'disease',
    choices: [{
      id: 'rest',
      text: 'Let them rest',
      outcome: {
        description: 'The market never sleeps, but your party member needs to.',
        partyEffect: { type: 'status', value: 0, status: 'exhausted', target: 'random' },
      },
    }],
  },
  {
    id: 'broken_leg',
    title: 'Spilled Coffee on Laptop!',
    description: 'A party member spilled their energy drink right onto their keyboard. They\'re out of commission.',
    weight: 4,
    category: 'disease',
    choices: [{
      id: 'fix',
      text: 'Dry it out with rice',
      outcome: {
        description: 'The classic rice trick. It\'ll take time but they\'ll be back.',
        partyEffect: { type: 'status', value: 0, status: 'injured', target: 'random' },
      },
    }],
  },

  // ==================== BREAKDOWNS ====================
  {
    id: 'broken_wheel',
    title: 'Laptop Charger Died!',
    description: 'Your laptop charger just stopped working. Battery is draining fast!',
    weight: 5,
    category: 'breakdown',
    choices: [
      {
        id: 'use_spare',
        text: 'Use a backup charger',
        outcome: {
          description: 'Good thing you brought spares. Back in business.',
          inventoryChanges: { spareWheels: -1 },
        },
      },
      {
        id: 'try_fix',
        text: 'Try to fix the cable (takes a day)',
        outcome: {
          description: 'You spent a day with electrical tape. 50/50 it holds.',
          daysLost: 1,
        },
      },
    ],
  },
  {
    id: 'broken_axle',
    title: 'Wallet Compromised!',
    description: 'Your hot wallet is showing suspicious transactions. Someone has access!',
    weight: 4,
    category: 'breakdown',
    choices: [
      {
        id: 'use_spare',
        text: 'Move funds to hardware wallet',
        outcome: {
          description: 'Your hardware wallet saved the day. Funds are safe.',
          inventoryChanges: { spareAxles: -1 },
        },
      },
      {
        id: 'try_fix',
        text: 'Try to secure the wallet (takes 2 days)',
        outcome: {
          description: 'You spent 2 days rotating keys and revoking. Some ramen was lost in the chaos.',
          inventoryChanges: { food: -50 },
          daysLost: 2,
        },
      },
    ],
  },
  {
    id: 'broken_tongue',
    title: 'Phone Bricked!',
    description: 'Your phone just died and won\'t turn back on. No Phantom, no Jupiter, nothing!',
    weight: 4,
    category: 'breakdown',
    choices: [
      {
        id: 'use_spare',
        text: 'Switch to a burner phone',
        outcome: {
          description: 'The burner phone is in. Crisis averted.',
          inventoryChanges: { spareTongues: -1 },
        },
      },
      {
        id: 'try_fix',
        text: 'Try to revive it (takes a day)',
        outcome: {
          description: 'You held down every button combo known to man. It\'s alive... barely.',
          daysLost: 1,
        },
      },
    ],
  },

  // ==================== WEATHER ====================
  {
    id: 'network_storm',
    title: 'Solana Network Congestion!',
    description: 'Transactions are failing left and right! The whole network is jammed.',
    weight: 6,
    category: 'weather',
    choices: [{
      id: 'wait',
      text: 'Wait for the congestion to pass',
      outcome: {
        description: 'The network was clogged all day. No trades went through.',
        daysLost: 1,
      },
    }],
  },
  {
    id: 'heavy_congestion',
    title: 'Hot Mint Going Live!',
    description: 'Everyone is minting the same NFT collection and gas fees are through the roof!',
    weight: 7,
    category: 'weather',
    choices: [
      {
        id: 'wait',
        text: 'Wait it out',
        outcome: {
          description: 'You lost a day waiting for fees to normalize.',
          daysLost: 1,
        },
      },
      {
        id: 'priority',
        text: 'Pay priority fees',
        outcome: {
          description: 'Your transactions went through, but those Jito tips added up.',
          inventoryChanges: { sol: -8 },
        },
      },
    ],
  },
  {
    id: 'bear_winter',
    title: 'Crypto Winter!',
    description: 'A sudden bear market has frozen the ecosystem. Charts are red, timeline is sad, and vibes are dead.',
    weight: 4,
    category: 'weather',
    choices: [{
      id: 'push_through',
      text: 'Diamond hands through the cold',
      outcome: {
        description: 'The crypto winter tests your resolve. Morale drops, hoodies are wearing thin.',
        healthChange: -10,
        inventoryChanges: { clothing: -1 },
      },
    }],
  },

  // ==================== THEFT ====================
  {
    id: 'thief',
    title: 'Wallet Drained!',
    description: 'You approved a malicious transaction and SOL was siphoned out while you slept!',
    weight: 5,
    category: 'theft',
    choices: [{
      id: 'accept',
      text: 'Check the damage',
      outcome: {
        description: 'They got away with some of your SOL. Revoke those approvals!',
        inventoryChanges: { sol: -25 },
      },
    }],
  },
  {
    id: 'ox_stolen',
    title: 'Laptop Stolen!',
    description: 'Someone swiped your laptop from the coffee shop while you were grabbing a refill!',
    weight: 4,
    category: 'theft',
    choices: [{
      id: 'accept',
      text: 'Remote wipe it',
      outcome: {
        description: 'You lost a laptop but wiped it remotely. At least they can\'t access your wallets.',
        inventoryChanges: { oxen: -1 },
      },
    }],
  },
  {
    id: 'fire',
    title: 'Discord Server Hacked!',
    description: 'Your Discord got compromised! Scam links were posted and some party members clicked them.',
    weight: 3,
    category: 'theft',
    choices: [{
      id: 'extinguish',
      text: 'Do damage control!',
      outcome: {
        description: 'You saved what you could, but some supplies were lost to the scam.',
        inventoryChanges: { food: -100, clothing: -2, ammunition: -5 },
      },
    }],
  },

  // ==================== TRAIL HAZARDS ====================
  {
    id: 'bad_water',
    title: 'Fake Token Contract!',
    description: 'The token you\'re about to buy has a suspicious contract. Could be a rug.',
    weight: 6,
    category: 'trail',
    choices: [
      {
        id: 'use_anyway',
        text: 'Ape in anyway (risky)',
        outcome: {
          description: 'The contract was sketchy. Several party members got rekt.',
          healthChange: -15,
        },
      },
      {
        id: 'skip',
        text: 'DYOR and find another play (costs a day)',
        outcome: {
          description: 'You did your research and dodged a bullet, but lost time.',
          daysLost: 1,
        },
      },
    ],
  },
  {
    id: 'rough_trail',
    title: 'Slow WiFi!',
    description: 'The WiFi at this stop is absolute garbage. Everything is loading at a crawl.',
    weight: 7,
    category: 'trail',
    choices: [{
      id: 'push',
      text: 'Tether from your phone',
      outcome: {
        description: 'Mobile data saved you, but it ate through your data plan. Extra ramen consumed from stress.',
        inventoryChanges: { food: -20 },
      },
    }],
  },
  {
    id: 'lost_trail',
    title: 'Lost the Alpha!',
    description: 'Your alpha group went private and you got kicked. Now you\'re flying blind.',
    weight: 4,
    category: 'trail',
    choices: [{
      id: 'search',
      text: 'Search for new alpha',
      outcome: {
        description: 'You spent time finding a new group. The ramen supply took a hit.',
        daysLost: 2,
        inventoryChanges: { food: -30 },
      },
    }],
  },
  {
    id: 'no_grass',
    title: 'No WiFi Zone!',
    description: 'You\'ve hit a dead zone. No internet, no trades, no chart-watching.',
    weight: 5,
    category: 'trail',
    choices: [{
      id: 'keep_going',
      text: 'Use cached pages and hope',
      outcome: {
        description: 'Your laptops are useless without WiFi. Ramen is consumed in frustration.',
        inventoryChanges: { food: -40 },
      },
    }],
  },
  {
    id: 'ox_wander',
    title: 'Lost Your Phone!',
    description: 'One of your devices slipped out of your pocket somewhere. Can\'t find it!',
    weight: 5,
    category: 'trail',
    choices: [{
      id: 'search',
      text: 'Retrace your steps',
      outcome: {
        description: 'You spent a day hunting for it. Found it wedged in a couch cushion.',
        daysLost: 1,
      },
    }],
  },

  // ==================== POSITIVE EVENTS ====================
  {
    id: 'airdrop',
    title: 'Airdrop Incoming!',
    description: 'A protocol you interacted with months ago just launched their token. Free money!',
    weight: 6,
    category: 'positive',
    choices: [{
      id: 'claim',
      text: 'Claim the airdrop!',
      outcome: {
        description: 'You claimed the airdrop! Your SOL bag grows heavier.',
        inventoryChanges: { sol: 20 },
      },
    }],
  },
  {
    id: 'find_abandoned',
    title: 'Abandoned Degen Setup!',
    description: 'You found someone\'s abandoned trading setup on the side of the trail. Laptops, ramen, the works.',
    weight: 5,
    category: 'positive',
    choices: [
      {
        id: 'search',
        text: 'Grab what you can',
        outcome: {
          description: 'You salvaged some ramen and a hoodie! Score.',
          inventoryChanges: { food: 50, clothing: 1 },
        },
      },
    ],
  },
  {
    id: 'wild_fruit',
    title: 'Free Ramen Drop!',
    description: 'A ramen brand is doing a promo on the trail. Free samples for everyone!',
    weight: 6,
    category: 'positive',
    choices: [{
      id: 'claim',
      text: 'Load up on free ramen',
      outcome: {
        description: 'Free ramen! The degen community provides.',
        inventoryChanges: { food: 30 },
      },
    }],
  },
  {
    id: 'staking_rewards',
    title: 'Staking Rewards!',
    description: 'Your staked SOL earned some juicy epoch rewards. Passive income hits different.',
    weight: 7,
    category: 'positive',
    choices: [{
      id: 'collect',
      text: 'Collect rewards',
      outcome: {
        description: 'Sweet passive income. Your staked SOL earned its keep.',
        inventoryChanges: { sol: 8 },
      },
    }],
  },
  {
    id: 'hackathon',
    title: 'Degen Meetup!',
    description: 'Fellow degens are gathered around sharing alpha and grilling. The vibes are immaculate.',
    weight: 5,
    category: 'positive',
    choices: [
      {
        id: 'join',
        text: 'Join and share alpha',
        outcome: {
          description: 'You shared some plays and got tipped! Community is everything.',
          inventoryChanges: { sol: 10 },
          partyEffect: { type: 'heal', value: 10, target: 'all' },
        },
      },
      {
        id: 'rest',
        text: 'Just vibe and eat',
        outcome: {
          description: 'Sometimes the best trade is no trade. Everyone feels refreshed.',
          partyEffect: { type: 'heal', value: 15, target: 'all' },
        },
      },
    ],
  },

  // ==================== CHOICE EVENTS ====================
  {
    id: 'yield_farm',
    title: 'Yield Farm Opportunity',
    description: 'A new DeFi protocol is offering 1000% APY. The contract is unaudited but the yields are juicy.',
    weight: 4,
    category: 'choice',
    choices: [
      {
        id: 'ape',
        text: 'Ape in (high risk)',
        outcome: {
          description: 'The yields were real! For now...',
          inventoryChanges: { sol: 15 },
        },
      },
      {
        id: 'skip',
        text: 'Too good to be true',
        outcome: {
          description: 'Wise choice. The protocol got exploited the next day.',
        },
      },
    ],
  },
  {
    id: 'whale_trade',
    title: 'Whale Wants Your Laptops!',
    description: 'A crypto whale wants to buy your trading rigs at a premium. Tempting offer.',
    weight: 4,
    category: 'choice',
    choices: [
      {
        id: 'sell',
        text: 'Sell 2 laptops for 40 SOL',
        outcome: {
          description: 'Deal done. You\'re richer but slower.',
          inventoryChanges: { sol: 40, oxen: -2 },
        },
      },
      {
        id: 'decline',
        text: 'Keep your rigs',
        outcome: {
          description: 'You need every laptop you\'ve got for this journey.',
        },
      },
    ],
  },
  {
    id: 'trader',
    title: 'Traveling Trader!',
    description: 'A fellow degen wants to trade. They\'ve got supplies you might need.',
    weight: 6,
    category: 'choice',
    choices: [
      {
        id: 'trade_food',
        text: 'Trade 1 hoodie for 80 ramen packs',
        outcome: {
          description: 'A fair trade. Ramen for warmth.',
          inventoryChanges: { clothing: -1, food: 80 },
        },
      },
      {
        id: 'trade_ammo',
        text: 'Trade 3 alpha passes for 1 backup charger',
        outcome: {
          description: 'Spare chargers are hard to find out here. Good trade.',
          inventoryChanges: { ammunition: -3, spareWheels: 1 },
        },
      },
      {
        id: 'decline',
        text: 'No thanks',
        outcome: { description: 'The trader moves on.' },
      },
    ],
  },
  {
    id: 'rug_pull',
    title: 'Rug Pull!',
    description: 'That "guaranteed" memecoin just rugged. Liquidity drained. Dev did a mass dump.',
    weight: 5,
    category: 'choice',
    choices: [{
      id: 'accept',
      text: 'Accept the L',
      outcome: {
        description: 'Another rug. At least the memes were good while it lasted.',
        inventoryChanges: { sol: -15 },
        healthChange: -5,
      },
    }],
  },
  {
    id: 'gas_war',
    title: 'Mint War!',
    description: 'A hyped NFT just dropped and everyone\'s fighting for a spot!',
    weight: 5,
    category: 'choice',
    choices: [
      {
        id: 'compete',
        text: 'Join the mint war',
        outcome: {
          description: 'You got in! Cost you in priority fees, but you minted something rare.',
          inventoryChanges: { sol: -12 },
          partyEffect: { type: 'heal', value: 10, target: 'all' },
        },
      },
      {
        id: 'skip',
        text: 'Sit this one out',
        outcome: {
          description: 'FOMO hurts but your wallet is intact.',
        },
      },
    ],
  },
]

export function getRandomEvent(day: number): GameEvent {
  const eligible = GAME_EVENTS.filter((e) => true) // all events eligible

  const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0)
  let roll = Math.random() * totalWeight

  for (const event of eligible) {
    roll -= event.weight
    if (roll <= 0) return event
  }

  return eligible[eligible.length - 1]
}
