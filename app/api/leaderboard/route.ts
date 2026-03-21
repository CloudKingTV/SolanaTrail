import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

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
  timestamp: number
}

const DATA_DIR = join(process.cwd(), 'data')
const DATA_FILE = join(DATA_DIR, 'leaderboard.json')
const MAX_ENTRIES = 50

async function readEntries(): Promise<LeaderboardEntry[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeEntries(entries: LeaderboardEntry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2))
}

export async function GET() {
  const entries = await readEntries()
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
      timestamp: Date.now(),
    }

    const entries = await readEntries()
    entries.push(entry)
    entries.sort((a, b) => b.score - a.score)
    const top = entries.slice(0, MAX_ENTRIES)

    await writeEntries(top)

    const rank = top.findIndex(e => e.timestamp === entry.timestamp) + 1

    return NextResponse.json({ rank, entries: top })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
