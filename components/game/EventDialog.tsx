'use client'

import { GameEvent, EventChoice } from '@/lib/game/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface EventDialogProps {
  event: GameEvent | null
  selectedChoice: EventChoice | null
  onChoice: (choiceId: string) => void
  onDismiss: () => void
}

const categoryIcon: Record<string, string> = {
  positive: '✨',
  negative: '⚠️',
  neutral: 'ℹ️',
  choice: '🤔',
}

export function EventDialog({ event, selectedChoice, onChoice, onDismiss }: EventDialogProps) {
  if (!event) return null

  return (
    <Modal open={true} title={`${categoryIcon[event.category]} ${event.title}`}>
      <p className="text-sm text-sol-text leading-relaxed mb-6">
        {event.description}
      </p>

      {!selectedChoice ? (
        <div className="space-y-3">
          {event.choices.map((choice) => (
            <Button
              key={choice.id}
              variant={event.category === 'negative' ? 'danger' : 'primary'}
              fullWidth
              onClick={() => onChoice(choice.id)}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-sol-darker border border-sol-border">
            <p className="text-sm text-sol-text leading-relaxed">
              {selectedChoice.outcome.description}
            </p>
          </div>
          <Button variant="secondary" fullWidth onClick={onDismiss}>
            Continue
          </Button>
        </div>
      )}
    </Modal>
  )
}
