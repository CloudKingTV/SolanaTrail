import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

interface LeaderboardEntry {
  playerName: string
  walletAddress: string
  score: number
  day: number
  distanceTraveled: number
  survived: number
  totalParty: number
  victory: boolean
  profession?: string
  professionIcon?: string
  isDaily?: boolean
  isTurbo?: boolean
  timestamp: number
}

const MAX_ENTRIES = 50

function kvKey(type: string): string {
  if (type === 'daily') return 'leaderboard:daily'
  if (type === 'turbo') return 'leaderboard:turbo'
  return 'leaderboard:normal'
}

async function readEntries(type: string): Promise<LeaderboardEntry[]> {
  try {
    const entries = await redis.get<LeaderboardEntry[]>(kvKey(type))
    return entries || []
  } catch {
    return []
  }
}

async function writeEntries(type: string, entries: LeaderboardEntry[]): Promise<void> {
  await redis.set(kvKey(type), entries)
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') || 'normal'
  const entries = await readEntries(type)
  entries.sort((a, b) => b.score - a.score)
  return NextResponse.json(entries.slice(0, MAX_ENTRIES))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate
    if (!body.playerName || typeof body.playerName !== 'string' || body.playerName.length > 10) {
      return NextResponse.json({ error: 'Invalid player name' }, { status: 400 })
    }
    if (typeof body.score !== 'number' || body.score < 0) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }

    const isDaily = !!body.isDaily
    const isTurbo = !!body.isTurbo
    const type = isTurbo ? 'turbo' : isDaily ? 'daily' : 'normal'

    const entry: LeaderboardEntry = {
      playerName: body.playerName.slice(0, 10).toUpperCase(),
      walletAddress: body.walletAddress || 'anonymous',
      score: Math.round(body.score),
      day: body.day || 0,
      distanceTraveled: body.distanceTraveled || 0,
      survived: body.survived || 0,
      totalParty: body.totalParty || 5,
      victory: !!body.victory,
      profession: body.profession,
      professionIcon: body.professionIcon,
      isDaily,
      isTurbo,
      timestamp: body.timestamp || Date.now(),
    }

    const entries = await readEntries(type)
    entries.push(entry)
    entries.sort((a, b) => b.score - a.score)
    const top = entries.slice(0, MAX_ENTRIES)

    await writeEntries(type, top)

    const rank = top.findIndex(e => e.timestamp === entry.timestamp) + 1

    return NextResponse.json({ rank, entries: top })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
