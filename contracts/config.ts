// Contract addresses - supports both local and Monad Testnet
export const CONTRACT_ADDRESSES = {
  // Monad Testnet addresses
  monadTestnet: {
    nadmonNFT: "0xd6486e985Db773f3eb5767cE5FBe099e31D87A1e",
    cookiesToken: "0xC5f6e87a61dAa7a15B458318e4D05C82C0cCD10b",
    expeditionCenter: "0x5a7fc62B6EF9ACc5AD1a9a7E582b2A636ab83504",
    pveBattle: "0xAb87cf4A9ee8Ab510ca8a96546E71f97CD92DC8a",
    pvpBattle: "0xe1DD9f7C03281A659998bDDd84019c93473F5C7e",
    weeklyRewards: "0xE0E0C7731b99659dC0b3624f2147bD929E3B503D",
    nadmonRandomizer: "0x400c5BDee811120bc484979F9018beA8ea8E713D",
  },
  
  // Local Anvil addresses
  anvil: {
    nadmonNFT: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    cookiesToken: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    expeditionCenter: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    pveBattle: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    pvpBattle: "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e",
    weeklyRewards: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    mockMON: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    nadmonRandomizer: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  }
} as const;

// Helper function to get contract addresses based on chain
export function getContractAddresses(chainId: number) {
  switch (chainId) {
    case 10143: // Monad Testnet
      return CONTRACT_ADDRESSES.monadTestnet;
    case 31337: // Anvil Local
      return CONTRACT_ADDRESSES.anvil;
    default:
      return CONTRACT_ADDRESSES.monadTestnet; // Default to Monad Testnet
  }
}

// Local network configuration
export const ANVIL_CHAIN = {
  id: 31337,
  name: "Anvil Local",
  network: "anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Anvil", url: "http://127.0.0.1:8545" },
  },
} as const;

// Test accounts (Anvil's default accounts)
export const TEST_ACCOUNTS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    name: "Test Account 1",
  },
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    name: "Test Account 2",
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    name: "Test Account 3",
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    name: "Test Account 4",
  },
] as const; 