'use client'

import { GameEvent, EventChoice, GameMode } from '@/lib/game/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface EventDialogProps {
  event: GameEvent | null
  selectedChoice: EventChoice | null
  onChoice: (choiceId: string) => void
  onDismiss: () => void
  mode?: GameMode
}

const categoryIcon: Record<string, string> = {
  disease: '🤒',
  breakdown: '🔧',
  weather: '📉',
  theft: '🏴‍☠️',
  trail: '🛤️',
  positive: '✨',
  choice: '🤔',
}

export function EventDialog({ event, selectedChoice, onChoice, onDismiss, mode }: EventDialogProps) {
  if (!event) return null

  const title = (mode === 'veteran' && event.veteranTitle) || event.title
  const description = (mode === 'veteran' && event.veteranDescription) || event.description

  return (
    <Modal open={true} title={`${categoryIcon[event.category]} ${title}`}>
      <p className="text-sm text-sol-text leading-relaxed mb-4">
        {description}
      </p>

      {/* Newcomer learn box */}
      {mode === 'newcomer' && event.newcomerLearn && !selectedChoice && (
        <div className="mb-4 p-3 rounded-lg border border-sol-blue/30 bg-sol-blue/5">
          <div className="flex items-start gap-2">
            <span className="text-sm flex-shrink-0">💡</span>
            <p className="text-[11px] text-sol-blue leading-relaxed">
              {event.newcomerLearn}
            </p>
          </div>
        </div>
      )}

      {!selectedChoice ? (
        <div className="space-y-3">
          {event.choices.map((choice) => (
            <Button
              key={choice.id}
              variant={['disease', 'breakdown', 'weather', 'theft', 'trail'].includes(event.category) ? 'danger' : 'primary'}
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
