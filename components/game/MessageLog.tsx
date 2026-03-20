'use client'

import { useEffect, useRef } from 'react'
import { MessageEntry } from '@/lib/game/types'

interface MessageLogProps {
  messages: MessageEntry[]
}

const typeColors: Record<MessageEntry['type'], string> = {
  info: 'text-sol-text',
  success: 'text-sol-green',
  warning: 'text-warning',
  danger: 'text-danger',
  system: 'text-sol-purple',
}

export function MessageLog({ messages }: MessageLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const recentMessages = messages.slice(-20)

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
      {recentMessages.map((msg) => (
        <div key={msg.id} className={`text-xs leading-relaxed ${typeColors[msg.type]}`}>
          <span className="text-sol-muted opacity-50">[{msg.day}] </span>
          {msg.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
