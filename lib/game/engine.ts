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
    mode: 'newcomer',
    teamType: 'explorers',
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
    currentWeather: 'bull',
    seekerDetected: false,
  }
}

export function calculateScore(state: GameState): number {
  if (state.phase !== 'victory') return 0

  const alive = getAliveCount(state.party)
  const health = getOverallHealth(state.party)

  // Health-based points per survivor (like original)
  const healthPoints: Record<string, number> = { good: 500, fair: 400, poor: 300, very_poor: 200 }
  const survivorPoints = (healthPoints[health] || 200) * alive

  // Supply points
  const inv = state.inventory
  const supplyPoints =
    50 +                                    // base
    inv.oxen * 4 +                          // 4 per phone
    (inv.spareWheels + inv.spareAxles + inv.spareTongues) * 2 +
    inv.clothing * 2 +
    Math.floor(inv.ammunition / 1) +        // 1 per box
    Math.floor(inv.food / 25) +             // 1 per 25 data
    Math.floor(inv.sol / 5)                 // 1 per 5 SOL

  const baseScore = survivorPoints + supplyPoints

  // Team type bonus
  let teamBonus = 0
  if (state.teamType === 'builders') {
    // Builders get bonus for resources remaining (runway)
    teamBonus = Math.floor(inv.sol / 10) * 5
  } else {
    // Explorers get bonus for party health (everyone survived)
    teamBonus = alive * 50
  }

  const multiplier = state.profession?.scoreMultiplier || 1

  return Math.round((baseScore + teamBonus) * multiplier)
}

function getWeather(day: number, epoch: number): 'bull' | 'crab' | 'bear' | 'fomo' | 'winter' {
  // Epoch 1=early (bear), 3=middle (fomo), 5=late (bear/winter)
  const effectiveDay = day + (epoch - 1) * 20
  const roll = Math.random()

  if (effectiveDay > 150) { // late = bear market / crypto winter
    if (roll < 0.3) return 'bear'
    if (roll < 0.4) return 'winter'
    if (roll < 0.6) return 'crab'
    return 'bull'
  }
  if (effectiveDay > 80) { // mid = fomo season
    if (roll < 0.2) return 'fomo'
    if (roll < 0.4) return 'crab'
    return 'bull'
  }
  // early = crab/bear
  if (roll < 0.2) return 'bear'
  if (roll < 0.4) return 'crab'
  return 'bull'
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
    // ==================== MODE & TEAM SELECT ====================
    case 'SET_MODE': {
      return { ...state, mode: action.mode, phase: 'team_select' }
    }

    case 'SET_TEAM': {
      return { ...state, teamType: action.teamType, phase: 'tutorial' }
    }

    case 'DETECT_SEEKER': {
      return {
        ...state,
        seekerDetected: true,
        inventory: { ...state.inventory, food: state.inventory.food + 10 },
      }
    }

    // ==================== TUTORIAL ====================
    case 'START_TUTORIAL': {
      return { ...state, phase: 'mode_select' }
    }

    case 'SKIP_TUTORIAL': {
      return { ...state, phase: 'profession_select' }
    }

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
      const party = createParty(action.names, state.teamType)
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
          msg(`Welcome to Matt's Supply Shop, ${state.party[0]?.name || 'traveler'}!`, 'system', 0),
          msg('Grab what you need for the trail. You can buy more at forts along the way (but prices go up).', 'info', 0),
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
        warnings.push(msg('Warning: You barely have any phones. Travel will be slow!', 'warning', 1))
      }
      if (state.inventory.food < 200) {
        warnings.push(msg('Warning: You may not have enough data for the journey!', 'warning', 1))
      }

      const teamMsg = state.teamType === 'builders'
        ? 'Time to build your way to Mainnet Launch...'
        : 'The road to Mainnet Launch is long...'

      return {
        ...state,
        phase: 'traveling',
        day: 1,
        currentLocation,
        nextLocation,
        currentWeather: getWeather(1, state.startEpoch),
        messageLog: [
          msg(`Your party departs from Genesis Block. ${teamMsg}`, 'system', 1),
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

      // --- Data consumption ---
      const aliveCount = getAliveCount(state.party)
      const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount
      const newFood = Math.max(0, state.inventory.food - foodPerDay)

      // --- Travel speed (based on pace + phone count) ---
      const baseMiles = PACE_INFO[state.pace].milesPerDay
      const oxenFactor = Math.min(state.inventory.oxen / 6, 1) // 6 phones = max speed
      const speed = Math.max(3, Math.round(baseMiles * (0.3 + 0.7 * oxenFactor)))
      const newDistance = Math.min(state.totalDistance, state.distanceTraveled + speed)

      // --- Market conditions ---
      const weather = getWeather(newDay, state.startEpoch)

      // --- Health update ---
      const newParty = updatePartyHealth(state.party, state.pace, state.rations, state.inventory.clothing, weather)
      const newHealth = getOverallHealth(newParty)

      const messages: MessageEntry[] = [...state.messageLog]
      const weatherLabels: Record<string, string> = {
        bull: 'Bull Market 📈', crab: 'Crab Market 🦀', bear: 'Bear Market 📉', fomo: 'FOMO Season 🔥', winter: 'Crypto Winter ❄️',
      }
      messages.push(msg(`Day ${newDay} — Traveled ${speed} blocks. ${weatherLabels[weather] || weather}.`, 'info', newDay))

      // Check for no data
      if (newFood <= 0) {
        messages.push(msg('You\'re out of data! Your party is going dark — no signal, no trades!', 'danger', newDay))
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

        // Guide message for newcomers
        if (state.mode === 'newcomer' && newLocation.newcomerLearn) {
          messages.push(msg(`💡 ${newLocation.newcomerLearn}`, 'guide', newDay))
        }

        // Context message based on team type
        if (state.teamType === 'builders' && newLocation.builderContext) {
          messages.push(msg(newLocation.builderContext, 'info', newDay))
        } else if (state.teamType === 'explorers' && newLocation.explorerContext) {
          messages.push(msg(newLocation.explorerContext, 'info', newDay))
        }

        // Veteran flavor
        if (state.mode === 'veteran' && newLocation.veteranFlavor) {
          messages.push(msg(newLocation.veteranFlavor, 'info', newDay))
        }

        // Victory!
        if (newDistance >= state.totalDistance) {
          const victoryMsg = state.teamType === 'builders'
            ? 'YOUR PROJECT HAS LAUNCHED ON MAINNET! The Solana ecosystem welcomes your creation!'
            : 'YOUR CREW MADE IT! You\'ve navigated the entire Solana ecosystem and lived to tell the tale!'
          const finalState: GameState = {
            ...state, phase: 'victory', day: newDay, distanceTraveled: newDistance,
            inventory: newInventory, party: newParty, health: newHealth,
            currentLocation: newLocation, nextLocation: null, currentWeather: weather,
            messageLog: [...messages, msg(victoryMsg, 'success', newDay)],
          }
          return { ...finalState, score: calculateScore(finalState) }
        }

        // River crossing
        if (newLocation.type === 'river_crossing') {
          const depth = Math.round((Math.random() * 5 + 1) * 10) / 10 // 1.0 - 6.0
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

      if (newInventory.oxen <= 0) {
        const finalState: GameState = {
          ...state, phase: 'gameOver', day: newDay, distanceTraveled: newDistance,
          inventory: newInventory, party: newParty, health: newHealth,
          currentLocation: newLocation, nextLocation, currentWeather: weather,
          messageLog: [...messages, msg('All your phones are dead. No devices, no connection. It\'s over.', 'danger', newDay)],
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
      if (newFood < 100) messages.push(msg('Warning: Data running low!', 'warning', newDay))
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

      // Check if spare part is required but missing
      if (choice.id === 'use_spare' && choice.outcome.inventoryChanges) {
        const changes = choice.outcome.inventoryChanges
        const inv = newInventory
        const missingSpare =
          (changes.spareWheels && changes.spareWheels < 0 && inv.spareWheels <= 0) ||
          (changes.spareAxles && changes.spareAxles < 0 && inv.spareAxles <= 0) ||
          (changes.spareTongues && changes.spareTongues < 0 && inv.spareTongues <= 0)

        if (missingSpare) {
          messages.push(msg('You don\'t have a spare! You\'ll have to try to fix it the hard way.', 'danger', state.day))
          // Fall through with a time penalty instead
          return {
            ...state,
            day: state.day + 2,
            inventory: { ...newInventory, food: Math.max(0, newInventory.food - 20) },
            messageLog: [...messages, msg('Lost 2 days jury-rigging a fix. Some data was lost.', 'warning', state.day)],
          }
        }
      }

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
        // Consume data for lost days
        const aliveCount = getAliveCount(newParty)
        const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount
        newInventory = { ...newInventory, food: Math.max(0, newInventory.food - foodPerDay * choice.outcome.daysLost) }
      }

      messages.push(msg(choice.outcome.description, 'info', state.day))

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
          // Bridge directly — safe if congestion low, risky if high
          if (depth <= 2.5) {
            messages.push(msg(`Bridged through ${state.currentLocation?.name} with no issues. Clean transaction.`, 'success', state.day))
          } else if (depth <= 4) {
            if (Math.random() < 0.4) {
              const lostFood = Math.round(Math.random() * 50 + 20)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`The bridge lagged! Lost ${lostFood} GB of data in failed transactions.`, 'warning', state.day))
            } else {
              messages.push(msg('Bridged across successfully, but it was sketchy for a minute.', 'success', state.day))
            }
          } else {
            if (Math.random() < 0.3) {
              const result = applyPartyEffect(newParty, { type: 'damage', value: 50, target: 'random' })
              newParty = result.party
              const lostFood = Math.round(Math.random() * 100 + 50)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`Bridge exploit! ${result.affectedName} got rekt in the transfer! Lost ${lostFood} GB of data.`, 'danger', state.day))
            } else {
              const lostFood = Math.round(Math.random() * 30 + 10)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`Rough bridge transfer. Lost some data but everyone made it.`, 'warning', state.day))
            }
          }
          break
        }

        case 'caulk_and_float': {
          // Wrap tokens — moderate risk
          if (Math.random() < 0.25) {
            const lostFood = Math.round(Math.random() * 40 + 10)
            newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
            messages.push(msg('Wrapped token transfer failed mid-swap! Some data lost.', 'warning', state.day))
          } else {
            messages.push(msg('Wrapped your tokens and bridged across safely. Clean swap.', 'success', state.day))
          }
          break
        }

        case 'pay_ferry': {
          const ferryCost = Math.round(depth * 5)
          if (newInventory.sol >= ferryCost) {
            newInventory = { ...newInventory, sol: newInventory.sol - ferryCost }
            messages.push(msg(`Paid ${ferryCost} SOL for a secure bridge. Guaranteed transfer.`, 'success', state.day))
          } else {
            messages.push(msg('Not enough SOL for the secure bridge! Find another way across.', 'danger', state.day))
            return state
          }
          break
        }

        case 'wait': {
          newDay += 1
          const aliveCount = getAliveCount(newParty)
          const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount
          newInventory = { ...newInventory, food: Math.max(0, newInventory.food - foodPerDay) }
          const newDepth = Math.max(1, state.riverDepth - Math.random() * 1.5)
          messages.push(msg(`Waited a day for congestion to drop. Network load now ${newDepth.toFixed(1)}/10.`, 'info', newDay))
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

    // ==================== HUNTING (ALPHA SCOUTING) ====================
    case 'START_HUNTING': {
      if (state.inventory.ammunition <= 0) {
        return {
          ...state,
          messageLog: [...state.messageLog, msg('You have no alpha passes!', 'warning', state.day)],
        }
      }
      return { ...state, phase: 'hunting', huntingAmmoUsed: 0, huntingFoodGained: 0 }
    }

    case 'HUNT_SHOOT': {
      if (state.inventory.ammunition <= state.huntingAmmoUsed) {
        return state // out of alpha
      }

      // Simple hunting — random reward per shot
      const targets: Record<string, { food: number; chance: number; name: string }> = {
        rabbit: { food: 5, chance: 0.8, name: 'Shitcoin Flip' },
        deer: { food: 35, chance: 0.5, name: 'NFT Snipe' },
        bear: { food: 80, chance: 0.25, name: 'Airdrop Farm' },
        buffalo: { food: 100, chance: 0.15, name: 'Gem Find' },
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
            msg(`Hit! Found a ${target.name} worth ${target.food} GB data!`, 'success', state.day),
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
          msg(`Scouting complete! Gained ${foodGained} GB data, used ${boxesUsed} alpha pass(es).`, 'info', state.day),
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
