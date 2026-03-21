import { Collectible, CollectibleRarity, GameState } from './types'
import { getAliveCount } from './party'

export const COLLECTIBLES: Collectible[] = [
  // === COMMON (sellValue: 2 SOL) ===
  { id: 'whale_receipt', name: "Whale's Staking Receipt", icon: '🧾', rarity: 'common', sellValue: 2, description: 'A receipt from when a whale staked SOL on your behalf. Smells like money.', source: 'Accept a Wandering Whale\'s offer' },
  { id: 'vc_card', name: 'VC Business Card', icon: '💼', rarity: 'common', sellValue: 2, description: 'A sleek card with "Web3 Fund" embossed in gold. The back says "We invest in vibes."', source: 'Accept funding from a VC Recruiter' },
  { id: 'airdrop_split', name: 'Airdrop Split Token', icon: '🎯', rarity: 'common', sellValue: 2, description: 'Your share of a split airdrop. It\'s not much, but it\'s honest work.', source: 'Split an airdrop with a fellow hunter' },
  { id: 'yield_receipt', name: 'Yield Farm Receipt', icon: '🌾', rarity: 'common', sellValue: 2, description: 'Proof you aped into a yield farm and somehow didn\'t get rugged.', source: 'Ape into a yield farm' },
  { id: 'hackathon_badge', name: 'Hackathon Badge', icon: '🤝', rarity: 'common', sellValue: 2, description: 'A lanyard badge from a degen meetup. Still has pizza grease on it.', source: 'Join a hackathon/degen meetup' },

  // === UNCOMMON (sellValue: 5 SOL) ===
  { id: 'gratitude_note', name: 'Gratitude Note', icon: '📝', rarity: 'uncommon', sellValue: 5, description: 'A heartfelt note from a degen you helped. "Thanks ser, WAGMI."', source: 'Help a Lost Degen find their way' },
  { id: 'degen_hoodie', name: "Degen's Lucky Hoodie", icon: '👕', rarity: 'uncommon', sellValue: 5, description: 'A worn hoodie found at an abandoned setup. Has "WAGMI" stitched inside the collar.', source: 'Search an abandoned degen setup' },
  { id: 'salvaged_cpu', name: 'Salvaged Bot CPU', icon: '🔧', rarity: 'uncommon', sellValue: 5, description: 'A processor chip from a broken trading bot. Still warm.', source: 'Fix a Broken Bot on the trail' },
  { id: 'fud_trophy', name: 'FUD Slayer Trophy', icon: '🏆', rarity: 'uncommon', sellValue: 5, description: 'A tiny trophy for winning an argument against FUD. It says "I was right" on the base.', source: 'Argue with a FUD Spreader and win' },
  { id: 'staking_gem', name: 'Epoch Staking Gem', icon: '💎', rarity: 'uncommon', sellValue: 5, description: 'A crystallized epoch reward. Glows faintly when near a validator.', source: 'Collect staking rewards' },

  // === RARE (sellValue: 15 SOL) ===
  { id: 'pixelated_nft', name: 'Pixelated NFT', icon: '🖼️', rarity: 'rare', sellValue: 15, description: 'A lovingly crafted pixel art NFT. The artist was so grateful you bought one.', source: 'Buy an NFT from a struggling artist' },
  { id: 'golden_airdrop', name: 'Golden Airdrop Token', icon: '✨', rarity: 'rare', sellValue: 15, description: 'A shimmering token from a surprise airdrop. Might be worth something someday.', source: 'Claim an airdrop' },
  { id: 'alpha_intel', name: 'Classified Alpha Intel', icon: '📋', rarity: 'rare', sellValue: 15, description: 'A sealed envelope of alpha. The contents are... actually pretty good.', source: 'Buy alpha from a Shady Dealer' },
  { id: 'race_trophy', name: 'Degen Race Trophy', icon: '🏁', rarity: 'rare', sellValue: 15, description: 'First place in an impromptu race against a rival party. They want a rematch.', source: 'Win a race against a Rival Party' },

  // === EPIC (sellValue: 40 SOL) ===
  { id: 'og_mint_pass', name: 'OG Mint Pass', icon: '🎫', rarity: 'epic', sellValue: 40, description: 'A mint pass from a gas war you survived. Battle-scarred but legendary.', source: 'Win a Mint War gas battle' },
  { id: 'genesis_coin', name: 'Genesis Block Coin', icon: '🪙', rarity: 'epic', sellValue: 40, description: 'A commemorative coin from the Genesis Block. Only true degens earn this.', source: 'Win the game as a Memecoin Degen' },

  // === LEGENDARY (sellValue: 100 SOL) ===
  { id: 'signed_hw_wallet', name: 'Signed Hardware Wallet', icon: '🔐', rarity: 'legendary', sellValue: 100, description: 'A hardware wallet signed by a Solana OG. The seed phrase is "trust the process."', source: 'Listen to a Solana OG\'s wisdom' },
  { id: 'diamond_ring', name: 'Diamond Hands Ring', icon: '💍', rarity: 'legendary', sellValue: 100, description: 'A ring forged from pure diamond hands energy. Your entire crew survived the trail.', source: 'Reach Mainnet with all 5 party members alive' },
]

// Rarity display config
export const RARITY_COLORS: Record<CollectibleRarity, { text: string; bg: string; border: string }> = {
  common: { text: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-500/30' },
  uncommon: { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-500/30' },
  rare: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/30' },
  epic: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-500/30' },
  legendary: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-500/30' },
}

const RARITY_ORDER: Record<CollectibleRarity, number> = {
  legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4,
}

export function getCollectiblesSortedByRarity(): Collectible[] {
  return [...COLLECTIBLES].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])
}

// Check for special collectibles awarded at game end (not from event/encounter drops)
export function checkSpecialCollectibles(state: GameState): string[] {
  const found: string[] = []
  const alive = getAliveCount(state.party)
  if (state.phase === 'victory' && alive === state.party.length && state.party.length === 5) {
    found.push('diamond_ring')
  }
  if (state.phase === 'victory' && state.profession?.id === 'degen') {
    found.push('genesis_coin')
  }
  return found
}

// === LOCAL PERSISTENCE ===

const STORAGE_KEY = 'solana-trail-collectibles'

export function loadCollectibles(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveCollectibles(ids: string[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // silent fail
  }
}

// === SERVER-SYNCED PERSISTENCE ===

export async function loadCollectiblesServer(walletAddress?: string): Promise<string[]> {
  try {
    const params = walletAddress ? `?wallet=${walletAddress}` : ''
    const res = await fetch(`/api/collectibles${params}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch')
    const serverIds: string[] = await res.json()
    const localIds = loadCollectibles()
    const merged = [...new Set([...serverIds, ...localIds])]
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
    }
    return merged
  } catch {
    return loadCollectibles()
  }
}

export async function saveCollectiblesServer(ids: string[], walletAddress?: string) {
  saveCollectibles(ids)
  try {
    await fetch('/api/collectibles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, walletAddress: walletAddress || 'anonymous' }),
    })
  } catch {
    // localStorage has it as fallback
  }
}
