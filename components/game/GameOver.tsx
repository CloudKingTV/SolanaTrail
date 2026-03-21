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
    <div className="flex flex-col items-center min-h-[100dvh] p-5 text-center overflow-y-auto animate-fade-in">
      {/* Hero section */}
      <div className="pt-8 pb-4 space-y-2">
        {isVictory ? (
          <>
            <div className="text-5xl animate-bounce-slow">{isBuilders ? '🚀' : '🎉'}</div>
            <h1 className="font-pixel text-base text-sol-green glow-green leading-relaxed">
              {isBuilders ? 'PROJECT LAUNCHED!' : 'MAINNET REACHED!'}
            </h1>
            <p className="text-xs text-sol-muted max-w-[260px]">
              {isBuilders
                ? `${state.party[0]?.name}'s project is live on Mainnet!`
                : `${state.party[0]?.name}'s crew made it to Mainnet!`
              }
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl">💀</div>
            <h1 className="font-pixel text-base text-danger leading-relaxed">
              GAME OVER
            </h1>
            <p className="text-xs text-sol-muted max-w-[260px]">
              {alive === 0 ? 'Everyone was lost on the trail.' : 'The road to Mainnet was too treacherous.'}
            </p>
          </>
        )}
      </div>

      {/* Score card */}
      {isVictory && (
        <div className="w-full max-w-xs p-4 rounded-xl bg-sol-card border border-sol-green/30 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-sol-green/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-[9px] text-sol-muted uppercase tracking-wider mb-1">Final Score</div>
            <div className="font-pixel text-2xl text-sol-green glow-green">{state.score}</div>
            {state.profession && state.profession.scoreMultiplier > 1 && (
              <div className="text-[10px] text-sol-purple mt-1">
                {state.profession.icon} {state.profession.scoreMultiplier}x {state.profession.name} bonus
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats grid — compact 3-column */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-1.5 mb-4">
        <StatBox label="Days" value={state.day.toString()} icon="📅" />
        <StatBox label="Distance" value={`${state.distanceTraveled}`} icon="📍" sub={`/${state.totalDistance}`} />
        <StatBox label="Survivors" value={`${alive}/${state.party.length}`} icon="👥" highlight={alive === state.party.length} />
        <StatBox label="SOL" value={inv.sol.toFixed(0)} icon="◎" />
        <StatBox label="Phones" value={inv.oxen.toString()} icon="📱" />
        <StatBox label="Data" value={`${inv.food}`} icon="📶" sub="GB" />
      </div>

      {/* Party final status */}
      <div className="w-full max-w-xs mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-pixel text-[9px] text-sol-purple uppercase">Party Status</span>
          <span className="text-[9px] text-sol-muted">{alive} survived</span>
        </div>
        <div className="grid grid-cols-1 gap-1">
          {state.party.map((m) => {
            const isDead = m.status === 'dead'
            return (
              <div
                key={m.name}
                className={`flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg border ${
                  isDead ? 'bg-sol-darker/30 border-sol-border/30 opacity-40' : 'bg-sol-darker border-sol-border'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {m.isLeader && <span className="text-[9px]">⭐</span>}
                  <span className={isDead ? 'text-sol-muted line-through' : 'text-sol-text'}>{m.name}</span>
                  {m.role && <span className="text-[9px] text-sol-muted">({m.role})</span>}
                </span>
                <span className={`text-[10px] font-mono ${isDead ? 'text-danger' : 'text-sol-green'}`}>
                  {isDead ? 'LOST' : `${m.health}%`}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-2 pb-6">
        {isVictory && onMintNFT && (
          <Button variant="secondary" fullWidth onClick={onMintNFT} disabled={isMinting}>
            {isMinting ? 'Minting...' : isBuilders ? '🚀 Mint Launch NFT' : '🏆 Mint Badge NFT'}
          </Button>
        )}
        {scoreSubmitted ? (
          <div className="w-full p-3 rounded-lg bg-sol-green/10 border border-sol-green/30 text-center animate-fade-in">
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

function StatBox({ label, value, icon, sub, highlight }: {
  label: string; value: string; icon: string; sub?: string; highlight?: boolean
}) {
  return (
    <div className={`p-2 rounded-lg border text-center ${
      highlight ? 'bg-sol-green/5 border-sol-green/20' : 'bg-sol-card border-sol-border'
    }`}>
      <div className="text-[9px] text-sol-muted mb-0.5">{icon} {label}</div>
      <div className="text-xs font-bold text-sol-text">
        {value}{sub && <span className="text-sol-muted font-normal text-[9px]">{sub}</span>}
      </div>
    </div>
  )
}
