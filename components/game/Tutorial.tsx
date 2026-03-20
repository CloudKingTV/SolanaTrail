'use client'

import { useState } from 'react'
import { GameMode } from '@/lib/game/types'

interface TutorialProps {
  mode: GameMode
  onComplete: () => void
}

const NEWCOMER_STEPS = [
  {
    title: 'WELCOME TO SOLANA',
    icon: '◎',
    content: [
      '**Solana** is a fast blockchain where people trade tokens, collect NFTs, and build apps. Think of it as a digital economy.',
      'In this game, you and 4 teammates are journeying through the **Solana ecosystem** — visiting real protocols and surviving the wild world of crypto.',
      'Your goal: make it from **Genesis Block** to **Mainnet Launch** — 2,000 blocks away. Don\'t worry, we\'ll explain everything along the way!',
    ],
  },
  {
    title: 'YOUR JOURNEY',
    icon: '🗺️',
    content: [
      'You\'ll visit **real Solana protocols** along the way — Phantom (wallets), Jupiter (trading), Raydium (DEX), and more.',
      'Each stop is a milestone. **Builders** are building a project to launch. **Explorers** are discovering the ecosystem.',
      'A friendly guide will explain what each protocol does in real life, so you\'ll learn Solana just by playing!',
    ],
    tip: 'Pay attention to the guide messages — they explain real Solana concepts you can use outside the game.',
  },
  {
    title: 'YOUR ROLE',
    icon: '💰',
    content: [
      '**Crypto Whale** — 1,600 SOL to start. Easiest mode, but lowest score multiplier (1x).',
      '**NFT Flipper** — 800 SOL. Medium difficulty, 2x score multiplier.',
      '**Memecoin Degen** — 400 SOL. Hardest start, but 3x score if you make it!',
    ],
    tip: 'SOL is the currency of Solana. In real life, 1 SOL is worth real money. In this game, it\'s your budget for everything.',
  },
  {
    title: 'YOUR SUPPLIES',
    icon: '🛒',
    content: [
      '**Phones** 📱 — Your Seeker devices. Need at least 1 to travel. 6 for max speed.',
      '**Data** 📶 — Mobile data keeps your crew online. ~100 GB per person. No data = offline.',
      '**VPNs** 🛡️ — Security protection from hacks and scams. Essential during bear markets.',
      '**Alpha Passes** 🎫 — Use these to scout for data on the trail.',
      '**Spare gear** (chargers, hardware wallets, burner phones) — Backups for when things break.',
    ],
    tip: 'Prices go up at every stop. Buy as much as you can afford at the start!',
  },
  {
    title: 'ON THE TRAIL',
    icon: '🏃',
    content: [
      '**Pace** controls your speed. Diamond Hands (slow/safe) → Active Trader → Full Degen (fast/dangerous).',
      '**Rations** control data usage. Well Fed (3 GB/day/person) → On a Budget → Fasting for Gains (1 GB/day).',
      '**Market conditions** change as you travel: Bull 📈, Crab 🦀, Bear 📉, FOMO 🔥, or Crypto Winter ❄️.',
      'You can **rest** (heal your crew), **scout** (use alpha passes for data), or **trade** at stops.',
    ],
    tip: 'If someone dies, they\'re gone forever. Keep an eye on your party\'s health!',
  },
  {
    title: 'LET\'S GO!',
    icon: '🚀',
    content: [
      'Get your team to **Mainnet Launch** alive. More survivors + more supplies = higher score.',
      'Random events will test you — airdrops, rug pulls, phone failures, scam links, and more.',
      'Don\'t worry about knowing everything. The guide will explain as you go. Have fun!',
    ],
  },
]

const VETERAN_STEPS = [
  {
    title: 'WTF IS THIS',
    icon: '◎',
    content: [
      'you and 4 frens are navigating the Solana ecosystem from **Genesis Block** to **Mainnet Launch**. 2,000 blocks of pure degen survival.',
      'think Oregon Trail but everything is crypto. rug pulls replace dysentery. your phone dying replaces a broken axle.',
      'people in your party can get rekt, phished, or straight up lost to the blockchain. this isn\'t a drill ser.',
    ],
  },
  {
    title: 'YOUR BAG',
    icon: '🛒',
    content: [
      '**Phones** 📱 — your Seeker devices. need 1 to move, 6 for max speed. no phone = ngmi.',
      '**Data** 📶 — mobile data. ~100 GB per person or your party goes dark.',
      '**VPNs** 🛡️ — security for bear markets when exploits spike. 2 per person minimum.',
      '**Alpha Passes** 🎫 — scout for data on the trail. cheap now, clutch later.',
      '**Spare gear** — portable chargers, hardware wallets, burner phones. trust us, things break.',
    ],
    tip: 'prices pump at every stop. buy heavy at Genesis Block when it\'s cheap.',
  },
  {
    title: 'HOW IT WORKS',
    icon: '🏃',
    content: [
      '**Pace**: Diamond Hands (chill) → Active Trader → Full Degen (fast but your crew suffers).',
      '**Rations**: how much data your crew burns per day. fasting saves data but health tanks.',
      'market conditions cycle: Bull 📈, Crab 🦀, Bear 📉, FOMO 🔥, Winter ❄️. VPNs matter in bear/winter.',
      'random events: airdrops, rugs, phone deaths, scam links, MEV bots — the full CT experience.',
    ],
    tip: 'going Full Degen = more random events. if your party is down bad, slow it down.',
  },
  {
    title: 'LFG',
    icon: '🚀',
    content: [
      'get your squad to Mainnet alive. more survivors + more leftover supplies = higher score.',
      'role multiplier hits at the end. whale 1x, flipper 2x, degen 3x. risk it for the biscuit.',
      'wagmi? probably not. but that\'s never stopped a degen before.',
    ],
  },
]

export function Tutorial({ mode, onComplete }: TutorialProps) {
  const steps = mode === 'newcomer' ? NEWCOMER_STEPS : VETERAN_STEPS
  const [step, setStep] = useState(0)
  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="flex flex-col min-h-[100dvh] p-6">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === step
                ? 'bg-sol-green scale-125'
                : i < step
                  ? 'bg-sol-green/40'
                  : 'bg-sol-border'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="text-center mb-6 space-y-3">
          <div className="text-4xl">{current.icon}</div>
          <h1 className="font-pixel text-sm text-sol-green glow-green">
            {current.title}
          </h1>
        </div>

        <div className="space-y-3 flex-1">
          {current.content.map((line, i) => (
            <p key={i} className="text-xs text-sol-text leading-relaxed">
              {renderBold(line)}
            </p>
          ))}

          {current.tip && (
            <div className="mt-4 p-3 rounded-lg border border-sol-green/30 bg-sol-green/5">
              <p className="text-[11px] text-sol-green leading-relaxed">
                {current.tip}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-3 pt-4">
        <button
          onClick={() => {
            if (isLast) {
              onComplete()
            } else {
              setStep(step + 1)
            }
          }}
          className="w-full min-h-[48px] px-6 py-3 rounded-xl border-2 border-sol-green bg-sol-green/10 text-sol-green font-pixel text-xs hover:bg-sol-green/20 active:bg-sol-green/30 transition-all btn-press"
        >
          {isLast ? 'LFG' : 'NEXT'}
        </button>

        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full py-2 text-[10px] text-sol-muted hover:text-sol-text transition-colors"
          >
            {mode === 'newcomer' ? 'skip tutorial' : 'skip (i already know what i\'m doing)'}
          </button>
        )}
      </div>
    </div>
  )
}

/** Render **bold** markdown inline */
function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-sol-green">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}
