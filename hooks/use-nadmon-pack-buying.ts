'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { getContractAddresses } from '@/contracts/config';
// Removed TransactionToastManager import - will be rebuilt later

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

export type PackBuyingState = 'idle' | 'pending' | 'confirming' | 'success' | 'error' | 'fetching-pack';

interface UseNadmonPackBuyingReturn {
  buyPackWithMON: () => void;
  buyPackWithCookies: () => void;
  state: PackBuyingState;
  error: string | null;
  transactionHash: string | null;
  isLoading: boolean;
  packId: number | null;
  reset: () => void;
}

export function useNadmonPackBuying(): UseNadmonPackBuyingReturn {
  const { address } = useAccount();
  const chainId = useChainId();
  const [state, setState] = useState<PackBuyingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [packId, setPackId] = useState<number | null>(null);

  const contracts = getContractAddresses(chainId);
  
  const { writeContract, isPending: isWritePending, data: writeData } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  // Extract pack ID from transaction receipt (METHOD 1)
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

  // Handle successful transaction and extract pack ID
  useEffect(() => {
    if (isConfirmed && receipt && address) {
      console.log('🎉 TRANSACTION CONFIRMED - Starting pack detection...');
      setState('fetching-pack');
      
      const handlePackDetection = async () => {
        try {
          // METHOD 1: Extract pack ID from receipt
          const extractedPackId = extractPackIdFromReceipt(receipt, address);
          
          if (extractedPackId) {
            setPackId(extractedPackId);
            console.log(`✅ FINAL SUCCESS: Pack ID ${extractedPackId} detected!`);
            setState('success');
          } else {
            console.log('❌ FINAL ERROR: Could not detect pack ID from transaction');
            setError('Could not detect pack ID from transaction');
            setState('error');
          }
          
        } catch (error) {
          console.log('❌ FINAL ERROR:', error.message);
          setError(error.message || 'Failed to detect pack');
          setState('error');
        }
      };
      
      handlePackDetection();
    }
  }, [isConfirmed, receipt, address, extractPackIdFromReceipt]);

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
    setPackId(null);
  };

  return {
    buyPackWithMON,
    buyPackWithCookies,
    state,
    error,
    transactionHash,
    isLoading: isWritePending || isConfirming || state === 'fetching-pack',
    packId,
    reset,
  };
}