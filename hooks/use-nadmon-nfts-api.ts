'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import type { PokemonCard } from '@/types/card';
import { API_CONFIG, apiRequestWithRetry, apiUtils } from '@/lib/api-config';

interface UseNadmonNFTsReturn {
  nfts: PokemonCard[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

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

interface InventoryResponse {
  data: BackendNFT[];
  total: number;
}

// Helper function to transform backend NFT data to our card format
function transformBackendNFTToPokemonCard(backendNFT: BackendNFT): PokemonCard {
  // Map backend rarity to our type system
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
    fusion: backendNFT.fusion,
    evo: backendNFT.evo,
  };
}

export function useNadmonNFTsAPI(): UseNadmonNFTsReturn {
  const { address } = useAccount();
  const chainId = useChainId();
  const [nfts, setNfts] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchNFTs = useCallback(async (userAddress: string) => {
    if (!apiUtils.isValidAddress(userAddress)) {
      throw new Error('Invalid Ethereum address format');
    }

    try {
      const data = await apiRequestWithRetry<InventoryResponse>(
        API_CONFIG.ENDPOINTS.PLAYER_NFTS(userAddress)
      );
      return data;
    } catch (error) {
      // Handle 404 as empty collection
      if (error instanceof Error && error.message.includes('404')) {
        return { data: [], total: 0 };
      }
      throw error;
    }
  }, []);

  // Manual refetch function
  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  // Main effect to fetch NFTs
  useEffect(() => {
    if (!address) {
      setNfts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchUserNFTs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`🔍 Fetching NFTs for ${address} from API...`);
        
        const data = await fetchNFTs(address);
        
        // Transform backend NFTs to our format
        const transformedNFTs = data.data.map(transformBackendNFTToPokemonCard);
        
        setNfts(transformedNFTs);
        console.log(`✅ Successfully loaded ${transformedNFTs.length} NFTs from API`);
        
        if (transformedNFTs.length > 0) {
          console.log(`Successfully loaded ${transformedNFTs.length} Nadmon${transformedNFTs.length > 1 ? 's' : ''} from your wallet!`);
        }
        
      } catch (err) {
        console.error('❌ Failed to fetch NFTs from API:', err);
        const errorMessage = apiUtils.formatErrorMessage(err);
        setError(errorMessage);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNFTs();
  }, [address, chainId, refetchTrigger, fetchNFTs]);

  // Auto-refetch disabled - only manual refresh or on specific events
  // useEffect(() => {
  //   if (!address) return;

  //   const interval = setInterval(() => {
  //     refetch();
  //   }, API_CONFIG.POLLING.INVENTORY_REFRESH);

  //   return () => clearInterval(interval);
  // }, [address, refetch]);

  // Memoize the return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    nfts,
    loading,
    error,
    refetch,
  }), [nfts, loading, error, refetch]);

  return returnValue;
}

// Export as default for backwards compatibility
export default useNadmonNFTsAPI;

// Additional utility functions for pack purchases
export function usePackNFTs() {
  const [packNFTs, setPackNFTs] = useState<PokemonCard[]>([]);
  const [packLoading, setPackLoading] = useState(false);
  const [packError, setPackError] = useState<string | null>(null);

  const fetchPackNFTs = useCallback(async (packId: number): Promise<PokemonCard[]> => {
    setPackLoading(true);
    setPackError(null);

    try {
      const data = await apiRequestWithRetry(
        API_CONFIG.ENDPOINTS.PACK_DETAILS(packId),
        {},
        API_CONFIG.RETRY.MAX_ATTEMPTS
      );
      
      // Transform NFTs from pack response
      const transformedNFTs = data.nfts.map(transformBackendNFTToPokemonCard);
      
      setPackNFTs(transformedNFTs);
      return transformedNFTs;
      
    } catch (err) {
      const errorMessage = apiUtils.formatErrorMessage(err);
      setPackError(errorMessage);
      console.error('❌ Failed to fetch pack NFTs:', err);
      return [];
    } finally {
      setPackLoading(false);
    }
  }, []);

  return {
    packNFTs,
    packLoading,
    packError,
    fetchPackNFTs,
  };
}

// Utility function for batch NFT fetching
export function useBatchNFTs() {
  const fetchMultipleNFTs = useCallback(async (tokenIds: number[]): Promise<PokemonCard[]> => {
    if (tokenIds.length === 0) return [];
    
    const idsParam = tokenIds.join(',');
    const data = await apiRequestWithRetry(
      `${API_CONFIG.ENDPOINTS.NFT_BATCH}?ids=${idsParam}`
    );
    
    return data.data.map(transformBackendNFTToPokemonCard);
  }, []);

  return { fetchMultipleNFTs };
}