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

const categoryConfig: Record<string, { icon: string; accent: string }> = {
  disease: { icon: '🤒', accent: 'border-danger/30' },
  breakdown: { icon: '🔧', accent: 'border-warning/30' },
  weather: { icon: '📉', accent: 'border-sol-blue/30' },
  theft: { icon: '🏴‍☠️', accent: 'border-danger/30' },
  trail: { icon: '🛤️', accent: 'border-sol-border' },
  positive: { icon: '✨', accent: 'border-sol-green/30' },
  choice: { icon: '🤔', accent: 'border-sol-purple/30' },
}

export function EventDialog({ event, selectedChoice, onChoice, onDismiss, mode }: EventDialogProps) {
  if (!event) return null

  const title = (mode === 'veteran' && event.veteranTitle) || event.title
  const description = (mode === 'veteran' && event.veteranDescription) || event.description
  const cfg = categoryConfig[event.category] || categoryConfig.trail
  const isDanger = ['disease', 'breakdown', 'weather', 'theft', 'trail'].includes(event.category)

  return (
    <Modal open={true} title={`${cfg.icon} ${title}`}>
      <p className="text-sm text-sol-text leading-relaxed mb-4">
        {description}
      </p>

      {/* Newcomer learn box */}
      {mode === 'newcomer' && event.newcomerLearn && !selectedChoice && (
        <div className="mb-4 p-2.5 rounded-lg border border-sol-blue/30 bg-sol-blue/5">
          <div className="flex items-start gap-2">
            <span className="text-sm flex-shrink-0">💡</span>
            <p className="text-[11px] text-sol-blue leading-relaxed">
              {event.newcomerLearn}
            </p>
          </div>
        </div>
      )}

      {!selectedChoice ? (
        <div className="space-y-2">
          {event.choices.map((choice, i) => (
            <Button
              key={choice.id}
              variant={isDanger ? 'danger' : i === 0 ? 'primary' : 'secondary'}
              fullWidth
              onClick={() => onChoice(choice.id)}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <div className={`p-3 rounded-lg bg-sol-darker border ${cfg.accent}`}>
            <p className="text-sm text-sol-text leading-relaxed">
              {selectedChoice.outcome.description}
            </p>
            {selectedChoice.outcome.inventoryChanges && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(selectedChoice.outcome.inventoryChanges).map(([key, val]) => (
                  val !== 0 && (
                    <span key={key} className={`text-[10px] px-1.5 py-0.5 rounded ${
                      (val as number) > 0 ? 'bg-sol-green/10 text-sol-green' : 'bg-danger/10 text-danger'
                    }`}>
                      {(val as number) > 0 ? '+' : ''}{val} {key}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
          <Button variant="primary" fullWidth onClick={onDismiss}>
            Continue →
          </Button>
        </div>
      )}
    </Modal>
  )
}
