'use client'

import { Button } from '@/components/ui/Button'

interface ConnectButtonProps {
  walletAddress?: string | null
  onConnect?: () => void
  onDisconnect?: () => void
  ready?: boolean
}

export function ConnectButton({
  walletAddress,
  onConnect,
  onDisconnect,
  ready = true,
}: ConnectButtonProps) {
  if (!ready) {
    return (
      <Button variant="ghost" disabled>
        Loading...
      </Button>
    )
  }

  if (walletAddress) {
    return (
      <button
        onClick={onDisconnect}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sol-card border border-sol-border text-xs hover:bg-sol-darker transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-sol-green animate-pulse" />
        <span className="text-sol-text">
          {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </span>
      </button>
    )
  }

  return (
    <Button variant="primary" onClick={onConnect}>
      Connect Wallet
    </Button>
  )
}
