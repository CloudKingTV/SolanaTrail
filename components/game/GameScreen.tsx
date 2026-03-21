'use client'

import { useReducer, useState, useEffect, useCallback, useRef } from 'react'
import { gameReducer, createInitialState, calculateScore } from '@/lib/game/engine'
import { Pace, Rations, Inventory, PROFESSIONS } from '@/lib/game/types'
import { checkAchievements, createInitialStats, saveAchievementsServer, loadAchievementsServer, GameStats } from '@/lib/game/achievements'
import { saveGame, loadGame, deleteSave, hasSavedGame, getDailySeed, hasDailyBeenPlayed, hasDailyBeenPlayedServer, markDailyPlayedServer, saveDailyScore } from '@/lib/game/save'
import { addGameToHistoryServer, fetchGameHistoryServer, getGameHistoryCount, GameHistoryEntry } from '@/lib/game/history'
import { submitScoreAPI, LeaderboardEntry } from '@/lib/solana/leaderboard'
import { StatusBar } from './StatusBar'
import { MessageLog } from './MessageLog'
import { TravelView } from './TravelView'
import { EventDialog } from './EventDialog'
import { TradingPost } from './TradingPost'
import { PartyStatus } from './PartyStatus'
import { GameOver } from './GameOver'
import { ProfessionSelect } from './ProfessionSelect'
import { PartyNaming } from './PartyNaming'
import { EpochSelect } from './EpochSelect'
import { GeneralStore } from './GeneralStore'
import { RiverCrossing } from './RiverCrossing'
import { LandmarkView } from './LandmarkView'
import { HuntingView } from './HuntingView'
import { Tutorial } from './Tutorial'
import { ModeSelect } from './ModeSelect'
import { TeamSelect } from './TeamSelect'
import { TokenTradingView } from './TokenTradingView'
import { EncounterDialog } from './EncounterDialog'
import { AchievementsView } from './AchievementsView'
import { AchievementToast } from './AchievementToast'
import { CollectiblesView } from './CollectiblesView'
import { GameHistory } from './GameHistory'
import { NameEntryModal } from './NameEntryModal'
import { loadCollectiblesServer, saveCollectiblesServer, checkSpecialCollectibles } from '@/lib/game/collectibles'

interface GameScreenProps {
  walletAddress?: string
  onSubmitScore?: (score: number, walletAddress: string) => Promise<void>
  onMintNFT?: () => Promise<void>
}

export function GameScreen({ walletAddress, onSubmitScore, onMintNFT }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState())
  const [showParty, setShowParty] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showNameEntry, setShowNameEntry] = useState(false)
  const [historyEntries, setHistoryEntries] = useState<GameHistoryEntry[]>([])
  const [historyCount, setHistoryCount] = useState(0)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [dailyPlayed, setDailyPlayed] = useState(hasDailyBeenPlayed())
  const [submittedRank, setSubmittedRank] = useState<number | null>(null)
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [allAchievements, setAllAchievements] = useState<string[]>([])
  const [showCollectibles, setShowCollectibles] = useState(false)
  const [allCollectibles, setAllCollectibles] = useState<string[]>([])
  const statsRef = useRef<GameStats>(createInitialStats())

  // Load persisted achievements and history count on mount (server-synced)
  useEffect(() => {
    loadAchievementsServer(walletAddress).then(ids => setAllAchievements(ids))
    loadCollectiblesServer(walletAddress).then(ids => setAllCollectibles(ids))
    setHistoryCount(getGameHistoryCount())
    // Also sync history from server to update count
    fetchGameHistoryServer(walletAddress).then(entries => setHistoryCount(entries.length))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check server-side daily challenge status on mount
  useEffect(() => {
    hasDailyBeenPlayedServer(walletAddress).then(played => {
      setDailyPlayed(played)
    })
  }, [walletAddress])

  // Seeker phone detection
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase()
      if (ua.includes('seeker') || ua.includes('solana phone') || ua.includes('saga')) {
        dispatch({ type: 'DETECT_SEEKER' })
      }
    }
  }, [])

  // Auto-save during active game
  useEffect(() => {
    if (['traveling', 'landmark', 'event', 'encounter', 'hunting', 'trading', 'token_trading', 'river_crossing'].includes(state.phase)) {
      saveGame(state, statsRef.current)
    }
    if (state.phase === 'gameOver' || state.phase === 'victory') {
      deleteSave()
    }
  }, [state])

  // Track stats for achievements
  useEffect(() => {
    if (state.phase === 'traveling') {
      // Stats tracking happens through actions
    }
  }, [state.phase])

  // Check achievements and save history on game end
  useEffect(() => {
    if (state.phase === 'victory' || state.phase === 'gameOver') {
      const earned = checkAchievements(state, statsRef.current)
      if (earned.length > 0) {
        setNewAchievements(earned)
        const updated = [...new Set([...allAchievements, ...earned])]
        setAllAchievements(updated)
        saveAchievementsServer(earned, walletAddress)
      }
      // Sync collectibles found this run
      const specialItems = checkSpecialCollectibles(state)
      const runItems = [...state.foundCollectibles, ...specialItems]
      if (runItems.length > 0) {
        const newlyFound = runItems.filter(id => !allCollectibles.includes(id))
        if (newlyFound.length > 0) {
          const updated = [...new Set([...allCollectibles, ...runItems])]
          setAllCollectibles(updated)
          saveCollectiblesServer(runItems, walletAddress)
        }
      }
      // Mark daily played (server-side + localStorage)
      if (state.isDaily) {
        markDailyPlayedServer(walletAddress)
        setDailyPlayed(true)
        if (state.phase === 'victory') {
          saveDailyScore(state.score)
        }
      }
      // Auto-save to game history (server-synced)
      addGameToHistoryServer(state, walletAddress).then(() => {
        setHistoryCount(getGameHistoryCount())
      })
      // Reset score submission state
      setScoreSubmitted(false)
      setSubmittedRank(null)
      // Auto-prompt name entry on victory
      if (state.phase === 'victory') {
        setShowNameEntry(true)
      }
    }
  }, [state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track rests and hunts for achievements
  const wrappedDispatch = useCallback((action: Parameters<typeof dispatch>[0]) => {
    if (action.type === 'REST') {
      statsRef.current.timesRested++
    }
    if (action.type === 'START_HUNTING') {
      statsRef.current.timesHunted++
    }
    if (action.type === 'ENCOUNTER_CHOICE' && state.currentEncounter) {
      statsRef.current.encounteredNpcs.add(state.currentEncounter.id)
      statsRef.current.encountersMet = statsRef.current.encounteredNpcs.size
      if (state.currentEncounter.id === 'lost_degen' && action.choiceId === 'help') {
        statsRef.current.helpedLostDegen = true
      }
    }
    if (action.type === 'LEAVE_TOKEN_TRADING') {
      // Calculate trading profit
      let holdingsValue = 0
      for (const [name, qty] of Object.entries(state.tokenHoldings)) {
        const token = state.tokenPrices.find(t => t.name === name)
        if (token) holdingsValue += token.price * qty
      }
      // Rough profit calc: current sol + holdings - sol at start
      // We approximate by tracking the holdings value as profit
      if (holdingsValue > statsRef.current.bestTradingProfit) {
        statsRef.current.bestTradingProfit = holdingsValue
      }
    }
    dispatch(action)
  }, [state.currentEncounter, state.tokenHoldings, state.tokenPrices])

  // ==================== GAME HISTORY VIEW ====================
  if (showHistory) {
    return (
      <GameHistory
        entries={historyEntries}
        onClose={() => setShowHistory(false)}
      />
    )
  }

  // ==================== COLLECTIBLES VIEW ====================
  if (showCollectibles) {
    return (
      <CollectiblesView
        collectedIds={allCollectibles}
        onClose={() => setShowCollectibles(false)}
      />
    )
  }

  // ==================== ACHIEVEMENTS VIEW ====================
  if (showAchievements) {
    return (
      <AchievementsView
        unlockedIds={allAchievements}
        onClose={() => setShowAchievements(false)}
      />
    )
  }

  // ==================== TITLE SCREEN ====================
  if (state.phase === 'title') {
    const savedGame = hasSavedGame()

    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center space-y-8">
        {/* Achievement toast */}
        {newAchievements.length > 0 && (
          <AchievementToast
            achievementIds={newAchievements}
            onDone={() => setNewAchievements([])}
          />
        )}

        <div className="space-y-4">
          <div className="text-6xl">◎</div>
          <h1 className="font-pixel text-xl text-sol-green glow-green leading-relaxed">
            SOLANA<br />TRAIL
          </h1>
          <p className="text-sm text-sol-muted max-w-xs leading-relaxed">
            Your party of 5 must navigate the entire Solana
            ecosystem — 2,000 blocks from Genesis Block to Mainnet Launch.
          </p>
          {state.seekerDetected && (
            <div className="text-xs text-sol-green bg-sol-green/10 border border-sol-green/30 rounded-lg px-3 py-2">
              📱 Seeker Detected! +10 Data bonus at start
            </div>
          )}
        </div>

        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => dispatch({ type: 'START_TUTORIAL' })}
            className="w-full min-h-[56px] px-8 py-4 rounded-xl border-2 border-sol-green bg-sol-green/10 text-sol-green font-pixel text-xs hover:bg-sol-green/20 active:bg-sol-green/30 transition-all btn-press"
          >
            NEW GAME
          </button>

          {savedGame && (
            <button
              onClick={() => {
                const save = loadGame()
                if (save) {
                  statsRef.current = save.stats
                  dispatch({ type: 'LOAD_GAME', savedState: save.state })
                }
              }}
              className="w-full min-h-[48px] px-6 py-3 rounded-xl border border-sol-purple/50 bg-sol-purple/10 text-sol-purple font-pixel text-xs hover:bg-sol-purple/20 active:bg-sol-purple/30 transition-all btn-press"
            >
              CONTINUE SAVED GAME
            </button>
          )}

          <button
            onClick={() => dispatch({ type: 'START_DAILY' })}
            disabled={dailyPlayed}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl border border-sol-blue/50 bg-sol-blue/10 text-sol-blue font-pixel text-xs hover:bg-sol-blue/20 active:bg-sol-blue/30 transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {dailyPlayed ? 'DAILY COMPLETE ✓' : '📅 DAILY CHALLENGE'}
          </button>

          <button
            onClick={() => dispatch({ type: 'START_TURBO' })}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl border border-warning/50 bg-warning/10 text-warning font-pixel text-xs hover:bg-warning/20 active:bg-warning/30 transition-all btn-press"
          >
            ⚡ TURBO MODE
          </button>

          <button
            onClick={() => setShowAchievements(true)}
            className="w-full min-h-[44px] px-6 py-2 rounded-xl border border-sol-border bg-transparent text-sol-muted text-xs hover:bg-sol-card hover:text-sol-text transition-all btn-press"
          >
            🏅 Achievements ({allAchievements.length})
          </button>

          <button
            onClick={() => setShowCollectibles(true)}
            className="w-full min-h-[44px] px-6 py-2 rounded-xl border border-sol-border bg-transparent text-sol-muted text-xs hover:bg-sol-card hover:text-sol-text transition-all btn-press"
          >
            🎒 Items ({allCollectibles.length})
          </button>

          <button
            onClick={() => {
              fetchGameHistoryServer(walletAddress).then(entries => {
                setHistoryEntries(entries)
                setShowHistory(true)
              })
            }}
            className="w-full min-h-[44px] px-6 py-2 rounded-xl border border-sol-border bg-transparent text-sol-muted text-xs hover:bg-sol-card hover:text-sol-text transition-all btn-press"
          >
            📜 Game History {historyCount > 0 ? `(${historyCount})` : ''}
          </button>

          <a
            href="/leaderboard"
            className="w-full min-h-[44px] px-6 py-2 rounded-xl border border-sol-border bg-transparent text-sol-muted text-xs hover:bg-sol-card hover:text-sol-text transition-all btn-press flex items-center justify-center"
          >
            🏆 Leaderboard
          </a>
        </div>

        {walletAddress && (
          <div className="text-[10px] text-sol-muted">
            Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </div>
        )}

        <div className="text-[10px] text-sol-muted space-y-1">
          <p>Powered by Solana Devnet</p>
        </div>
      </div>
    )
  }

  // ==================== MODE SELECT ====================
  if (state.phase === 'mode_select') {
    return <ModeSelect onSelect={(mode) => wrappedDispatch({ type: 'SET_MODE', mode })} />
  }

  // ==================== TEAM SELECT ====================
  if (state.phase === 'team_select') {
    return <TeamSelect mode={state.mode} onSelect={(teamType) => wrappedDispatch({ type: 'SET_TEAM', teamType })} />
  }

  // ==================== TUTORIAL ====================
  if (state.phase === 'tutorial') {
    return <Tutorial mode={state.mode} onComplete={() => wrappedDispatch({ type: 'SKIP_TUTORIAL' })} />
  }

  // ==================== PROFESSION SELECT ====================
  if (state.phase === 'profession_select') {
    return <ProfessionSelect onSelect={(p) => wrappedDispatch({ type: 'SELECT_PROFESSION', profession: p })} />
  }

  // ==================== PARTY NAMING ====================
  if (state.phase === 'party_naming') {
    return <PartyNaming onSubmit={(names) => wrappedDispatch({ type: 'SET_PARTY_NAMES', names })} />
  }

  // ==================== EPOCH SELECT ====================
  if (state.phase === 'epoch_select') {
    return <EpochSelect onSelect={(epoch) => wrappedDispatch({ type: 'SET_EPOCH', epoch })} />
  }

  // ==================== GENERAL STORE ====================
  if (state.phase === 'general_store') {
    return (
      <GeneralStore
        inventory={state.inventory}
        onBuy={(item, qty) => wrappedDispatch({ type: 'BUY_INITIAL', item, quantity: qty })}
        onLeave={() => wrappedDispatch({ type: 'START_TRAIL' })}
      />
    )
  }

  // ==================== GAME OVER / VICTORY ====================
  if (state.phase === 'gameOver' || state.phase === 'victory') {
    return (
      <>
        {newAchievements.length > 0 && (
          <AchievementToast
            achievementIds={newAchievements}
            onDone={() => setNewAchievements([])}
          />
        )}
        {showNameEntry && (
          <NameEntryModal
            score={state.score}
            onSubmit={async (name) => {
              setShowNameEntry(false)
              setIsSubmitting(true)
              try {
                const entry: LeaderboardEntry = {
                  playerName: name,
                  walletAddress: walletAddress || 'anonymous',
                  score: state.score,
                  day: state.day,
                  distanceTraveled: state.distanceTraveled,
                  survived: state.party.filter(p => p.status !== 'dead').length,
                  totalParty: state.party.length,
                  victory: state.phase === 'victory',
                  profession: state.profession?.name,
                  professionIcon: state.profession?.icon,
                  isDaily: state.isDaily,
                  isTurbo: state.isTurbo,
                  timestamp: Date.now(),
                }
                const result = await submitScoreAPI(entry)
                setSubmittedRank(result.rank)
                setScoreSubmitted(true)
              } finally {
                setIsSubmitting(false)
              }
            }}
            onCancel={() => setShowNameEntry(false)}
          />
        )}
        <GameOver
          state={state}
          onPlayAgain={() => {
            statsRef.current = createInitialStats()
            dispatch({ type: 'PLAY_AGAIN' })
          }}
          onMintNFT={walletAddress ? async () => {
            setIsMinting(true)
            try { await onMintNFT?.() } finally { setIsMinting(false) }
          } : undefined}
          onSubmitScore={!scoreSubmitted ? () => {
            setShowNameEntry(true)
          } : undefined}
          isMinting={isMinting}
          isSubmitting={isSubmitting}
          scoreSubmitted={scoreSubmitted}
          submittedRank={submittedRank}
          leaderboardType={state.isTurbo ? 'turbo' : state.isDaily ? 'daily' : 'normal'}
          achievements={allAchievements}
          onShowAchievements={() => setShowAchievements(true)}
        />
      </>
    )
  }

  // ==================== MAIN GAME VIEW ====================
  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto">
      {/* Achievement toast */}
      {newAchievements.length > 0 && (
        <AchievementToast
          achievementIds={newAchievements}
          onDone={() => setNewAchievements([])}
        />
      )}

      {state.isDaily && (
        <div className="bg-sol-blue/10 border-b border-sol-blue/30 px-4 py-1 text-center">
          <span className="text-[10px] text-sol-blue font-pixel">📅 DAILY CHALLENGE</span>
        </div>
      )}

      {state.isTurbo && (
        <div className="bg-warning/10 border-b border-warning/30 px-4 py-1 text-center">
          <span className="text-[10px] text-warning font-pixel">⚡ TURBO MODE</span>
        </div>
      )}

      <StatusBar
        inventory={state.inventory}
        day={state.day}
        distance={state.distanceTraveled}
        totalDistance={state.totalDistance}
        health={state.health}
        weather={state.currentWeather}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* RIVER CROSSING */}
        {state.phase === 'river_crossing' && state.currentLocation && (
          <RiverCrossing
            location={state.currentLocation}
            depth={state.riverDepth}
            sol={state.inventory.sol}
            onChoice={(choice) => wrappedDispatch({ type: 'RIVER_CHOICE', choice })}
          />
        )}

        {/* LANDMARK / FORT */}
        {state.phase === 'landmark' && state.currentLocation && (
          <LandmarkView
            location={state.currentLocation}
            inventory={state.inventory}
            onContinue={() => wrappedDispatch({ type: 'CONTINUE_FROM_LANDMARK' })}
            onLookAround={() => wrappedDispatch({ type: 'LOOK_AROUND' })}
            onTalk={() => wrappedDispatch({ type: 'TALK_TO_PEOPLE' })}
            onTrade={() => wrappedDispatch({ type: 'ENTER_TRADING' })}
            onRest={() => wrappedDispatch({ type: 'REST' })}
            onTokenTrade={state.currentLocation.hasStore ? () => wrappedDispatch({ type: 'ENTER_TOKEN_TRADING' }) : undefined}
            messages={state.messageLog.filter(m => m.day >= state.day)}
          />
        )}

        {/* TRADING AT FORT */}
        {state.phase === 'trading' && state.currentLocation && (
          <TradingPost
            location={state.currentLocation}
            inventory={state.inventory}
            onBuy={(item, qty) => wrappedDispatch({ type: 'BUY_ITEM', item, quantity: qty })}
            onLeave={() => wrappedDispatch({ type: 'LEAVE_TRADING' })}
          />
        )}

        {/* TOKEN TRADING MINI-GAME */}
        {state.phase === 'token_trading' && (
          <TokenTradingView
            tokenPrices={state.tokenPrices}
            holdings={state.tokenHoldings}
            sol={state.inventory.sol}
            roundsLeft={state.tradingRoundsLeft}
            onBuy={(name, amt) => wrappedDispatch({ type: 'BUY_TOKEN', tokenName: name, amount: amt })}
            onSell={(name, amt) => wrappedDispatch({ type: 'SELL_TOKEN', tokenName: name, amount: amt })}
            onAdvanceMarket={() => wrappedDispatch({ type: 'ADVANCE_MARKET' })}
            onLeave={() => wrappedDispatch({ type: 'LEAVE_TOKEN_TRADING' })}
            messages={state.messageLog.filter(m => m.day >= state.day)}
          />
        )}

        {/* HUNTING */}
        {state.phase === 'hunting' && (
          <HuntingView
            ammoRemaining={state.inventory.ammunition * 20 - state.huntingAmmoUsed}
            foodGained={state.huntingFoodGained}
            onShoot={(targetId) => wrappedDispatch({ type: 'HUNT_SHOOT', targetId })}
            onFinish={() => wrappedDispatch({ type: 'END_HUNTING' })}
            messages={state.messageLog.filter(m => m.day >= state.day)}
          />
        )}

        {/* PARTY VIEW */}
        {showParty && state.phase === 'traveling' && (
          <div className="p-4 overflow-y-auto">
            <PartyStatus party={state.party} />
            <button
              onClick={() => setShowParty(false)}
              className="w-full mt-4 text-xs text-sol-muted hover:text-sol-text py-2"
            >
              ← Back to Trail
            </button>
          </div>
        )}

        {/* TRAVELING */}
        {state.phase === 'traveling' && !showParty && (
          <>
            <MessageLog messages={state.messageLog} />
            <TravelView
              state={state}
              onAdvance={() => wrappedDispatch({ type: 'ADVANCE_DAY' })}
              onRest={() => wrappedDispatch({ type: 'REST' })}
              onTrade={() => wrappedDispatch({ type: 'ENTER_TRADING' })}
              onSetPace={(p) => wrappedDispatch({ type: 'SET_PACE', pace: p })}
              onSetRations={(r) => wrappedDispatch({ type: 'SET_RATIONS', rations: r })}
              onHunt={() => wrappedDispatch({ type: 'START_HUNTING' })}
              showParty={showParty}
              onToggleParty={() => setShowParty(!showParty)}
            />
          </>
        )}
      </div>

      {/* EVENT DIALOG */}
      {state.phase === 'event' && (
        <EventDialog
          event={state.currentEvent}
          selectedChoice={state.selectedChoice}
          mode={state.mode}
          onChoice={(id) => wrappedDispatch({ type: 'HANDLE_CHOICE', choiceId: id })}
          onDismiss={() => wrappedDispatch({ type: 'DISMISS_EVENT' })}
        />
      )}

      {/* ENCOUNTER DIALOG */}
      {state.phase === 'encounter' && (
        <EncounterDialog
          encounter={state.currentEncounter}
          selectedChoice={state.selectedEncounterChoice}
          onChoice={(id) => wrappedDispatch({ type: 'ENCOUNTER_CHOICE', choiceId: id })}
          onDismiss={() => wrappedDispatch({ type: 'DISMISS_ENCOUNTER' })}
        />
      )}
    </div>
  )
}
