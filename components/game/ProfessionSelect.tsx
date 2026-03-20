'use client'

import { Profession, PROFESSIONS } from '@/lib/game/types'

interface ProfessionSelectProps {
  onSelect: (profession: Profession) => void
}

export function ProfessionSelect({ onSelect }: ProfessionSelectProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          CHOOSE YOUR ROLE
        </h1>
        <p className="text-xs text-sol-muted leading-relaxed">
          Many kinds of people made the mass migration to Mainnet.
          <br />Who are you?
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {PROFESSIONS.map((prof) => (
          <button
            key={prof.id}
            onClick={() => onSelect(prof)}
            className="w-full text-left p-4 rounded-xl border border-sol-border bg-sol-card hover:bg-sol-darker active:bg-sol-darker transition-all btn-press"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{prof.icon}</span>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sol-text">{prof.name}</span>
                  <span className="text-xs font-pixel text-sol-green">
                    {prof.scoreMultiplier}x SCORE
                  </span>
                </div>
                <p className="text-xs text-sol-muted leading-relaxed">
                  {prof.description}
                </p>
                <div className="text-xs text-sol-purple">
                  Starting funds: ◎ {prof.startingSol} SOL
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-[10px] text-sol-muted space-y-1">
        <p>Choosing a harder role means less starting SOL,</p>
        <p>but a higher score multiplier if you reach Mainnet.</p>
      </div>
    </div>
  )
}
