import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Solana Trail',
  description: 'Journey from Genesis Block to Mainnet Launch. A crypto-themed Oregon Trail on Solana.',
  icons: { icon: '/favicon.ico' },
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
