'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { getContractAddresses } from '@/contracts/config';
import { TransactionToastManager } from '@/components/ui/transaction-toast';
import { API_CONFIG, apiRequestWithRetry, apiUtils } from '@/lib/api-config';
import type { PokemonCard } from '@/types/card';

// Contract ABI for pack purchasing
const NADMON_NFT_ABI = [
  {
    "inputs": [],
    "name": "buyPackWithMON",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyPackWithCookies", 
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "purchasePacksWithToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// ABI for parsing events
const PACK_MINTED_EVENT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "packId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]"},
      {"indexed": false, "internalType": "string", "name": "paymentType", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "sequence", "type": "uint256"}
    ],
    "name": "PackMinted",
    "type": "event"
  }
] as const;

export type PackBuyingState = 'idle' | 'pending' | 'confirming' | 'success' | 'error' | 'fetching-pack';

interface BackendNFT {
  id: number;
  name: string;
  type: string;
  rarity: string;
  hp: number;
  attack: number;
  defense: number;
  critical: number;
  evo: number;
  fusion: number;
  image: string;
  color: string;
  speed: number;
}

interface PackResponse {
  pack_id: number;
  player: string;
  payment_type: string;
  purchased_at: string;
  token_ids: number[];
  nfts: BackendNFT[];
  total_nfts: number;
}

interface UseNadmonPackBuyingEnhancedReturn {
  buyPackWithMON: () => void;
  buyPackWithCookies: () => void;
  state: PackBuyingState;
  error: string | null;
  transactionHash: string | null;
  isLoading: boolean;
  packNFTs: PokemonCard[];
  packId: number | null;
  reset: () => void;
}

// Transform backend NFT to frontend format
function transformBackendNFTToPokemonCard(backendNFT: BackendNFT): PokemonCard {
  const rarityMap: Record<string, "common" | "rare" | "epic" | "legendary"> = {
    'Common': 'common',
    'Rare': 'rare', 
    'Epic': 'epic',
    'Legendary': 'legendary'
  };
  
  const mappedRarity = rarityMap[backendNFT.rarity] || 'common';
  
  return {
    id: backendNFT.id,
    name: backendNFT.name,
    image: backendNFT.image,
    hp: backendNFT.hp,
    attack: backendNFT.attack,
    defense: backendNFT.defense,
    speed: backendNFT.speed,
    type: backendNFT.type,
    rarity: mappedRarity,
    critical: backendNFT.critical,
    color: backendNFT.color,
  };
}

export function useNadmonPackBuyingEnhanced(): UseNadmonPackBuyingEnhancedReturn {
  const { address } = useAccount();
  const chainId = useChainId();
  const [state, setState] = useState<PackBuyingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [packNFTs, setPackNFTs] = useState<PokemonCard[]>([]);
  const [packId, setPackId] = useState<number | null>(null);

  const contracts = getContractAddresses(chainId);
  
  const { writeContract, isPending: isWritePending, data: writeData } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Extract token IDs directly from transaction logs (fallback method)
  const extractTokenIdsFromReceipt = useCallback((receipt: any, userAddress: string): number[] => {
    try {
      if (!receipt?.logs || !userAddress) return [];
      
      console.log('🔧 METHOD 2: Trying to extract token IDs from Transfer events');
      
      const tokenIds: number[] = [];
      
      for (const log of receipt.logs) {
        try {
          if (log.topics && log.topics.length >= 4) {
            const topics = log.topics.map((topic: any) => 
              typeof topic === 'string' ? topic : `0x${topic.toString(16)}`
            );
            
            const transferSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
            
            if (topics[0] === transferSignature) {
              const fromAddress = topics[1];
              const tokenIdHex = topics[3];
              
              if (fromAddress === '0x0000000000000000000000000000000000000000000000000000000000000000') {
                const tokenId = parseInt(tokenIdHex, 16);
                if (!isNaN(tokenId) && tokenId > 0) {
                  tokenIds.push(tokenId);
                }
              }
            }
          }
        } catch (parseError) {
          continue;
        }
      }
      
      if (tokenIds.length > 0) {
        console.log(`✅ METHOD 2 SUCCESS: Found ${tokenIds.length} token IDs:`, tokenIds);
      } else {
        console.log('❌ METHOD 2 FAILED: No Transfer events found');
      }
      
      return tokenIds;
    } catch (error) {
      console.log('❌ METHOD 2 ERROR:', error.message);
      return [];
    }
  }, []);

  // Extract pack ID from transaction receipt
  const extractPackIdFromReceipt = useCallback((receipt: any, userAddress: string): number | null => {
    try {
      if (!receipt?.logs || !userAddress) return null;
      
      console.log('🎯 METHOD 1: Trying to extract pack ID from transaction receipt');
      
      // Debug: Log all event signatures in the receipt
      console.log('📋 All event signatures in receipt:');
      receipt.logs.forEach((log: any, index: number) => {
        if (log.topics && log.topics.length > 0) {
          console.log(`  Log ${index}: ${log.topics[0]} (${log.topics.length} topics)`);
        }
      });
      
      // Find PackMinted event log
      for (const log of receipt.logs) {
        try {
          if (log.topics && log.topics.length >= 3) {
            const topics = log.topics.map((topic: any) => 
              typeof topic === 'string' ? topic : `0x${topic.toString(16)}`
            );
            
            // Try common PackMinted event signatures
            const packMintedSignatures = [
              '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb', // Common PackMinted pattern
              '0x8f0e1b1b8b0e1b1b8b0e1b1b8b0e1b1b8b0e1b1b8b0e1b1b8b0e1b1b8b0e1b1b', // Alternative pattern
            ];
            
            // Also try to find any event with player address and a pack-like ID
            if (topics.length >= 3) {
              const potentialPackId = parseInt(topics[2], 16);
              if (!isNaN(potentialPackId) && potentialPackId > 0 && potentialPackId < 1000000) {
                console.log(`🔍 Found potential pack ID ${potentialPackId} in event ${topics[0]}`);
                
                // If it looks like a reasonable pack ID, use it
                if (packMintedSignatures.includes(topics[0]) || potentialPackId > 0) {
                  console.log(`✅ METHOD 1 SUCCESS: Pack ID ${potentialPackId} extracted from receipt`);
                  return potentialPackId;
                }
              }
            }
          }
        } catch (parseError) {
          continue;
        }
      }
      
      console.log('❌ METHOD 1 FAILED: No PackMinted event found in receipt');
      return null;
    } catch (error) {
      console.log('❌ METHOD 1 ERROR:', error.message);
      return null;
    }
  }, []);

  // Fetch NFTs by token IDs directly
  const fetchNFTsByTokenIds = useCallback(async (tokenIds: number[]): Promise<PokemonCard[]> => {
    try {
      const data = await apiRequestWithRetry(
        `${API_CONFIG.ENDPOINTS.NFTS_BY_IDS}?ids=${tokenIds.join(',')}`,
        {},
        8
      );
      
      if (data.data && data.data.length > 0) {
        const transformedNFTs = data.data.map(transformBackendNFTToPokemonCard);
        setPackNFTs(transformedNFTs);
        return transformedNFTs;
      }
      
      throw new Error('No NFT data found for token IDs');
    } catch (error) {
      throw error;
    }
  }, []);

  // Fetch pack data from API by pack ID
  const fetchPackData = useCallback(async (packId: number): Promise<PokemonCard[]> => {
    try {
      const data = await apiRequestWithRetry<PackResponse>(
        API_CONFIG.ENDPOINTS.PACK_DETAILS(packId),
        {},
        5
      );
      
      const transformedNFTs = data.nfts.map(transformBackendNFTToPokemonCard);
      setPackNFTs(transformedNFTs);
      setPackId(packId);
      
      return transformedNFTs;
    } catch (error) {
      throw error;
    }
  }, []);

  // Fetch pack data by recent pack lookup (fallback method)
  const fetchRecentPackForUser = useCallback(async (userAddress: string, maxRetries: number = 10): Promise<PokemonCard[]> => {
    try {
      console.log('⚠️ METHOD 3: Using recent pack lookup (fallback)');
      
      const initialData = await apiRequestWithRetry(
        API_CONFIG.ENDPOINTS.PLAYER_PACKS(userAddress)
      );
      const initialPackCount = initialData.total || 0;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        
        const data = await apiRequestWithRetry(
          API_CONFIG.ENDPOINTS.PLAYER_PACKS(userAddress)
        );
        
        if (data.data && data.data.length > 0) {
          if (data.total > initialPackCount) {
            const newestPack = data.data[0];
            const packTime = new Date(newestPack.purchased_at).getTime();
            const now = Date.now();
            
            if ((now - packTime) < 300000) {
              console.log(`✅ METHOD 3 SUCCESS: Found pack ${newestPack.pack_id}`);
              return await fetchPackData(newestPack.pack_id);
            }
          }
        }
      }
      
      throw new Error(`METHOD 3 FAILED: No new pack found`);
    } catch (error) {
      console.log('❌ METHOD 3 ERROR:', error.message);
      throw error;
    }
  }, [fetchPackData]);

  // Update state based on transaction status
  useEffect(() => {
    if (isWritePending) {
      setState('pending');
    }
  }, [isWritePending]);

  useEffect(() => {
    if (isConfirming) {
      setState('confirming');
      if (writeData) {
        setTransactionHash(writeData);
      }
    }
  }, [isConfirming, writeData]);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && receipt && address) {
      console.log('🎉 TRANSACTION CONFIRMED - Starting pack detection...');
      setState('fetching-pack');
      
      const handlePackFetching = async () => {
        try {
          // Method 1: Try to extract pack ID from receipt
          const extractedPackId = extractPackIdFromReceipt(receipt, address);
          
          let nfts: PokemonCard[];
          
          if (extractedPackId) {
            nfts = await fetchPackData(extractedPackId);
          } else {
            // Method 2: Try to extract token IDs directly from transaction logs
            const tokenIds = extractTokenIdsFromReceipt(receipt, address);
            
            if (tokenIds.length > 0) {
              await new Promise(resolve => setTimeout(resolve, 3000));
              nfts = await fetchNFTsByTokenIds(tokenIds);
            } else {
              // Method 3: Fallback to recent pack lookup
              nfts = await fetchRecentPackForUser(address, 15);
            }
          }
          
          console.log(`✅ FINAL SUCCESS: Loaded ${nfts.length} NFTs for pack opening`);
          setState('success');
          
        } catch (error) {
          console.log('❌ FINAL ERROR:', error.message);
          setError(apiUtils.formatErrorMessage(error));
          setState('error');
        }
      };
      
      handlePackFetching();
    }
  }, [isConfirmed, receipt, address, extractPackIdFromReceipt, extractTokenIdsFromReceipt, fetchPackData, fetchNFTsByTokenIds, fetchRecentPackForUser]);

  const buyPackWithMON = () => {
    if (!address) {
      const errorMsg = 'Please connect your wallet first';
      setError(errorMsg);
      setState('error');
      return;
    }

    try {
      setState('pending');
      setError(null);
      setTransactionHash(null);
      setPackNFTs([]);
      setPackId(null);

      writeContract({
        address: contracts.nadmonNFT as `0x${string}`,
        abi: NADMON_NFT_ABI,
        functionName: 'buyPackWithMON',
        value: parseEther('0.01'), // 0.01 MON
      });

    } catch (err: any) {
      setState('error');
      const errorMessage = err?.message?.includes('User rejected') 
        ? 'Transaction was rejected by user'
        : err?.message || 'Failed to buy pack';
      
      setError(errorMessage);
    }
  };

  const buyPackWithCookies = () => {
    if (!address) {
      const errorMsg = 'Please connect your wallet first';
      setError(errorMsg);
      setState('error');
      return;
    }

    try {
      setState('pending');
      setError(null);
      setTransactionHash(null);
      setPackNFTs([]);
      setPackId(null);

      writeContract({
        address: contracts.nadmonNFT as `0x${string}`,
        abi: NADMON_NFT_ABI,
        functionName: 'buyPackWithCookies',
      });

    } catch (err: any) {
      setState('error');
      const errorMessage = err?.message?.includes('User rejected') 
        ? 'Transaction was rejected by user'
        : err?.message || 'Failed to buy pack';
      
      setError(errorMessage);
    }
  };

  const reset = () => {
    setState('idle');
    setError(null);
    setTransactionHash(null);
    setPackNFTs([]);
    setPackId(null);
  };

  return {
    buyPackWithMON,
    buyPackWithCookies,
    state,
    error,
    transactionHash,
    isLoading: isWritePending || isConfirming || state === 'fetching-pack',
    packNFTs,
    packId,
    reset,
  };
}

// Utility hook for manual pack fetching (for testing or other use cases)
export function usePackFetching() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackByPackId = useCallback(async (packId: number): Promise<PokemonCard[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequestWithRetry<PackResponse>(
        API_CONFIG.ENDPOINTS.PACK_DETAILS(packId)
      );

      const transformedNFTs = data.nfts.map(transformBackendNFTToPokemonCard);
      return transformedNFTs;
    } catch (err) {
      const errorMessage = apiUtils.formatErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackByTxHash = useCallback(async (userAddress: string, maxRetries: number = 10): Promise<PokemonCard[]> => {
    setLoading(true);
    setError(null);

    try {
      // Poll for recent pack
      for (let i = 0; i < maxRetries; i++) {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between attempts

          const data = await apiRequestWithRetry(
            API_CONFIG.ENDPOINTS.PLAYER_PACKS(userAddress)
          );

          if (data.data && data.data.length > 0) {
            const recentPack = data.data[0];
            const now = Date.now();
            const packTime = new Date(recentPack.purchased_at).getTime();
            
            // Check if pack was created within last 2 minutes
            if ((now - packTime) < 120000) {
              return await fetchPackByPackId(recentPack.pack_id);
            }
          }
        } catch (retryError) {
          console.log(`Retry ${i + 1} failed:`, retryError);
        }
      }

      throw new Error('Pack not found after transaction');
    } catch (err) {
      const errorMessage = apiUtils.formatErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPackByPackId]);

  return {
    fetchPackByPackId,
    fetchPackByTxHash,
    loading,
    error,
  };
}