'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { parseAbi } from 'viem'
import { getContractAddresses } from '@/contracts/config'
import { TransactionToastManager } from '@/components/ui/transaction-toast'
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
    const loadingToastId = `burn-prep-${Date.now()}`
    
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔥 Attempting to burn monster:', card.name, `(ID: ${card.id})`)

      TransactionToastManager.show({
        id: loadingToastId,
        status: 'pending',
        title: 'Checking burn functionality...',
        description: `Checking if ${card.name} can be burned`
      })

      // For now, just show that burning is not supported
      // This can be updated when burn functionality is added to the contract
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate checking
      
      TransactionToastManager.dismiss(loadingToastId)
      
      const errorMessage = 'Burning is not yet supported by this NFT contract. This feature will be available in a future update.'
      setError(errorMessage)
      TransactionToastManager.error(
        'Burn not supported',
        errorMessage
      )

    } catch (err) {
      console.error('Burn error:', err)
      
      // Dismiss the preparation toast
      TransactionToastManager.dismiss(loadingToastId)
      
      const errorMessage = 'Burning is not yet supported by this NFT contract.'
      setError(errorMessage)
      TransactionToastManager.error(
        'Burn not supported',
        errorMessage
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle transaction states with toasts
  useEffect(() => {
    if (isPending && hash) {
      TransactionToastManager.show({
        id: `burn-${hash}`,
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
      TransactionToastManager.update(`burn-${hash}`, {
        status: 'pending',
        title: 'Processing burn...',
        description: 'Transaction is being confirmed on blockchain',
        txHash: hash,
        blockExplorerUrl: 'https://testnet.monvision.io'
      })
    }
  }, [isConfirming, hash])

  useEffect(() => {
    if (isConfirmed && hash) {
      TransactionToastManager.update(`burn-${hash}`, {
        status: 'success',
        title: 'Monster burned successfully!',
        description: 'Your monster has been permanently destroyed',
        txHash: hash,
        blockExplorerUrl: 'https://testnet.monvision.io'
      })
    }
  }, [isConfirmed, hash])

  useEffect(() => {
    if ((writeError || receiptError) && hash) {
      TransactionToastManager.update(`burn-${hash}`, {
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
    burnMonster,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess: isConfirmed,
    error: error || writeError?.message || receiptError?.message || null,
    hash,
    resetError,
    state: isPending ? 'pending' : isConfirming ? 'confirming' : isConfirmed ? 'success' : error || writeError || receiptError ? 'error' : 'idle'
  }
}