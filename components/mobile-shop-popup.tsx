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
  }, [state, error, currentToastId, selectedPack, onPackSelect, onPackPurchased, reset])

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
      <div className="relative z-10 mb-3">
        <WalletHandle />
      </div>
      
      {/* Popup Container */}
      <div className="relative w-full max-w-lg h-full max-h-[92vh] glass-panel rounded-t-2xl rounded-b-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center backdrop-blur-sm">
              <ShoppingCart className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Monster Shop</h2>
              <p className="text-white/70 text-xs">Discover powerful creatures</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5" />
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
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all whitespace-nowrap min-w-fit ${
                    isActive 
                      ? 'text-white border-b-2 border-blue-400 bg-white/10' 
                      : isLocked
                        ? 'text-white/30 cursor-not-allowed'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : isLocked ? 'text-white/30' : 'text-white/70'}`} />
                  {category.name}
                  {isLocked && <Lock className="w-3 h-3 text-amber-400" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Connection Warning */}
        {(!isConnected || !isOnCorrectChain) && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-l-4 border-red-400 p-4 m-4 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-200 font-medium text-sm">
                  {!isConnected ? 'Wallet not connected' : 'Wrong network'}
                </p>
                <p className="text-red-300/80 text-xs">
                  {!isConnected ? 'Connect your wallet to make purchases' : 'Switch to Monad Testnet to continue'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Selected Pack Details (Collapsible) */}
        {selectedPack && (
          <div className="border-b border-white/20 bg-white/5">
            <button
              onClick={() => setShowPackDetails(!showPackDetails)}
              className="w-full flex items-center justify-between p-4 text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/30 flex items-center justify-center">
                  {getRarityIcon(selectedPack.id)}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{selectedPack.name}</h3>
                  <p className="text-white/60 text-xs">Selected Pack</p>
                </div>
              </div>
              {showPackDetails ? (
                <ChevronUp className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/60" />
              )}
            </button>
            
            {showPackDetails && (
              <div className="px-4 pb-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/20">
                  <p className="text-white/80 text-sm mb-3">{selectedPack.description}</p>
                  
                  {/* Payment Options */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => setPaymentMethod('MON')}
                      className={`py-3 px-3 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === 'MON'
                          ? 'bg-purple-500 text-white border border-purple-400'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Image src="/token/mon.png" alt="MON" width={16} height={16} className="w-4 h-4" />
                        {selectedPack.price.mon} MON
                      </div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('COOKIES')}
                      className={`py-3 px-3 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === 'COOKIES'
                          ? 'bg-orange-500 text-white border border-orange-400'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Image src="/token/cookies.png" alt="COOKIES" width={16} height={16} className="w-4 h-4" />
                        {selectedPack.price.cookies} COOKIES
                      </div>
                    </button>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handleBuyPack}
                    disabled={!canPurchase}
                    className={`w-full py-4 px-4 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-2 ${
                      !canPurchase
                        ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border border-blue-500 shadow-lg'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {state === 'pending' ? 'Confirm in Wallet...' : 'Processing...'}
                      </>
                    ) : isOpening ? (
                      <>
                        <Package className="w-4 h-4 animate-bounce" />
                        Opening Pack...
                      </>
                    ) : !isConnected ? (
                      <>
                        <Wallet className="w-4 h-4" />
                        Connect Wallet First
                      </>
                    ) : !isOnCorrectChain ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Switch to Monad Testnet
                      </>
                    ) : selectedPack?.locked ? (
                      <>
                        <Lock className="w-4 h-4" />
                        Coming Soon
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        Buy with {paymentMethod}
                      </>
                    )}
                  </button>
                  
                  <p className="text-white/60 text-xs text-center mt-2">
                    NFTs minted to your wallet
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeCategory === 'pack' ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-white/20 bg-white/5">
                <h3 className="text-base font-semibold text-white mb-1">
                  Booster Packs ({PACK_TYPES.length} available)
                </h3>
                <p className="text-white/70 text-xs">Each pack contains 5 powerful monster cards</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-3 pb-20">
                  {PACK_TYPES.map((pack: PackType) => {
                    const isSelected = selectedPack?.id === pack.id
                    const isLocked = pack.locked
                    
                    return (
                      <div
                        key={pack.id}
                        className={`bg-white/5 backdrop-blur-md border rounded-lg p-3 transition-all duration-300 cursor-pointer relative ${
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
                          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center z-10">
                            <div className="text-center">
                              <Lock className="w-4 h-4 text-white/60 mx-auto mb-1" />
                              <p className="text-white/60 text-xs font-medium">Coming Soon</p>
                            </div>
                          </div>
                        )}

                        {/* Pack Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded bg-white/10 border border-white/30 flex items-center justify-center">
                            {getRarityIcon(pack.id)}
                          </div>
                          {!isLocked && (
                            <div className="text-right">
                              <div className="text-green-400 font-bold text-xs">AVAILABLE</div>
                            </div>
                          )}
                        </div>

                        <div className="mb-2">
                          <h4 className="text-white font-bold text-sm">{pack.name}</h4>
                          <p className="text-white/70 text-xs line-clamp-2">{pack.description}</p>
                        </div>

                        {/* Pack Preview */}
                        <div className="bg-white/5 rounded p-2 border border-white/20 mb-2">
                          <div className="flex items-center justify-center py-2">
                            <div className="w-6 h-8 rounded border border-white/30 bg-white/10 flex items-center justify-center">
                              <Package className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="text-center text-white/80 text-xs">5 Cards</div>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 z-10">
                            <div className="bg-blue-400 text-white rounded-full p-1 border border-blue-400/30 shadow-lg">
                              <Star className="w-2 h-2" />
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        {!isLocked && (
                          <div className="space-y-1">
                            <div className="text-purple-400 font-bold text-xs flex items-center justify-center gap-1">
                              <Image src="/token/mon.png" alt="MON" width={12} height={12} className="w-3 h-3" />
                              {pack.price.mon} MON
                            </div>
                            <div className="text-orange-400 font-bold text-xs flex items-center justify-center gap-1">
                              <Image src="/token/cookies.png" alt="COOKIES" width={12} height={12} className="w-3 h-3" />
                              {pack.price.cookies} COOKIES
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
              <div className="text-center p-8">
                <Lock className="w-12 h-12 mx-auto mb-3 opacity-50 text-amber-400" />
                <h4 className="text-lg font-semibold mb-2">Coming Soon</h4>
                <p className="text-sm">This category will be available in a future update</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="p-4 bg-white/5 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
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