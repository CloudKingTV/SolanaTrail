'use client'

import { useState } from 'react'

interface TutorialProps {
  onComplete: () => void
}

const TUTORIAL_STEPS = [
  {
    title: 'WTF IS THIS',
    icon: '◎',
    content: [
      'ok so basically you and 4 frens are trying to get from **Genesis Block** to **Mainnet Launch**. that\'s 2,000 blocks away.',
      'think of it like Oregon Trail but everything is crypto. you buy supplies, manage resources, and pray nothing rugs you on the way.',
      'people in your party can get sick, get rekt, or straight up die. this isn\'t a drill ser.',
    ],
  },
  {
    title: 'PICK YOUR BAG SIZE',
    icon: '💰',
    content: [
      '**Crypto Whale** — 1,600 SOL. ez mode. you\'re rich but your final score gets a measly 1x multiplier.',
      '**NFT Flipper** — 800 SOL. mid difficulty, 2x score. solid for a first run.',
      '**Memecoin Degen** — 400 SOL. you\'re basically broke but if you survive? **3x score**. max clout.',
    ],
    tip: 'degen mode is hard. like "aping into an unaudited contract at 3am" hard. but the score multiplier is worth it if you make it.',
  },
  {
    title: 'WHAT TO BUY',
    icon: '🛒',
    content: [
      '**Laptops** — your trading rigs. need 1 minimum to move. 6 for full speed. no laptop = ngmi.',
      '**Ramen** — you\'re a degen, this is your food. ~100 packs per person or your party starves.',
      '**Hoodies** — crypto uniform + cold weather protection. 2 per person minimum.',
      '**Alpha Passes** — use these to hunt for extra ramen on the trail. cheap now, clutch later.',
      '**Spare gear** (chargers, hardware wallets, burner phones) — for when your stuff breaks. and it will break.',
    ],
    tip: 'prices pump at every stop along the trail. buy heavy at the start when it\'s cheap.',
  },
  {
    title: 'HOW TRAVEL WORKS',
    icon: '🏃',
    content: [
      '**Pace** = how fast you go. steady is chill, grueling is fast but your party\'s health tanks. choose wisely.',
      '**Rations** = how much ramen your party eats per day. filling keeps everyone healthy. bare bones saves food but people get weak.',
      'you can **rest** (heals the squad), **hunt** (spend alpha passes to earn ramen), or **trade** at forts along the way.',
    ],
    tip: 'if someone in your party dies they\'re gone forever. no respawns. keep that health bar green.',
  },
  {
    title: 'STUFF THAT HAPPENS',
    icon: '🎲',
    content: [
      'random events hit while you travel. airdrops (free sol, lfg), rug pulls (rip your bags), laptop failures, storms, hackers — all of it.',
      'some events let you **choose** what to do. bad choice = lost supplies or dead frens.',
      'rivers block your path sometimes. you can try to cross (risky), float across (less risky), pay a ferry (costs sol), or wait it out.',
    ],
    tip: 'going faster = more random events. if your party is hurting, slow down ser.',
  },
  {
    title: 'LFG',
    icon: '🚀',
    content: [
      'get your squad to Mainnet Launch alive. more survivors + more leftover supplies = higher score.',
      'your role multiplier hits at the end. whale gets 1x, flipper 2x, degen 3x. risk it for the biscuit.',
      'wagmi? probably not. but that\'s never stopped a degen before.',
    ],
  },
]

export function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0)
  const current = TUTORIAL_STEPS[step]
  const isLast = step === TUTORIAL_STEPS.length - 1

  return (
    <div className="flex flex-col min-h-[100dvh] p-6">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {TUTORIAL_STEPS.map((_, i) => (
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
            skip (i already know what i\'m doing)
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
