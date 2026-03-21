'use client'

import { Encounter, EncounterChoice } from '@/lib/game/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface EncounterDialogProps {
  encounter: Encounter | null
  selectedChoice: EncounterChoice | null
  onChoice: (choiceId: string) => void
  onDismiss: () => void
}

export function EncounterDialog({ encounter, selectedChoice, onChoice, onDismiss }: EncounterDialogProps) {
  if (!encounter) return null

  return (
    <Modal open={true} title={`${encounter.icon} ${encounter.name}`}>
      <p className="text-sm text-sol-text leading-relaxed mb-3">
        {encounter.description}
      </p>

      {/* NPC dialogue — speech bubble style */}
      <div className="mb-4 p-3 rounded-lg border border-sol-purple/30 bg-sol-purple/5 relative">
        <div className="flex items-start gap-2.5">
          <span className="text-2xl flex-shrink-0 mt-0.5">{encounter.icon}</span>
          <div>
            <p className="text-xs text-sol-purple italic leading-relaxed">
              &ldquo;{encounter.dialogue}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {!selectedChoice ? (
        <div className="space-y-2">
          {encounter.choices.map((choice, i) => (
            <Button
              key={choice.id}
              variant={i === 0 ? 'primary' : 'secondary'}
              fullWidth
              onClick={() => onChoice(choice.id)}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          <div className="p-3 rounded-lg bg-sol-darker border border-sol-purple/20">
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
