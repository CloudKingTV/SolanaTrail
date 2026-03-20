import { GameEvent } from './types'

// Events modeled after the classic Oregon Trail's random events
// Categories: disease, breakdown, weather, theft, trail, positive, choice

export const GAME_EVENTS: GameEvent[] = [
  // ==================== DISEASES ====================
  {
    id: 'dysentery',
    title: 'Smart Contract Virus!',
    description: 'A party member has caught a smart contract virus — the crypto equivalent of dysentery. Their wallet is leaking.',
    weight: 6,
    category: 'disease',
    choices: [{
      id: 'rest',
      text: 'Rest and patch the code',
      outcome: {
        description: 'You spend time debugging. Hopefully the patch holds.',
        partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
        daysLost: 1,
      },
    }],
  },
  {
    id: 'cholera',
    title: 'Mempool Poisoning!',
    description: 'The network data is corrupted! A party member ingested bad transaction data.',
    weight: 4,
    category: 'disease',
    choices: [{
      id: 'treat',
      text: 'Quarantine and flush the cache',
      outcome: {
        description: 'The infection is serious. They need time to recover.',
        partyEffect: { type: 'damage', value: 25, status: 'sick', target: 'random' },
      },
    }],
  },
  {
    id: 'typhoid',
    title: 'Consensus Failure Syndrome!',
    description: 'A party member\'s node is out of sync. They\'re producing invalid blocks and feeling terrible.',
    weight: 4,
    category: 'disease',
    choices: [{
      id: 'resync',
      text: 'Re-sync from genesis',
      outcome: {
        description: 'Re-syncing takes time but it\'s the only cure.',
        partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
        daysLost: 2,
      },
    }],
  },
  {
    id: 'measles',
    title: 'Phishing Rash!',
    description: 'A party member clicked too many suspicious links. Now their system is covered in popup infections.',
    weight: 5,
    category: 'disease',
    choices: [{
      id: 'antivirus',
      text: 'Run antivirus scan',
      outcome: {
        description: 'The scan is running. They should recover in a few days.',
        partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
      },
    }],
  },
  {
    id: 'snakebite',
    title: 'Zero-Day Exploit!',
    description: 'A party member was hit by an unknown zero-day vulnerability! Critical damage!',
    weight: 3,
    category: 'disease',
    choices: [{
      id: 'patch',
      text: 'Emergency hotfix',
      outcome: {
        description: 'The emergency patch was applied, but the damage was severe.',
        partyEffect: { type: 'damage', value: 40, target: 'random' },
      },
    }],
  },
  {
    id: 'exhaustion',
    title: 'Burnout!',
    description: 'A party member has been coding non-stop and is completely burnt out.',
    weight: 7,
    category: 'disease',
    choices: [{
      id: 'rest',
      text: 'Let them rest',
      outcome: {
        description: 'Web3 never sleeps, but your party member needs to.',
        partyEffect: { type: 'status', value: 0, status: 'exhausted', target: 'random' },
      },
    }],
  },
  {
    id: 'broken_leg',
    title: 'Hardware Crash!',
    description: 'A party member\'s main rig has completely crashed. They\'re injured and unable to work.',
    weight: 4,
    category: 'disease',
    choices: [{
      id: 'fix',
      text: 'Attempt repairs',
      outcome: {
        description: 'They\'re patching things together, but it\'ll take time to fully recover.',
        partyEffect: { type: 'status', value: 0, status: 'injured', target: 'random' },
      },
    }],
  },

  // ==================== BREAKDOWNS ====================
  {
    id: 'broken_wheel',
    title: 'GPU Failure!',
    description: 'One of your validator GPUs has burned out from the heat!',
    weight: 5,
    category: 'breakdown',
    choices: [
      {
        id: 'use_spare',
        text: 'Use a spare GPU',
        outcome: {
          description: 'Good thing you brought spares. The GPU has been replaced.',
          inventoryChanges: { spareWheels: -1 },
        },
      },
      {
        id: 'try_fix',
        text: 'Try to fix it (takes a day)',
        outcome: {
          description: 'You spent a day trying to repair it. 50/50 chance it holds.',
          daysLost: 1,
        },
      },
    ],
  },
  {
    id: 'broken_axle',
    title: 'SSD Failure!',
    description: 'Your storage drive has corrupted! Data is at risk!',
    weight: 4,
    category: 'breakdown',
    choices: [
      {
        id: 'use_spare',
        text: 'Swap in a spare SSD',
        outcome: {
          description: 'The spare SSD saved the day. Data is safe.',
          inventoryChanges: { spareAxles: -1 },
        },
      },
      {
        id: 'try_fix',
        text: 'Attempt data recovery (takes 2 days)',
        outcome: {
          description: 'You spent 2 days recovering data. Some was lost.',
          inventoryChanges: { food: -50 },
          daysLost: 2,
        },
      },
    ],
  },
  {
    id: 'broken_tongue',
    title: 'Power Supply Failure!',
    description: 'Your power supply blew! Your whole setup is dark!',
    weight: 4,
    category: 'breakdown',
    choices: [
      {
        id: 'use_spare',
        text: 'Use a spare PSU',
        outcome: {
          description: 'The backup PSU is in. Crisis averted.',
          inventoryChanges: { spareTongues: -1 },
        },
      },
      {
        id: 'try_fix',
        text: 'Try to jury-rig it (takes a day)',
        outcome: {
          description: 'You cobbled together a fix. It\'s not pretty, but it works.',
          daysLost: 1,
        },
      },
    ],
  },

  // ==================== WEATHER ====================
  {
    id: 'network_storm',
    title: 'Network Storm!',
    description: 'A massive DDoS storm has rolled in! Transactions are failing left and right.',
    weight: 6,
    category: 'weather',
    choices: [{
      id: 'wait',
      text: 'Wait for the storm to pass',
      outcome: {
        description: 'The storm lasted a full day. You couldn\'t move.',
        daysLost: 1,
      },
    }],
  },
  {
    id: 'heavy_congestion',
    title: 'Heavy Network Congestion!',
    description: 'Everyone is minting NFTs and the network is grinding to a halt.',
    weight: 7,
    category: 'weather',
    choices: [
      {
        id: 'wait',
        text: 'Wait it out',
        outcome: {
          description: 'You lost a day waiting for the network to clear.',
          daysLost: 1,
        },
      },
      {
        id: 'priority',
        text: 'Pay priority fees',
        outcome: {
          description: 'Your transactions went through, but at a steep cost.',
          inventoryChanges: { sol: -8 },
        },
      },
    ],
  },
  {
    id: 'bear_winter',
    title: 'Crypto Winter!',
    description: 'A sudden bear market has frozen the ecosystem. Travel is slow and morale is low.',
    weight: 4,
    category: 'weather',
    choices: [{
      id: 'push_through',
      text: 'Push through the cold',
      outcome: {
        description: 'The crypto winter chills your party to the bone.',
        healthChange: -10,
        inventoryChanges: { clothing: -1 },
      },
    }],
  },

  // ==================== THEFT ====================
  {
    id: 'thief',
    title: 'Wallet Drained!',
    description: 'A hacker exploited a vulnerability in camp while you slept. SOL was stolen!',
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
    title: 'Validator Hijacked!',
    description: 'Someone has taken control of one of your validators while you weren\'t looking!',
    weight: 4,
    category: 'theft',
    choices: [{
      id: 'accept',
      text: 'Rotate the keys',
      outcome: {
        description: 'You lost a validator but secured the rest. Always rotate your keys.',
        inventoryChanges: { oxen: -1 },
      },
    }],
  },
  {
    id: 'fire',
    title: 'Server Room Fire!',
    description: 'A fire broke out in your server rack! Supplies are being destroyed!',
    weight: 3,
    category: 'theft',
    choices: [{
      id: 'extinguish',
      text: 'Put out the fire!',
      outcome: {
        description: 'You saved what you could, but some supplies were destroyed.',
        inventoryChanges: { food: -100, clothing: -2, ammunition: -5 },
      },
    }],
  },

  // ==================== TRAIL HAZARDS ====================
  {
    id: 'bad_water',
    title: 'Corrupted Data Stream!',
    description: 'The data you\'re processing is corrupted. Using it could be dangerous.',
    weight: 6,
    category: 'trail',
    choices: [
      {
        id: 'use_anyway',
        text: 'Process it anyway (risky)',
        outcome: {
          description: 'The corrupted data caused problems. Several party members feel ill.',
          healthChange: -15,
        },
      },
      {
        id: 'skip',
        text: 'Find clean data (costs a day)',
        outcome: {
          description: 'You found a clean data source, but lost time.',
          daysLost: 1,
        },
      },
    ],
  },
  {
    id: 'rough_trail',
    title: 'Rough Code Path!',
    description: 'The trail ahead is full of spaghetti code and technical debt. Progress is slow.',
    weight: 7,
    category: 'trail',
    choices: [{
      id: 'push',
      text: 'Push through carefully',
      outcome: {
        description: 'The rough path slowed you down and wore out your equipment.',
        inventoryChanges: { food: -20 },
      },
    }],
  },
  {
    id: 'lost_trail',
    title: 'Lost Connection!',
    description: 'Your GPS signal dropped and you\'ve gone off-route. The trail markers are nowhere to be found.',
    weight: 4,
    category: 'trail',
    choices: [{
      id: 'search',
      text: 'Search for the trail',
      outcome: {
        description: 'You wandered for a while before finding the path again.',
        daysLost: 2,
        inventoryChanges: { food: -30 },
      },
    }],
  },
  {
    id: 'no_grass',
    title: 'No Bandwidth Available!',
    description: 'The local network is completely saturated. Your validators can\'t sync.',
    weight: 5,
    category: 'trail',
    choices: [{
      id: 'keep_going',
      text: 'Use cached data',
      outcome: {
        description: 'Your validators are running on cached data. Performance suffers.',
        inventoryChanges: { food: -40 },
      },
    }],
  },
  {
    id: 'ox_wander',
    title: 'Validator Went Offline!',
    description: 'One of your validators wandered off the network and won\'t respond to pings.',
    weight: 5,
    category: 'trail',
    choices: [{
      id: 'search',
      text: 'Search for the validator',
      outcome: {
        description: 'You spent a day hunting for the rogue node. Found it eventually.',
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
    title: 'Abandoned Server Rack!',
    description: 'You found an abandoned server rack on the side of the trail. Someone didn\'t make it.',
    weight: 5,
    category: 'positive',
    choices: [
      {
        id: 'search',
        text: 'Search for usable parts',
        outcome: {
          description: 'You salvaged some useful supplies!',
          inventoryChanges: { food: 50, clothing: 1 },
        },
      },
    ],
  },
  {
    id: 'wild_fruit',
    title: 'Open Source Bounty!',
    description: 'You found an unclaimed open-source bounty posted on the trail. Free bandwidth!',
    weight: 6,
    category: 'positive',
    choices: [{
      id: 'claim',
      text: 'Claim the bounty',
      outcome: {
        description: 'Free bandwidth! The open-source community provides.',
        inventoryChanges: { food: 30 },
      },
    }],
  },
  {
    id: 'staking_rewards',
    title: 'Staking Rewards!',
    description: 'Your validators earned epoch rewards. Passive income hits different on the trail.',
    weight: 7,
    category: 'positive',
    choices: [{
      id: 'collect',
      text: 'Collect rewards',
      outcome: {
        description: 'Sweet passive income. Your validators earned their keep.',
        inventoryChanges: { sol: 8 },
      },
    }],
  },
  {
    id: 'hackathon',
    title: 'Hackathon Campfire!',
    description: 'Fellow builders gathered around a campfire to hack on projects. The vibes are immaculate.',
    weight: 5,
    category: 'positive',
    choices: [
      {
        id: 'join',
        text: 'Join the hackathon',
        outcome: {
          description: 'You built something cool and won a bounty!',
          inventoryChanges: { sol: 10 },
          partyEffect: { type: 'heal', value: 10, target: 'all' },
        },
      },
      {
        id: 'rest',
        text: 'Just enjoy the vibes',
        outcome: {
          description: 'Sometimes the best code is no code. Everyone feels refreshed.',
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
    title: 'Whale Encounter!',
    description: 'A crypto whale wants to buy your validators at a premium. Tempting offer.',
    weight: 4,
    category: 'choice',
    choices: [
      {
        id: 'sell',
        text: 'Sell 2 validators for 40 SOL',
        outcome: {
          description: 'Deal done. You\'re richer but weaker.',
          inventoryChanges: { sol: 40, oxen: -2 },
        },
      },
      {
        id: 'decline',
        text: 'Keep your validators',
        outcome: {
          description: 'Decentralization matters more than a quick buck.',
        },
      },
    ],
  },
  {
    id: 'trader',
    title: 'Traveling Trader!',
    description: 'A fellow traveler wants to trade. They have supplies you might need.',
    weight: 6,
    category: 'choice',
    choices: [
      {
        id: 'trade_food',
        text: 'Trade 1 security patch for 80 bandwidth',
        outcome: {
          description: 'A fair trade. Bandwidth for security.',
          inventoryChanges: { clothing: -1, food: 80 },
        },
      },
      {
        id: 'trade_ammo',
        text: 'Trade 3 bug bounty kits for 1 spare GPU',
        outcome: {
          description: 'Spare parts are hard to find out here. Good trade.',
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
    description: 'That "guaranteed" yield protocol just pulled the rug. Liquidity drained instantly.',
    weight: 5,
    category: 'choice',
    choices: [{
      id: 'accept',
      text: 'Accept the loss',
      outcome: {
        description: 'Another one bites the dust. At least you learned a lesson.',
        inventoryChanges: { sol: -15 },
        healthChange: -5,
      },
    }],
  },
  {
    id: 'gas_war',
    title: 'Gas War!',
    description: 'A hot mint just started and fees are skyrocketing!',
    weight: 5,
    category: 'choice',
    choices: [
      {
        id: 'compete',
        text: 'Join the gas war',
        outcome: {
          description: 'You got in! Cost you, but you minted something rare.',
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
