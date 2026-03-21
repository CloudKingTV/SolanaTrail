'use client'

import { useEffect, useRef } from 'react'
import { MessageEntry } from '@/lib/game/types'

interface MessageLogProps {
  messages: MessageEntry[]
}

const typeConfig: Record<MessageEntry['type'], { color: string; prefix: string }> = {
  info: { color: 'text-sol-text/90', prefix: '' },
  success: { color: 'text-sol-green', prefix: '+ ' },
  warning: { color: 'text-warning', prefix: '! ' },
  danger: { color: 'text-danger', prefix: '!! ' },
  system: { color: 'text-sol-purple', prefix: '' },
  guide: { color: 'text-sol-blue', prefix: '' },
}

export function MessageLog({ messages }: MessageLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const recentMessages = messages.slice(-25)

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-0.5 min-h-0">
      {recentMessages.map((msg, i) => {
        const cfg = typeConfig[msg.type]
        const isLatest = i === recentMessages.length - 1
        return (
          <div
            key={msg.id}
            className={`text-xs leading-relaxed py-0.5 ${cfg.color} ${isLatest ? 'animate-fade-in' : ''} ${
              msg.type === 'guide' ? 'pl-2 border-l-2 border-sol-blue/30' : ''
            }`}
          >
            <span className="text-sol-muted/40 text-[9px] font-mono mr-1">{msg.day}</span>
            {cfg.prefix}{msg.text}
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
