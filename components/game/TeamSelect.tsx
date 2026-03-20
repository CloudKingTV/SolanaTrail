'use client'

import { TeamType } from '@/lib/game/types'

interface TeamSelectProps {
  mode: 'newcomer' | 'veteran'
  onSelect: (teamType: TeamType) => void
}

export function TeamSelect({ mode, onSelect }: TeamSelectProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] p-6 space-y-6">
      <div className="text-center space-y-3">
        <div className="text-4xl">👥</div>
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          CHOOSE YOUR PATH
        </h1>
        <p className="text-xs text-sol-muted leading-relaxed">
          {mode === 'newcomer'
            ? 'How would you like to experience the Solana ecosystem?'
            : 'What\'s your vibe, ser?'
          }
        </p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {/* Builders */}
        <button
          onClick={() => onSelect('builders')}
          className="w-full text-left p-5 rounded-xl border-2 border-sol-green/40 bg-sol-green/5 hover:bg-sol-green/10 active:bg-sol-green/15 transition-all btn-press"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🏗️</span>
            <div className="flex-1 space-y-2">
              <div className="font-semibold text-sol-green text-sm">Builders</div>
              <p className="text-xs text-sol-muted leading-relaxed">
                {mode === 'newcomer'
                  ? 'Your startup team is building a project from scratch. Visit real Solana protocols to integrate features, get audited, and launch on Mainnet.'
                  : 'Startup arc. Ship code, integrate protocols, survive audits, and launch your token. You\'re here to build.'
                }
              </p>
              <div className="text-[10px] text-sol-green/70 mt-1">
                Team: Founder • Developer • Designer • Community Lead • BD
              </div>
              <div className="text-[10px] text-sol-muted">
                Win: Launch your project on Mainnet • Score bonus: Resources remaining
              </div>
            </div>
          </div>
        </button>

        {/* Explorers */}
        <button
          onClick={() => onSelect('explorers')}
          className="w-full text-left p-5 rounded-xl border-2 border-warning/40 bg-warning/5 hover:bg-warning/10 active:bg-warning/15 transition-all btn-press"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🗺️</span>
            <div className="flex-1 space-y-2">
              <div className="font-semibold text-warning text-sm">Explorers</div>
              <p className="text-xs text-sol-muted leading-relaxed">
                {mode === 'newcomer'
                  ? 'Your crew of friends is discovering the Solana ecosystem for the first time. Trade, swap, stake, and survive the whole journey together.'
                  : 'Degen squad. Ape into everything, dodge rugs, farm airdrops, and try not to get rekt before Mainnet.'
                }
              </p>
              <div className="text-[10px] text-warning/70 mt-1">
                Crew: The Ape • The Flipper • The Holder • The Farmer • The Lurker
              </div>
              <div className="text-[10px] text-sol-muted">
                Win: Survive the entire trail • Score bonus: Party health
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
