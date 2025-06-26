"use client"

import { useState } from "react"
import type React from "react"
import { X, Package, Star, Sparkles, Crown, Package2, Lock, ShoppingCart, Coins } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import type { PackType } from "@/constants/packs"
import { PACK_TYPES } from "@/constants/packs"

interface ShopPopupProps {
  collection: PokemonCard[]
  onPackSelect: (packType: PackType, event: React.MouseEvent) => void
  isOpening: boolean
  onClose: () => void
}

type ShopCategory = 'pack' | 'stone' | 'building' | 'costume'

const SHOP_CATEGORIES = [
  { id: 'pack' as ShopCategory, name: 'PACK', icon: Package, unlocked: true, color: 'blue-400' },
  { id: 'stone' as ShopCategory, name: 'STONE', icon: Sparkles, unlocked: false, color: 'emerald-400' },
  { id: 'building' as ShopCategory, name: 'BUILDING', icon: Crown, unlocked: false, color: 'amber-400' },
  { id: 'costume' as ShopCategory, name: 'COSTUME', icon: Star, unlocked: false, color: 'pink-400' },
]

const getRarityIcon = (packId: string) => {
  switch (packId) {
    case "fire": return <Sparkles className="w-6 h-6 text-orange-400" />
    case "water": return <Package2 className="w-6 h-6 text-blue-400" />
    case "nature": return <Star className="w-6 h-6 text-green-400" />
    default: return <Package2 className="w-6 h-6 text-gray-400" />
  }
}

const getPackColors = (packId: string) => {
  switch (packId) {
    case "fire": return {
      accent: 'border-orange-400',
      text: 'text-orange-400',
      bg: 'bg-orange-400'
    }
    case "water": return {
      accent: 'border-blue-400',
      text: 'text-blue-400',
      bg: 'bg-blue-400'
    }
    case "nature": return {
      accent: 'border-green-400',
      text: 'text-green-400',
      bg: 'bg-green-400'
    }
    default: return {
      accent: 'border-gray-400',
      text: 'text-gray-400',
      bg: 'bg-gray-400'
    }
  }
}

const getPackStock = (packId: string) => {
  // Mock stock data - you can replace with real data
  return Math.floor(Math.random() * 50) + 10
}

export function ShopPopup({
  collection,
  onPackSelect,
  isOpening,
  onClose,
}: ShopPopupProps) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('pack')
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null)

  const handlePackClick = (packType: PackType) => {
    setSelectedPack(packType)
  }

  const handleBuyPack = (event: React.MouseEvent) => {
    if (selectedPack && !isOpening) {
      onPackSelect(selectedPack, event)
    }
  }

  const handleCategoryClick = (category: ShopCategory) => {
    const categoryData = SHOP_CATEGORIES.find(c => c.id === category)
    if (categoryData?.unlocked) {
      setActiveCategory(category)
      setSelectedPack(null)
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
            <p className="text-white/70 text-sm md:text-base">Purchase items to enhance your adventure</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
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
                      ? `text-white border-b-2 border-${category.color} bg-white/10` 
                      : isLocked
                        ? 'text-white/30 cursor-not-allowed'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? `text-${category.color}` : isLocked ? 'text-white/30' : 'text-white/70'}`} />
                  {category.name}
                  {isLocked && <Lock className="w-3 h-3 text-amber-400" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile Selected Item Section */}
        <div className="md:hidden border-b border-white/20 p-4">
          {selectedPack ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Selected Item</h3>
                <ShoppingCart className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="glass-panel rounded-lg p-4 bg-white/5 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/30 flex items-center justify-center">
                    {getRarityIcon(selectedPack.id)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{selectedPack.name}</h4>
                    <p className="text-white/70 text-xs">{selectedPack.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-sm">Stock:</span>
                  <span className={`font-bold ${getPackColors(selectedPack.id).text}`}>{getPackStock(selectedPack.id)} available</span>
                </div>
                
                <button
                  onClick={handleBuyPack}
                  disabled={isOpening}
                  className={`w-full py-2 px-4 rounded-lg font-bold transition-all text-sm ${
                    isOpening
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  {isOpening ? 'Opening...' : 'Buy & Open Pack'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 text-white/50">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50 text-blue-400" />
                <p>Select an item to purchase</p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-full overflow-hidden">
          {/* Item Details Sidebar */}
          <div className="w-80 p-6 border-r border-white/20 bg-white/5 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              Item Details
            </h3>
            
            {selectedPack ? (
              <div className="flex-1 space-y-4">
                {/* Selected Item Preview */}
                <div className="glass-panel rounded-lg p-4 bg-white/5 border border-white/20">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-white/10 border border-white/30 flex items-center justify-center mb-3">
                      {getRarityIcon(selectedPack.id)}
                    </div>
                    <h4 className="text-white font-bold text-lg">{selectedPack.name}</h4>
                    <p className="text-white/70 text-sm mt-1">{selectedPack.description}</p>
                  </div>
                </div>

                {/* Item Information */}
                <div className="space-y-3">
                  <div className="glass-panel rounded-lg p-3 bg-white/5 border border-white/20">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-400" />
                      Contents
                    </h4>
                    <ul className="text-white/80 text-xs space-y-1">
                      <li>• 5 Random Monster Cards</li>
                      <li>• Guaranteed Rare or Higher</li>
                      <li>• <span className={getPackColors(selectedPack.id).text}>{selectedPack.name.split(' ')[0]} Element Focus</span></li>
                      <li>• Bonus XP for new cards</li>
                    </ul>
                  </div>

                  <div className="glass-panel rounded-lg p-3 bg-white/5 border border-white/20">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      Price & Stock
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-xs">Price:</span>
                        <span className="text-green-400 font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-xs">In Stock:</span>
                        <span className={`font-bold ${getPackColors(selectedPack.id).text}`}>{getPackStock(selectedPack.id)} available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="space-y-2">
                  <button
                    onClick={handleBuyPack}
                    disabled={isOpening}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${
                      isOpening
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                    }`}
                  >
                    {isOpening ? 'Opening...' : 'Buy & Open Pack'}
                  </button>
                  <p className="text-white/50 text-xs text-center">Cards will be added to your collection</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-white/50 text-center">
                <div>
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50 text-blue-400" />
                  <p>Select an item to view details</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Item Selection */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeCategory === 'pack' ? `Booster Packs (${PACK_TYPES.length} available)` : 'Coming Soon'}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {activeCategory === 'pack' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6 pt-4">
                  {PACK_TYPES.map((pack: PackType) => {
                    const colors = getPackColors(pack.id)
                    return (
                      <div
                        key={pack.id}
                        className={`glass-panel rounded-lg p-4 backdrop-blur-md bg-white/5 border transition-all duration-300 cursor-pointer hover:scale-105 group relative ${
                          selectedPack?.id === pack.id 
                            ? 'border-orange-400/80 bg-orange-400/20 scale-105 shadow-lg shadow-orange-400/20' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => handlePackClick(pack)}
                      >
                        {/* Pack Card Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/30 flex items-center justify-center">
                            {getRarityIcon(pack.id)}
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold text-sm">FREE</div>
                            <div className={`text-xs ${colors.text}`}>{getPackStock(pack.id)} left</div>
                          </div>
                        </div>

                        {/* Pack Info */}
                        <div className="mb-3">
                          <h4 className="text-white font-bold text-sm mb-1">{pack.name}</h4>
                          <p className="text-white/70 text-xs">{pack.description}</p>
                        </div>

                        {/* Pack Preview */}
                        <div className="glass-panel rounded p-2 bg-white/5 border border-white/20 mb-3">
                          <div className="flex items-center justify-center py-3">
                            <div className="w-8 h-10 rounded border border-white/30 bg-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="text-center text-white/80 text-xs">5 Cards Inside</div>
                        </div>

                        {/* Selection Indicator */}
                        {selectedPack?.id === pack.id && (
                          <div className="absolute -top-2 -right-2 z-10">
                            <div className="bg-orange-400 text-white rounded-full p-1 border border-orange-400/30 shadow-lg">
                              <Star className="w-3 h-3" />
                            </div>
                          </div>
                        )}

                        {/* Colored Bottom Accent */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg} rounded-b-lg`} />

                        {/* Quick Buy Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPack(pack)
                            handleBuyPack(e)
                          }}
                          disabled={isOpening}
                          className={`w-full py-2 px-3 rounded text-xs font-bold transition-all ${
                            isOpening
                              ? 'bg-white/10 text-white/50 cursor-not-allowed'
                              : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                          }`}
                        >
                          {isOpening ? 'Opening...' : 'Quick Buy'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-white/50">
                  <div className="text-center">
                    <Lock className="w-12 h-12 mx-auto mb-3 opacity-50 text-amber-400" />
                    <h4 className="font-bold mb-2">Coming Soon</h4>
                    <p className="text-sm">This category will be available in a future update</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Item Selection */}
        <div className="md:hidden flex flex-col h-full">
          <div className="p-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-white mb-3">
              {activeCategory === 'pack' ? `Booster Packs (${PACK_TYPES.length} available)` : 'Coming Soon'}
            </h3>
          </div>
          
          <div className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
            {activeCategory === 'pack' ? (
              <div className="grid grid-cols-2 gap-3 pb-16">
                {PACK_TYPES.map((pack: PackType) => {
                  const colors = getPackColors(pack.id)
                  return (
                    <div
                      key={pack.id}
                      className={`glass-panel rounded-lg p-3 backdrop-blur-md bg-white/5 border transition-all duration-300 cursor-pointer hover:scale-105 group relative ${
                        selectedPack?.id === pack.id 
                          ? 'border-orange-400/80 bg-orange-400/20 scale-105 shadow-lg shadow-orange-400/20' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      onClick={() => handlePackClick(pack)}
                    >
                      {/* Pack Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded bg-white/10 border border-white/30 flex items-center justify-center">
                          {getRarityIcon(pack.id)}
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-xs">FREE</div>
                        </div>
                      </div>

                      <div className="mb-2">
                        <h4 className="text-white font-bold text-xs">{pack.name}</h4>
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
                      {selectedPack?.id === pack.id && (
                        <div className="absolute -top-1 -right-1 z-10">
                          <div className="bg-orange-400 text-white rounded-full p-1 border border-orange-400/30 shadow-lg">
                            <Star className="w-2 h-2" />
                          </div>
                        </div>
                      )}

                      {/* Colored Bottom Accent */}
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.bg} rounded-b-lg`} />
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