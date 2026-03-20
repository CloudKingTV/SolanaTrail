'use client'

import { useState } from 'react'
import { DEFAULT_NAMES } from '@/lib/game/party'
import { Button } from '@/components/ui/Button'

interface PartyNamingProps {
  onSubmit: (names: string[]) => void
}

const LABELS = [
  'Party Leader (you)',
  'Party Member 2',
  'Party Member 3',
  'Party Member 4',
  'Party Member 5',
]

export function PartyNaming({ onSubmit }: PartyNamingProps) {
  const [names, setNames] = useState<string[]>([...DEFAULT_NAMES])

  const handleChange = (index: number, value: string) => {
    const updated = [...names]
    updated[index] = value
    setNames(updated)
  }

  const handleSubmit = () => {
    const finalNames = names.map((n, i) => n.trim() || DEFAULT_NAMES[i])
    onSubmit(finalNames)
  }

  return (
    <div className="flex flex-col min-h-[100dvh] p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-pixel text-sm text-sol-green glow-green">
          NAME YOUR PARTY
        </h1>
        <p className="text-xs text-sol-muted leading-relaxed">
          What are the names of the five members in your party?
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {LABELS.map((label, i) => (
          <div key={i}>
            <label className="text-[10px] text-sol-muted mb-1 block">
              {label}
            </label>
            <input
              type="text"
              value={names[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={DEFAULT_NAMES[i]}
              maxLength={20}
              className="w-full px-4 py-3 bg-sol-darker border border-sol-border rounded-lg text-sm text-sol-text focus:border-sol-green focus:outline-none placeholder:text-sol-muted/50"
            />
          </div>
        ))}
      </div>

      <Button variant="primary" fullWidth onClick={handleSubmit}>
        Continue
      </Button>
    </div>
  )
}
