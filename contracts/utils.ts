import { CONTRACT_ADDRESSES, ANVIL_CHAIN } from './config';

// Import contract ABIs
import NadmonNFTABI from './NadmonNFT.json';
import CookiesTokenABI from './CookiesToken.json';
import PvEBattleABI from './PvEBattle.json';
import PvPBattleABI from './PvPBattle.json';
import ExpeditionCenterABI from './ExpeditionCenter.json';
import MockMONTokenABI from './MockMONToken.json';

// Export ABIs for easy access
export const ABIS = {
  nadmonNFT: NadmonNFTABI.abi,
  cookiesToken: CookiesTokenABI.abi,
  pveBattle: PvEBattleABI.abi,
  pvpBattle: PvPBattleABI.abi,
  expeditionCenter: ExpeditionCenterABI.abi,
  mockMON: MockMONTokenABI.abi,
} as const;

// Contract configurations for easy use
export const CONTRACTS = {
  nadmonNFT: {
    address: CONTRACT_ADDRESSES.nadmonNFT,
    abi: ABIS.nadmonNFT,
  },
  cookiesToken: {
    address: CONTRACT_ADDRESSES.cookiesToken,
    abi: ABIS.cookiesToken,
  },
  pveBattle: {
    address: CONTRACT_ADDRESSES.pveBattle,
    abi: ABIS.pveBattle,
  },
  pvpBattle: {
    address: CONTRACT_ADDRESSES.pvpBattle,
    abi: ABIS.pvpBattle,
  },
  expeditionCenter: {
    address: CONTRACT_ADDRESSES.expeditionCenter,
    abi: ABIS.expeditionCenter,
  },
  mockMON: {
    address: CONTRACT_ADDRESSES.mockMON,
    abi: ABIS.mockMON,
  },
} as const;

// Types for Nadmon NFT data
export interface Nadmon {
  tokenId: number;
  nadmonType: string;
  element: string;
  rarity: string;
  hp: bigint;
  attack: bigint;
  defense: bigint;
  crit: bigint;
  fusion: bigint;
  evo: bigint;
}

// Battle result type
export interface BattleResult {
  playerWon: boolean;
  cookiesReward: bigint;
  wasCritical: boolean;
}

// Player stats type
export interface PlayerStats {
  rating: bigint;
  wins: bigint;
  losses: bigint;
  totalBattles: bigint;
  weeklyWins: bigint;
  weeklyBattles: bigint;
}

// Utility functions for common operations
export const formatCookies = (amount: bigint): string => {
  return (Number(amount) / 1e18).toFixed(2);
};

export const formatMON = (amount: bigint): string => {
  return (Number(amount) / 1e18).toFixed(2);
};

export const parseTokenAmount = (amount: string): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * 1e18));
};

// Game constants
export const GAME_CONSTANTS = {
  maxDailyPvEBattles: 15,
  maxDifficulty: 5,
  packCostETH: "0.01", // ETH cost for packs
  expeditionDurations: [1, 6, 24, 72, 168], // hours
  expeditionCosts: [10, 50, 150, 350, 700], // COOKIES
} as const;

// Helper function to get readable rarity
export const getRarityColor = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'text-gray-600';
    case 'rare':
      return 'text-blue-600';
    case 'epic':
      return 'text-purple-600';
    case 'legendary':
      return 'text-yellow-600';
    case 'mythic':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Helper function to get element color
export const getElementColor = (element: string): string => {
  switch (element.toLowerCase()) {
    case 'fire':
      return 'text-red-500';
    case 'water':
      return 'text-blue-500';
    case 'earth':
      return 'text-green-500';
    case 'air':
      return 'text-gray-500';
    case 'electric':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
}; 