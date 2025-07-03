'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS, type Nadmon, type BattleResult, type PlayerStats } from '@/contracts/utils';

// Hook for reading Nadmon NFT data
export function useNadmon(tokenId: number) {
  return useReadContract({
    ...CONTRACTS.nadmonNFT,
    functionName: 'nadmons',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  });
}

// Hook for reading player's Nadmon balance
export function useNadmonBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    ...CONTRACTS.nadmonNFT,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook for getting token ID by index for a specific owner
export function useTokenOfOwnerByIndex(address: `0x${string}` | undefined, index: number) {
  return useReadContract({
    ...CONTRACTS.nadmonNFT,
    functionName: 'tokenOfOwnerByIndex',
    args: address && index >= 0 ? [address, BigInt(index)] : undefined,
    query: {
      enabled: !!address && index >= 0,
    },
  });
}

// Hook for getting owner of a specific token
export function useOwnerOf(tokenId: number) {
  return useReadContract({
    ...CONTRACTS.nadmonNFT,
    functionName: 'ownerOf',
    args: tokenId > 0 ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId > 0,
    },
  });
}

// Hook for getting token URI (metadata)
export function useTokenURI(tokenId: number) {
  return useReadContract({
    ...CONTRACTS.nadmonNFT,
    functionName: 'tokenURI',
    args: tokenId > 0 ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: tokenId > 0,
    },
  });
}

// Hook for getting total supply of NFTs
export function useTotalSupply() {
  return useReadContract({
    ...CONTRACTS.nadmonNFT,
    functionName: 'totalSupply',
  });
}

// Hook for reading COOKIES balance
export function useCookiesBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    ...CONTRACTS.cookiesToken,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook for reading MON token balance
export function useMONBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    ...CONTRACTS.mockMON,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook for buying pack with MON (pays with ETH)
export function useBuyPackWithMON() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash,
    });

  const buyPack = () => {
    writeContract({
      ...CONTRACTS.nadmonNFT,
      functionName: 'buyPackWithMON',
      value: parseEther('0.01'), // 0.01 ETH
    });
  };

  return {
    buyPack,
    isPending: isPending || isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

// Hook for PvE battle
export function usePvEBattle() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash,
    });

  const battle = (tokenId: number, difficulty: number) => {
    writeContract({
      ...CONTRACTS.pveBattle,
      functionName: 'battlePvE',
      args: [BigInt(tokenId), BigInt(difficulty)],
    });
  };

  return {
    battle,
    isPending: isPending || isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

// Hook for sending Nadmon on expedition
export function useExpedition() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash,
    });

  const sendToExpedition = (tokenId: number, durationHours: number, statType: number) => {
    writeContract({
      ...CONTRACTS.expeditionCenter,
      functionName: 'sendToExpedition',
      args: [BigInt(tokenId), BigInt(durationHours), statType],
    });
  };

  const claimExpedition = (tokenId: number) => {
    writeContract({
      ...CONTRACTS.expeditionCenter,
      functionName: 'claimExpedition',
      args: [BigInt(tokenId)],
    });
  };

  return {
    sendToExpedition,
    claimExpedition,
    isPending: isPending || isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

// Hook for checking if Nadmon is on expedition
export function useIsOnExpedition(tokenId: number) {
  return useReadContract({
    ...CONTRACTS.expeditionCenter,
    functionName: 'isOnExpedition',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  });
}

// Hook for getting active expedition
export function useActiveExpedition(tokenId: number) {
  return useReadContract({
    ...CONTRACTS.expeditionCenter,
    functionName: 'activeExpeditions',
    args: [BigInt(tokenId)],
    query: {
      enabled: tokenId > 0,
    },
  });
}

// Hook for getting player's PvP stats
export function usePlayerStats(address: `0x${string}` | undefined) {
  return useReadContract({
    ...CONTRACTS.pvpBattle,
    functionName: 'getPlayerStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Hook for getting daily PvE battle stats
export function useDailyBattleStats(address: `0x${string}` | undefined) {
  return useReadContract({
    ...CONTRACTS.pveBattle,
    functionName: 'playerDailyStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
} 