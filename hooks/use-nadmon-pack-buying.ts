'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { getContractAddresses } from '@/contracts/config';
import { TransactionToastManager } from '@/components/ui/transaction-toast';

// Extract just the ABI we need
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
  }
] as const;

export type PackBuyingState = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

interface UseNadmonPackBuyingReturn {
  buyPackWithMON: () => void;
  buyPackWithCookies: () => void;
  state: PackBuyingState;
  error: string | null;
  transactionHash: string | null;
  isLoading: boolean;
  reset: () => void;
}

export function useNadmonPackBuying(): UseNadmonPackBuyingReturn {
  const { address } = useAccount();
  const chainId = useChainId();
  const [state, setState] = useState<PackBuyingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const contracts = getContractAddresses(chainId);
  
  const { writeContract, isPending: isWritePending, data: writeData } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeData,
  });

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

  useEffect(() => {
    if (isConfirmed) {
      setState('success');
    }
  }, [isConfirmed]);

  const buyPackWithMON = () => {
    if (!address) {
      const errorMsg = 'Please connect your wallet first';
      setError(errorMsg);
      setState('error');
      return;
    }

    console.log('🔮 Starting pack purchase with MON...');
    console.log('Contract address:', contracts.nadmonNFT);
    console.log('Chain ID:', chainId);
    console.log('User address:', address);

    try {
      setState('pending');
      setError(null);
      setTransactionHash(null);

      console.log('📝 Calling writeContract...');
      writeContract({
        address: contracts.nadmonNFT as `0x${string}`,
        abi: NADMON_NFT_ABI,
        functionName: 'buyPackWithMON',
        value: parseEther('0.01'), // 0.01 MON
      });

      console.log('✅ writeContract called successfully');

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
  };

  return {
    buyPackWithMON,
    buyPackWithCookies,
    state,
    error,
    transactionHash,
    isLoading: isWritePending || isConfirming,
    reset,
  };
}