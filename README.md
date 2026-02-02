# 🏦 KingYieldAggregator - DeFi Vault Frontend

[![Built by BuildsWithKing](https://img.shields.io/badge/Built%20by-BuildsWithKing-gold)](https://github.com/BuildsWithKing)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)

> **Institutional-grade DeFi yield optimization on Base Sepolia testnet**

A modern, responsive web application for interacting with the KingYieldAggregator smart contract system - an automated yield aggregator that maximizes returns by dynamically allocating funds across multiple DeFi strategies.

---

## Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Smart Contracts](#-smart-contracts)
- [Usage Guide](#-usage-guide)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## Features

### Core Functionality
- **Secure Wallet Connection** - RainbowKit integration with multiple wallet support
- **Deposit & Withdraw** - Two-step approval process with real-time feedback
- **Live Dashboard** - Auto-refreshing stats (TVL, APY, shares, deployed capital)
- **Auto-Rebalancing** - Automated strategy switching to highest APR
- **Strategy Management** - Add, remove, and set active strategies (admin only)
- **Real-time APR Display** - Live strategy performance metrics

### User Experience
- **Auto-refresh** - Data updates every 4-5 seconds automatically
- **Manual Refresh** - One-click data refresh button
- **Professional UI** - Clean black & green design with smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Transaction Notifications** - Clear status updates for all operations
- **Error Handling** - Comprehensive error messages and guidance

### Advanced Features
- **Debug Tools** - Built-in debugging pages for troubleshooting
- **Strategy Analytics** - Detailed APR breakdown per strategy
- **Role-based Access** - Admin controls for authorized addresses only
- **Smart Allowance** - Automatic detection of approval requirements

---

## Live Demo

**Testnet Demo:** [kingYieldAggreator](https://kingyieldaggregator.vercel.app/)

**Network:** Base Sepolia Testnet  
**Test Tokens:** Request testnet tokens in [Discord](#https://discord.gg/t7Wgs73z)

---

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### Web3 Libraries
- **wagmi v2** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI

### UI Components
- **Lucide React** - Beautiful icons
- **Custom Components** - Hand-crafted UI elements

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A crypto wallet (MetaMask, Coinbase Wallet, etc.)
- Base Sepolia testnet RPC access

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/BuildsWithKing/king-yield-aggregator-frontend.git
cd king-yield-aggregator-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

Get your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)

4. **Update contract addresses**

Edit `lib/contracts/config.ts` with your deployed contract addresses:
```typescript
export const CONTRACTS = {
  VAULT_CORE: '0xYourVaultCoreAddress',
  STRATEGY_MANAGER: '0xYourStrategyManagerAddress',
  REBALANCER: '0xYourRebalancerAddress',
  ASSET_TOKEN: '0xYourTokenAddress',
};
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
kingyieldaggregator-frontend/
├──app
|  ├── favicon.ico
|  ├── globals.css
|  ├── layout.tsx
|  └── page.tsx
├──lib
|  ├── contracts
|  │   └── config.ts
|  └── wagmi.ts
```

---

## Smart Contracts

### Contract Architecture

The frontend interacts with 4 main smart contracts:

1. **VaultCore** - Core vault logic (deposits, withdrawals, shares)
2. **StrategyManager** - Strategy management and allocation
3. **Rebalancer** - Automated rebalancing mechanism
4. **ERC20 Token** - Asset token (KYAUSD token on testnet)

### Deployed Addresses (Base Sepolia)

```
VaultCore:        0x1d0D871aC5F49415e48F74279f849b296509714b
StrategyManager:  0x2c8E9b136143BF33BDa40865FfB6457F94E0816E
Rebalancer:       0xa83ea1bAEFFDee6A193fB0136DCDFE3EF132759e
Asset Token:      0xa20Fd06FA93802c9906e82d02C774aa0a4110E25
```

### Contract Source Code

Smart contract repository: [KingYieldAggregator-Contracts](https://github.com/BuildsWithKing/king-yield-aggregator)

---

## Usage Guide

### For Regular Users

#### 1. Connect Wallet
- Click "Connect Wallet" button
- Select your wallet provider
- Approve the connection
- Ensure you're on Base Sepolia network

#### 2. Get Test Tokens
- Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
- Request testnet ETH for gas
- Request KYAUSD from [Discord](#https://discord.gg/t7Wgs73z)

#### 3. Deposit Funds
- Enter amount to deposit
- Click "Approve & Deposit"
- Confirm approval transaction (first time only)
- Confirm deposit transaction
- Your shares will appear in ~5 seconds

#### 4. Monitor Returns
- View your annual yield rate on "Your Position Value" section
- See highest APY on the dashboard
- View strategy allocation details

#### 5. Withdraw Funds
- Enter shares amount to withdraw
- Click "Withdraw" or "Withdraw All"
- Confirm transaction
- Receive your funds

### For Admins

#### Adding Strategies
1. Navigate to "Admin Controls" tab
2. Enter strategy contract address
3. Click "Add Strategy"
4. Confirm transaction

#### Setting Active Strategy
1. Enter strategy ID (1, 2, 3, etc.)
2. Click "Set Active"
3. Confirm transaction

#### Rebalancing
1. Click "Execute Rebalance"
2. Confirm transaction
3. Funds move to highest APR strategy

---

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Adding New Features

1. **Create new page:** Add file to `app/` directory
2. **Add contract interaction:** Update `lib/contracts/config.ts`
3. **Style components:** Use Tailwind classes
4. **Test thoroughly:** Test on Base Sepolia

### Debug Pages

The app includes several debug pages:

- `/debug` - Strategy overview and diagnostics
- `/apy-debug` - APY calculation troubleshooting
- `/fix-apr` - APR setter for strategies
- `/rebalancer-debug` - Rebalancer diagnostics

---

## Deployment

### Manual Deployment

```bash
# Build the application
npm run build

# The output is in .next/ directory
# Deploy this to your hosting provider
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Tailwind for styling
- Write descriptive commit messages

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built by [BuildsWithKing](https://github.com/BuildsWithKing)
- Powered by [Base](https://base.org) blockchain
- UI inspiration from modern DeFi protocols
- Smart contract security by [Foundry](https://book.getfoundry.sh/)

---

## Support

- **GitHub Issues:** [Report bugs](https://github.com/BuildsWithKing/king-yield-aggregator-frontend/issues)
- **Twitter:** [@BuildsWithKing](https://twitter.com/BuildsWithKing)

---

## Roadmap

- [ ] Mainnet deployment
- [ ] Additional strategy types
- [ ] Mobile app
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support
- [ ] Governance token integration

---

## Disclaimer

This is experimental software deployed on testnet for demonstration purposes. Do not use with real funds. Always DYOR (Do Your Own Research) before interacting with any DeFi protocol.

---

<div align="center">
  <strong>Built by BuildsWithKing | 2026</strong>
  <br>
  <sub>Tested with 100% coverage using Foundry</sub>
</div>