import { GameEvent } from './types'

// Events modeled after the classic Oregon Trail's random events
// Rethemed for everyday Solana/Seeker user culture
// Categories: disease, breakdown, weather, theft, trail, positive, choice

export const GAME_EVENTS: GameEvent[] = [
  // ==================== DISEASES ====================
  {
    id: 'dysentery',
    title: 'Bad Street Food!',
    description: 'A party member ate some sketchy food truck tacos at a crypto conference. They\'re not doing well.',
    veteranTitle: 'Convention Floor Sickness!',
    veteranDescription: 'Ser ate from the Breakpoint buffet and is down bad. The crypto equivalent of dysentery.',
    weight: 6,
    category: 'disease',
    choices: [{
      id: 'rest',
      text: 'Rest and hydrate',
      outcome: {
        description: 'They\'re laid up for a day. Should have stuck with the hotel restaurant.',
        partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
        daysLost: 1,
      },
    }],
  },
  {
    id: 'cholera',
    title: 'Scam Link Clicked!',
    description: 'A party member clicked a "free airdrop" link in their DMs. Their wallet is compromised!',
    newcomerLearn: 'Never click links in your DMs! Scammers impersonate real projects to drain your wallet.',
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
    veteranDescription: 'Ser has been on CT since the FTX news broke and hasn\'t slept. They\'re seeing red candles in their dreams.',
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
    description: 'A party member connected their wallet to too many sketchy sites. Drainer requests keep popping up.',
    newcomerLearn: 'Be careful what sites you connect your wallet to. Malicious dApps can request permission to drain your funds.',
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
    newcomerLearn: 'A honeypot is a token designed to let you buy but not sell. Always check if a token has sell restrictions before buying.',
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
    title: 'Phone Dropped in Pool!',
    description: 'A party member\'s phone just took a swim. No Phantom, no Jupiter, nothing — they\'re out of commission.',
    weight: 4,
    category: 'disease',
    choices: [{
      id: 'fix',
      text: 'Put it in rice',
      outcome: {
        description: 'The classic rice trick. It\'ll take time but they\'ll be back.',
        partyEffect: { type: 'status', value: 0, status: 'injured', target: 'random' },
      },
    }],
  },

  // ==================== BREAKDOWNS ====================
  {
    id: 'broken_wheel',
    title: 'Phone Battery Dead!',
    description: 'Your phone just died at 0%. No charger in sight and you\'re mid-swap!',
    weight: 5,
    category: 'breakdown',
    choices: [
      {
        id: 'use_spare',
        text: 'Use a portable charger',
        outcome: {
          description: 'Good thing you brought spares. Back in business.',
          inventoryChanges: { spareWheels: -1 },
        },
      },
      {
        id: 'try_fix',
        text: 'Find an outlet (takes a day)',
        outcome: {
          description: 'You spent a day hunting for a power outlet. Found one at a gas station.',
          daysLost: 1,
        },
      },
    ],
  },
  {
    id: 'broken_axle',
    title: 'Wallet Compromised!',
    description: 'Your hot wallet is showing suspicious transactions. Someone has access!',
    newcomerLearn: 'A hot wallet is a wallet connected to the internet. If compromised, move your funds to a hardware (cold) wallet immediately.',
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
          description: 'You spent 2 days rotating keys and revoking. Some data was lost in the chaos.',
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
    newcomerLearn: 'Solana can sometimes get congested when there\'s too much activity. Transactions fail and you have to wait or pay more.',
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
    veteranDescription: 'It\'s giving Mad Lads mint day. Priority fees are insane and Jito tips are through the roof.',
    newcomerLearn: 'When a popular NFT drops, everyone tries to mint at once. This drives up transaction fees (priority fees).',
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
    veteranDescription: 'It\'s giving post-FTX energy. Charts are red, CT is doom and gloom, and your VPNs are the only thing keeping scammers out.',
    newcomerLearn: 'A "crypto winter" is when the entire market drops and stays low for months. Scammers get more active during these periods.',
    weight: 4,
    category: 'weather',
    choices: [{
      id: 'push_through',
      text: 'Diamond hands through it',
      outcome: {
        description: 'The crypto winter tests your resolve. Morale drops. VPNs wearing thin from constant exploit attempts.',
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
    newcomerLearn: 'Always check what you\'re signing. Malicious contracts can drain your wallet if you approve the wrong transaction.',
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
    title: 'Phone Stolen!',
    description: 'Someone swiped your phone from the coffee shop while you were grabbing a refill!',
    weight: 4,
    category: 'theft',
    choices: [{
      id: 'accept',
      text: 'Remote wipe it',
      outcome: {
        description: 'You lost a phone but wiped it remotely. At least they can\'t access your wallets.',
        inventoryChanges: { oxen: -1 },
      },
    }],
  },
  {
    id: 'fire',
    title: 'Discord Server Hacked!',
    description: 'Your Discord got compromised! Scam links were posted and some party members clicked them.',
    newcomerLearn: 'Hackers often take over Discord servers to post fake "mint" or "airdrop" links. Never click links from announcements without verifying.',
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
    newcomerLearn: 'A "rug pull" is when a token creator removes all the liquidity, making the token worthless. Always research (DYOR) before buying.',
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
    title: 'Dead Zone!',
    description: 'You\'ve hit an area with terrible cell service. Data speeds are painfully slow.',
    weight: 7,
    category: 'trail',
    choices: [{
      id: 'push',
      text: 'Tether from another phone',
      outcome: {
        description: 'Hotspot saved you, but it burned through your data plan fast.',
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
        description: 'You spent time finding a new group. Used extra data searching.',
        daysLost: 2,
        inventoryChanges: { food: -30 },
      },
    }],
  },
  {
    id: 'no_grass',
    title: 'No Signal!',
    description: 'You\'ve hit a dead zone. No internet, no trades, no chart-watching.',
    weight: 5,
    category: 'trail',
    choices: [{
      id: 'keep_going',
      text: 'Use cached pages and hope',
      outcome: {
        description: 'Your phones are useless without signal. Data consumed trying to reconnect.',
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
    veteranDescription: 'Remember that random dApp you used once in January? They just dropped their token. Your allocation is massive.',
    newcomerLearn: 'Airdrops are free tokens given to early users of a protocol. It\'s one of the best parts of being early in crypto!',
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
    description: 'You found someone\'s abandoned trading setup on the side of the trail. Phones, chargers, the works.',
    veteranDescription: 'Looks like someone rage-quit after the last rug. Their loss is your gain — phones and VPN licenses scattered everywhere.',
    weight: 5,
    category: 'positive',
    choices: [
      {
        id: 'search',
        text: 'Grab what you can',
        outcome: {
          description: 'You salvaged some data packs and a VPN license! Score.',
          inventoryChanges: { food: 50, clothing: 1 },
        },
      },
    ],
  },
  {
    id: 'wild_fruit',
    title: 'Free WiFi Hotspot!',
    description: 'You found an open WiFi hotspot with blazing fast speeds. Time to download everything!',
    weight: 6,
    category: 'positive',
    choices: [{
      id: 'claim',
      text: 'Download everything',
      outcome: {
        description: 'Free data! Your crew loaded up on cached pages and offline content.',
        inventoryChanges: { food: 30 },
      },
    }],
  },
  {
    id: 'staking_rewards',
    title: 'Staking Rewards!',
    description: 'Your staked SOL earned some juicy epoch rewards. Passive income hits different.',
    newcomerLearn: 'Staking is locking up your SOL to help secure the network. In return, you earn rewards each "epoch" (about 2-3 days).',
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
    newcomerLearn: 'DeFi (Decentralized Finance) lets you earn yield on your crypto. But if the APY seems too good to be true, it usually is.',
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
    title: 'Whale Wants Your Phones!',
    description: 'A crypto whale wants to buy your Seeker phones at a premium. Tempting offer.',
    weight: 4,
    category: 'choice',
    choices: [
      {
        id: 'sell',
        text: 'Sell 2 phones for 40 SOL',
        outcome: {
          description: 'Deal done. You\'re richer but slower.',
          inventoryChanges: { sol: 40, oxen: -2 },
        },
      },
      {
        id: 'decline',
        text: 'Keep your phones',
        outcome: {
          description: 'You need every device you\'ve got for this journey.',
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
        text: 'Trade 1 VPN for 80 GB data',
        outcome: {
          description: 'A fair trade. Data for security.',
          inventoryChanges: { clothing: -1, food: 80 },
        },
      },
      {
        id: 'trade_ammo',
        text: 'Trade 3 alpha passes for 1 portable charger',
        outcome: {
          description: 'Portable chargers are hard to find out here. Good trade.',
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
    veteranDescription: 'Dev just mass-dumped. LP removed. Telegram admin banned everyone. Classic pump.fun special.',
    newcomerLearn: 'A rug pull happens when a token creator suddenly removes all liquidity or sells all their tokens, crashing the price to zero.',
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
    newcomerLearn: 'When a popular NFT drops, thousands of people try to buy at once, creating a "mint war" with high fees.',
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

export function getRandomEvent(day: number, rng: () => number = Math.random): GameEvent {
  const eligible = GAME_EVENTS.filter((e) => true) // all events eligible

  const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0)
  let roll = rng() * totalWeight

  for (const event of eligible) {
    roll -= event.weight
    if (roll <= 0) return event
  }

  return eligible[eligible.length - 1]
}
