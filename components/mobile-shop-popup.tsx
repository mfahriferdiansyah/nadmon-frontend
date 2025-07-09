"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { X, Package, Star, Sparkles, Crown, Lock, ShoppingCart, Loader2, Gift, Wallet, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import type { PokemonCard } from "@/types/card"
import type { PackType } from "@/constants/packs"
import { PACK_TYPES } from "@/constants/packs"
import { useNadmonPackBuying } from "@/hooks/use-nadmon-pack-buying"
import { useAccount, useChainId } from "wagmi"
import { monadTestnet } from "@/lib/web3-config"
import { TransactionToastManager } from "@/components/ui/transaction-toast"
import { WalletHandle } from "@/components/wallet-handle"

interface MobileShopPopupProps {
  collection: PokemonCard[]
  onPackSelect: (packType: PackType, event: React.MouseEvent) => void
  isOpening: boolean
  onClose: () => void
  onPackPurchased?: (packId?: number, paymentMethod?: 'MON' | 'COOKIES') => void
}

type ShopCategory = 'pack' | 'stone' | 'building' | 'costume'

const SHOP_CATEGORIES = [
  { id: 'pack' as ShopCategory, name: 'PACKS', icon: Package, unlocked: true },
  { id: 'stone' as ShopCategory, name: 'STONES', icon: Sparkles, unlocked: false },
  { id: 'building' as ShopCategory, name: 'BUILDINGS', icon: Crown, unlocked: false },
  { id: 'costume' as ShopCategory, name: 'COSTUMES', icon: Star, unlocked: false },
]

const getRarityIcon = (packId: string) => {
  switch (packId) {
    case "trial": return <Gift className="w-5 h-5 text-purple-400" />
    case "fire": return <Sparkles className="w-5 h-5 text-orange-400" />
    case "water": return <Package className="w-5 h-5 text-blue-400" />
    case "nature": return <Star className="w-5 h-5 text-green-400" />
    default: return <Package className="w-5 h-5 text-gray-400" />
  }
}

export function MobileShopPopup({
  collection,
  onPackSelect,
  isOpening,
  onClose,
  onPackPurchased,
}: MobileShopPopupProps) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('pack')
  const [selectedPack, setSelectedPack] = useState<PackType | null>(PACK_TYPES.find(p => !p.locked) || PACK_TYPES[0])
  const [paymentMethod, setPaymentMethod] = useState<'MON' | 'COOKIES'>('MON')
  const [currentToastId, setCurrentToastId] = useState<string | null>(null)
  const [showPackDetails, setShowPackDetails] = useState(false)
  
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { buyPackWithMON, buyPackWithCookies, state, error, isLoading, packId, reset } = useNadmonPackBuying()
  
  const isOnCorrectChain = chainId === monadTestnet.id
  const canPurchase = isConnected && isOnCorrectChain && !isLoading && !isOpening && selectedPack && !selectedPack.locked

  const handlePackClick = (packType: PackType) => {
    if (packType.locked) return
    setSelectedPack(packType)
    setShowPackDetails(true)
  }

  const handleBuyPack = async () => {
    if (!selectedPack || !canPurchase) return
    
    const toastId = `pack-purchase-${Date.now()}`
    setCurrentToastId(toastId)
    
    TransactionToastManager.show({
      id: toastId,
      status: 'loading',
      title: 'Purchasing Pack',
      description: `Buying ${selectedPack.name} with ${paymentMethod}`,
    })
    
    reset()
    
    try {
      if (paymentMethod === 'MON') {
        await buyPackWithMON()
      } else {
        await buyPackWithCookies()
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      TransactionToastManager.update(toastId, {
        status: 'error',
        title: 'Purchase Failed',
        description: error instanceof Error ? error.message : 'Transaction was rejected',
      })
    }
  }

  useEffect(() => {
    if (!currentToastId) return

    if (state === 'pending') {
      TransactionToastManager.update(currentToastId, {
        status: 'pending',
        title: 'Confirm Transaction',
        description: 'Please confirm in your wallet',
      })
    } else if (state === 'confirming') {
      TransactionToastManager.update(currentToastId, {
        status: 'pending',
        title: 'Transaction Pending',
        description: 'Waiting for blockchain confirmation',
      })
    } else if (state === 'fetching-pack') {
      TransactionToastManager.update(currentToastId, {
        status: 'pending',
        title: 'Detecting Pack',
        description: 'Extracting pack ID from transaction...',
      })
    } else if (state === 'success') {
      TransactionToastManager.update(currentToastId, {
        status: 'success',
        title: 'Pack Purchased!',
        description: 'Your pack is being opened...',
      })
      
      setTimeout(() => {
        if (selectedPack) {
          const mockEvent = { 
            currentTarget: { 
              getBoundingClientRect: () => ({ 
                left: window.innerWidth/2, 
                top: window.innerHeight/2, 
                width: 0, 
                height: 0 
              }) 
            } 
          } as any
          
          onPackSelect(selectedPack, mockEvent)
          onPackPurchased?.(packId || undefined, paymentMethod)
          reset()
          setCurrentToastId(null)
        }
      }, 1000)
    } else if (state === 'error') {
      TransactionToastManager.update(currentToastId, {
        status: 'error',
        title: 'Transaction Failed',
        description: error || 'Something went wrong',
      })
    }
  }, [state, error, currentToastId, selectedPack, onPackSelect, onPackPurchased, reset, packId])

  const handleCategoryClick = (category: ShopCategory) => {
    const categoryData = SHOP_CATEGORIES.find(c => c.id === category)
    if (categoryData?.unlocked) {
      setActiveCategory(category)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-4 px-2">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Wallet Handle - Outside and Above Popup */}
      <div className="relative z-10 mb-4 px-4">
        <WalletHandle />
      </div>
      
      {/* Popup Container */}
      <div className="relative w-full max-w-lg h-full max-h-[95vh] glass-panel rounded-t-2xl rounded-b-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
              <ShoppingCart className="w-2.5 h-2.5 text-blue-300" />
            </div>
            <h2 className="text-sm font-bold text-white">Monster Shop</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-white/20 bg-white/5">
          <div className="flex overflow-x-auto">
            {SHOP_CATEGORIES.map((category) => {
              const Icon = category.icon
              const isActive = activeCategory === category.id
              const isLocked = !category.unlocked
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  disabled={isLocked}
                  className={`relative flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-all whitespace-nowrap min-w-fit ${
                    isActive 
                      ? 'text-white border-b-2 border-blue-400 bg-white/10' 
                      : isLocked
                        ? 'text-white/30 cursor-not-allowed'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-2.5 h-2.5 ${isActive ? 'text-blue-400' : isLocked ? 'text-white/30' : 'text-white/70'}`} />
                  {category.name}
                  {isLocked && <Lock className="w-2 h-2 text-amber-400" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Connection Warning */}
        {(!isConnected || !isOnCorrectChain) && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-l-2 border-red-400 p-2 m-2 rounded">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
              <p className="text-red-200 font-medium text-xs">
                {!isConnected ? 'Connect wallet to purchase' : 'Switch to Monad Testnet'}
              </p>
            </div>
          </div>
        )}

        {/* Selected Pack Display */}
        {selectedPack && (
          <div className="border-b border-white/20 bg-white/5 p-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-white/10 border border-white/30 flex items-center justify-center">
                {getRarityIcon(selectedPack.id)}
              </div>
              <div className="text-left">
                <h3 className="font-medium text-xs text-white">{selectedPack.name}</h3>
                <p className="text-white/60 text-xs">Selected Pack</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeCategory === 'pack' ? (
            <div className="h-full flex flex-col">
              <div className="p-2 border-b border-white/20 bg-white/5">
                <h3 className="text-xs font-medium text-white">
                  Booster Packs ({PACK_TYPES.length} available)
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-2 gap-1.5 pb-4">
                  {PACK_TYPES.map((pack: PackType) => {
                    const isSelected = selectedPack?.id === pack.id
                    const isLocked = pack.locked
                    
                    return (
                      <div
                        key={pack.id}
                        className={`bg-white/5 backdrop-blur-md border rounded p-1.5 transition-all duration-300 cursor-pointer relative ${
                          isSelected 
                            ? 'border-blue-400/80 bg-blue-400/20 shadow-lg shadow-blue-400/20' 
                            : isLocked
                            ? 'border-white/10 opacity-50 cursor-not-allowed'
                            : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                        }`}
                        onClick={() => handlePackClick(pack)}
                      >
                        {/* Lock Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/30 rounded flex items-center justify-center z-10">
                            <div className="text-center">
                              <Lock className="w-2.5 h-2.5 text-white/60 mx-auto mb-0.5" />
                              <p className="text-white/60 text-xs font-medium">Soon</p>
                            </div>
                          </div>
                        )}

                        {/* Pack Header */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="w-5 h-5 rounded bg-white/10 border border-white/30 flex items-center justify-center">
                            {getRarityIcon(pack.id)}
                          </div>
                          {!isLocked && (
                            <div className="text-right">
                              <div className="text-green-400 font-bold text-xs">✓</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-1">
                          <h4 className="text-white font-bold text-xs">{pack.name}</h4>
                        </div>

                        {/* Pack Preview */}
                        <div className="bg-white/5 rounded p-1 border border-white/20 mb-1">
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-5 rounded border border-white/30 bg-white/10 flex items-center justify-center">
                              <Package className="w-2 h-2 text-white" />
                            </div>
                          </div>
                          <div className="text-center text-white/80 text-xs">5 Cards</div>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute -top-0.5 -right-0.5 z-10">
                            <div className="bg-blue-400 text-white rounded-full p-0.5 border border-blue-400/30 shadow-lg">
                              <Star className="w-1.5 h-1.5" />
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        {!isLocked && (
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="text-purple-400 font-bold text-xs flex items-center justify-center gap-0.5">
                              <Image src="/token/mon.png" alt="MON" width={8} height={8} className="w-2 h-2" />
                              {pack.price.mon}
                            </div>
                            <div className="text-orange-400 font-bold text-xs flex items-center justify-center gap-0.5">
                              <Image src="/token/cookies.png" alt="COOKIES" width={8} height={8} className="w-2 h-2" />
                              {pack.price.cookies}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">
              <div className="text-center p-4">
                <Lock className="w-8 h-8 mx-auto mb-2 opacity-50 text-amber-400" />
                <h4 className="text-sm font-semibold mb-1">Coming Soon</h4>
                <p className="text-xs">Available in future update</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Buy Buttons */}
        <div className="p-3 bg-white/5 border-t border-white/20">
          {!selectedPack ? (
            <div className="text-center">
              <button
                disabled
                className="w-full py-3 px-4 rounded-lg bg-white/10 text-white/50 cursor-not-allowed border border-white/20 font-medium text-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <Package className="w-4 h-4" />
                  Select a Pack
                </div>
              </button>
              <p className="text-white/60 text-xs mt-1">Choose a pack above to continue</p>
            </div>
          ) : !isConnected ? (
            <div className="text-center">
              <button
                disabled
                className="w-full py-3 px-4 rounded-lg bg-white/10 text-white/50 cursor-not-allowed border border-white/20 font-medium text-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </div>
              </button>
              <p className="text-white/60 text-xs mt-1">Connect your wallet to purchase</p>
            </div>
          ) : !isOnCorrectChain ? (
            <div className="text-center">
              <button
                disabled
                className="w-full py-3 px-4 rounded-lg bg-white/10 text-white/50 cursor-not-allowed border border-white/20 font-medium text-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Wrong Network
                </div>
              </button>
              <p className="text-white/60 text-xs mt-1">Switch to Monad Testnet</p>
            </div>
          ) : selectedPack?.locked ? (
            <div className="text-center">
              <button
                disabled
                className="w-full py-3 px-4 rounded-lg bg-white/10 text-white/50 cursor-not-allowed border border-white/20 font-medium text-sm"
              >
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Coming Soon
                </div>
              </button>
              <p className="text-white/60 text-xs mt-1">This pack will be available soon</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setPaymentMethod('MON')
                    handleBuyPack()
                  }}
                  disabled={isLoading || isOpening}
                  className={`py-2 px-2.5 rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-1.5 backdrop-blur-sm ${
                    isLoading && paymentMethod === 'MON'
                      ? 'bg-purple-500/30 text-white/70 cursor-not-allowed border border-purple-400/30'
                      : 'bg-purple-500/20 text-white hover:bg-purple-500/30 border border-purple-400/30 hover:border-purple-400/50'
                  }`}
                >
                  {isLoading && paymentMethod === 'MON' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {state === 'pending' ? 'Confirm...' : 'Processing...'}
                    </>
                  ) : isOpening ? (
                    <>
                      <Package className="w-3 h-3 animate-bounce" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <Image src="/token/mon.png" alt="MON" width={12} height={12} className="w-3 h-3" />
                      {selectedPack.price.mon} MON
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('COOKIES')
                    handleBuyPack()
                  }}
                  disabled={isLoading || isOpening}
                  className={`py-2 px-2.5 rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-1.5 backdrop-blur-sm ${
                    isLoading && paymentMethod === 'COOKIES'
                      ? 'bg-orange-500/30 text-white/70 cursor-not-allowed border border-orange-400/30'
                      : 'bg-orange-500/20 text-white hover:bg-orange-500/30 border border-orange-400/30 hover:border-orange-400/50'
                  }`}
                >
                  {isLoading && paymentMethod === 'COOKIES' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {state === 'pending' ? 'Confirm...' : 'Processing...'}
                    </>
                  ) : isOpening ? (
                    <>
                      <Package className="w-3 h-3 animate-bounce" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <Image src="/token/cookies.png" alt="COOKIES" width={12} height={12} className="w-3 h-3" />
                      {selectedPack.price.cookies} COOKIES
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors font-medium text-xs"
          >
            Close Shop
          </button>
        </div>

        <style jsx>{`
          .glass-panel {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </div>
    </div>
  )
}