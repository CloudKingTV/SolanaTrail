import {
  GameState, GameAction, MessageEntry, Inventory,
  Pace, Rations, PACE_INFO, RATIONS_INFO, PROFESSIONS,
} from './types'
import { TOTAL_DISTANCE, getCurrentLocation, getNextLocation, getLocationByDistance, getTalkText, getLookAroundText } from './locations'
import { getRandomEvent } from './events'
import { getRandomEncounter } from './encounters'
import { createParty, DEFAULT_NAMES, updatePartyHealth, applyPartyEffect, getAliveCount, getOverallHealth } from './party'
import { INITIAL_INVENTORY, STORE_ITEMS, getStoreTotalCost } from './store'
import { generateTokenPrices, tickPrices, seededRandom, dateSeed } from './tokens'
import { COLLECTIBLES } from './collectibles'

let messageIdCounter = 0
function msg(text: string, type: MessageEntry['type'], day: number): MessageEntry {
  return { id: `msg-${++messageIdCounter}`, text, type, day }
}

// Get a random function - seeded for daily challenges, Math.random for normal
function getRng(state: GameState): { rng: () => number; nextRngState: number } {
  if (state.isDaily && state.dailySeed) {
    const rng = seededRandom(state.rngState)
    // Advance the state by calling once to get the next seed position
    let nextState = state.rngState
    const wrappedRng = () => {
      const val = rng()
      nextState = (nextState + 1) | 0
      return val
    }
    return { rng: wrappedRng, nextRngState: nextState }
  }
  return { rng: Math.random, nextRngState: state.rngState }
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
    // Token trading
    tokenPrices: [],
    tokenHoldings: {},
    tradingRoundsLeft: 0,
    // Encounters
    currentEncounter: null,
    selectedEncounterChoice: null,
    // Achievements & Collectibles
    unlockedAchievements: [],
    foundCollectibles: [],
    // Daily challenge
    dailySeed: null,
    isDaily: false,
    isTurbo: false,
    rngState: 0,
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

function getWeather(day: number, epoch: number, rng: () => number = Math.random): 'bull' | 'crab' | 'bear' | 'fomo' | 'winter' {
  // Epoch 1=early (bear), 3=middle (fomo), 5=late (bear/winter)
  const effectiveDay = day + (epoch - 1) * 20
  const roll = rng()

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

      const { rng } = getRng(state)
      // Advance rng state for this day
      const newRngState = state.isDaily ? (state.rngState + state.day * 7 + 1) : state.rngState

      const newDay = state.day + 1

      // --- Data consumption (turbo burns data 2x faster) ---
      const aliveCount = getAliveCount(state.party)
      const turboFoodMultiplier = state.isTurbo ? 2 : 1
      const foodPerDay = RATIONS_INFO[state.rations].foodPerPersonPerDay * aliveCount * turboFoodMultiplier
      const newFood = Math.max(0, state.inventory.food - foodPerDay)

      // --- Travel speed (based on pace + phone count) ---
      const baseMiles = PACE_INFO[state.pace].milesPerDay
      const oxenFactor = Math.min(state.inventory.oxen / 6, 1) // 6 phones = max speed
      const speed = Math.max(3, Math.round(baseMiles * (0.3 + 0.7 * oxenFactor)))
      const newDistance = Math.min(state.totalDistance, state.distanceTraveled + speed)

      // --- Market conditions ---
      const weather = getWeather(newDay, state.startEpoch, rng)

      // --- Health update (turbo = harsher conditions) ---
      const turboPace: Pace = state.isTurbo && state.pace === 'steady' ? 'strenuous' : state.isTurbo && state.pace === 'strenuous' ? 'grueling' : state.pace
      const newParty = updatePartyHealth(state.party, turboPace, state.rations, state.inventory.clothing, weather)
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

        // River crossing
        if (newLocation.type === 'river_crossing') {
          const depth = Math.round((rng() * 5 + 1) * 10) / 10 // 1.0 - 6.0
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

      // Victory! (checked outside location block so turbo/shorter trails always trigger)
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
        const baseEventChance = state.pace === 'grueling' ? 0.5 : state.pace === 'strenuous' ? 0.35 : 0.2
        const eventChance = state.isTurbo ? Math.min(baseEventChance * 1.5, 0.65) : baseEventChance
        if (rng() < eventChance) {
          const event = getRandomEvent(newDay, rng)
          return {
            ...state, phase: 'event', day: newDay, distanceTraveled: newDistance,
            inventory: newInventory, party: newParty, health: newHealth,
            currentLocation: newLocation, nextLocation, currentEvent: event,
            selectedChoice: null, currentWeather: weather, messageLog: messages,
            rngState: newRngState,
          }
        }

        // --- Random NPC encounters (separate from events) ---
        const encounter = getRandomEncounter(newDay, rng)
        if (encounter) {
          return {
            ...state, phase: 'encounter', day: newDay, distanceTraveled: newDistance,
            inventory: newInventory, party: newParty, health: newHealth,
            currentLocation: newLocation, nextLocation, currentWeather: weather,
            currentEncounter: encounter, selectedEncounterChoice: null,
            messageLog: messages, rngState: newRngState,
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
        messageLog: messages, rngState: newRngState,
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

      // Collectible drop
      let newFoundCollectibles = state.foundCollectibles
      if (choice.outcome.collectibleDrop && !newFoundCollectibles.includes(choice.outcome.collectibleDrop)) {
        const collectible = COLLECTIBLES.find(c => c.id === choice.outcome.collectibleDrop)
        if (collectible) {
          newFoundCollectibles = [...newFoundCollectibles, choice.outcome.collectibleDrop]
          messages.push(msg(`🎁 Collectible found: ${collectible.icon} ${collectible.name}!`, 'success', state.day))
        }
      }

      return {
        ...state,
        inventory: newInventory,
        party: newParty,
        day: newDay,
        health: getOverallHealth(newParty),
        selectedChoice: choice,
        foundCollectibles: newFoundCollectibles,
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
      const { rng: riverRng } = getRng(state)
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
            if (riverRng() < 0.4) {
              const lostFood = Math.round(riverRng() * 50 + 20)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`The bridge lagged! Lost ${lostFood} GB of data in failed transactions.`, 'warning', state.day))
            } else {
              messages.push(msg('Bridged across successfully, but it was sketchy for a minute.', 'success', state.day))
            }
          } else {
            if (riverRng() < 0.3) {
              const result = applyPartyEffect(newParty, { type: 'damage', value: 50, target: 'random' })
              newParty = result.party
              const lostFood = Math.round(riverRng() * 100 + 50)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`Bridge exploit! ${result.affectedName} got rekt in the transfer! Lost ${lostFood} GB of data.`, 'danger', state.day))
            } else {
              const lostFood = Math.round(riverRng() * 30 + 10)
              newInventory = { ...newInventory, food: Math.max(0, newInventory.food - lostFood) }
              messages.push(msg(`Rough bridge transfer. Lost some data but everyone made it.`, 'warning', state.day))
            }
          }
          break
        }

        case 'caulk_and_float': {
          // Wrap tokens — moderate risk
          if (riverRng() < 0.25) {
            const lostFood = Math.round(riverRng() * 40 + 10)
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
          const newDepth = Math.max(1, state.riverDepth - riverRng() * 1.5)
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
      const recentTexts = state.messageLog.slice(-10).map(m => m.text)
      const lookText = getLookAroundText(loc, recentTexts)
      return {
        ...state,
        messageLog: [
          ...state.messageLog,
          msg(lookText, 'info', state.day),
        ],
      }
    }

    case 'TALK_TO_PEOPLE': {
      const loc = state.currentLocation
      if (!loc) return state
      const recentTexts = state.messageLog.slice(-10).map(m => m.text)
      const text = getTalkText(loc, recentTexts)
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
      const { rng: huntRng } = getRng(state)
      const hit = huntRng() < target.chance
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

      // Stay at landmark if resting there, otherwise return to traveling
      const restPhase = (state.phase === 'landmark') ? 'landmark' : 'traveling'

      return {
        ...state,
        phase: restPhase,
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

    // ==================== TOKEN TRADING MINI-GAME ====================
    case 'ENTER_TOKEN_TRADING': {
      if (!state.currentLocation?.hasStore) return state
      const prices = generateTokenPrices()
      return {
        ...state,
        phase: 'token_trading',
        tokenPrices: prices,
        tokenHoldings: {},
        tradingRoundsLeft: 10, // 10 rounds to trade
        messageLog: [
          ...state.messageLog,
          msg(`Welcome to the ${state.currentLocation.name} token exchange! You have 10 rounds to trade.`, 'system', state.day),
        ],
      }
    }

    case 'BUY_TOKEN': {
      if (state.tradingRoundsLeft <= 0) return state
      const token = state.tokenPrices.find(t => t.name === action.tokenName)
      if (!token) return state
      const cost = Math.round(token.price * action.amount * 100) / 100
      if (state.inventory.sol < cost) return state

      const currentHolding = state.tokenHoldings[action.tokenName] || 0
      return {
        ...state,
        inventory: { ...state.inventory, sol: Math.round((state.inventory.sol - cost) * 100) / 100 },
        tokenHoldings: { ...state.tokenHoldings, [action.tokenName]: currentHolding + action.amount },
        messageLog: [
          ...state.messageLog,
          msg(`Bought ${action.amount} ${token.icon} ${action.tokenName} at ${token.price.toFixed(2)} SOL each (${cost.toFixed(2)} SOL total)`, 'success', state.day),
        ],
      }
    }

    case 'SELL_TOKEN': {
      if (state.tradingRoundsLeft <= 0) return state
      const token = state.tokenPrices.find(t => t.name === action.tokenName)
      if (!token) return state
      const currentHolding = state.tokenHoldings[action.tokenName] || 0
      if (currentHolding < action.amount) return state

      const revenue = Math.round(token.price * action.amount * 100) / 100
      return {
        ...state,
        inventory: { ...state.inventory, sol: Math.round((state.inventory.sol + revenue) * 100) / 100 },
        tokenHoldings: { ...state.tokenHoldings, [action.tokenName]: currentHolding - action.amount },
        messageLog: [
          ...state.messageLog,
          msg(`Sold ${action.amount} ${token.icon} ${action.tokenName} at ${token.price.toFixed(2)} SOL each (+${revenue.toFixed(2)} SOL)`, 'success', state.day),
        ],
      }
    }

    case 'ADVANCE_MARKET': {
      if (state.tradingRoundsLeft <= 0) return state
      const newPrices = tickPrices(state.tokenPrices)
      const roundsLeft = state.tradingRoundsLeft - 1
      const messages = [...state.messageLog, msg(`Market tick! ${roundsLeft} rounds remaining.`, 'info', state.day)]

      // Show price movements
      for (let i = 0; i < newPrices.length; i++) {
        const old = state.tokenPrices[i]
        const cur = newPrices[i]
        const pct = ((cur.price - old.price) / old.price * 100).toFixed(1)
        const dir = cur.price > old.price ? '📈' : cur.price < old.price ? '📉' : '➡️'
        messages.push(msg(`${cur.icon} ${cur.name}: ${old.price.toFixed(2)} → ${cur.price.toFixed(2)} SOL (${pct}%) ${dir}`, 'info', state.day))
      }

      if (roundsLeft === 0) {
        messages.push(msg('Market closed! Auto-selling remaining positions...', 'system', state.day))
      }

      return {
        ...state,
        tokenPrices: newPrices,
        tradingRoundsLeft: roundsLeft,
        messageLog: messages,
      }
    }

    case 'LEAVE_TOKEN_TRADING': {
      // Auto-sell remaining holdings at current prices
      let soldTotal = 0
      const messages = [...state.messageLog]
      let newSol = state.inventory.sol

      for (const [name, qty] of Object.entries(state.tokenHoldings)) {
        if (qty > 0) {
          const token = state.tokenPrices.find(t => t.name === name)
          if (token) {
            const revenue = Math.round(token.price * qty * 100) / 100
            newSol = Math.round((newSol + revenue) * 100) / 100
            soldTotal += revenue
            messages.push(msg(`Auto-sold ${qty} ${token.icon} ${name} for ${revenue.toFixed(2)} SOL`, 'info', state.day))
          }
        }
      }

      if (soldTotal > 0) {
        messages.push(msg(`Token trading complete! Total from auto-sell: ${soldTotal.toFixed(2)} SOL`, 'success', state.day))
      }

      return {
        ...state,
        phase: 'landmark',
        inventory: { ...state.inventory, sol: newSol },
        tokenPrices: [],
        tokenHoldings: {},
        tradingRoundsLeft: 0,
        messageLog: messages,
      }
    }

    // ==================== RANDOM ENCOUNTERS ====================
    case 'ENCOUNTER_CHOICE': {
      if (!state.currentEncounter) return state
      const choice = state.currentEncounter.choices.find(c => c.id === action.choiceId)
      if (!choice) return state

      let newInventory = state.inventory
      let newParty = [...state.party]
      let newDay = state.day
      const messages = [...state.messageLog]

      if (choice.outcome.inventoryChanges) {
        newInventory = applyInventoryChanges(newInventory, choice.outcome.inventoryChanges)
      }

      if (choice.outcome.partyEffect) {
        const result = applyPartyEffect(newParty, choice.outcome.partyEffect)
        newParty = result.party
      }

      if (choice.outcome.healthChange) {
        newParty = newParty.map(m => {
          if (m.status === 'dead') return m
          const hp = Math.max(0, Math.min(100, m.health + choice.outcome.healthChange!))
          return { ...m, health: hp, status: hp <= 0 ? 'dead' as const : m.status }
        })
      }

      if (choice.outcome.daysLost) {
        newDay += choice.outcome.daysLost
      }

      messages.push(msg(choice.outcome.description, 'info', state.day))

      // Collectible drop
      let ecNewFoundCollectibles = state.foundCollectibles
      if (choice.outcome.collectibleDrop && !ecNewFoundCollectibles.includes(choice.outcome.collectibleDrop)) {
        const collectible = COLLECTIBLES.find(c => c.id === choice.outcome.collectibleDrop)
        if (collectible) {
          ecNewFoundCollectibles = [...ecNewFoundCollectibles, choice.outcome.collectibleDrop]
          messages.push(msg(`🎁 Collectible found: ${collectible.icon} ${collectible.name}!`, 'success', state.day))
        }
      }

      return {
        ...state,
        inventory: newInventory,
        party: newParty,
        day: newDay,
        health: getOverallHealth(newParty),
        selectedEncounterChoice: choice,
        foundCollectibles: ecNewFoundCollectibles,
        messageLog: messages,
      }
    }

    case 'DISMISS_ENCOUNTER': {
      return {
        ...state,
        phase: 'traveling',
        currentEncounter: null,
        selectedEncounterChoice: null,
      }
    }

    // ==================== SELL COLLECTIBLES ====================
    case 'SELL_COLLECTIBLE': {
      if (state.phase !== 'landmark' || !state.currentLocation?.hasStore) return state
      if (!state.foundCollectibles.includes(action.collectibleId)) return state

      const collectibleToSell = COLLECTIBLES.find(c => c.id === action.collectibleId)
      if (!collectibleToSell) return state

      const sellMessages = [...state.messageLog]
      sellMessages.push(msg(`Sold ${collectibleToSell.icon} ${collectibleToSell.name} for ${collectibleToSell.sellValue} SOL`, 'success', state.day))

      return {
        ...state,
        inventory: { ...state.inventory, sol: state.inventory.sol + collectibleToSell.sellValue },
        foundCollectibles: state.foundCollectibles.filter(id => id !== action.collectibleId),
        messageLog: sellMessages,
      }
    }

    // ==================== SAVE/LOAD ====================
    case 'LOAD_GAME': {
      return { ...action.savedState, foundCollectibles: action.savedState.foundCollectibles || [] }
    }

    case 'START_DAILY': {
      const seed = new Date().toISOString().slice(0, 10)
      const seedNum = dateSeed(seed)
      const dailyRng = seededRandom(seedNum)

      // Pick a daily profession based on seed
      const professionIndex = Math.floor(dailyRng() * PROFESSIONS.length)
      const profession = PROFESSIONS[professionIndex]

      // Create preset party
      const dailyParty = createParty(DEFAULT_NAMES, 'explorers')

      // Pick daily start epoch (1-5)
      const epoch = Math.floor(dailyRng() * 5) + 1

      const currentLocation = getCurrentLocation(0)
      const nextLocation = getNextLocation(0)

      return {
        ...createInitialState(),
        phase: 'general_store',
        mode: 'veteran',
        teamType: 'explorers',
        profession,
        party: dailyParty,
        inventory: { ...INITIAL_INVENTORY, sol: profession.startingSol },
        startEpoch: epoch,
        isDaily: true,
        dailySeed: seed,
        rngState: seedNum,
        currentLocation,
        nextLocation,
        messageLog: [
          msg(`📅 DAILY CHALLENGE — ${seed}`, 'system', 0),
          msg(`Today's profession: ${profession.icon} ${profession.name} (${profession.scoreMultiplier}x score)`, 'info', 0),
          msg(`Grab your supplies and hit the trail!`, 'info', 0),
        ],
      }
    }

    case 'START_TURBO': {
      return {
        ...createInitialState(),
        phase: 'mode_select',
        isTurbo: true,
        totalDistance: 500,
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
