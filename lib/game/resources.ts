import { Resources, Pace } from './types'

export const STARTING_RESOURCES: Resources = {
  sol: 100,
  validators: 5,
  bandwidth: 100,
  morale: 80,
}

const DAILY_CONSUMPTION: Record<Pace, Partial<Resources>> = {
  slow: { bandwidth: -2, morale: -1 },
  steady: { bandwidth: -3, morale: -1 },
  reckless: { bandwidth: -5, morale: -2 },
}

const TRAVEL_SPEED: Record<Pace, number> = {
  slow: 15,
  steady: 25,
  reckless: 40,
}

export function getDailyConsumption(pace: Pace): Partial<Resources> {
  return DAILY_CONSUMPTION[pace]
}

export function getTravelSpeed(pace: Pace, validators: number): number {
  const base = TRAVEL_SPEED[pace]
  // Fewer validators = slower (network performance)
  const validatorBonus = Math.min(validators / 5, 1)
  return Math.round(base * (0.5 + 0.5 * validatorBonus))
}

export function applyResourceChanges(
  current: Resources,
  changes: Partial<Resources>
): Resources {
  return {
    sol: Math.max(0, Math.round((current.sol + (changes.sol || 0)) * 100) / 100),
    validators: Math.max(0, current.validators + (changes.validators || 0)),
    bandwidth: Math.max(0, current.bandwidth + (changes.bandwidth || 0)),
    morale: Math.max(0, Math.min(100, current.morale + (changes.morale || 0))),
  }
}

export function canAfford(resources: Resources, cost: number): boolean {
  return resources.sol >= cost
}
