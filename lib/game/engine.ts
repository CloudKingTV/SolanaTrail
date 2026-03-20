import { GameState, GameAction, MessageEntry, Resources } from './types'
import { TOTAL_DISTANCE, getCurrentLocation, getNextLocation } from './locations'
import { getRandomEvent } from './events'
import { createDefaultParty, updatePartyHealth, applyPartyEffect, getAliveCount } from './party'
import { STARTING_RESOURCES, getDailyConsumption, getTravelSpeed, applyResourceChanges } from './resources'

let messageIdCounter = 0
function createMessage(text: string, type: MessageEntry['type'], day: number): MessageEntry {
  return { id: `msg-${++messageIdCounter}`, text, type, day }
}

export function createInitialState(): GameState {
  return {
    phase: 'title',
    day: 0,
    distanceTraveled: 0,
    totalDistance: TOTAL_DISTANCE,
    resources: { ...STARTING_RESOURCES },
    party: createDefaultParty(),
    pace: 'steady',
    currentLocation: null,
    nextLocation: null,
    currentEvent: null,
    selectedChoice: null,
    messageLog: [],
    score: 0,
    startTime: Date.now(),
  }
}

export function calculateScore(state: GameState): number {
  const alive = getAliveCount(state.party)
  const aliveBonus = alive * 200
  const solBonus = Math.round(state.resources.sol * 5)
  const speedBonus = Math.max(0, 200 - state.day) * 10
  const resourceBonus = state.resources.validators * 50 + state.resources.bandwidth * 2
  const completionBonus = state.phase === 'victory' ? 1000 : 0

  return aliveBonus + solBonus + speedBonus + resourceBonus + completionBonus
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const initial = createInitialState()
      const currentLocation = getCurrentLocation(0)
      const nextLocation = getNextLocation(0)
      return {
        ...initial,
        phase: 'traveling',
        day: 1,
        currentLocation,
        nextLocation,
        walletAddress: action.walletAddress,
        messageLog: [
          createMessage('Your party departs from Genesis Block. The road to Mainnet Launch is long...', 'system', 1),
          createMessage(`Party: ${initial.party.map((p) => `${p.name} the ${p.role}`).join(', ')}`, 'info', 1),
          createMessage('Tip: Change your pace to balance speed vs. resource usage.', 'info', 1),
        ],
      }
    }

    case 'SET_PACE': {
      return {
        ...state,
        pace: action.pace,
        messageLog: [
          ...state.messageLog,
          createMessage(`Pace set to ${action.pace}.`, 'info', state.day),
        ],
      }
    }

    case 'ADVANCE_DAY': {
      if (state.phase !== 'traveling') return state

      const newDay = state.day + 1
      const consumption = getDailyConsumption(state.pace)
      const speed = getTravelSpeed(state.pace, state.resources.validators)
      const newDistance = Math.min(state.totalDistance, state.distanceTraveled + speed)
      const newResources = applyResourceChanges(state.resources, consumption)
      const healthDrain = state.pace === 'reckless' ? 2 : state.pace === 'slow' ? 0 : 1
      const newParty = updatePartyHealth(state.party, healthDrain)
      const messages: MessageEntry[] = [...state.messageLog]

      messages.push(
        createMessage(`Day ${newDay} — Traveled ${speed} blocks.`, 'info', newDay)
      )

      // Check for deaths
      const prevAlive = getAliveCount(state.party)
      const nowAlive = getAliveCount(newParty)
      if (nowAlive < prevAlive) {
        const died = newParty.filter(
          (m, i) => m.status === 'dead' && state.party[i].status !== 'dead'
        )
        for (const d of died) {
          messages.push(
            createMessage(`${d.name} the ${d.role} has been lost to the blockchain...`, 'danger', newDay)
          )
        }
      }

      // Check for recovery
      for (let i = 0; i < newParty.length; i++) {
        if (state.party[i].status !== 'healthy' && state.party[i].status !== 'dead' && newParty[i].status === 'healthy') {
          messages.push(
            createMessage(`${newParty[i].name} has recovered!`, 'success', newDay)
          )
        }
      }

      // Check arrival at location
      const newLocation = getCurrentLocation(newDistance)
      const nextLocation = getNextLocation(newDistance)

      if (newLocation && newLocation.id !== state.currentLocation?.id) {
        messages.push(
          createMessage(`Arrived at ${newLocation.name}!`, 'success', newDay)
        )
        if (newLocation.type === 'trading_post') {
          messages.push(
            createMessage('A trading post! You can buy supplies here.', 'info', newDay)
          )
        }
        if (newLocation.type === 'rest_stop') {
          messages.push(
            createMessage('A good place to rest and recover.', 'info', newDay)
          )
        }
      }

      // Victory check
      if (newDistance >= state.totalDistance) {
        const finalState: GameState = {
          ...state,
          phase: 'victory',
          day: newDay,
          distanceTraveled: newDistance,
          resources: newResources,
          party: newParty,
          currentLocation: newLocation,
          nextLocation: null,
          messageLog: [
            ...messages,
            createMessage('🎉 YOU REACHED MAINNET LAUNCH! The protocol is live!', 'success', newDay),
          ],
        }
        return { ...finalState, score: calculateScore(finalState) }
      }

      // Game over checks
      if (nowAlive === 0) {
        const finalState: GameState = {
          ...state,
          phase: 'gameOver',
          day: newDay,
          distanceTraveled: newDistance,
          resources: newResources,
          party: newParty,
          messageLog: [
            ...messages,
            createMessage('All party members have been lost. The protocol never launched...', 'danger', newDay),
          ],
        }
        return { ...finalState, score: calculateScore(finalState) }
      }

      if (newResources.sol <= 0 && newResources.bandwidth <= 0) {
        const finalState: GameState = {
          ...state,
          phase: 'gameOver',
          day: newDay,
          distanceTraveled: newDistance,
          resources: newResources,
          party: newParty,
          messageLog: [
            ...messages,
            createMessage('Out of SOL and bandwidth. The network has halted...', 'danger', newDay),
          ],
        }
        return { ...finalState, score: calculateScore(finalState) }
      }

      // Random event chance (40% base, higher if reckless)
      const eventChance = state.pace === 'reckless' ? 0.55 : state.pace === 'slow' ? 0.25 : 0.40
      const triggerEvent = Math.random() < eventChance

      if (triggerEvent) {
        const event = getRandomEvent(newDay)
        return {
          ...state,
          phase: 'event',
          day: newDay,
          distanceTraveled: newDistance,
          resources: newResources,
          party: newParty,
          currentLocation: newLocation,
          nextLocation,
          currentEvent: event,
          selectedChoice: null,
          messageLog: messages,
        }
      }

      // Low resource warnings
      if (newResources.bandwidth < 20) {
        messages.push(createMessage('Warning: Bandwidth running low!', 'warning', newDay))
      }
      if (newResources.sol < 10) {
        messages.push(createMessage('Warning: SOL reserves critically low!', 'warning', newDay))
      }
      if (newResources.morale < 20) {
        messages.push(createMessage('Warning: Morale is dangerously low!', 'warning', newDay))
      }

      return {
        ...state,
        day: newDay,
        distanceTraveled: newDistance,
        resources: newResources,
        party: newParty,
        currentLocation: newLocation,
        nextLocation,
        messageLog: messages,
      }
    }

    case 'HANDLE_CHOICE': {
      if (!state.currentEvent) return state

      const choice = state.currentEvent.choices.find((c) => c.id === action.choiceId)
      if (!choice) return state

      let newResources = applyResourceChanges(state.resources, choice.outcome.resourceChanges)
      let newParty = [...state.party]
      const messages = [...state.messageLog]

      if (choice.outcome.partyEffect) {
        newParty = applyPartyEffect(newParty, choice.outcome.partyEffect)
      }

      if (choice.outcome.moraleMod) {
        newResources = applyResourceChanges(newResources, { morale: choice.outcome.moraleMod })
      }

      messages.push(createMessage(choice.outcome.description, 'info', state.day))

      // Show resource changes
      const changes = choice.outcome.resourceChanges
      const changeParts: string[] = []
      if (changes.sol) changeParts.push(`SOL ${changes.sol > 0 ? '+' : ''}${changes.sol}`)
      if (changes.validators) changeParts.push(`Validators ${changes.validators > 0 ? '+' : ''}${changes.validators}`)
      if (changes.bandwidth) changeParts.push(`Bandwidth ${changes.bandwidth > 0 ? '+' : ''}${changes.bandwidth}`)
      if (changes.morale) changeParts.push(`Morale ${changes.morale > 0 ? '+' : ''}${changes.morale}`)
      if (changeParts.length > 0) {
        messages.push(createMessage(changeParts.join(' | '), changes.sol && changes.sol > 0 ? 'success' : 'warning', state.day))
      }

      return {
        ...state,
        resources: newResources,
        party: newParty,
        selectedChoice: choice,
        messageLog: messages,
      }
    }

    case 'DISMISS_EVENT': {
      // Check for game over after event
      const alive = getAliveCount(state.party)
      if (alive === 0) {
        return {
          ...state,
          phase: 'gameOver',
          currentEvent: null,
          selectedChoice: null,
          score: calculateScore(state),
          messageLog: [
            ...state.messageLog,
            createMessage('All party members have been lost...', 'danger', state.day),
          ],
        }
      }

      return {
        ...state,
        phase: 'traveling',
        currentEvent: null,
        selectedChoice: null,
      }
    }

    case 'ENTER_TRADING': {
      if (!state.currentLocation?.trading) return state
      return { ...state, phase: 'trading' }
    }

    case 'BUY_ITEM': {
      if (!state.currentLocation?.trading) return state
      const shop = state.currentLocation.trading
      const itemShop = shop[action.item as keyof typeof shop]
      if (!itemShop || itemShop.stock < action.quantity) return state

      const cost = itemShop.price * action.quantity
      if (state.resources.sol < cost) return state

      const resourceChange: Partial<Resources> = {
        sol: -cost,
        [action.item]: action.quantity,
      }

      const newResources = applyResourceChanges(state.resources, resourceChange)
      const newTrading = {
        ...shop,
        [action.item]: { ...itemShop, stock: itemShop.stock - action.quantity },
      }

      return {
        ...state,
        resources: newResources,
        currentLocation: { ...state.currentLocation, trading: newTrading },
        messageLog: [
          ...state.messageLog,
          createMessage(
            `Bought ${action.quantity} ${action.item} for ${cost} SOL`,
            'success',
            state.day
          ),
        ],
      }
    }

    case 'LEAVE_TRADING': {
      return { ...state, phase: 'traveling' }
    }

    case 'REST': {
      const healAmount = 10
      const newParty = state.party.map((m) => {
        if (m.status === 'dead') return m
        const newHealth = Math.min(100, m.health + healAmount)
        return {
          ...m,
          health: newHealth,
          status: newHealth > 30 ? ('healthy' as const) : m.status,
        }
      })

      return {
        ...state,
        phase: 'traveling',
        day: state.day + 1,
        resources: applyResourceChanges(state.resources, { bandwidth: -2, morale: 5 }),
        party: newParty,
        messageLog: [
          ...state.messageLog,
          createMessage('The party rested for a day. Health restored, morale improved.', 'success', state.day + 1),
        ],
      }
    }

    case 'CONTINUE': {
      return { ...state, phase: 'traveling' }
    }

    default:
      return state
  }
}
