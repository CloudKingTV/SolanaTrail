'use client'

import { useState, useRef, useEffect } from 'react'

interface NameEntryModalProps {
  score: number
  onSubmit: (name: string) => void
  onCancel: () => void
}

export function NameEntryModal({ score, onSubmit, onCancel }: NameEntryModalProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const trimmed = name.trim().toUpperCase()
    if (trimmed.length === 0) return
    onSubmit(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="w-full max-w-xs rounded-xl border-2 border-sol-green/50 bg-sol-darker p-6 space-y-6 text-center">
        {/* Title */}
        <div className="space-y-2">
          <div className="text-3xl">🏆</div>
          <h2 className="font-pixel text-sm text-sol-green glow-green">
            ENTER YOUR NAME
          </h2>
          <p className="text-[10px] text-sol-muted">
            Your score will be posted to the leaderboard
          </p>
        </div>

        {/* Score Display */}
        <div className="p-3 rounded-lg bg-sol-card border border-sol-green/20">
          <div className="text-[10px] text-sol-muted">SCORE</div>
          <div className="font-pixel text-xl text-sol-green glow-green">{score}</div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            maxLength={10}
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9 _-]/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
            placeholder="AAA"
            className="w-full text-center font-pixel text-lg text-sol-green bg-sol-darker border-2 border-sol-green/40 rounded-lg px-4 py-3 focus:outline-none focus:border-sol-green placeholder:text-sol-green/20 uppercase tracking-widest"
          />
          <div className="text-[10px] text-sol-muted">
            {name.length}/10 characters
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleSubmit}
            disabled={name.trim().length === 0}
            className="w-full min-h-[48px] px-6 py-3 rounded-lg border-2 border-sol-green bg-sol-green/20 text-sol-green font-pixel text-xs hover:bg-sol-green/30 active:bg-sol-green/40 transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed"
          >
            SUBMIT SCORE
          </button>
          <button
            onClick={onCancel}
            className="w-full min-h-[40px] px-4 py-2 rounded-lg border border-sol-border text-sol-muted text-xs hover:bg-sol-card transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
