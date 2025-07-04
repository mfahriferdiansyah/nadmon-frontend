"use client"

import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseAbi } from 'viem'
import { getContractAddresses } from '@/contracts/config'
import { TransactionToastManager } from '@/components/ui/transaction-toast'
import type { PokemonCard } from '@/types/card'

// Simplified ABI for the evolve function
const NADMON_NFT_ABI = parseAbi([
  'function evolve(uint256[] tokenIds) external',
  'event NadmonEvolved(uint256 indexed tokenId, uint256 newEvo, uint256 fusionPoints)'
])

export function useNadmonFusion() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const chainId = useChainId()
  const contracts = getContractAddresses(chainId)
  
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error: writeError 
  } = useWriteContract()
  
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: receiptError 
  } = useWaitForTransactionReceipt({ 
    hash 
  })

  const fuseMonsters = useCallback(async (
    targetCard: PokemonCard, 
    sacrificeCards: PokemonCard[]
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      // Create array with target card first, then sacrifice cards
      const tokenIds = [targetCard.id, ...sacrificeCards.map(card => card.id)]

      // Validate that all cards have same element AND same nadmonType (matching contract logic)
      const allCardsValid = tokenIds.every(id => {
        const card = [targetCard, ...sacrificeCards].find(c => c.id === id)
        return card?.name === targetCard.name && card?.type === targetCard.type
      })

      if (!allCardsValid) {
        throw new Error('All cards must have the same element and type for fusion')
      }

      // Calculate total fusion points
      const totalFusion = [targetCard, ...sacrificeCards].reduce((sum, card) => {
        return sum + (card.fusion || 0) + 1
      }, 0)

      if (totalFusion < 10) {
        throw new Error('Need at least 10 fusion points to evolve (each card provides its fusion level + 1)')
      }

      // Show loading toast
      TransactionToastManager.loading(
        'Preparing fusion transaction...',
        `Evolving ${targetCard.name} with ${sacrificeCards.length} sacrifices`
      )

      await writeContract({
        address: contracts.nadmonNFT as `0x${string}`,
        abi: NADMON_NFT_ABI,
        functionName: 'evolve',
        args: [tokenIds.map(id => BigInt(id))]
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      TransactionToastManager.error(
        'Fusion failed',
        errorMessage
      )
      console.error('Fusion error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [writeContract, contracts.nadmonNFT])

  // Handle transaction states with toasts
  useEffect(() => {
    if (isPending && hash) {
      TransactionToastManager.show({
        id: `fusion-${hash}`,
        status: 'pending',
        title: 'Transaction submitted',
        description: 'Waiting for confirmation...',
        txHash: hash,
        blockExplorerUrl: 'https://testnet.monvision.io'
      })
    }
  }, [isPending, hash])

  useEffect(() => {
    if (isConfirming && hash) {
      TransactionToastManager.update(`fusion-${hash}`, {
        status: 'pending',
        title: 'Processing fusion...',
        description: 'Transaction is being confirmed on blockchain',
        txHash: hash,
        blockExplorerUrl: 'https://testnet.monvision.io'
      })
    }
  }, [isConfirming, hash])

  useEffect(() => {
    if (isConfirmed && hash) {
      TransactionToastManager.update(`fusion-${hash}`, {
        status: 'success',
        title: 'Fusion successful!',
        description: 'Your monster has evolved successfully',
        txHash: hash,
        blockExplorerUrl: 'https://testnet.monvision.io'
      })
    }
  }, [isConfirmed, hash])

  useEffect(() => {
    if ((writeError || receiptError) && hash) {
      TransactionToastManager.update(`fusion-${hash}`, {
        status: 'error',
        title: 'Transaction failed',
        description: writeError?.message || receiptError?.message || 'Unknown error occurred',
        txHash: hash,
        blockExplorerUrl: 'https://testnet.monvision.io'
      })
    }
  }, [writeError, receiptError, hash])

  // Reset error when starting new transaction
  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    fuseMonsters,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess: isConfirmed,
    error: error || writeError?.message || receiptError?.message || null,
    hash,
    resetError,
    state: isPending ? 'pending' : isConfirming ? 'confirming' : isConfirmed ? 'success' : error || writeError || receiptError ? 'error' : 'idle'
  }
}