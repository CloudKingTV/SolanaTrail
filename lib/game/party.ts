import { PartyMember, PartyStatus, Pace, Rations, TeamType, BUILDER_ROLES, EXPLORER_ROLES } from './types'

export function createParty(names: string[], teamType?: TeamType): PartyMember[] {
  const roles = teamType === 'builders' ? BUILDER_ROLES : teamType === 'explorers' ? EXPLORER_ROLES : undefined
  return names.map((name, i) => ({
    name,
    health: 100,
    status: 'healthy' as PartyStatus,
    isLeader: i === 0,
    role: roles ? roles[i] || undefined : undefined,
  }))
}

export const DEFAULT_NAMES_BUILDERS = ['toly', 'Ansem', 'Bonk Dog', 'GigaBrain', 'Ser Cope']
export const DEFAULT_NAMES_EXPLORERS = ['toly', 'Ansem', 'Bonk Dog', 'GigaBrain', 'Ser Cope']
export const DEFAULT_NAMES = DEFAULT_NAMES_BUILDERS

export function updatePartyHealth(
  party: PartyMember[],
  pace: Pace,
  rations: Rations,
  clothing: number,
  weather: string
): PartyMember[] {
  return party.map((member) => {
    if (member.status === 'dead') return member

    let healthChange = 0

    // Pace effect on health
    if (pace === 'grueling') healthChange -= 3
    else if (pace === 'strenuous') healthChange -= 1

    // Rations effect on health
    if (rations === 'bare_bones') healthChange -= 2
    else if (rations === 'meager') healthChange -= 1
    else if (rations === 'filling') healthChange += 1

    // VPN effect (bear market + low VPNs = bad — exploits and scams increase)
    const aliveCount = party.filter((m) => m.status !== 'dead').length
    if (clothing < aliveCount && (weather === 'bear' || weather === 'winter')) {
      healthChange -= 2
    }

    // Status effects
    if (member.status === 'sick') healthChange -= 4
    if (member.status === 'injured') healthChange -= 3
    if (member.status === 'exhausted') healthChange -= 2
    if (member.status === 'rugged') healthChange -= 5

    const newHealth = Math.max(0, Math.min(100, member.health + healthChange))

    // Die at 0
    if (newHealth <= 0) {
      return { ...member, health: 0, status: 'dead' as const }
    }

    // Chance to recover (15% if health > 50)
    if (member.status !== 'healthy' && newHealth > 50 && Math.random() < 0.15) {
      return { ...member, health: newHealth, status: 'healthy' as const }
    }

    return { ...member, health: newHealth }
  })
}

export function applyPartyEffect(
  party: PartyMember[],
  effect: { type: 'damage' | 'heal' | 'status'; value: number; status?: PartyStatus; target: 'random' | 'all' | 'leader' }
): { party: PartyMember[]; affectedName: string | null } {
  const alive = party.filter((m) => m.status !== 'dead')
  if (alive.length === 0) return { party, affectedName: null }

  let targetName: string | null = null

  if (effect.target === 'leader') {
    const leader = party.find((m) => m.isLeader && m.status !== 'dead')
    if (leader) targetName = leader.name
    else targetName = alive[0].name
  } else if (effect.target === 'random') {
    targetName = alive[Math.floor(Math.random() * alive.length)].name
  }

  const updatedParty = party.map((member) => {
    if (member.status === 'dead') return member
    if (effect.target !== 'all' && member.name !== targetName) return member

    if (effect.type === 'heal') {
      return {
        ...member,
        health: Math.min(100, member.health + effect.value),
        status: member.health + effect.value > 30 ? ('healthy' as const) : member.status,
      }
    }
    if (effect.type === 'damage') {
      const hp = Math.max(0, member.health - effect.value)
      return { ...member, health: hp, status: hp <= 0 ? ('dead' as const) : member.status }
    }
    if (effect.type === 'status' && effect.status) {
      return { ...member, status: effect.status }
    }
    return member
  })

  return { party: updatedParty, affectedName: targetName }
}

export function getAliveCount(party: PartyMember[]): number {
  return party.filter((m) => m.status !== 'dead').length
}

export function getOverallHealth(party: PartyMember[]): 'good' | 'fair' | 'poor' | 'very_poor' {
  const alive = party.filter((m) => m.status !== 'dead')
  if (alive.length === 0) return 'very_poor'

  const avgHealth = alive.reduce((sum, m) => sum + m.health, 0) / alive.length
  const sickCount = alive.filter((m) => m.status !== 'healthy').length

  if (avgHealth >= 70 && sickCount === 0) return 'good'
  if (avgHealth >= 50) return 'fair'
  if (avgHealth >= 25) return 'poor'
  return 'very_poor'
}
