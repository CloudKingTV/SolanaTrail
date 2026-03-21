import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

function getPlayerKey(req: NextRequest): string {
  const wallet = req.nextUrl.searchParams.get('wallet') || req.headers.get('x-wallet')
  if (wallet && wallet !== 'anonymous') return `achievements:wallet:${wallet}`
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  return `achievements:ip:${ip}`
}

// GET /api/achievements?wallet=xxx — fetch unlocked achievement IDs
export async function GET(req: NextRequest) {
  const key = getPlayerKey(req)
  try {
    const ids = await redis.get<string[]>(key)
    return NextResponse.json(ids || [])
  } catch {
    return NextResponse.json([])
  }
}

// POST /api/achievements — save newly earned achievement IDs
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { ids, walletAddress } = body

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid ids' }, { status: 400 })
    }

    const wallet = walletAddress || undefined
    let key: string
    if (wallet && wallet !== 'anonymous') {
      key = `achievements:wallet:${wallet}`
    } else {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || req.headers.get('x-real-ip')
        || 'unknown'
      key = `achievements:ip:${ip}`
    }

    const existing = await redis.get<string[]>(key) || []
    const merged = [...new Set([...existing, ...ids])]
    await redis.set(key, merged)

    return NextResponse.json({ success: true, achievements: merged })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
