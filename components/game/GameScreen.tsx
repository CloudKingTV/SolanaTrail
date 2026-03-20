'use client'

import { useReducer, useState, useCallback } from 'react'
import { gameReducer, createInitialState } from '@/lib/game/engine'
import { Pace, Resources } from '@/lib/game/types'
import { StatusBar } from './StatusBar'
import { MessageLog } from './MessageLog'
import { TravelView } from './TravelView'
import { EventDialog } from './EventDialog'
import { TradingPost } from './TradingPost'
import { PartyStatus } from './PartyStatus'
import { GameOver } from './GameOver'

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

  const handleStart = useCallback(() => {
    dispatch({ type: 'START_GAME', walletAddress })
  }, [walletAddress])

  const handleAdvance = useCallback(() => {
    dispatch({ type: 'ADVANCE_DAY' })
  }, [])

  const handleSetPace = useCallback((pace: Pace) => {
    dispatch({ type: 'SET_PACE', pace })
  }, [])

  const handleChoice = useCallback((choiceId: string) => {
    dispatch({ type: 'HANDLE_CHOICE', choiceId })
  }, [])

  const handleDismissEvent = useCallback(() => {
    dispatch({ type: 'DISMISS_EVENT' })
  }, [])

  const handleTrade = useCallback(() => {
    dispatch({ type: 'ENTER_TRADING' })
  }, [])

  const handleBuy = useCallback((item: keyof Resources, quantity: number) => {
    dispatch({ type: 'BUY_ITEM', item, quantity })
  }, [])

  const handleLeaveTrade = useCallback(() => {
    dispatch({ type: 'LEAVE_TRADING' })
  }, [])

  const handleRest = useCallback(() => {
    dispatch({ type: 'REST' })
  }, [])

  const handlePlayAgain = useCallback(() => {
    dispatch({ type: 'START_GAME', walletAddress })
  }, [walletAddress])

  const handleMintNFT = useCallback(async () => {
    if (!onMintNFT) return
    setIsMinting(true)
    try {
      await onMintNFT()
    } catch {
      // handled by parent
    } finally {
      setIsMinting(false)
    }
  }, [onMintNFT])

  const handleSubmitScore = useCallback(async () => {
    if (!onSubmitScore || !walletAddress) return
    setIsSubmitting(true)
    try {
      await onSubmitScore(state.score, walletAddress)
    } catch {
      // handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmitScore, walletAddress, state.score])

  // Title screen
  if (state.phase === 'title') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-8">
        <div className="space-y-4">
          <div className="text-6xl">◎</div>
          <h1 className="font-pixel text-xl text-sol-green glow-green leading-relaxed">
            SOLANA
            <br />
            TRAIL
          </h1>
          <p className="text-sm text-sol-muted max-w-xs">
            Journey from Genesis Block to Mainnet Launch.
            <br />
            Manage your SOL, validators, and party to survive the crypto wilderness.
          </p>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={handleStart}
            className="w-full min-h-[56px] px-8 py-4 rounded-xl border-2 border-sol-green bg-sol-green/10 text-sol-green font-pixel text-sm hover:bg-sol-green/20 active:bg-sol-green/30 transition-all btn-press"
          >
            START TRAIL
          </button>

          {walletAddress && (
            <div className="text-[10px] text-sol-muted">
              Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </div>
          )}
        </div>

        <div className="text-[10px] text-sol-muted space-y-1">
          <p>Powered by Solana Devnet</p>
          <p className="text-sol-purple">◎ SOL · ⬡ Validators · ⚡ Bandwidth · ♥ Morale</p>
        </div>
      </div>
    )
  }

  // Game over / victory
  if (state.phase === 'gameOver' || state.phase === 'victory') {
    return (
      <GameOver
        state={state}
        onPlayAgain={handlePlayAgain}
        onMintNFT={walletAddress ? handleMintNFT : undefined}
        onSubmitScore={walletAddress ? handleSubmitScore : undefined}
        isMinting={isMinting}
        isSubmitting={isSubmitting}
      />
    )
  }

  // Main game view
  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto">
      {/* Status bar */}
      <StatusBar
        resources={state.resources}
        day={state.day}
        distance={state.distanceTraveled}
        totalDistance={state.totalDistance}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {state.phase === 'trading' && state.currentLocation ? (
          <TradingPost
            location={state.currentLocation}
            resources={state.resources}
            onBuy={handleBuy}
            onLeave={handleLeaveTrade}
          />
        ) : showParty ? (
          <div className="p-4">
            <PartyStatus party={state.party} />
            <button
              onClick={() => setShowParty(false)}
              className="w-full mt-4 text-xs text-sol-muted hover:text-sol-text py-2"
            >
              ← Back to Trail
            </button>
          </div>
        ) : (
          <>
            {/* Message log takes flexible space */}
            <MessageLog messages={state.messageLog} />

            {/* Travel controls */}
            <TravelView
              state={state}
              onAdvance={handleAdvance}
              onRest={handleRest}
              onTrade={handleTrade}
              onSetPace={handleSetPace}
              showParty={showParty}
              onToggleParty={() => setShowParty(!showParty)}
            />
          </>
        )}
      </div>

      {/* Event dialog overlay */}
      <EventDialog
        event={state.currentEvent}
        selectedChoice={state.selectedChoice}
        onChoice={handleChoice}
        onDismiss={handleDismissEvent}
      />
    </div>
  )
}
