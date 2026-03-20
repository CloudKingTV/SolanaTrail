'use client'

import { useState } from 'react'
import { TokenPrice, MessageEntry } from '@/lib/game/types'
import { Button } from '@/components/ui/Button'
import { MessageLog } from './MessageLog'

interface TokenTradingViewProps {
  tokenPrices: TokenPrice[]
  holdings: Record<string, number>
  sol: number
  roundsLeft: number
  onBuy: (tokenName: string, amount: number) => void
  onSell: (tokenName: string, amount: number) => void
  onAdvanceMarket: () => void
  onLeave: () => void
  messages: MessageEntry[]
}

function MiniChart({ history }: { history: number[] }) {
  if (history.length < 2) return null
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  const h = 24
  const w = 60
  const step = w / (history.length - 1)

  const points = history.map((v, i) => {
    const x = i * step
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')

  const isUp = history[history.length - 1] >= history[0]

  return (
    <svg width={w} height={h} className="inline-block ml-2">
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? '#14F195' : '#FF6B6B'}
        strokeWidth="1.5"
      />
    </svg>
  )
}

export function TokenTradingView({
  tokenPrices, holdings, sol, roundsLeft,
  onBuy, onSell, onAdvanceMarket, onLeave, messages,
}: TokenTradingViewProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const marketClosed = roundsLeft <= 0

  // Calculate total holdings value
  const holdingsValue = Object.entries(holdings).reduce((sum, [name, qty]) => {
    const token = tokenPrices.find(t => t.name === name)
    return sum + (token ? token.price * qty : 0)
  }, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sol-border text-center space-y-2">
        <h2 className="font-pixel text-xs text-sol-green glow-green">
          TOKEN EXCHANGE
        </h2>
        <div className="flex justify-center gap-4 text-xs">
          <div>
            <span className="text-sol-muted">SOL: </span>
            <span className="text-sol-green">◎ {sol.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-sol-muted">Holdings: </span>
            <span className="text-sol-purple">◎ {holdingsValue.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-sol-muted">Rounds: </span>
            <span className={roundsLeft <= 2 ? 'text-danger' : 'text-sol-text'}>
              {roundsLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Token list */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        {tokenPrices.map((token) => {
          const held = holdings[token.name] || 0
          const prevPrice = token.history.length > 1 ? token.history[token.history.length - 2] : token.price
          const pctChange = ((token.price - prevPrice) / prevPrice * 100)
          const isSelected = selectedToken === token.name

          return (
            <div key={token.name} className="rounded-lg border border-sol-border bg-sol-card">
              <button
                onClick={() => setSelectedToken(isSelected ? null : token.name)}
                className="w-full p-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{token.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-sol-text">{token.name}</div>
                      {held > 0 && (
                        <div className="text-[10px] text-sol-purple">Holding: {held}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex items-center">
                    <div>
                      <div className="text-sm font-bold text-sol-text">◎ {token.price.toFixed(2)}</div>
                      <div className={`text-[10px] ${pctChange >= 0 ? 'text-sol-green' : 'text-danger'}`}>
                        {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}%
                      </div>
                    </div>
                    <MiniChart history={token.history} />
                  </div>
                </div>
              </button>

              {/* Expanded trade panel */}
              {isSelected && !marketClosed && (
                <div className="px-3 pb-3 flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1 text-[10px] !min-h-[36px] !py-1"
                    onClick={() => onBuy(token.name, 1)}
                    disabled={sol < token.price}
                  >
                    Buy 1 (◎{token.price.toFixed(2)})
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1 text-[10px] !min-h-[36px] !py-1"
                    onClick={() => onSell(token.name, 1)}
                    disabled={held <= 0}
                  >
                    Sell 1
                  </Button>
                  {sol >= token.price * 5 && (
                    <Button
                      variant="secondary"
                      className="text-[10px] !min-h-[36px] !py-1 !px-2"
                      onClick={() => onBuy(token.name, 5)}
                    >
                      Buy 5
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2 border-t border-sol-border">
        {!marketClosed ? (
          <Button variant="primary" fullWidth onClick={onAdvanceMarket}>
            Next Round ({roundsLeft} left) →
          </Button>
        ) : (
          <div className="text-center text-xs text-danger mb-2">Market closed!</div>
        )}
        <Button variant="secondary" fullWidth onClick={onLeave}>
          {marketClosed ? 'Collect & Leave' : 'Cash Out & Leave'}
        </Button>
      </div>
    </div>
  )
}
