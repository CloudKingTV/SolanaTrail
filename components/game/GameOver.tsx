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
  scoreSubmitted?: boolean
  submittedRank?: number | null
  leaderboardType?: 'normal' | 'daily' | 'turbo'
  achievements?: string[]
  onShowAchievements?: () => void
}

export function GameOver({
  state, onPlayAgain, onMintNFT, onSubmitScore, isMinting = false, isSubmitting = false,
  scoreSubmitted = false, submittedRank = null, leaderboardType = 'normal',
  achievements = [], onShowAchievements,
}: GameOverProps) {
  const isVictory = state.phase === 'victory'
  const alive = getAliveCount(state.party)
  const inv = state.inventory
  const isBuilders = state.teamType === 'builders'

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center space-y-5 overflow-y-auto">
      {/* Title */}
      <div className="space-y-2">
        {isVictory ? (
          <>
            <div className="text-4xl">{isBuilders ? '🚀' : '🎉'}</div>
            <h1 className="font-pixel text-lg text-sol-green glow-green">
              {isBuilders ? 'PROJECT LAUNCHED!' : 'MAINNET REACHED!'}
            </h1>
            <p className="text-sm text-sol-text">
              {isBuilders
                ? `Your project is live on Mainnet! Congratulations, ${state.party[0]?.name}!`
                : `Your crew navigated the entire Solana ecosystem! Well done, ${state.party[0]?.name}!`
              }
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl">💀</div>
            <h1 className="font-pixel text-lg text-danger">GAME OVER</h1>
            <p className="text-sm text-sol-text">
              The road to Mainnet was too treacherous.
            </p>
          </>
        )}
      </div>

      {/* Score */}
      {isVictory && (
        <div className="p-4 rounded-xl bg-sol-card border border-sol-green/30 w-full max-w-xs">
          <div className="text-[10px] text-sol-muted mb-1">FINAL SCORE</div>
          <div className="font-pixel text-2xl text-sol-green glow-green">{state.score}</div>
          {state.profession && state.profession.scoreMultiplier > 1 && (
            <div className="text-[10px] text-sol-purple mt-1">
              ({state.profession.scoreMultiplier}x multiplier as {state.profession.name})
            </div>
          )}
          <div className="text-[10px] text-sol-muted mt-1">
            {isBuilders ? 'Bonus: Resources remaining (runway)' : 'Bonus: Party health (survivors)'}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="w-full max-w-xs grid grid-cols-2 gap-2">
        <StatBox label="Days" value={state.day.toString()} />
        <StatBox label="Distance" value={`${state.distanceTraveled}/${state.totalDistance}`} />
        <StatBox label="Survivors" value={`${alive}/${state.party.length}`} />
        <StatBox label="SOL Left" value={`◎ ${inv.sol.toFixed(0)}`} />
        <StatBox label="Phones" value={inv.oxen.toString()} />
        <StatBox label="Data" value={`${inv.food} GB`} />
      </div>

      {/* Party */}
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
              <span>
                {m.isLeader ? '⭐ ' : ''}{m.name}
                {m.role && <span className="text-sol-muted ml-1">({m.role})</span>}
              </span>
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
            {isMinting ? 'Minting...' : isBuilders ? '🚀 Mint Project Launch NFT' : '🏆 Mint Explorer Badge NFT'}
          </Button>
        )}
        {scoreSubmitted ? (
          <div className="w-full p-3 rounded-lg bg-sol-green/10 border border-sol-green/30 text-center">
            <div className="text-xs text-sol-green font-pixel">
              Score submitted! {submittedRank ? `Rank #${submittedRank}` : ''}
            </div>
            <a href="/leaderboard" className="text-[10px] text-sol-green/70 hover:text-sol-green underline">
              View {leaderboardType === 'turbo' ? 'Turbo ' : leaderboardType === 'daily' ? 'Daily ' : ''}Leaderboard
            </a>
          </div>
        ) : onSubmitScore ? (
          <Button variant="primary" fullWidth onClick={onSubmitScore} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : '📊 Submit to Leaderboard'}
          </Button>
        ) : null}
        {onShowAchievements && (
          <Button variant="ghost" fullWidth onClick={onShowAchievements}>
            🏅 Achievements ({achievements.length})
          </Button>
        )}
        <Button variant="ghost" fullWidth onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-lg bg-sol-card border border-sol-border text-center">
      <div className="text-[10px] text-sol-muted mb-1">{label}</div>
      <div className="text-sm font-bold text-sol-text">{value}</div>
    </div>
  )
}
