'use client'

import { ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''

export function Providers({ children }: { children: ReactNode }) {
  // If no Privy App ID configured, render without Privy
  if (!PRIVY_APP_ID || PRIVY_APP_ID === 'your-privy-app-id-here') {
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#14F195',
          walletChainType: 'solana-only',
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'all-users',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
