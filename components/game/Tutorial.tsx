'use client'

import { useState } from 'react'

interface TutorialProps {
  onComplete: () => void
}

const TUTORIAL_STEPS = [
  {
    title: 'WELCOME TO SOLANA TRAIL',
    icon: '◎',
    content: [
      'The year is 2024. You must lead a party of 5 from **Genesis Block** to **Mainnet Launch** — a 2,000 block journey through the crypto wilderness.',
      'Along the way you\'ll face random events, manage resources, cross rivers, and make tough decisions.',
      'Not everyone may survive the trip.',
    ],
  },
  {
    title: 'YOUR ROLE',
    icon: '👤',
    content: [
      '**Crypto Whale** — Start with 1,600 SOL but only 1x score. Easiest path.',
      '**NFT Flipper** — Start with 800 SOL and 2x score. Balanced.',
      '**Memecoin Degen** — Start with 400 SOL but 3x score. Hardest, but biggest bragging rights.',
    ],
    tip: 'Less starting SOL = harder journey, but higher final score.',
  },
  {
    title: 'SUPPLIES',
    icon: '🛒',
    content: [
      '**Validators** (⬡) — Your engines. Need at least 1 to move, 6 for full speed.',
      '**Bandwidth** (⚡) — Food for your party. ~100 per person recommended.',
      '**Security Patches** (🛡️) — Protection from cold weather. 2 per person.',
      '**Bug Bounty Kits** (🔫) — Used for hunting to earn more food on the trail.',
      '**Spare parts** (🖥️💾🔌) — GPUs, SSDs, and PSUs to fix breakdowns.',
    ],
    tip: 'Prices go up at forts further along the trail. Stock up early!',
  },
  {
    title: 'ON THE TRAIL',
    icon: '🗺️',
    content: [
      '**Pace** controls speed vs. health. Grueling is fast but damages your party.',
      '**Rations** control food use. Filling heals, Bare Bones saves food but hurts health.',
      'You can **rest** to heal, **hunt** for extra food, and **trade** at forts.',
    ],
    tip: 'Keep an eye on party health. Dead members can\'t come back.',
  },
  {
    title: 'EVENTS & DANGERS',
    icon: '⚡',
    content: [
      'Random events happen as you travel — diseases, breakdowns, theft, storms, and even good luck like airdrops.',
      'Some events give you **choices**. Choose wisely — they affect your supplies and party health.',
      'At **rivers**, you can ford, float, hire a ferry, or wait for water to drop.',
    ],
    tip: 'Faster pace = more events. Steady pace is safest.',
  },
  {
    title: 'READY TO RIDE?',
    icon: '🚀',
    content: [
      'Your goal: get as many party members to Mainnet Launch alive and healthy.',
      'Final score = survivors + supplies, multiplied by your role\'s bonus.',
      'Good luck out there, anon. The blockchain is unforgiving.',
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
                Tip: {current.tip}
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
          {isLast ? 'START THE TRAIL' : 'NEXT'}
        </button>

        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full py-2 text-[10px] text-sol-muted hover:text-sol-text transition-colors"
          >
            Skip Tutorial
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
