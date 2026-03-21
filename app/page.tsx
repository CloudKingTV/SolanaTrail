'use client'

import { useCallback } from 'react'
import { GameScreen } from '@/components/game/GameScreen'
import { submitScore } from '@/lib/solana/leaderboard'
import { mintCompletionNFT } from '@/lib/solana/nft'
import { useWallet } from '@/lib/hooks/useWallet'

export default function HomePage() {
  const { walletAddress } = useWallet()

  const handleSubmitScore = useCallback(
    async (score: number, wallet: string) => {
      submitScore({
        playerName: wallet.slice(0, 6),
        walletAddress: wallet,
        score,
        day: 0,
        distanceTraveled: 0,
        survived: 0,
        totalParty: 5,
        victory: score > 1000,
        timestamp: Date.now(),
      })
    },
    []
  )

  const handleMintNFT = useCallback(async () => {
    if (!walletAddress) return
    await mintCompletionNFT(walletAddress, {
      playerName: walletAddress.slice(0, 8),
      score: 0,
      days: 0,
      survivors: 0,
      totalParty: 5,
    })
  }, [walletAddress])

  return (
    <GameScreen
      walletAddress={walletAddress || undefined}
      onSubmitScore={handleSubmitScore}
      onMintNFT={handleMintNFT}
    />
  )
}
