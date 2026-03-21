import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

function getPlayerKey(req: NextRequest, walletAddress?: string): string {
  const wallet = walletAddress || req.nextUrl.searchParams.get('wallet') || req.headers.get('x-wallet')
  if (wallet && wallet !== 'anonymous') return `collectibles:wallet:${wallet}`
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  return `collectibles:ip:${ip}`
}

// GET /api/collectibles?wallet=xxx — fetch collected item IDs
export async function GET(req: NextRequest) {
  const key = getPlayerKey(req)
  try {
    const ids = await redis.get<string[]>(key)
    return NextResponse.json(ids || [])
  } catch {
    return NextResponse.json([])
  }
}

// POST /api/collectibles — save newly found collectible IDs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ids, walletAddress } = body

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid ids' }, { status: 400 })
    }

    const key = getPlayerKey(req, walletAddress)
    await redis.set(key, ids)

    return NextResponse.json({ success: true, collectibles: ids })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
