// NFT minting for game completion
// Uses Metaplex Core when available, otherwise logs intent

export interface CompletionNFTMetadata {
  playerName: string
  score: number
  days: number
  survivors: number
  totalParty: number
}

export async function mintCompletionNFT(
  walletAddress: string,
  metadata: CompletionNFTMetadata
): Promise<string | null> {
  // In devnet with Privy, we'd need the wallet signer
  // For now, this creates the metadata and logs the intent
  // Full Metaplex Core integration requires the connected wallet's signer

  console.log('Minting completion NFT for:', walletAddress)
  console.log('Metadata:', metadata)

  // Placeholder: In production, this would:
  // 1. Create Umi instance with wallet signer
  // 2. Upload metadata to Arweave/IPFS
  // 3. Mint using Metaplex Core
  // 4. Return the mint address

  const mockMintAddress = `SolTrail${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

  // Store locally as proof of completion
  if (typeof window !== 'undefined') {
    const nfts = JSON.parse(localStorage.getItem('solana-trail-nfts') || '[]')
    nfts.push({
      mintAddress: mockMintAddress,
      walletAddress,
      metadata,
      timestamp: Date.now(),
    })
    localStorage.setItem('solana-trail-nfts', JSON.stringify(nfts))
  }

  return mockMintAddress
}
