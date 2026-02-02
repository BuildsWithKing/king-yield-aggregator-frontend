import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'KingYieldAggregator',
  projectId: 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID',
  chains: [baseSepolia],
  ssr: true,
});