"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { X, Package, Star, Sparkles, Crown, Lock, ShoppingCart, Loader2, Gift, Wallet, AlertCircle } from "lucide-react"
import Image from "next/image"
import type { PokemonCard } from "@/types/card"
import type { PackType } from "@/constants/packs"
import { PACK_TYPES } from "@/constants/packs"
import { useNadmonPackBuying } from "@/hooks/use-nadmon-pack-buying"
import { useAccount, useChainId } from "wagmi"
import { monadTestnet } from "@/lib/web3-config"
// Removed TransactionToastManager import - will be rebuilt later
import { WalletHandle } from "@/components/wallet-handle"

interface ShopPopupProps {
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
    case "trial": return <Gift className="w-6 h-6 text-purple-400" />
    case "fire": return <Sparkles className="w-6 h-6 text-orange-400" />
    case "water": return <Package className="w-6 h-6 text-blue-400" />
    case "nature": return <Star className="w-6 h-6 text-green-400" />
    default: return <Package className="w-6 h-6 text-gray-400" />
  }
}

export function ShopPopup({
  collection,
  onPackSelect,
  isOpening,
  onClose,
  onPackPurchased,
}: ShopPopupProps) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('pack')
  const [selectedPack, setSelectedPack] = useState<PackType | null>(PACK_TYPES.find(p => !p.locked) || PACK_TYPES[0])
  const [paymentMethod, setPaymentMethod] = useState<'MON' | 'COOKIES'>('MON')
  const [currentToastId, setCurrentToastId] = useState<string | null>(null)
  
  // Wallet and contract hooks
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { buyPackWithMON, buyPackWithCookies, state, error, isLoading, packId, reset } = useNadmonPackBuying()
  
  const isOnCorrectChain = chainId === monadTestnet.id
  const canPurchase = isConnected && isOnCorrectChain && !isLoading && !isOpening && selectedPack && !selectedPack.locked

  const handlePackClick = (packType: PackType) => {
    if (packType.locked) return
    setSelectedPack(packType)
  }

  const handleBuyPack = async () => {
    if (!selectedPack || !canPurchase) return
    
    // Removed toast notifications - will be rebuilt later
    console.log(`Purchasing ${selectedPack.name} with ${paymentMethod}`)
    setCurrentToastId(null)
    
    reset()
    
    try {
      if (paymentMethod === 'MON') {
        await buyPackWithMON()
      } else {
        await buyPackWithCookies()
      }
    } catch (error) {
      console.error('Purchase failed:', error)
    }
  }

  // Handle transaction state changes - removed toast updates, will be rebuilt later
  useEffect(() => {
    console.log(`Transaction state: ${state}`)
    
    if (state === 'success') {
      // Trigger pack opening after short delay
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
      console.error('Transaction failed:', error)
    }
  }, [state, error, selectedPack, onPackSelect, onPackPurchased, reset, packId, paymentMethod])

  const handleCategoryClick = (category: ShopCategory) => {
    const categoryData = SHOP_CATEGORIES.find(c => c.id === category)
    if (categoryData?.unlocked) {
      setActiveCategory(category)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Container */}
      <div className="relative w-full max-w-6xl h-full max-h-[95vh] md:max-h-[90vh] glass-panel rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Monster Shop</h2>
            <p className="text-white/70 text-sm md:text-base">Discover powerful creatures and enhance your collection</p>
          </div>
          <div className="flex items-center gap-3">
            <WalletHandle />
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Category Navigation */}
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
                  className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-wider transition-all whitespace-nowrap ${
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

        {/* Connection Status Warning */}
        {(!isConnected || !isOnCorrectChain) && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-l-4 border-red-400 p-4 m-6 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-200 font-medium">
                  {!isConnected ? 'Wallet not connected' : 'Wrong network'}
                </p>
                <p className="text-red-300/80 text-sm">
                  {!isConnected ? 'Connect your wallet to make purchases' : 'Switch to Monad Testnet to continue'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Pack Details Section */}
        <div className="md:hidden border-b border-white/20 p-4">
          {selectedPack ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Selected Pack</h3>
                <ShoppingCart className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="glass-panel rounded-lg p-4 bg-white/5 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
                    {getRarityIcon(selectedPack.id)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{selectedPack.name}</h4>
                    <p className="text-white/80 text-sm">{selectedPack.description}</p>
                  </div>
                </div>
                
                {/* Payment Method Selector */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setPaymentMethod('MON')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === 'MON'
                        ? 'bg-purple-500 text-white border border-purple-400'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Image src="/token/mon.png" alt="MON" width={14} height={14} className="w-3.5 h-3.5" />
                      {selectedPack.price.mon} MON
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('COOKIES')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      paymentMethod === 'COOKIES'
                        ? 'bg-orange-500 text-white border border-orange-400'
                        : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Image src="/token/cookies.png" alt="COOKIES" width={14} height={14} className="w-3.5 h-3.5" />
                      {selectedPack.price.cookies} COOKIES
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleBuyPack}
                  disabled={!canPurchase}
                  className={`w-full py-4 px-4 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-2 ${
                    !canPurchase
                      ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                      : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500 hover:border-blue-400 shadow-lg'
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
          ) : (
            <div className="flex items-center justify-center py-4 text-white/50">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50 text-blue-400" />
                <p>Select a pack to purchase</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-full overflow-hidden">
          {/* Pack Details Sidebar - Always Visible */}
          <div className="w-80 p-4 border-r border-white/20 bg-white/5 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              Pack Details
            </h3>
            
            {selectedPack ? (
              <div className="flex-1 flex flex-col space-y-3">
                {/* Selected Pack Preview - Compact */}
                <div className="glass-panel rounded-lg p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
                      {getRarityIcon(selectedPack.id)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm">{selectedPack.name}</h4>
                      <p className="text-white/80 text-xs">{selectedPack.description}</p>
                    </div>
                  </div>
                </div>

                {/* Buy Section - Prominent at Top */}
                <div className="glass-panel rounded-lg p-4 bg-white/5 border border-white/20 bg-gradient-to-br from-blue-500/10 to-green-500/10">
                  <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    Purchase Options
                  </h4>
                  
                  {/* Payment Method Selector */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setPaymentMethod('MON')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === 'MON'
                          ? 'bg-purple-500 text-white border border-purple-400'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Image src="/token/mon.png" alt="MON" width={14} height={14} className="w-3.5 h-3.5" />
                        {selectedPack.price.mon} MON
                      </div>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('COOKIES')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        paymentMethod === 'COOKIES'
                          ? 'bg-orange-500 text-white border border-orange-400'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Image src="/token/cookies.png" alt="COOKIES" width={14} height={14} className="w-3.5 h-3.5" />
                        {selectedPack.price.cookies} COOKIES
                      </div>
                    </button>
                  </div>

                  {/* Buy Button - Prominent */}
                  <button
                    onClick={handleBuyPack}
                    disabled={!canPurchase}
                    className={`w-full py-4 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-base ${
                      !canPurchase
                        ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border border-blue-500 hover:border-blue-400 shadow-lg hover:shadow-blue-500/25'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {state === 'pending' ? 'Confirm in Wallet...' : 'Processing...'}
                      </>
                    ) : isOpening ? (
                      <>
                        <Package className="w-5 h-5 animate-bounce" />
                        Opening Pack...
                      </>
                    ) : !isConnected ? (
                      <>
                        <Wallet className="w-5 h-5" />
                        Connect Wallet First
                      </>
                    ) : !isOnCorrectChain ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Switch to Monad Testnet
                      </>
                    ) : selectedPack?.locked ? (
                      <>
                        <Lock className="w-5 h-5" />
                        Coming Soon
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Buy with {paymentMethod}
                      </>
                    )}
                  </button>
                  <p className="text-white/60 text-xs text-center mt-2">NFTs minted directly to your wallet</p>
                </div>

                {/* Pack Contents - Compact */}
                <div className="glass-panel rounded-lg p-3 bg-white/5 border border-white/20">
                  <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    What's Inside
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
                    <div>• 5 Monster Cards</div>
                    <div>• Guaranteed Rare+</div>
                    <div>• {selectedPack.elementFocus || 'Mixed Elements'}</div>
                    <div>• Instant Delivery</div>
                  </div>
                </div>

                {/* Quick Stats - Compact */}
                <div className="glass-panel rounded-lg p-3 bg-white/5 border border-white/20">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="text-green-400 font-bold">∞</div>
                      <div className="text-white/60">In Stock</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">5</div>
                      <div className="text-white/60">Cards/Pack</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-white/50 text-center">
                <div>
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50 text-blue-400" />
                  <p>Select a pack to view details</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Pack Selection Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  {activeCategory === 'pack' ? `Booster Packs (${PACK_TYPES.length} available)` : 'Coming Soon'}
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                </h3>
              </div>
              <p className="text-white/70 text-sm">Each pack contains 5 powerful monster cards with guaranteed rarity</p>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {activeCategory === 'pack' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                  {PACK_TYPES.map((pack: PackType) => {
                    const isSelected = selectedPack?.id === pack.id
                    const isLocked = pack.locked
                    
                    return (
                      <div
                        key={pack.id}
                        className={`glass-panel rounded-lg p-3 backdrop-blur-md bg-white/5 border transition-all duration-300 cursor-pointer hover:scale-105 group relative ${
                          isSelected 
                            ? 'border-blue-400/80 bg-blue-400/20 scale-105 shadow-lg shadow-blue-400/20 z-10' 
                            : isLocked
                            ? 'border-white/10 opacity-50 cursor-not-allowed hover:scale-100'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        style={{ transformOrigin: 'center' }}
                        onClick={() => handlePackClick(pack)}
                      >
                        {/* Lock Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center z-10">
                            <div className="text-center">
                              <Lock className="w-6 h-6 text-white/60 mx-auto mb-1" />
                              <p className="text-white/60 text-xs font-medium">Coming Soon</p>
                            </div>
                          </div>
                        )}

                        {/* Pack Card Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/30 flex items-center justify-center">
                            {getRarityIcon(pack.id)}
                          </div>
                          {!isLocked && (
                            <div className="text-right">
                              <div className="text-green-400 font-bold text-xs">AVAILABLE</div>
                            </div>
                          )}
                        </div>

                        {/* Pack Info */}
                        <div className="mb-3">
                          <h4 className="text-white font-bold text-sm mb-1">{pack.name}</h4>
                          <p className="text-white/70 text-xs mb-1">{pack.description}</p>
                          {pack.elementFocus && (
                            <p className="text-purple-300 text-xs font-medium">{pack.elementFocus}</p>
                          )}
                        </div>

                        {/* Pack Preview */}
                        <div className="glass-panel rounded p-2 bg-white/5 border border-white/20 mb-3">
                          <div className="flex items-center justify-center py-3">
                            <div className="w-6 h-8 rounded border-2 border-white/30 bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                              <Package className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="text-center text-white/80 text-xs">5 Cards Inside</div>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 z-10">
                            <div className="bg-blue-400 text-white rounded-full p-1 border border-blue-400/30 shadow-lg">
                              <Star className="w-3 h-3" />
                            </div>
                          </div>
                        )}

                        {/* Price Display */}
                        {!isLocked && (
                          <div className="text-center space-y-1.5">
                            <div className="text-purple-400 font-bold text-sm flex items-center justify-center gap-1.5">
                              <Image src="/token/mon.png" alt="MON" width={16} height={16} className="w-4 h-4" />
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
              ) : (
                <div className="flex items-center justify-center h-64 text-white/50">
                  <div className="text-center">
                    <Lock className="w-12 h-12 mx-auto mb-3 opacity-50 text-amber-400" />
                    <h4 className="text-lg font-semibold mb-2">Coming Soon</h4>
                    <p className="text-sm">This category will be available in a future update</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Collection */}
        <div className="md:hidden flex flex-col h-full">
          <div className="p-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-white mb-3">
              {activeCategory === 'pack' ? `Booster Packs (${PACK_TYPES.length} available)` : 'Coming Soon'}
            </h3>
          </div>
          
          <div className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
            {activeCategory === 'pack' ? (
              <div className="grid grid-cols-2 gap-3 pb-8">
                {PACK_TYPES.map((pack: PackType) => {
                  const isSelected = selectedPack?.id === pack.id
                  const isLocked = pack.locked
                  
                  return (
                    <div
                      key={pack.id}
                      className={`glass-panel rounded-lg p-3 backdrop-blur-md bg-white/5 border transition-all duration-300 cursor-pointer hover:scale-105 group relative ${
                        isSelected 
                          ? 'border-blue-400/80 bg-blue-400/20 scale-105 shadow-lg shadow-blue-400/20' 
                          : isLocked
                          ? 'border-white/10 opacity-50 cursor-not-allowed hover:scale-100'
                          : 'border-white/20 hover:border-white/40'
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
                        <h4 className="text-white font-bold text-xs">{pack.name}</h4>
                        <p className="text-white/70 text-xs">{pack.description}</p>
                      </div>

                      {/* Pack Preview */}
                      <div className="glass-panel rounded p-2 bg-white/5 border border-white/20 mb-2">
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
                        <div className="text-center">
                          <div className="text-purple-400 font-bold text-xs flex items-center justify-center gap-1">
                            <Image src="/token/mon.png" alt="MON" width={12} height={12} className="w-3 h-3" />
                            {pack.price.mon} MON
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-white/50">
                <div className="text-center">
                  <Lock className="w-12 h-12 mx-auto mb-3 opacity-50 text-amber-400" />
                  <h4 className="font-bold mb-2">Coming Soon</h4>
                  <p className="text-sm">This category will be available soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
} 