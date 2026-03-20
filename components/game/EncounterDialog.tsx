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
      <p className="text-sm text-sol-text leading-relaxed mb-2">
        {encounter.description}
      </p>

      {/* NPC dialogue */}
      <div className="mb-4 p-3 rounded-lg border border-sol-purple/30 bg-sol-purple/5">
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">{encounter.icon}</span>
          <p className="text-xs text-sol-purple italic leading-relaxed">
            {encounter.dialogue}
          </p>
        </div>
      </div>

      {!selectedChoice ? (
        <div className="space-y-2">
          {encounter.choices.map((choice) => (
            <Button
              key={choice.id}
              variant="primary"
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
