'use client'

import { useReducer, useState, useCallback } from 'react'
import { gameReducer, createInitialState, calculateScore } from '@/lib/game/engine'
import { Pace, Rations, Inventory, PROFESSIONS } from '@/lib/game/types'
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

  // ==================== TITLE SCREEN ====================
  if (state.phase === 'title') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 text-center space-y-8">
        <div className="space-y-4">
          <div className="text-6xl">◎</div>
          <h1 className="font-pixel text-xl text-sol-green glow-green leading-relaxed">
            SOLANA<br />TRAIL
          </h1>
          <p className="text-sm text-sol-muted max-w-xs leading-relaxed">
            The year is 2024. Your party of 5 must travel from Genesis Block
            to Mainnet Launch — 2,000 blocks through the crypto wilderness.
          </p>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => dispatch({ type: 'SELECT_PROFESSION', profession: PROFESSIONS[0] })}
            className="w-full min-h-[56px] px-8 py-4 rounded-xl border-2 border-sol-green bg-sol-green/10 text-sol-green font-pixel text-xs hover:bg-sol-green/20 active:bg-sol-green/30 transition-all btn-press"
          >
            START TRAIL
          </button>
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

  // ==================== PROFESSION SELECT ====================
  if (state.phase === 'profession_select') {
    return <ProfessionSelect onSelect={(p) => dispatch({ type: 'SELECT_PROFESSION', profession: p })} />
  }

  // ==================== PARTY NAMING ====================
  if (state.phase === 'party_naming') {
    return <PartyNaming onSubmit={(names) => dispatch({ type: 'SET_PARTY_NAMES', names })} />
  }

  // ==================== EPOCH SELECT ====================
  if (state.phase === 'epoch_select') {
    return <EpochSelect onSelect={(epoch) => dispatch({ type: 'SET_EPOCH', epoch })} />
  }

  // ==================== GENERAL STORE ====================
  if (state.phase === 'general_store') {
    return (
      <GeneralStore
        inventory={state.inventory}
        onBuy={(item, qty) => dispatch({ type: 'BUY_INITIAL', item, quantity: qty })}
        onLeave={() => dispatch({ type: 'START_TRAIL' })}
      />
    )
  }

  // ==================== GAME OVER / VICTORY ====================
  if (state.phase === 'gameOver' || state.phase === 'victory') {
    return (
      <GameOver
        state={state}
        onPlayAgain={() => dispatch({ type: 'PLAY_AGAIN' })}
        onMintNFT={walletAddress ? async () => {
          setIsMinting(true)
          try { await onMintNFT?.() } finally { setIsMinting(false) }
        } : undefined}
        onSubmitScore={walletAddress ? async () => {
          setIsSubmitting(true)
          try { await onSubmitScore?.(state.score, walletAddress!) } finally { setIsSubmitting(false) }
        } : undefined}
        isMinting={isMinting}
        isSubmitting={isSubmitting}
      />
    )
  }

  // ==================== MAIN GAME VIEW ====================
  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto">
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
            onChoice={(choice) => dispatch({ type: 'RIVER_CHOICE', choice })}
          />
        )}

        {/* LANDMARK / FORT */}
        {state.phase === 'landmark' && state.currentLocation && (
          <LandmarkView
            location={state.currentLocation}
            inventory={state.inventory}
            onContinue={() => dispatch({ type: 'CONTINUE_FROM_LANDMARK' })}
            onLookAround={() => dispatch({ type: 'LOOK_AROUND' })}
            onTalk={() => dispatch({ type: 'TALK_TO_PEOPLE' })}
            onTrade={() => dispatch({ type: 'ENTER_TRADING' })}
            onRest={() => dispatch({ type: 'REST' })}
            messages={state.messageLog}
          />
        )}

        {/* TRADING AT FORT */}
        {state.phase === 'trading' && state.currentLocation && (
          <TradingPost
            location={state.currentLocation}
            inventory={state.inventory}
            onBuy={(item, qty) => dispatch({ type: 'BUY_ITEM', item, quantity: qty })}
            onLeave={() => dispatch({ type: 'LEAVE_TRADING' })}
          />
        )}

        {/* HUNTING */}
        {state.phase === 'hunting' && (
          <HuntingView
            ammoRemaining={state.inventory.ammunition * 20 - state.huntingAmmoUsed}
            foodGained={state.huntingFoodGained}
            onShoot={(targetId) => dispatch({ type: 'HUNT_SHOOT', targetId })}
            onFinish={() => dispatch({ type: 'END_HUNTING' })}
            messages={state.messageLog}
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
              onAdvance={() => dispatch({ type: 'ADVANCE_DAY' })}
              onRest={() => dispatch({ type: 'REST' })}
              onTrade={() => dispatch({ type: 'ENTER_TRADING' })}
              onSetPace={(p) => dispatch({ type: 'SET_PACE', pace: p })}
              onSetRations={(r) => dispatch({ type: 'SET_RATIONS', rations: r })}
              onHunt={() => dispatch({ type: 'START_HUNTING' })}
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
          onChoice={(id) => dispatch({ type: 'HANDLE_CHOICE', choiceId: id })}
          onDismiss={() => dispatch({ type: 'DISMISS_EVENT' })}
        />
      )}
    </div>
  )
}
