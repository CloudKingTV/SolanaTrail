import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solana Trail — Navigate the Crypto Ecosystem',
  description: 'Journey from Genesis Block to Mainnet Launch. A crypto-themed Oregon Trail on Solana — learn DeFi, dodge rugs, and survive the blockchain wilderness.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Solana Trail',
    description: 'Navigate 2,000 blocks through the Solana ecosystem. Dodge rug pulls, bridge tokens, farm airdrops, and get your crew to Mainnet alive.',
    type: 'website',
    siteName: 'Solana Trail',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solana Trail',
    description: 'Oregon Trail meets Solana. Navigate the crypto ecosystem, survive rug pulls, and reach Mainnet Launch.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-sol-darker text-sol-text antialiased">
        <Providers>
          <main className="max-w-md mx-auto min-h-[100dvh] bg-sol-dark relative scanlines">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
