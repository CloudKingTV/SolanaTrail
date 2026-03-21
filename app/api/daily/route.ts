import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

function todaysSeed(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function getPlayerKey(req: NextRequest, wallet?: string): string {
  if (wallet && wallet !== 'anonymous') return `wallet:${wallet}`
  // Fallback to IP-based tracking
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  return `ip:${ip}`
}

// GET /api/daily?wallet=xxx — check if player has already played today
export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet') || undefined
  const playerKey = getPlayerKey(req, wallet)
  const seed = todaysSeed()
  const redisKey = `daily:${seed}`

  try {
    const played = await redis.sismember(redisKey, playerKey)
    return NextResponse.json({ played: !!played, seed })
  } catch {
    return NextResponse.json({ played: false, seed })
  }
}

// POST /api/daily — mark player as having played today
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const wallet = body.walletAddress || undefined
    const playerKey = getPlayerKey(req, wallet)
    const seed = todaysSeed()
    const redisKey = `daily:${seed}`

    await redis.sadd(redisKey, playerKey)
    // Expire at end of day + 1 hour buffer (25 hours from now)
    await redis.expire(redisKey, 90000)

    return NextResponse.json({ marked: true, seed })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
