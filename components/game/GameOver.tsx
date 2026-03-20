'use client'

import { GameState } from '@/lib/game/types'
import { getAliveCount } from '@/lib/game/party'
import { Button } from '@/components/ui/Button'

interface GameOverProps {
  state: GameState
  onPlayAgain: () => void
  onMintNFT?: () => void
  onSubmitScore?: () => void
  isMinting?: boolean
  isSubmitting?: boolean
}

export function GameOver({
  state,
  onPlayAgain,
  onMintNFT,
  onSubmitScore,
  isMinting = false,
  isSubmitting = false,
}: GameOverProps) {
  const isVictory = state.phase === 'victory'
  const alive = getAliveCount(state.party)

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-6">
      {/* Title */}
      <div className="space-y-2">
        {isVictory ? (
          <>
            <div className="text-4xl mb-2">🎉</div>
            <h1 className="font-pixel text-lg text-sol-green glow-green">
              MAINNET LAUNCHED!
            </h1>
            <p className="text-sm text-sol-text">
              Your protocol is live. The validators are humming. Web3 has a new star.
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">💀</div>
            <h1 className="font-pixel text-lg text-danger">
              GAME OVER
            </h1>
            <p className="text-sm text-sol-text">
              The road to Mainnet was too treacherous. Another protocol lost to the bear market.
            </p>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="w-full max-w-xs space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Score" value={state.score.toString()} highlight />
          <StatBox label="Days" value={state.day.toString()} />
          <StatBox label="Distance" value={`${state.distanceTraveled}/${state.totalDistance}`} />
          <StatBox label="Survivors" value={`${alive}/${state.party.length}`} />
          <StatBox label="SOL Left" value={`◎ ${state.resources.sol.toFixed(1)}`} />
          <StatBox label="Validators" value={state.resources.validators.toString()} />
        </div>
      </div>

      {/* Party final status */}
      <div className="w-full max-w-xs">
        <h3 className="font-pixel text-[10px] text-sol-purple mb-2">PARTY STATUS</h3>
        <div className="space-y-1">
          {state.party.map((m) => (
            <div
              key={m.name}
              className={`text-xs flex justify-between px-2 py-1 rounded bg-sol-darker border border-sol-border ${
                m.status === 'dead' ? 'opacity-50' : ''
              }`}
            >
              <span>{m.name} the {m.role}</span>
              <span className={m.status === 'dead' ? 'text-danger' : 'text-sol-green'}>
                {m.status === 'dead' ? 'Lost' : `HP: ${m.health}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-3">
        {isVictory && onMintNFT && (
          <Button variant="secondary" fullWidth onClick={onMintNFT} disabled={isMinting}>
            {isMinting ? 'Minting...' : '🏆 Mint Achievement NFT'}
          </Button>
        )}
        {onSubmitScore && (
          <Button variant="primary" fullWidth onClick={onSubmitScore} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : '📊 Submit to Leaderboard'}
          </Button>
        )}
        <Button variant="ghost" fullWidth onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>
    </div>
  )
}

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="p-2 rounded-lg bg-sol-card border border-sol-border text-center">
      <div className="text-[10px] text-sol-muted mb-1">{label}</div>
      <div
        className={`text-sm font-bold ${
          highlight ? 'text-sol-green glow-green font-pixel' : 'text-sol-text'
        }`}
      >
        {value}
      </div>
    </div>
  )
}
