import { GameEvent } from './types'

export const GAME_EVENTS: GameEvent[] = [
  // POSITIVE EVENTS
  {
    id: 'airdrop',
    title: 'Airdrop Incoming!',
    description: 'A protocol you interacted with months ago just launched their token. Free money rains from the sky!',
    weight: 8,
    category: 'positive',
    choices: [
      {
        id: 'claim',
        text: 'Claim the airdrop',
        outcome: {
          description: 'You claimed the airdrop! Your SOL bag grows heavier.',
          resourceChanges: { sol: 15 },
          moraleMod: 10,
        },
      },
    ],
  },
  {
    id: 'hackathon',
    title: 'Hackathon Campfire',
    description: 'Fellow builders have gathered around a campfire to hack on projects. The vibes are immaculate.',
    weight: 6,
    category: 'positive',
    choices: [
      {
        id: 'join',
        text: 'Join the hackathon',
        outcome: {
          description: 'You built something cool and won a bounty! Morale is through the roof.',
          resourceChanges: { sol: 8, morale: 15 },
        },
      },
      {
        id: 'rest',
        text: 'Just enjoy the vibes',
        outcome: {
          description: 'Sometimes the best code is no code. You feel refreshed.',
          resourceChanges: { morale: 10 },
          partyEffect: { type: 'heal', value: 10, target: 'all' },
        },
      },
    ],
  },
  {
    id: 'bull-run',
    title: 'Bull Run!',
    description: 'The market is pumping! Everything is going up. Number go up technology is real!',
    weight: 5,
    category: 'positive',
    choices: [
      {
        id: 'ride',
        text: 'Ride the wave',
        outcome: {
          description: 'Your portfolio is thriving. Everyone is happy!',
          resourceChanges: { sol: 10, morale: 15 },
        },
      },
    ],
  },
  {
    id: 'validator-reward',
    title: 'Staking Rewards',
    description: 'Your validators have been performing well. Epoch rewards just hit!',
    weight: 7,
    category: 'positive',
    choices: [
      {
        id: 'collect',
        text: 'Collect rewards',
        outcome: {
          description: 'Sweet passive income. Your validators earned their keep.',
          resourceChanges: { sol: 5 },
        },
      },
    ],
  },

  // NEGATIVE EVENTS
  {
    id: 'rug-pull',
    title: 'Rug Pull!',
    description: 'That promising project everyone was aping into? The devs just drained the liquidity pool and vanished.',
    weight: 6,
    category: 'negative',
    choices: [
      {
        id: 'accept',
        text: 'Accept the loss',
        outcome: {
          description: 'Another one bites the dust. At least you learned a lesson.',
          resourceChanges: { sol: -12, morale: -15 },
        },
      },
    ],
  },
  {
    id: 'mev-attack',
    title: 'MEV Bot Attack!',
    description: 'A sandwich bot detected your transaction and front-ran you. Your swap was sandwiched!',
    weight: 7,
    category: 'negative',
    choices: [
      {
        id: 'accept',
        text: 'Nothing you can do...',
        outcome: {
          description: 'The bot made off with your slippage. Set tighter limits next time.',
          resourceChanges: { sol: -8 },
          moraleMod: -5,
        },
      },
    ],
  },
  {
    id: 'validator-outage',
    title: 'Validator Outage!',
    description: 'One of your validators went offline! The hardware overheated in the desert heat.',
    weight: 6,
    category: 'negative',
    choices: [
      {
        id: 'accept',
        text: 'Try to restart it',
        outcome: {
          description: 'The validator is toast. You\'ll need to find a replacement.',
          resourceChanges: { validators: -1, bandwidth: -10 },
        },
      },
    ],
  },
  {
    id: 'network-congestion',
    title: 'Network Congestion',
    description: 'Everyone is trying to mint the latest NFT collection. The network is crawling.',
    weight: 8,
    category: 'negative',
    choices: [
      {
        id: 'wait',
        text: 'Wait it out',
        outcome: {
          description: 'You lost a day waiting for transactions to confirm.',
          resourceChanges: { bandwidth: -15, morale: -5 },
        },
      },
      {
        id: 'priority',
        text: 'Pay priority fees',
        outcome: {
          description: 'Your transactions went through, but at a cost.',
          resourceChanges: { sol: -5 },
        },
      },
    ],
  },
  {
    id: 'bear-market',
    title: 'Bear Market Blues',
    description: 'The market is dumping. FUD is everywhere. Your timeline is nothing but red candles.',
    weight: 5,
    category: 'negative',
    choices: [
      {
        id: 'hodl',
        text: 'HODL and build',
        outcome: {
          description: 'Diamond hands activated. It\'s painful but you\'re not selling.',
          resourceChanges: { morale: -10 },
        },
      },
      {
        id: 'sell',
        text: 'Cut your losses',
        outcome: {
          description: 'You sold some assets to preserve capital. Smart or paper hands?',
          resourceChanges: { sol: -8, morale: -5 },
        },
      },
    ],
  },
  {
    id: 'smart-contract-bug',
    title: 'Smart Contract Bug!',
    description: 'A vulnerability was found in a protocol your party was using. Funds are at risk!',
    weight: 4,
    category: 'negative',
    choices: [
      {
        id: 'report',
        text: 'Report the bug',
        outcome: {
          description: 'You reported it responsibly. Some funds were lost but most were saved.',
          resourceChanges: { sol: -5 },
          partyEffect: { type: 'status', value: 0, status: 'sick', target: 'random' },
        },
      },
    ],
  },

  // CHOICE EVENTS
  {
    id: 'phishing-attack',
    title: 'Suspicious DM',
    description: 'You received a DM: "Congrats! You won a free NFT! Click here to claim." The link looks sketchy...',
    weight: 6,
    category: 'choice',
    choices: [
      {
        id: 'ignore',
        text: 'Ignore it (smart)',
        outcome: {
          description: 'Good call. That was definitely a phishing attempt. Stay safe out there.',
          resourceChanges: { morale: 5 },
        },
      },
      {
        id: 'click',
        text: 'Click the link (risky)',
        outcome: {
          description: 'Your wallet got drained! The "free NFT" was a drainer contract.',
          resourceChanges: { sol: -20, morale: -20 },
          partyEffect: { type: 'status', value: 0, status: 'rugged', target: 'random' },
        },
      },
    ],
  },
  {
    id: 'yield-farm',
    title: 'Yield Farm Opportunity',
    description: 'A new DeFi protocol is offering 1000% APY. The smart contract is unaudited but the yields are juicy.',
    weight: 5,
    category: 'choice',
    choices: [
      {
        id: 'farm',
        text: 'Ape in (high risk)',
        outcome: {
          description: 'The yields were real! For now... You made some quick SOL.',
          resourceChanges: { sol: 12 },
        },
      },
      {
        id: 'skip',
        text: 'Too good to be true',
        outcome: {
          description: 'Wise choice. The protocol got exploited the next day.',
          resourceChanges: { morale: 5 },
        },
      },
    ],
  },
  {
    id: 'whale-trade',
    title: 'Whale Encounter',
    description: 'A whale wants to make a large OTC trade. They\'re offering a premium for your validators.',
    weight: 4,
    category: 'choice',
    choices: [
      {
        id: 'trade',
        text: 'Sell 2 validators for 25 SOL',
        outcome: {
          description: 'Deal done. You\'re richer but your infrastructure is thinner.',
          resourceChanges: { sol: 25, validators: -2 },
        },
      },
      {
        id: 'decline',
        text: 'Keep your validators',
        outcome: {
          description: 'You held onto your infrastructure. Decentralization matters.',
          resourceChanges: { morale: 5 },
        },
      },
    ],
  },
  {
    id: 'cross-chain-bridge',
    title: 'Bridge Crossing',
    description: 'A rickety cross-chain bridge spans the canyon. It\'s the only way forward but bridges have been exploited before...',
    weight: 5,
    category: 'choice',
    choices: [
      {
        id: 'bridge',
        text: 'Cross the bridge (fast)',
        outcome: {
          description: 'You made it across! The bridge held... this time.',
          resourceChanges: { sol: -3 },
        },
      },
      {
        id: 'detour',
        text: 'Take the long way around',
        outcome: {
          description: 'The detour cost you time and supplies, but at least you\'re safe.',
          resourceChanges: { bandwidth: -20, morale: -5 },
        },
      },
    ],
  },
  {
    id: 'governance-vote',
    title: 'Governance Proposal',
    description: 'A critical governance vote is happening. Should the trail increase bandwidth allocation or reduce validator requirements?',
    weight: 4,
    category: 'choice',
    choices: [
      {
        id: 'bandwidth',
        text: 'Vote for more bandwidth',
        outcome: {
          description: 'The proposal passed! Bandwidth increased for everyone.',
          resourceChanges: { bandwidth: 20 },
        },
      },
      {
        id: 'validators',
        text: 'Vote for fewer validators needed',
        outcome: {
          description: 'The proposal passed! The validator requirement was reduced.',
          resourceChanges: { validators: 1 },
        },
      },
    ],
  },
  {
    id: 'community-call',
    title: 'Community Spaces',
    description: 'A popular CT personality is hosting a Spaces about the journey ahead. Thousands are tuning in.',
    weight: 7,
    category: 'positive',
    choices: [
      {
        id: 'listen',
        text: 'Tune in',
        outcome: {
          description: 'Great alpha! The community is bullish and your party feels inspired.',
          resourceChanges: { morale: 12 },
        },
      },
    ],
  },
  {
    id: 'gas-war',
    title: 'Gas War!',
    description: 'A hot NFT mint just started and everyone is competing for transactions. Fees are skyrocketing!',
    weight: 6,
    category: 'choice',
    choices: [
      {
        id: 'compete',
        text: 'Join the gas war',
        outcome: {
          description: 'You got in! Cost you extra SOL but you minted something rare.',
          resourceChanges: { sol: -10, morale: 10 },
        },
      },
      {
        id: 'skip',
        text: 'Sit this one out',
        outcome: {
          description: 'You watched from the sidelines. FOMO hurts but your wallet is intact.',
          resourceChanges: { morale: -5 },
        },
      },
    ],
  },
]

export function getRandomEvent(day: number): GameEvent {
  const eligible = GAME_EVENTS.filter(
    (e) => (!e.minDay || day >= e.minDay) && (!e.maxDay || day <= e.maxDay)
  )

  const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0)
  let roll = Math.random() * totalWeight

  for (const event of eligible) {
    roll -= event.weight
    if (roll <= 0) return event
  }

  return eligible[eligible.length - 1]
}
