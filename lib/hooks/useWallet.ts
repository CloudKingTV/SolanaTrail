'use client'

// Simple wallet state hook that works with or without Privy
// When Privy isn't configured, the game runs in standalone mode

import { usePrivy } from '@privy-io/react-auth'

export function useWallet() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { ready, authenticated, user, login, logout } = usePrivy()

    const walletAddress = user?.wallet?.address || null

    return {
      walletAddress,
      isConnected: authenticated && !!walletAddress,
      isPrivyAvailable: true,
      ready,
      login,
      logout: () => { logout() },
    }
  } catch {
    // Privy not available (no provider in tree)
    return {
      walletAddress: null as string | null,
      isConnected: false,
      isPrivyAvailable: false,
      ready: true,
      login: () => {},
      logout: () => {},
    }
  }
}
