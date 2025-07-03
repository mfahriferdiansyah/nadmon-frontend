'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useReadContract } from 'wagmi';
import { getContractAddresses } from '@/contracts/config';
import type { PokemonCard } from '@/types/card';
import { getMonsterImagePath } from '@/utils/monster-images';

// Simple ABI for reading NFT data
const NADMON_READ_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "nadmons",
    "outputs": [
      {"internalType": "string", "name": "nadmonType", "type": "string"},
      {"internalType": "string", "name": "element", "type": "string"},
      {"internalType": "string", "name": "rarity", "type": "string"},
      {"internalType": "uint256", "name": "hp", "type": "uint256"},
      {"internalType": "uint256", "name": "attack", "type": "uint256"},
      {"internalType": "uint256", "name": "defense", "type": "uint256"},
      {"internalType": "uint256", "name": "crit", "type": "uint256"},
      {"internalType": "uint256", "name": "fusion", "type": "uint256"},
      {"internalType": "uint256", "name": "evo", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

interface NadmonData {
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

interface UseNadmonNFTsReturn {
  nfts: PokemonCard[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Color mapping for different elements
const getTypeColor = (type: string, element: string): string => {
  const elementColors: Record<string, string> = {
    'Fire': '#ff6b35',
    'Water': '#4dabf7', 
    'Grass': '#51cf66',
    'Electric': '#ffd43b',
    'Ice': '#74c0fc',
    'Rock': '#8c7853',
    'Ground': '#a67c52',
    'Flying': '#91a7ff',
    'Poison': '#9c88ff',
    'Bug': '#8bc34a',
    'Normal': '#9e9e9e',
    'Fighting': '#ff5722',
    'Psychic': '#e91e63',
    'Ghost': '#673ab7',
    'Dragon': '#3f51b5',
    'Dark': '#424242',
    'Steel': '#607d8b',
    'Fairy': '#f8bbd9',
  };
  
  return elementColors[element] || '#6c757d';
};

// Generate image URL for Nadmon
const getNadmonImageUrl = (type: string, evo: number): string => {
  const stage = evo === 1 ? 'i' : 'ii';
  const baseUrl = 'https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4';
  return `${baseUrl}/${type.toLowerCase()}-${stage}.png`;
};

// Helper function to transform blockchain NFT data to our card format
function transformNadmonToPokemonCard(tokenId: number, nadmonData: NadmonData): PokemonCard {
  const evolution = Number(nadmonData.evo) || 1
  
  // Map blockchain rarity to our type system
  const rarityMap: Record<string, "common" | "rare" | "epic" | "legendary"> = {
    'Common': 'common',
    'Rare': 'rare', 
    'Epic': 'epic',
    'Legendary': 'legendary'
  };
  
  const mappedRarity = rarityMap[nadmonData.rarity] || 'common';
  
  return {
    id: tokenId,
    name: nadmonData.nadmonType || `Nadmon #${tokenId}`,
    image: getMonsterImagePath(nadmonData.nadmonType, evolution),
    hp: Number(nadmonData.hp) || 100,
    attack: Number(nadmonData.attack) || 50,
    defense: Number(nadmonData.defense) || 40,
    speed: Math.floor((Number(nadmonData.hp) + Number(nadmonData.attack) + Number(nadmonData.defense)) / 10) || 30, // Calculate speed based on other stats
    type: nadmonData.element || 'Normal',
    rarity: mappedRarity,
    critical: Number(nadmonData.crit) || 30,
    color: getElementColor(nadmonData.element),
  }
}

// Helper function to get element color
function getElementColor(element: string): string {
  const colorMap: Record<string, string> = {
    'Fire': '#ff6b6b',
    'Water': '#4ecdc4', 
    'Nature': '#95e1d3',
    'Earth': '#8b5a3c',
    'Electric': '#ffd93d',
    'Ice': '#74c0fc',
    'Dark': '#495057',
    'Light': '#ffd43b',
  };
  
  return colorMap[element] || '#6c757d';
}

export function useNadmonNFTs(): UseNadmonNFTsReturn {
  const { address } = useAccount();
  const chainId = useChainId();
  const [nfts, setNfts] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const contracts = getContractAddresses(chainId);

  // Get user's NFT balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: contracts.nadmonNFT as `0x${string}`,
    abi: NADMON_READ_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contracts.nadmonNFT,
      refetchInterval: 15000, // Refetch every 15 seconds
    }
  });

  // Get total supply to know the range of token IDs to check
  const { data: totalSupply } = useReadContract({
    address: contracts.nadmonNFT as `0x${string}`,
    abi: NADMON_READ_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!contracts.nadmonNFT,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
    refetchBalance();
  }, [refetchBalance]);

  // Optimized NFT fetching with better error handling
  useEffect(() => {
    if (!address || !balance || Number(balance) === 0) {
      setNfts([]);
      setLoading(false);
      return;
    }

    const fetchRealNFTs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`🔍 Fetching ${balance} real NFTs for ${address}`);
        const realNFTs: PokemonCard[] = [];

        // Import wagmi functions
        const { readContract } = await import('wagmi/actions');
        const { wagmiConfig } = await import('@/lib/web3-config');

        // Determine the range of token IDs to check
        const maxTokenId = totalSupply ? Math.min(Number(totalSupply), 1000) : 100; // Cap at 1000 for safety
        const expectedNFTs = Number(balance);
        
        // Batch promises for better performance
        const ownershipChecks: Promise<{ tokenId: number; owner?: string }>[] = [];
        
        for (let tokenId = 1; tokenId <= maxTokenId && realNFTs.length < expectedNFTs; tokenId++) {
          const ownerContract = {
            address: contracts.nadmonNFT as `0x${string}`,
            abi: NADMON_READ_ABI,
            functionName: 'ownerOf' as const,
            args: [BigInt(tokenId)] as const,
          };

          ownershipChecks.push(
            readContract(wagmiConfig, ownerContract)
              .then(owner => ({ tokenId, owner: owner as string }))
              .catch(() => ({ tokenId })) // Token doesn't exist or error
          );

          // Process in batches of 20 for better performance
          if (ownershipChecks.length >= 20) {
            const results = await Promise.all(ownershipChecks);
            await processOwnershipResults(results, realNFTs, expectedNFTs, readContract, wagmiConfig, contracts, address);
            ownershipChecks.length = 0; // Clear the array
            
            if (realNFTs.length >= expectedNFTs) break;
          }
        }

        // Process remaining checks
        if (ownershipChecks.length > 0) {
          const results = await Promise.all(ownershipChecks);
          await processOwnershipResults(results, realNFTs, expectedNFTs, readContract, wagmiConfig, contracts, address);
        }

        setNfts(realNFTs);
        console.log(`✅ Successfully loaded ${realNFTs.length} real NFTs from blockchain`);
        
        if (realNFTs.length > 0) {
          console.log(`Successfully loaded ${realNFTs.length} Nadmon${realNFTs.length > 1 ? 's' : ''} from your wallet!`);
        }
        
      } catch (err) {
        console.error('❌ Failed to fetch real NFTs:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NFTs from blockchain';
        setError(errorMessage);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealNFTs();
  }, [address, balance, contracts.nadmonNFT, chainId, refetchTrigger, totalSupply]);

  return {
    nfts,
    loading,
    error,
    refetch,
  };
}

// Helper function to process ownership results
async function processOwnershipResults(
  results: { tokenId: number; owner?: string }[],
  realNFTs: PokemonCard[],
  expectedNFTs: number,
  readContract: any,
  wagmiConfig: any,
  contracts: any,
  address: string
) {
  for (const result of results) {
    if (realNFTs.length >= expectedNFTs) break;
    
    if (result.owner && result.owner.toLowerCase() === address.toLowerCase()) {
      try {
        console.log(`✅ Found your NFT: Token ID ${result.tokenId}`);
        
        // Get NFT data
        const nadmonContract = {
          address: contracts.nadmonNFT as `0x${string}`,
          abi: NADMON_READ_ABI,
          functionName: 'nadmons' as const,
          args: [BigInt(result.tokenId)] as const,
        };
        
        const nadmonData = await readContract(wagmiConfig, nadmonContract) as [string, string, string, bigint, bigint, bigint, bigint, bigint, bigint];
        
        if (nadmonData && nadmonData.length >= 9) {
          const nft = transformNadmonToPokemonCard(result.tokenId, {
            nadmonType: nadmonData[0],
            element: nadmonData[1], 
            rarity: nadmonData[2],
            hp: nadmonData[3],
            attack: nadmonData[4],
            defense: nadmonData[5],
            crit: nadmonData[6],
            fusion: nadmonData[7],
            evo: nadmonData[8]
          });
          
          realNFTs.push(nft);
          console.log(`📝 Added NFT:`, nft);
        }
      } catch (tokenError) {
        console.log(`⚠️ Failed to fetch data for token ${result.tokenId}:`, tokenError);
      }
    }
  }
}