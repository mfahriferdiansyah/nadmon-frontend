'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseAbi } from 'viem'
import { getContractAddresses } from '@/contracts/config'
// Removed TransactionToastManager import - will be rebuilt later
import type { PokemonCard } from '@/types/card'

// Simplified ABI for transfer function (burning by transferring to zero address)
const NADMON_NFT_ABI = parseAbi([
  'function transferFrom(address from, address to, uint256 tokenId) external',
  'function safeTransferFrom(address from, address to, uint256 tokenId) external',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
])

export function useNadmonBurn() {
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

  const burnMonster = useCallback(async (card: PokemonCard) => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔥 Attempting to burn monster:', card.name, `(ID: ${card.id})`)

      // Removed toast notifications - will be rebuilt later
      console.log('Checking burn functionality...')

      // For now, just show that burning is not supported
      // This can be updated when burn functionality is added to the contract
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate checking
      
      const errorMessage = 'Burning is not yet supported by this NFT contract. This feature will be available in a future update.'
      setError(errorMessage)
      console.error('Burn not supported:', errorMessage)

    } catch (err) {
      console.error('Burn error:', err)
      
      const errorMessage = 'Burning is not yet supported by this NFT contract.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle transaction states - removed toast notifications, will be rebuilt later
  useEffect(() => {
    if (isPending && hash) {
      console.log('Transaction submitted, waiting for confirmation...', hash)
    }
  }, [isPending, hash])

  useEffect(() => {
    if (isConfirming && hash) {
      console.log('Processing burn transaction...', hash)
    }
  }, [isConfirming, hash])

  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('Monster burned successfully!', hash)
    }
  }, [isConfirmed, hash])

  useEffect(() => {
    if ((writeError || receiptError) && hash) {
      console.error('Transaction failed:', (writeError as any)?.message || (receiptError as any)?.message || 'Unknown error occurred')
    }
  }, [writeError, receiptError, hash])

  // Reset error when starting new transaction
  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    burnMonster,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess: isConfirmed,
    error: error || (writeError as any)?.message || (receiptError as any)?.message || null,
    hash,
    resetError,
    state: isPending ? 'pending' : isConfirming ? 'confirming' : isConfirmed ? 'success' : error || writeError || receiptError ? 'error' : 'idle'
  }
}