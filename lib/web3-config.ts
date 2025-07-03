import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { injected } from 'wagmi/connectors';

// Define Anvil local chain
export const anvilChain = defineChain({
  id: 31337,
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Local', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
});

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: [anvilChain],
  connectors: [injected()],
  transports: {
    [anvilChain.id]: http('http://127.0.0.1:8545'),
  },
});

// Declare module for wagmi config
declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
} 