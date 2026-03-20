import { PartyMember, PartyRole } from './types'

const DEFAULT_NAMES: Record<PartyRole, string> = {
  'Developer': 'Satoshi',
  'Validator Operator': 'Anatoly',
  'NFT Artist': 'Beeple',
  'DeFi Degen': 'Do Kwon\'t',
  'Protocol Founder': 'Vitalik',
}

export function createDefaultParty(): PartyMember[] {
  return [
    { name: DEFAULT_NAMES['Protocol Founder'], role: 'Protocol Founder', health: 100, status: 'healthy' },
    { name: DEFAULT_NAMES['Developer'], role: 'Developer', health: 100, status: 'healthy' },
    { name: DEFAULT_NAMES['Validator Operator'], role: 'Validator Operator', health: 100, status: 'healthy' },
    { name: DEFAULT_NAMES['NFT Artist'], role: 'NFT Artist', health: 100, status: 'healthy' },
    { name: DEFAULT_NAMES['DeFi Degen'], role: 'DeFi Degen', health: 100, status: 'healthy' },
  ]
}

export function updatePartyHealth(party: PartyMember[], dailyDrain: number): PartyMember[] {
  return party.map((member) => {
    if (member.status === 'dead') return member

    let healthChange = -dailyDrain

    if (member.status === 'sick') healthChange -= 3
    if (member.status === 'injured') healthChange -= 2
    if (member.status === 'rugged') healthChange -= 5

    const newHealth = Math.max(0, Math.min(100, member.health + healthChange))
    const newStatus = newHealth <= 0 ? 'dead' : member.status

    // Chance to recover from non-healthy status
    const recovered =
      member.status !== 'healthy' &&
      newHealth > 50 &&
      Math.random() < 0.15

    return {
      ...member,
      health: newHealth,
      status: recovered ? 'healthy' : newStatus,
    }
  })
}

export function applyPartyEffect(
  party: PartyMember[],
  effect: { type: 'damage' | 'heal' | 'status'; value: number; status?: string; target: 'random' | 'all' }
): PartyMember[] {
  const alive = party.filter((m) => m.status !== 'dead')
  if (alive.length === 0) return party

  if (effect.target === 'all') {
    return party.map((member) => {
      if (member.status === 'dead') return member
      if (effect.type === 'heal') {
        return { ...member, health: Math.min(100, member.health + effect.value), status: 'healthy' as const }
      }
      if (effect.type === 'damage') {
        const hp = Math.max(0, member.health - effect.value)
        return { ...member, health: hp, status: hp <= 0 ? 'dead' as const : member.status }
      }
      if (effect.type === 'status' && effect.status) {
        return { ...member, status: effect.status as PartyMember['status'] }
      }
      return member
    })
  }

  // Random target
  const targetIndex = Math.floor(Math.random() * alive.length)
  const targetName = alive[targetIndex].name

  return party.map((member) => {
    if (member.name !== targetName) return member
    if (effect.type === 'heal') {
      return { ...member, health: Math.min(100, member.health + effect.value), status: 'healthy' as const }
    }
    if (effect.type === 'damage') {
      const hp = Math.max(0, member.health - effect.value)
      return { ...member, health: hp, status: hp <= 0 ? 'dead' as const : member.status }
    }
    if (effect.type === 'status' && effect.status) {
      return { ...member, status: effect.status as PartyMember['status'] }
    }
    return member
  })
}

export function getAliveCount(party: PartyMember[]): number {
  return party.filter((m) => m.status !== 'dead').length
}
