"use client"

import type React from "react"
import { X, Package2, Star, Sparkles, Crown } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import type { PackType } from "@/constants/packs"
import { PACK_TYPES } from "@/constants/packs"

interface ShopPopupProps {
  collection: PokemonCard[]
  onPackSelect: (packType: PackType, event: React.MouseEvent) => void
  isOpening: boolean
  onClose: () => void
}

const getRarityIcon = (packId: string) => {
  switch (packId) {
    case "starter": return <Package2 className="w-8 h-8" />
    case "rare": return <Star className="w-8 h-8" />
    case "epic": return <Sparkles className="w-8 h-8" />
    case "legendary": return <Crown className="w-8 h-8" />
    default: return <Package2 className="w-8 h-8" />
  }
}

const getRarityDescription = (packId: string) => {
  switch (packId) {
    case "starter": return "Basic monsters for beginners"
    case "rare": return "Enhanced monsters with better stats"
    case "epic": return "Powerful monsters with unique abilities"
    case "legendary": return "The most powerful monsters available"
    default: return "Mystery pack contents"
  }
}

export function ShopPopup({
  collection,
  onPackSelect,
  isOpening,
  onClose,
}: ShopPopupProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Container */}
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] glass-panel rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Monster Shop</h2>
            <p className="text-white/70">Open packs to discover new monsters</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Shop Stats */}
          <div className="mb-8 glass-panel rounded-xl p-4 backdrop-blur-md bg-white/5 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{collection.length}</div>
                <div className="text-white/70 text-sm">Monsters Collected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">Free</div>
                <div className="text-white/70 text-sm">Pack Cost</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">5</div>
                <div className="text-white/70 text-sm">Cards per Pack</div>
              </div>
            </div>
          </div>

          {/* Pack Selection */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Choose Your Pack</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PACK_TYPES.map((pack: PackType) => (
                <div
                  key={pack.id}
                  className="glass-panel rounded-2xl p-6 backdrop-blur-md bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 group cursor-pointer"
                  onClick={(e) => !isOpening && onPackSelect(pack, e)}
                >
                  {/* Pack Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${pack.colors.primary}, ${pack.colors.secondary})`
                      }}
                    >
                      {getRarityIcon(pack.id)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{pack.name}</h4>
                      <p className="text-white/70 text-sm">{getRarityDescription(pack.id)}</p>
                    </div>
                  </div>

                  {/* Pack Description */}
                  <p className="text-white/80 mb-4">{pack.description}</p>

                  {/* Pack Preview/Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Cards per pack:</span>
                      <span className="text-white font-medium">5 cards</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Rarity focus:</span>
                      <span className="text-white font-medium capitalize">{pack.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Cost:</span>
                      <span className="text-green-400 font-bold">FREE</span>
                    </div>
                  </div>

                  {/* Pack Visual */}
                  <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(45deg, ${pack.colors.primary}20, ${pack.colors.secondary}20, ${pack.colors.tertiary}20)`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="w-20 h-28 rounded-lg border-2 shadow-lg transform group-hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: pack.colors.primary,
                          borderColor: pack.colors.border,
                          boxShadow: `0 0 20px ${pack.colors.secondary}40`
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {getRarityIcon(pack.id)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Open Button */}
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isOpening
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white hover:from-blue-500/30 hover:to-purple-500/30 hover:scale-105'
                    }`}
                    disabled={isOpening}
                  >
                    {isOpening ? 'Opening...' : 'Open Pack'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 glass-panel rounded-xl p-6 backdrop-blur-md bg-white/5 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-3">How It Works</h4>
            <div className="space-y-2 text-white/70">
              <p>• Select a pack type based on the rarity you want to focus on</p>
              <p>• Each pack contains 5 random monster cards</p>
              <p>• Higher tier packs have better chances for rare monsters</p>
              <p>• All monsters are automatically added to your collection</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
} 