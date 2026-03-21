import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const MAX_ENTRIES = 50

function getPlayerKey(req: NextRequest): string {
  const wallet = req.nextUrl.searchParams.get('wallet') || req.headers.get('x-wallet')
  if (wallet && wallet !== 'anonymous') return `history:wallet:${wallet}`
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  return `history:ip:${ip}`
}

// GET /api/history?wallet=xxx — fetch game history
export async function GET(req: NextRequest) {
  const key = getPlayerKey(req)
  try {
    const entries = await redis.get<unknown[]>(key)
    return NextResponse.json(entries || [])
  } catch {
    return NextResponse.json([])
  }
}

// POST /api/history — add a game history entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { entry, walletAddress } = body

    const wallet = walletAddress || undefined
    let key: string
    if (wallet && wallet !== 'anonymous') {
      key = `history:wallet:${wallet}`
    } else {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown'
      key = `history:ip:${ip}`
    }

    const existing = await redis.get<unknown[]>(key) || []
    existing.unshift(entry)
    const trimmed = existing.slice(0, MAX_ENTRIES)
    await redis.set(key, trimmed)

    return NextResponse.json({ success: true, count: trimmed.length })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
