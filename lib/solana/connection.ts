import { Connection, clusterApiUrl } from '@solana/web3.js'

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet')

let connection: Connection | null = null

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(RPC_URL, 'confirmed')
  }
  return connection
}

export async function getBalance(publicKeyStr: string): Promise<number> {
  const { PublicKey } = await import('@solana/web3.js')
  const conn = getConnection()
  const pubkey = new PublicKey(publicKeyStr)
  const lamports = await conn.getBalance(pubkey)
  return lamports / 1e9 // Convert to SOL
}
