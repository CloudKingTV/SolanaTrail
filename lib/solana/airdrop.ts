import { getConnection } from './connection'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

export async function requestAirdrop(publicKeyStr: string, solAmount: number = 1): Promise<string> {
  const conn = getConnection()
  const pubkey = new PublicKey(publicKeyStr)

  const signature = await conn.requestAirdrop(
    pubkey,
    solAmount * LAMPORTS_PER_SOL
  )

  await conn.confirmTransaction(signature, 'confirmed')
  return signature
}
