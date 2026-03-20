import {
  GameState, GameAction, MessageEntry, Inventory,
  Pace, Rations, PACE_INFO, RATIONS_INFO, PROFESSIONS,
} from './types'
import { TOTAL_DISTANCE, getCurrentLocation, getNextLocation, getLocationByDistance } from './locations'
import { getRandomEvent } from './events'
import { createParty, DEFAULT_NAMES, updatePartyHealth, applyPartyEffect, getAliveCount, getOverallHealth } from './party'
import { INITIAL_INVENTORY, STORE_ITEMS, getStoreTotalCost } from './store'

let messageIdCounter = 0
function msg(text: string, type: MessageEntry['type'], day: number): MessageEntry {
  return { id: `msg-${++messageIdCounter}`, text, type, day }
}

export function createInitialState(): GameState {
  return {
    phase: 'title',
    profession: null,
    party: [],
    day: 0,
    distanceTraveled: 0,
    totalDistance: TOTAL_DISTANCE,
    inventory: { ...INITIAL_INVENTORY },
    pace: 'steady',
    rations: 'filling',
    health: 'good',
    currentLocation: null,
    nextLocation: null,
    currentEvent: null,
    selectedChoice: null,
    riverDepth: 0,
    messageLog: [],
    score: 0,
    startTime: Date.now(),
    huntingAmmoUsed: 0,
    huntingFoodGained: 0,
    startEpoch: 3,
    currentWeather: 'clear',
  }
}

export function calculateScore(state: GameState): number {
  if (state.phase !== 'victory') return 0

  const alive = getAliveCount(state.party)
  const health = getOverallHealth(state.party)

  // Health-based points per survivor (like original)
  const healthPoints: Record<string, number> = { good: 500, fair: 400, poor: 300, very_poor: 200 }
  const survivorPoints = (healthPoints[health] || 200) * alive

  // Supply points (like original: ~1 point per 5 SOL value)
  const inv = state.inventory
  const supplyPoints =
    50 +                                    // wagon (always 50)
    inv.oxen * 4 +                          // 4 per validator
    (inv.spareWheels + inv.spareAxles + inv.spareTongues) * 2 +
    inv.clothing * 2 +
    Math.floor(inv.ammunition / 1) +        // 1 per box
    Math.floor(inv.food / 25) +             // 1 per 25 food
    Math.floor(inv.sol / 5)                 // 1 per 5 SOL

  const baseScore = survivorPoints + supplyPoints
  const multiplier = state.profession?.scoreMultiplier || 1

  return Math.round(baseScore * multiplier)
}

function getWeather(day: number, epoch: number): 'clear' | 'rainy' | 'cold' | 'hot' | 'snowy' {
  // Epoch 1=early (cold), 3=middle (hot), 5=late (cold again)
  const effectiveDay = day + (epoch - 1) * 20
  const roll = Math.random()

  if (effectiveDay > 150) { // late = cold/snowy
    if (roll < 0.3) return 'cold'
    if (roll < 0.4) return 'snowy'
    if (roll < 0.6) return 'rainy'
    return 'clear'
  }
  if (effectiveDay > 80) { // mid = hot
    if (roll < 0.2) return 'hot'
    if (roll < 0.4) return 'rainy'
    return 'clear'
  }
  // early = rainy/cold
  if (roll < 0.2) return 'cold'
  if (roll < 0.4) return 'rainy'
  return 'clear'
}

function applyInventoryChanges(inv: Inventory, changes: Partial<Inventory>): Inventory {
  const result = { ...inv }
  for (const [key, val] of Object.entries(changes)) {
    if (val && key in result) {
      (result as Record<string, number>)[key] = Math.max(0, (result as Record<string, number>)[key] + val)
    }
  }
  return result
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // ==================== SETUP FLOW ====================
    case 'SELECT_PROFESSION': {
      return {
        ...state,
        phase: 'party_naming',
        profession: action.profession,
        inventory: { ...INITIAL_INVENTORY, sol: action.profession.startingSol },
      }
    }

    case 'SET_PARTY_NAMES': {
      const party = createParty(action.names)
      return {
        ...state,
        phase: 'epoch_select',
        party,
      }
    }

    case 'SET_EPOCH': {
      return {
        ...state,
        phase: 'general_store',
        startEpoch: action.epoch,
        messageLog: [
          msg(`Welcome to Matt's DeFi Supply, ${state.party[0]?.name || 'traveler'}!`, 'system', 0),
          msg('Buy what you need for the trail. You can also buy supplies at forts along the way (but prices go up).', 'info', 0),
        ],
      }
    }

    case 'BUY_INITIAL': {
      const storeItem = STORE_ITEMS.find((s) => s.key === action.item)
      if (!storeItem) return state

      const cost = getStoreTotalCost(storeItem, action.quantity, 1.0)
      if (state.inventory.sol < cost) return state

      const currentQty = state.inventory[action.item] || 0
      if (currentQty + action.quantity > storeItem.max) return state

      return {
        ...state,
        inventory: {
          ...state.inventory,
          sol: Math.round((state.inventory.sol - cost) * 100) / 100,
          [action.item]: currentQty + action.quantity,
        },
        messageLog: [
          ...state.messageLog,
          msg(`Bought ${action.quantity} ${storeItem.label} for ${cost.toFixed(2)} SOL`, 'success', 0),
        ],
      }
    }

    case 'LEAVE_STORE':
    case 'START_TRAIL': {
      const currentLocation = getCurrentLocation(0)
      const nextLocation = getNextLocation(0)

      // Warnings if under-prepared
      const warnings: MessageEntry[] = []
      if (state.inventory.oxen < 2) {
        warnings.push(msg('Warning: You have very few validators. Travel will be slow!', 'warning', 1))
      }
      if (state.inventory.food < 200) {
        warnings.push(msg('Warning: You may not have enough bandwidth for the journey!', 'warning', 1))
      }

      return {
        ...state,
        phase: 'traveling',
        day: 1,
        currentLocation,
        nextLocation,
        currentWeather: getWeather(1, state.startEpoch),
        messageLog: [
          msg(`Your party departs from Genesis Block. The road to Mainnet Launch is long...`, 'system', 1),
          msg(`Party: ${state.party.map((p) => p.name).join(', ')}`, 'info', 1),
          msg(`Pace: ${PACE_INFO[state.pace].label} | Rations: ${RATIONS_INFO[state.rations].label}`, 'info', 1),
          ...warnings,
        ],
      }
    }

    // ==================== TRAVEL ACTIONS ====================
    case 'SET_PACE': {
      return {
        ...state,
        pace: action.pace,
        messageLog: [...state.messageLog, msg(`Pace set to ${PACE_INFO[action.pace].label}.`, 'info', state.day)],
      }
    }

    case 'SET_RATIONS': {
      return {
        ...state,
        rations: action.rations,
        messageLog: [...state.messageLog, msg(`Rations set to ${RATIONS_INFO[action.rations].label}.`, 'info', state.day)],
      }
    }

    case 'ADVANCE_DAY': {
      if (state.phase !== 'traveling') return state

      const newDay = state.day + 1

      // --- Food consumption ---
      const aliveCount = getAliveCount(state.party)
      const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount
      const newFood = Math.max(0, state.inventory.food - foodPerDay)

      // --- Travel speed (based on pace + oxen count) ---
      const baseMiles = PACE_INFO[state.pace].milesPerDay
      const oxenFactor = Math.min(state.inventory.oxen / 6, 1) // 6 oxen = max speed
      const speed = Math.max(3, Math.round(baseMiles * (0.3 + 0.7 * oxenFactor)))
      const newDistance = Math.min(state.totalDistance, state.distanceTraveled + speed)

      // --- Weather ---
      const weather = getWeather(newDay, state.startEpoch)

      // --- Health update ---
      const newParty = updatePartyHealth(state.party, state.pace, state.rations, state.inventory.clothing, weather)
      const newHealth = getOverallHealth(newParty)

      const messages: MessageEntry[] = [...state.messageLog]
      messages.push(msg(`Day ${newDay} — Traveled ${speed} blocks. Weather: ${weather}.`, 'info', newDay))

      // Check for starvation
      if (newFood <= 0) {
        messages.push(msg('You have run out of bandwidth! Your party is starving!', 'danger', newDay))
      }

      // Check deaths
      const prevAlive = getAliveCount(state.party)
      const nowAlive = getAliveCount(newParty)
      if (nowAlive < prevAlive) {
        for (let i = 0; i < newParty.length; i++) {
          if (newParty[i].status === 'dead' && state.party[i].status !== 'dead') {
            messages.push(msg(`${newParty[i].name} has been lost to the blockchain...`, 'danger', newDay))
          }
        }
      }

      // Check recoveries
      for (let i = 0; i < newParty.length; i++) {
        if (state.party[i].status !== 'healthy' && state.party[i].status !== 'dead' && newParty[i].status === 'healthy') {
          messages.push(msg(`${newParty[i].name} has recovered!`, 'success', newDay))
        }
      }

      const newInventory = { ...state.inventory, food: newFood }

      // --- Check arrival at new location ---
      const newLocation = getCurrentLocation(newDistance)
      const nextLocation = getNextLocation(newDistance)
      let newPhase: GameState['phase'] = 'traveling'

      if (newLocation && newLocation.id !== state.currentLocation?.id) {
        messages.push(msg(`Arrived at ${newLocation.name}!`, 'success', newDay))

        // Victory!
        if (newDistance >= state.totalDistance) {
          const finalState: GameState = {
            ...state, phase: 'victory', day: newDay, distanceTraveled: newDistance,
            inventory: newInventory, party: newParty, health: newHealth,
            currentLocation: newLocation, nextLocation: null, currentWeather: weather,
            messageLog: [...messages, msg('YOU REACHED MAINNET LAUNCH! The protocol is live!', 'success', newDay)],
          }
          return { ...finalState, score: calculateScore(finalState) }
        }

        // River crossing
        if (newLocation.type === 'river_crossing') {
          const depth = Math.round((Math.random() * 5 + 1) * 10) / 10 // 1.0 - 6.0 feet
          return {
            ...state, phase: 'river_crossing', day: newDay, distanceTraveled: newDistance,
            inventory: newInventory, party: newParty, health: newHealth,
            currentLocation: newLocation, nextLocation, riverDepth: depth, currentWeather: weather,
            messageLog: messages,
          }
        }

        // Fort or landmark — show arrival screen
        if (newLocation.type === 'fort' || newLocation.type === 'landmark') {
          newPhase = 'landmark'
        }
      }

      // Game over checks
      if (nowAlive === 0) {
        const finalState: GameState = {
          ...state, phase: 'gameOver', day: newDay, distanceTraveled: newDistance,
          inventory: newInventory, party: newParty, health: newHealth,
          currentLocation: newLocation, nextLocation, currentWeather: weather,
          messageLog: [...messages, msg('All party members have been lost...', 'danger', newDay)],
        }
        return { ...finalState, score: calculateScore(finalState) }
      }

      if (state.inventory.oxen <= 0) {
        const finalState: GameState = {
          ...state, phase: 'gameOver', day: newDay, distanceTraveled: newDistance,
          inventory: newInventory, party: newParty, health: newHealth,
          currentLocation: newLocation, nextLocation, currentWeather: weather,
          messageLog: [...messages, msg('You have no validators left. The network has halted.', 'danger', newDay)],
        }
        return { ...finalState, score: calculateScore(finalState) }
      }

      // --- Random events (if still traveling) ---
      if (newPhase === 'traveling') {
        const eventChance = state.pace === 'grueling' ? 0.5 : state.pace === 'strenuous' ? 0.35 : 0.2
        if (Math.random() < eventChance) {
          const event = getRandomEvent(newDay)
          return {
            ...state, phase: 'event', day: newDay, distanceTraveled: newDistance,
            inventory: newInventory, party: newParty, health: newHealth,
            currentLocation: newLocation, nextLocation, currentEvent: event,
            selectedChoice: null, currentWeather: weather, messageLog: messages,
          }
        }
      }

      // Health/resource warnings
      if (newHealth === 'poor') messages.push(msg('Your party\'s health is poor. Consider resting.', 'warning', newDay))
      if (newHealth === 'very_poor') messages.push(msg('Your party\'s health is very poor! Rest immediately!', 'danger', newDay))
      if (newFood < 100) messages.push(msg('Warning: Bandwidth running low!', 'warning', newDay))
      if (newInventory.sol < 10) messages.push(msg('Warning: SOL reserves low!', 'warning', newDay))

      return {
        ...state, phase: newPhase, day: newDay, distanceTraveled: newDistance,
        inventory: newInventory, party: newParty, health: newHealth,
        currentLocation: newLocation, nextLocation, currentWeather: weather,
        messageLog: messages,
      }
    }

    // ==================== EVENTS ====================
    case 'HANDLE_CHOICE': {
      if (!state.currentEvent) return state
      const choice = state.currentEvent.choices.find((c) => c.id === action.choiceId)
      if (!choice) return state

      let newInventory = state.inventory
      let newParty = [...state.party]
      const messages = [...state.messageLog]
      let newDay = state.day

      // Apply inventory changes
      if (choice.outcome.inventoryChanges) {
        newInventory = applyInventoryChanges(newInventory, choice.outcome.inventoryChanges)
      }

      // Apply party effect
      if (choice.outcome.partyEffect) {
        const result = applyPartyEffect(newParty, choice.outcome.partyEffect)
        newParty = result.party
        if (result.affectedName && choice.outcome.partyEffect.type === 'status') {
          messages.push(msg(`${result.affectedName} is ${choice.outcome.partyEffect.status}!`, 'warning', state.day))
        }
        if (result.affectedName && choice.outcome.partyEffect.type === 'damage') {
          messages.push(msg(`${result.affectedName} took damage!`, 'danger', state.day))
        }
      }

      // Apply health change to all alive
      if (choice.outcome.healthChange) {
        newParty = newParty.map((m) => {
          if (m.status === 'dead') return m
          const hp = Math.max(0, Math.min(100, m.health + choice.outcome.healthChange!))
          return { ...m, health: hp, status: hp <= 0 ? 'dead' as const : m.status }
        })
      }

      // Apply days lost
      if (choice.outcome.daysLost) {
        newDay += choice.outcome.daysLost
        // Consume food for lost days
        const aliveCount = getAliveCount(newParty)
        const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount
        newInventory = { ...newInventory, food: Math.max(0, newInventory.food - foodPerDay * choice.outcome.daysLost) }
      }

      messages.push(msg(choice.outcome.description, 'info', state.day))

      // Check for spare part usage
      if (choice.id === 'use_spare') {
        const changes = choice.outcome.inventoryChanges || {}
        if (changes.spareWheels && changes.spareWheels < 0 && newInventory.spareWheels < 0) {
          // Didn't have the spare — undo and force the other option
          messages.push(msg('You don\'t have a spare! You\'ll have to try to fix it.', 'danger', state.day))
          newInventory = state.inventory
        }
      }

      return {
        ...state,
        inventory: newInventory,
        party: newParty,
        day: newDay,
        health: getOverallHealth(newParty),
        selectedChoice: choice,
        messageLog: messages,
      }
    }

    case 'DISMISS_EVENT': {
      const alive = getAliveCount(state.party)
      if (alive === 0) {
        return {
          ...state, phase: 'gameOver', currentEvent: null, selectedChoice: null,
          score: calculateScore(state),
          messageLog: [...state.messageLog, msg('All party members have been lost...', 'danger', state.day)],
        }
      }
      return { ...state, phase: 'traveling', currentEvent: null, selectedChoice: null }
    }

    // ==================== RIVER CROSSING ====================
    case 'RIVER_CHOICE': {
      const messages = [...state.messageLog]
      let newInventory = { ...state.inventory }
      let newParty = [...state.party]
      let newDay = state.day
      const depth = state.riverDepth

      switch (action.choice) {
        case 'ford': {
          // Safe if depth <= 2.5, risky if higher
          if (depth <= 2.5) {
            messages.push(msg(`You forded the ${state.currentLocation?.name}. The crossing was smooth.`, 'success', state.day))
          } else if (depth <= 4) {
            // Moderate risk
            if (Math.random() < 0.4) {
              const lostFood = Math.round(Math.random() * 50 + 20)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`The crossing was rough! You lost ${lostFood} units of bandwidth to the current.`, 'warning', state.day))
            } else {
              messages.push(msg('You made it across safely, but it was close!', 'success', state.day))
            }
          } else {
            // High risk — possible drowning, lost supplies
            if (Math.random() < 0.3) {
              const result = applyPartyEffect(newParty, { type: 'damage', value: 50, target: 'random' })
              newParty = result.party
              const lostFood = Math.round(Math.random() * 100 + 50)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`Disaster! The current was too strong. ${result.affectedName} nearly drowned! Lost ${lostFood} bandwidth.`, 'danger', state.day))
            } else {
              const lostFood = Math.round(Math.random() * 30 + 10)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`A harrowing crossing! Lost some supplies but everyone survived.`, 'warning', state.day))
            }
          }
          break
        }

        case 'caulk_and_float': {
          // Moderate risk regardless of depth
          if (Math.random() < 0.25) {
            const lostFood = Math.round(Math.random() * 40 + 10)
            newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
            messages.push(msg('Your sealed wagon tipped! Some supplies were lost.', 'warning', state.day))
          } else {
            messages.push(msg('You caulked the wagon and floated across successfully!', 'success', state.day))
          }
          break
        }

        case 'pay_ferry': {
          const ferryCost = Math.round(depth * 5)
          if (newInventory.sol >= ferryCost) {
            newInventory = { ...newInventory, sol: newInventory.sol - ferryCost }
            messages.push(msg(`You paid ${ferryCost} SOL for the ferry. Safe crossing!`, 'success', state.day))
          } else {
            messages.push(msg('You can\'t afford the ferry! You\'ll have to find another way.', 'danger', state.day))
            return state // Don't advance
          }
          break
        }

        case 'wait': {
          newDay += 1
          const aliveCount = getAliveCount(newParty)
          const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount
          newInventory = { ...newInventory, food: Math.max(0, newInventory.food - foodPerDay) }
          const newDepth = Math.max(1, state.riverDepth - Math.random() * 1.5)
          messages.push(msg(`You waited a day. Water level changed to ${newDepth.toFixed(1)} feet.`, 'info', newDay))
          return {
            ...state, day: newDay, inventory: newInventory, party: newParty,
            riverDepth: newDepth, messageLog: messages,
          }
        }
      }

      return {
        ...state, phase: 'traveling', day: newDay, inventory: newInventory,
        party: newParty, health: getOverallHealth(newParty), messageLog: messages,
      }
    }

    // ==================== LANDMARK / FORT ====================
    case 'CONTINUE_FROM_LANDMARK': {
      return { ...state, phase: 'traveling' }
    }

    case 'LOOK_AROUND': {
      const loc = state.currentLocation
      if (!loc) return state
      return {
        ...state,
        messageLog: [
          ...state.messageLog,
          msg(`You look around ${loc.name}. ${loc.description}`, 'info', state.day),
        ],
      }
    }

    case 'TALK_TO_PEOPLE': {
      const loc = state.currentLocation
      if (!loc?.talkTexts?.length) return state
      const text = loc.talkTexts[Math.floor(Math.random() * loc.talkTexts.length)]
      return {
        ...state,
        messageLog: [...state.messageLog, msg(text, 'info', state.day)],
      }
    }

    // ==================== TRADING (AT FORTS) ====================
    case 'ENTER_TRADING': {
      if (!state.currentLocation?.hasStore) return state
      return { ...state, phase: 'trading' }
    }

    case 'BUY_ITEM': {
      const storeItem = STORE_ITEMS.find((s) => s.key === action.item)
      if (!storeItem || !state.currentLocation) return state

      const multiplier = state.currentLocation.priceMultiplier
      const cost = getStoreTotalCost(storeItem, action.quantity, multiplier)
      if (state.inventory.sol < cost) return state

      return {
        ...state,
        inventory: {
          ...state.inventory,
          sol: Math.round((state.inventory.sol - cost) * 100) / 100,
          [action.item]: (state.inventory[action.item] || 0) + action.quantity,
        },
        messageLog: [
          ...state.messageLog,
          msg(`Bought ${action.quantity} ${storeItem.label} for ${cost.toFixed(2)} SOL`, 'success', state.day),
        ],
      }
    }

    case 'LEAVE_TRADING': {
      return { ...state, phase: 'landmark' }
    }

    // ==================== HUNTING (BUG BOUNTY) ====================
    case 'START_HUNTING': {
      if (state.inventory.ammunition <= 0) {
        return {
          ...state,
          messageLog: [...state.messageLog, msg('You have no bug bounty kits!', 'warning', state.day)],
        }
      }
      return { ...state, phase: 'hunting', huntingAmmoUsed: 0, huntingFoodGained: 0 }
    }

    case 'HUNT_SHOOT': {
      if (state.inventory.ammunition <= state.huntingAmmoUsed) {
        return state // out of ammo
      }

      // Simple hunting — random reward per shot
      const targets: Record<string, { food: number; chance: number; name: string }> = {
        rabbit: { food: 5, chance: 0.8, name: 'Minor Bug' },
        deer: { food: 35, chance: 0.5, name: 'Medium Vulnerability' },
        bear: { food: 80, chance: 0.25, name: 'Critical Exploit' },
        buffalo: { food: 100, chance: 0.15, name: 'Zero-Day' },
      }

      const target = targets[action.targetId] || targets.rabbit
      const hit = Math.random() < target.chance
      const newAmmo = state.huntingAmmoUsed + 1

      if (hit) {
        const totalFood = Math.min(state.huntingFoodGained + target.food, 100) // max 100 per hunt
        return {
          ...state,
          huntingAmmoUsed: newAmmo,
          huntingFoodGained: totalFood,
          messageLog: [
            ...state.messageLog,
            msg(`Hit! Found a ${target.name} worth ${target.food} bounty!`, 'success', state.day),
          ],
        }
      } else {
        return {
          ...state,
          huntingAmmoUsed: newAmmo,
          messageLog: [
            ...state.messageLog,
            msg(`Missed the ${target.name}...`, 'info', state.day),
          ],
        }
      }
    }

    case 'END_HUNTING': {
      const foodGained = state.huntingFoodGained
      const ammoUsed = state.huntingAmmoUsed
      // Each "box" = 20 charges
      const boxesUsed = Math.ceil(ammoUsed / 20)

      return {
        ...state,
        phase: 'traveling',
        day: state.day + 1,
        inventory: {
          ...state.inventory,
          food: state.inventory.food + foodGained,
          ammunition: Math.max(0, state.inventory.ammunition - boxesUsed),
        },
        huntingAmmoUsed: 0,
        huntingFoodGained: 0,
        messageLog: [
          ...state.messageLog,
          msg(`Bug bounty hunt complete! Gained ${foodGained} bandwidth, used ${boxesUsed} kit(s).`, 'info', state.day),
        ],
      }
    }

    // ==================== REST ====================
    case 'REST': {
      const newDay = state.day + 1
      const aliveCount = getAliveCount(state.party)
      const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount

      const healedParty = state.party.map((m) => {
        if (m.status === 'dead') return m
        const newHealth = Math.min(100, m.health + 8)
        return {
          ...m,
          health: newHealth,
          status: newHealth > 40 ? ('healthy' as const) : m.status,
        }
      })

      return {
        ...state,
        phase: 'traveling',
        day: newDay,
        inventory: { ...state.inventory, food: Math.max(0, state.inventory.food - foodPerDay) },
        party: healedParty,
        health: getOverallHealth(healedParty),
        messageLog: [
          ...state.messageLog,
          msg('The party rested for a day. Health improved.', 'success', newDay),
        ],
      }
    }

    // ==================== PLAY AGAIN ====================
    case 'PLAY_AGAIN': {
      return createInitialState()
    }

    default:
      return state
  }
}
