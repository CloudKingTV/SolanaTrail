import { Encounter } from './types'

// Random trail encounters — NPCs you meet between landmarks
// These fire during travel (separate from events) and offer dialogue + choices

export const TRAIL_ENCOUNTERS: Encounter[] = [
  // === FRIENDLY NPCs ===
  {
    id: 'wandering_whale',
    name: 'Wandering Whale',
    icon: '🐋',
    description: 'A massive whale trader sits by the trail, counting his bags.',
    dialogue: '"I\'ve been in since 2020, ser. Want me to stake some SOL for you? I\'ll double it... probably."',
    choices: [
      {
        id: 'stake',
        text: 'Let the whale stake 20 SOL for you',
        outcome: {
          description: 'The whale stakes your SOL. A few hours later, you check — 35 SOL! The whale tips his hat and walks on.',
          inventoryChanges: { sol: 15 },
        },
      },
      {
        id: 'decline',
        text: 'Politely decline',
        outcome: {
          description: '"Smart to be careful, ser." The whale wanders off into the sunset.',
        },
      },
    ],
  },
  {
    id: 'lost_degen',
    name: 'Lost Degen',
    icon: '😵',
    description: 'A confused degen is wandering the trail, phone in hand, muttering about gas fees.',
    dialogue: '"Bro... I\'ve been trying to bridge for 3 days. I\'ll give you data if you help me figure this out."',
    choices: [
      {
        id: 'help',
        text: 'Help them bridge (costs 1 day)',
        outcome: {
          description: 'You walk them through the bridge process. They gratefully share some data and a VPN license.',
          inventoryChanges: { food: 60, clothing: 1 },
          daysLost: 1,
        },
      },
      {
        id: 'ignore',
        text: 'Keep walking',
        outcome: {
          description: 'You wave goodbye. Not your problem, ser.',
        },
      },
    ],
  },
  {
    id: 'rival_party',
    name: 'Rival Degen Party',
    icon: '⚔️',
    description: 'Another group of degens is heading the same direction. They look competitive.',
    dialogue: '"Race you to the next fort? Losers give up 30 SOL. Winners take all."',
    choices: [
      {
        id: 'race',
        text: 'Accept the race! (grueling pace for 2 days)',
        outcome: {
          description: 'Your crew pushes hard and wins! The rival party reluctantly pays up.',
          inventoryChanges: { sol: 30 },
          healthChange: -8,
        },
      },
      {
        id: 'team_up',
        text: 'Propose teaming up instead',
        outcome: {
          description: 'They agree to travel together for a bit. Shared alpha and resources. Everyone benefits.',
          inventoryChanges: { food: 40 },
          partyEffect: { type: 'heal', value: 5, target: 'all' },
        },
      },
      {
        id: 'decline',
        text: 'Hard pass',
        outcome: {
          description: 'They shrug and move on. "NGMI," one mutters under their breath.',
        },
      },
    ],
  },
  // === SKETCHY NPCs ===
  {
    id: 'shady_dealer',
    name: 'Mysterious Trader',
    icon: '🎭',
    description: 'A hooded figure appears from behind a server rack, whispering about insider alpha.',
    dialogue: '"I\'ve got info on the next 100x. Just 25 SOL and it\'s yours. Trust me, ser."',
    choices: [
      {
        id: 'buy_alpha',
        text: 'Pay 25 SOL for the alpha',
        outcome: {
          description: 'The alpha was legit! You find a hidden stash of supplies the original owner abandoned.',
          inventoryChanges: { sol: -25, food: 200, ammunition: 3 },
        },
      },
      {
        id: 'haggle',
        text: 'Try to haggle — offer 10 SOL',
        outcome: {
          description: '"10? Fine, take the scraps." The intel is mid, but you get a lead on some data caches.',
          inventoryChanges: { sol: -10, food: 80 },
        },
      },
      {
        id: 'walk_away',
        text: 'Walk away — probably a scam',
        outcome: {
          description: 'You walk away. The figure mutters "paper hands" and vanishes.',
        },
      },
    ],
  },
  {
    id: 'nft_artist',
    name: 'Struggling NFT Artist',
    icon: '🎨',
    description: 'An artist sits by the trail, surrounded by unsold NFTs rendered on cracked tablets.',
    dialogue: '"Please ser, buy one of my 1/1s. They\'re AI-generated masterpieces. Only 5 SOL each."',
    choices: [
      {
        id: 'buy',
        text: 'Buy an NFT (5 SOL) — support the arts',
        outcome: {
          description: 'The NFT is... interesting. But the artist blesses your party with good vibes. Morale up!',
          inventoryChanges: { sol: -5 },
          partyEffect: { type: 'heal', value: 12, target: 'all' },
        },
      },
      {
        id: 'pass',
        text: '"I\'m more of a fungible token guy"',
        outcome: {
          description: 'The artist sighs. "Nobody appreciates art anymore."',
        },
      },
    ],
  },
  {
    id: 'solana_og',
    name: 'Solana OG',
    icon: '👴',
    description: 'A grizzled veteran sits by a campfire, staring at block explorers on three monitors.',
    dialogue: '"I was here before the first outage, kid. Let me tell you how to survive this trail..."',
    choices: [
      {
        id: 'listen',
        text: 'Listen to the wisdom',
        outcome: {
          description: 'The OG shares survival tips: shortcuts, safe routes, and which forts have the best deals. Your party gains confidence.',
          partyEffect: { type: 'heal', value: 15, target: 'all' },
        },
      },
      {
        id: 'share_food',
        text: 'Share some data and listen',
        outcome: {
          description: 'Grateful for the data, the OG gives you a spare hardware wallet and a charger from his stash.',
          inventoryChanges: { food: -30, spareAxles: 1, spareWheels: 1 },
          partyEffect: { type: 'heal', value: 10, target: 'all' },
        },
      },
    ],
  },
  {
    id: 'vc_recruiter',
    name: 'VC Recruiter',
    icon: '🤵',
    description: 'A person in a tailored suit appears out of nowhere, business card in hand.',
    dialogue: '"I represent a top-tier fund. We\'re looking for promising projects. Got 50 SOL to invest in yours."',
    choices: [
      {
        id: 'accept_funding',
        text: 'Accept the investment',
        outcome: {
          description: 'The VC wires 50 SOL but demands you travel faster. "Time to market is everything!"',
          inventoryChanges: { sol: 50 },
          healthChange: -5,
        },
      },
      {
        id: 'counter',
        text: '"We\'re bootstrapped, thanks"',
        outcome: {
          description: '"Respect." The VC gives you a VPN license as a parting gift.',
          inventoryChanges: { clothing: 2 },
        },
      },
    ],
  },
  {
    id: 'broken_bot',
    name: 'Abandoned Trading Bot',
    icon: '🤖',
    description: 'You find an abandoned server running a trading bot. It\'s still executing trades... badly.',
    dialogue: '[AUTOMATED]: EXECUTING STRATEGY... BUY HIGH SELL LOW... ERROR... FUNDS DEPLETED...',
    choices: [
      {
        id: 'salvage',
        text: 'Salvage the hardware',
        outcome: {
          description: 'You strip the server for parts. Got a phone and some data storage out of it.',
          inventoryChanges: { oxen: 1, food: 40 },
        },
      },
      {
        id: 'fix',
        text: 'Try to fix the bot\'s strategy',
        outcome: {
          description: 'You flip "buy high sell low" to "buy low sell high." The bot runs for a bit and earns some SOL before dying.',
          inventoryChanges: { sol: 20 },
        },
      },
    ],
  },
  {
    id: 'fud_spreader',
    name: 'CT FUD Spreader',
    icon: '📢',
    description: 'A loud person is standing on a box, shouting conspiracy theories about every Solana project.',
    dialogue: '"SOLANA IS GOING TO ZERO! THE VALIDATORS ARE ALL COMPROMISED! SELL EVERYTHING!"',
    choices: [
      {
        id: 'argue',
        text: 'Debate them with facts',
        outcome: {
          description: 'You present clear arguments. Nearby traders are impressed and share some supplies. The FUD spreader skulks away.',
          inventoryChanges: { food: 30, sol: 5 },
        },
      },
      {
        id: 'ignore',
        text: 'Walk past — don\'t feed the trolls',
        outcome: {
          description: 'You plug in your earbuds and keep moving. DYOR, not DYOT (Do Your Own Trolling).',
        },
      },
      {
        id: 'panic',
        text: 'Panic sell some supplies',
        outcome: {
          description: 'The FUD got to you. You dumped some VPNs at a loss. Classic emotional trading.',
          inventoryChanges: { clothing: -3, sol: 10 },
        },
      },
    ],
  },
  {
    id: 'airdrop_hunter',
    name: 'Airdrop Hunter',
    icon: '🎯',
    description: 'A scrappy airdrop farmer runs up to your group, phone in each hand.',
    dialogue: '"I\'ve got 47 wallets and I just qualified for 3 airdrops. Want in on one? I\'ll split it."',
    choices: [
      {
        id: 'split',
        text: 'Join the airdrop split (give 10 SOL)',
        outcome: {
          description: 'The airdrop claim goes through! Your cut is 25 SOL. Not bad for a quick detour.',
          inventoryChanges: { sol: 15 },
        },
      },
      {
        id: 'decline',
        text: '"I farm my own airdrops"',
        outcome: {
          description: '"Respect the grind, ser." They sprint off to the next protocol.',
        },
      },
    ],
  },
]

export function getRandomEncounter(day: number): Encounter | null {
  // 15% chance of encounter per travel day
  if (Math.random() > 0.15) return null

  const encounter = TRAIL_ENCOUNTERS[Math.floor(Math.random() * TRAIL_ENCOUNTERS.length)]
  return encounter
}
