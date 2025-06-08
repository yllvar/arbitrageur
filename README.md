# BSC Flash Arbitrage Pro

Frontend application for executing arbitrage trades between PancakeSwap and ApeSwap on Binance Smart Chain.

<img width="386" alt="Screenshot 2025-06-08 at 14 17 23" src="https://github.com/user-attachments/assets/b2b8dcf7-1a51-4bb0-ab1d-cbbe5c136c78" />


## Features

- **Real-time Price Monitoring**: Live price feeds from multiple DEXs
- **Smart Contract Integration**: Connect to deployed ArbitrageExecutor contracts
- **Professional Trading Interface**: Execute flash loan arbitrage trades
- **Advanced Analytics**: Track performance and profitability
- **Web3 Integration**: MetaMask wallet connection and BSC network support
- **Push Notifications**: Browser alerts for arbitrage opportunities

## Getting Started

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Connect Your Wallet**
   - Install MetaMask browser extension
   - Connect to the application
   - Switch to BSC Mainnet or Testnet

4. **Deploy Your Contract**
   - Use the provided contract ABI to deploy your ArbitrageExecutor
   - Connect to your deployed contract in the Contract tab

## Architecture

This is a frontend-only application that:
- Connects to existing deployed smart contracts
- Fetches real-time price data from DEX APIs
- Provides a professional trading interface
- Handles Web3 wallet integration

## Contract Integration

The application expects an ArbitrageExecutor contract with the following interface:
- `startArbitrage()` - Execute flash loan arbitrage
- `owner()` - Get contract owner
- `beneficiary()` - Get beneficiary address

## Network Support

- **BSC Mainnet** (Chain ID: 56)
- **BSC Testnet** (Chain ID: 97)

## Security

- Frontend-only implementation
- No private keys stored
- Uses MetaMask for transaction signing
- Contract interaction through Web3 provider
