# Solana Trail

A crypto-themed Oregon Trail game on Solana. Journey from **Genesis Block** to **Mainnet Launch** through the wild west of Web3.

## Features

- **Crypto-themed gameplay**: Navigate rug pulls, airdrops, MEV attacks, gas wars, and more
- **Solana wallet integration**: Connect via email or any Solana wallet (Phantom, Solflare, Backpack) through Privy
- **Mobile-first design**: Built for phones with touch-friendly UI and retro terminal aesthetic
- **On-chain leaderboard**: Submit your scores and compete
- **NFT achievements**: Mint a completion NFT when you reach Mainnet Launch
- **5 party members**: Developer, Validator Operator, NFT Artist, DeFi Degen, Protocol Founder
- **14 trail locations**: From Genesis Block through DeFi Swamp, MEV Forest, and beyond
- **15+ random events**: Airdrops, rug pulls, phishing attacks, governance votes, and more

## Quick Start

```bash
npm install
npm run dev
```

The game works in standalone mode without Privy configuration. For full wallet integration:

1. Create a free account at [privy.io](https://dashboard.privy.io)
2. Copy your App ID
3. Create `.env.local` from `.env.example` and add your App ID
4. Enable email + wallet login methods in the Privy dashboard

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** + **Tailwind CSS v4**
- **Privy** for wallet auth (email + Solana wallets)
- **@solana/web3.js** for blockchain interactions
- **Metaplex Core** for NFT minting (devnet)

## Game Mechanics

- **Resources**: SOL (currency), Validators (network), Bandwidth (fuel), Morale (vibes)
- **Pace**: Slow (safe), Steady (balanced), Reckless (fast but risky)
- **Trading Posts**: Buy validators, bandwidth, and morale boosts
- **Events**: Random crypto events with meaningful choices
- **Score**: Based on survival, speed, resources, and party health
