# Implementation Plan: Daily Challenge, Game History, Live Leaderboard

## Feature 1: Daily Challenge (Fix — Currently Non-Functional)

**Problem:** The Daily Challenge button exists and sets `isDaily: true` + `dailySeed`, but the seed is never used. The game plays identically to a normal game with `Math.random()`. There's no unique daily experience.

### Steps:
1. **Create a seeded random number generator** in `lib/game/random.ts`
   - Simple mulberry32 PRNG seeded from the daily date string
   - Export a `createSeededRandom(seed: string)` function that returns a `() => number` (0-1 range, like Math.random)

2. **Add `rng` to GameState** (in `types.ts`)
   - Add a `rngState: number` field to GameState so the seeded RNG state persists across dispatches
   - The daily seed creates deterministic games — everyone on the same day gets the same events, encounters, weather

3. **Wire seeded RNG through the engine** (`engine.ts`)
   - When `isDaily` is true, use the seeded RNG instead of `Math.random()` for: events, encounters, river depths, weather, hunting results, trading prices
   - Pass the RNG through `getRandomEvent()`, `getRandomEncounter()`, `generateTokenPrices()`, etc.
   - Non-daily games continue using `Math.random()` as before

4. **Daily Challenge goes straight to gameplay** (skip mode/team/profession select)
   - `START_DAILY` should set a fixed config: mode `'explorer'`, team `'explorers'`, a preset party, profession `'trader'` (or random daily profession)
   - Jump directly to `phase: 'epoch_select'` or `'traveling'` so the daily is a quick, standardized challenge

5. **Show daily score comparison after completion**
   - On game over for daily, show "Your Score: X" and (future) compare against others
   - Store daily scores in localStorage keyed by date

## Feature 2: Game History (New Feature)

**Problem:** No record of past games exists. When a game ends, the save is deleted and the only trace is the leaderboard entry (if submitted).

### Steps:
1. **Create `lib/game/history.ts`** with:
   - `GameHistoryEntry` interface: `{ id, date, score, days, distanceTraveled, totalDistance, victory, profession, teamType, mode, partySurvivors, partyTotal, partyNames, solRemaining, timestamp }`
   - `HISTORY_KEY = 'solana-trail-history'` in localStorage
   - `getGameHistory(): GameHistoryEntry[]` — returns all past games sorted by date (newest first)
   - `addGameToHistory(state: GameState): void` — extracts summary from final GameState and saves
   - Cap at 50 entries max

2. **Auto-save to history on game end** (`GameScreen.tsx`)
   - In the existing `useEffect` that fires on `gameOver`/`victory`, call `addGameToHistory(state)`
   - This happens automatically — no user action needed

3. **Create `components/game/GameHistory.tsx`** component:
   - List view showing all past games as cards
   - Each card shows: date, score (if victory), days survived, distance, party survivors, profession icon
   - Victory games get a green border/glow, deaths get red
   - Tapping a card expands it to show full details: party names + status, inventory remaining, how far they got

4. **Add "Game History" button to title screen** (`GameScreen.tsx`)
   - New button between Achievements and the footer
   - Style: ghost button like Achievements, with a 📜 icon
   - Shows count of past games: `📜 Game History (12)`
   - Toggles the GameHistory component (same pattern as AchievementsView)

## Feature 3: Live Arcade Leaderboard with Name Entry (Overhaul)

**Problem:** Current leaderboard is localStorage-only (private to each browser), shows wallet addresses instead of names, and isn't "live" or shared.

### Steps:
1. **Add player name entry to leaderboard flow**
   - When the user taps "Submit to Leaderboard" on GameOver, show a name entry modal first
   - Classic arcade style: 3-character name input (or allow up to 10 chars for modern feel)
   - Default to "AAA" with arrow-up/down buttons per character, OR a simple text input
   - Store the name in the LeaderboardEntry

2. **Update `LeaderboardEntry` interface** (`lib/solana/leaderboard.ts`)
   - Add `playerName: string` field
   - Add `profession?: string` field
   - Add `distanceTraveled: number` field

3. **Create an API route for shared leaderboard** (`app/api/leaderboard/route.ts`)
   - `GET /api/leaderboard` — returns top 50 scores from a JSON file or simple DB
   - `POST /api/leaderboard` — submits a new score entry
   - For simplicity, use a JSON file (`data/leaderboard.json`) as storage since this is a game, not a bank
   - Include basic validation: score must be positive, name must be 1-10 chars, no duplicate spam (rate limit by IP or timestamp)

4. **Update leaderboard submission flow** (`GameScreen.tsx`, `GameOver.tsx`)
   - GameOver's "Submit to Leaderboard" opens the name entry modal
   - After name entry, POST to `/api/leaderboard`
   - Also save locally as fallback
   - Show confirmation with rank position

5. **Redesign the leaderboard page** (`app/leaderboard/page.tsx`)
   - Fetch from API route instead of localStorage
   - Classic arcade aesthetic: dark background, glowing green text, pixel font
   - Columns: Rank | Name | Score | Days | Distance | Status (victory/death)
   - Top 3 get special styling (gold/silver/bronze)
   - Auto-refresh every 30 seconds for "live" feel
   - Add a "Your Best" highlight if the player has a score on the board

6. **Add Leaderboard button to title screen** (`GameScreen.tsx`)
   - New button in the title screen button group
   - Shows as an inline view (same pattern as achievements) rather than navigating to `/leaderboard`
   - Or keep it as a link but make it more prominent

7. **Create `components/game/NameEntryModal.tsx`**
   - Arcade-style name entry with character selection
   - Pixel font, green glow, retro feel
   - "ENTER YOUR NAME" header
   - Submit button saves and closes

## File Changes Summary

| File | Action |
|------|--------|
| `lib/game/random.ts` | **NEW** — Seeded PRNG |
| `lib/game/history.ts` | **NEW** — Game history storage |
| `lib/game/types.ts` | **EDIT** — Add rngState, GameHistoryEntry |
| `lib/game/engine.ts` | **EDIT** — Wire seeded RNG for daily, fix START_DAILY |
| `lib/game/events.ts` | **EDIT** — Accept optional RNG param |
| `lib/game/encounters.ts` | **EDIT** — Accept optional RNG param |
| `lib/game/tokens.ts` | **EDIT** — Accept optional RNG param |
| `lib/solana/leaderboard.ts` | **EDIT** — Add playerName, API integration |
| `components/game/GameScreen.tsx` | **EDIT** — Add history button, name entry, auto-save history |
| `components/game/GameOver.tsx` | **EDIT** — Add name entry modal trigger |
| `components/game/GameHistory.tsx` | **NEW** — Game history list + detail view |
| `components/game/NameEntryModal.tsx` | **NEW** — Arcade name entry |
| `app/api/leaderboard/route.ts` | **NEW** — API route for shared leaderboard |
| `app/leaderboard/page.tsx` | **EDIT** — Fetch from API, redesign |

## Implementation Order
1. Game History (simplest, self-contained)
2. Leaderboard overhaul (name entry + API + redesign)
3. Daily Challenge (most complex, touches many files)
