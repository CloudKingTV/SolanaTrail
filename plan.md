# Plan: Fix Collectible Sync + Sell Items at Outposts

## Problem 1: Items don't appear until game ends
Currently, `foundCollectibles` lives only in GameState during a run. The server/localStorage sync happens exclusively in the `useEffect` that watches `state.phase === 'victory' || 'gameOver'` (GameScreen.tsx ~line 115). If the player quits mid-run or checks the Items tab from the title screen, collected items are lost.

## Problem 2: No way to sell collectibles
The user wants to sell collected items at outpost stores for SOL during gameplay.

---

## Fix 1: Sync collectibles immediately when found

**File: `components/game/GameScreen.tsx`**

Add a new `useEffect` that watches `state.foundCollectibles.length`. Whenever the array grows, immediately sync to both localStorage and server, and update the `allCollectibles` React state so the Items tab reflects it even if the player quits.

```typescript
useEffect(() => {
  if (state.foundCollectibles.length > 0) {
    const newlyFound = state.foundCollectibles.filter(id => !allCollectibles.includes(id))
    if (newlyFound.length > 0) {
      const updated = [...new Set([...allCollectibles, ...state.foundCollectibles])]
      setAllCollectibles(updated)
      saveCollectiblesServer(state.foundCollectibles, walletAddress)
    }
  }
}, [state.foundCollectibles.length])
```

The existing game-end sync block still handles `checkSpecialCollectibles()` (diamond ring, genesis coin) since those require game completion. Simplify the game-end block to only deal with special collectibles.

---

## Fix 2: Sell collectibles at outposts

### Step 2a: Add sell values to collectible definitions

**File: `lib/game/types.ts`**
- Add `sellValue: number` to the `Collectible` interface

**File: `lib/game/collectibles.ts`**
- Add `sellValue` to every collectible definition, scaled by rarity:
  - Common: 2 SOL
  - Uncommon: 5 SOL
  - Rare: 15 SOL
  - Epic: 40 SOL
  - Legendary: 100 SOL

### Step 2b: Add game action and engine handler

**File: `lib/game/types.ts`**
- Add `SELL_COLLECTIBLE` to the `GameAction` union type:
  ```typescript
  | { type: 'SELL_COLLECTIBLE'; collectibleId: string }
  ```

**File: `lib/game/engine.ts`**
- Add `SELL_COLLECTIBLE` case in the reducer:
  - Verify player is at a landmark with `hasStore` and has the collectible in `foundCollectibles`
  - Look up the collectible's `sellValue`
  - Remove collectible ID from `foundCollectibles`
  - Add SOL to `inventory.sol`
  - Push message: `"Sold {icon} {name} for {value} SOL"`

### Step 2c: Add sell UI to LandmarkView

**File: `components/game/LandmarkView.tsx`**
- Add a **"💎 Sell Items"** button in the landmark action grid at forts (where `hasStore === true`)
- Clicking it toggles an inline sell panel showing each collectible from `foundCollectibles`:
  - Icon, name, rarity-colored text, sell value in SOL
  - Individual "Sell" button per item → dispatches `SELL_COLLECTIBLE`
- When no collectibles to sell, the button shows disabled or with "(0)" count
- Panel is collapsible within the existing landmark view (no new phase needed)

### Step 2d: Pass foundCollectibles to LandmarkView

**File: `components/game/GameScreen.tsx`**
- Ensure `state.foundCollectibles` (or the full state) is passed to `LandmarkView` so it knows what items can be sold
- Pass `dispatch` so the sell buttons can fire `SELL_COLLECTIBLE` actions

---

## Files Changed

| File | Change |
|---|---|
| `lib/game/types.ts` | Add `sellValue` to `Collectible` interface, add `SELL_COLLECTIBLE` action type |
| `lib/game/collectibles.ts` | Add `sellValue` to all 18 collectible definitions |
| `lib/game/engine.ts` | Add `SELL_COLLECTIBLE` reducer case |
| `components/game/GameScreen.tsx` | Add immediate-sync useEffect for foundCollectibles, simplify game-end sync to only special collectibles |
| `components/game/LandmarkView.tsx` | Add "Sell Items" button and inline sell panel at forts |

## Implementation Order
1. Fix immediate sync (GameScreen.tsx useEffect) — fixes the bug
2. Add sellValue to types and collectible definitions
3. Add SELL_COLLECTIBLE action type and engine handler
4. Add sell UI to LandmarkView
5. Verify the full flow works end-to-end
