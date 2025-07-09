"use client"

import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseAbi } from 'viem'
import { getContractAddresses } from '@/contracts/config'
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

      // Calculate total fusion points: target's current fusion + 1 point per sacrifice
      const currentTargetFusion = targetCard.fusion || 0
      const pointsFromSacrifices = sacrificeCards.length // Each sacrifice = 1 point
      const totalFusion = currentTargetFusion + pointsFromSacrifices

      // Allow fusion with any number of sacrifices (minimum 1 sacrifice required)
      if (sacrificeCards.length === 0) {
        throw new Error('At least 1 sacrifice card is required for fusion')
      }

      // Debug logging
      console.log('🔥 Fusion Debug Info:')
      console.log('Target card:', targetCard.name, `(ID: ${targetCard.id}, Fusion: ${targetCard.fusion || 0})`)
      console.log('Sacrifice cards:', sacrificeCards.map(c => `${c.name} (ID: ${c.id}, Fusion: ${c.fusion || 0})`))
      console.log('Total fusion points:', totalFusion)
      console.log('Token IDs array:', tokenIds)

      await writeContract({
        address: contracts.nadmonNFT as `0x${string}`,
        abi: NADMON_NFT_ABI,
        functionName: 'evolve',
        args: [tokenIds.map(id => BigInt(id))]
      })

    } catch (err) {
      console.error('Fusion error:', err)
      
      // Map contract errors to user-friendly messages
      let errorMessage = 'Unknown error occurred'
      if (err instanceof Error) {
        if (err.message.includes('NotEnoughFusion')) {
          errorMessage = 'Insufficient fusion points for evolution (minimum 10 required)'
        } else if (err.message.includes('DifferentElements')) {
          errorMessage = 'All monsters must have the same element'
        } else if (err.message.includes('DifferentTypes')) {
          errorMessage = 'All monsters must be the same type'
        } else if (err.message.includes('NotEnoughCards')) {
          errorMessage = 'Not enough cards provided for fusion'
        } else if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction was cancelled by user'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [writeContract, contracts.nadmonNFT])

  // Transaction states are handled internally

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