'use client'

import { GameMode } from '@/lib/game/types'

interface ModeSelectProps {
  onSelect: (mode: GameMode) => void
}

export function ModeSelect({ onSelect }: ModeSelectProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] p-6 space-y-6">
      <div className="text-center space-y-3">
        <div className="text-4xl">◎</div>
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          HOW DO YOU SOLANA?
        </h1>
        <p className="text-xs text-sol-muted leading-relaxed">
          Pick the experience that fits you best.
        </p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {/* Newcomer */}
        <button
          onClick={() => onSelect('newcomer')}
          className="w-full text-left p-5 rounded-xl border-2 border-sol-blue/40 bg-sol-blue/5 hover:bg-sol-blue/10 active:bg-sol-blue/15 transition-all btn-press"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🌱</span>
            <div className="flex-1 space-y-2">
              <div className="font-semibold text-sol-blue text-sm">New to Solana</div>
              <p className="text-xs text-sol-muted leading-relaxed">
                A friendly guide explains everything as you go. Learn what wallets, DEXs, staking, and NFTs are — all through gameplay.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sol-blue/10 text-sol-blue border border-sol-blue/20">
                  Guide character
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sol-blue/10 text-sol-blue border border-sol-blue/20">
                  Crypto explained
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sol-blue/10 text-sol-blue border border-sol-blue/20">
                  Learn by playing
                </span>
              </div>
            </div>
          </div>
        </button>

        {/* Veteran */}
        <button
          onClick={() => onSelect('veteran')}
          className="w-full text-left p-5 rounded-xl border-2 border-sol-purple/40 bg-sol-purple/5 hover:bg-sol-purple/10 active:bg-sol-purple/15 transition-all btn-press"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">🦍</span>
            <div className="flex-1 space-y-2">
              <div className="font-semibold text-sol-purple text-sm">I Live On-Chain</div>
              <p className="text-xs text-sol-muted leading-relaxed">
                Full degen energy. Real Solana lore, CT references, and memes. No hand-holding. You know what a rug pull is.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sol-purple/10 text-sol-purple border border-sol-purple/20">
                  Real Solana lore
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sol-purple/10 text-sol-purple border border-sol-purple/20">
                  CT energy
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sol-purple/10 text-sol-purple border border-sol-purple/20">
                  No tutorials needed
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
