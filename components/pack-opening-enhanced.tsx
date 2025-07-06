"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Package, X, Star } from "lucide-react"
import { MonsterCard } from "@/components/card-component"
import type { PokemonCard } from "@/types/card"
import type { PackType } from "@/constants/packs"

export interface PackOpeningEnhancedProps {
  isOpening: boolean
  onComplete: () => void
  packPosition?: { x: number; y: number }
  packType?: PackType
  packNFTs: PokemonCard[]
  packId?: number | null
  onClose?: () => void
}

type AnimationStage = "idle" | "shaking" | "ripping" | "pulling-cards" | "revealing-cards" | "complete"

export function PackOpeningEnhanced({ 
  isOpening, 
  onComplete, 
  packPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }, 
  packType,
  packNFTs,
  packId,
  onClose
}: PackOpeningEnhancedProps) {
  const [animationStage, setAnimationStage] = useState<AnimationStage>("idle")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAllCards, setShowAllCards] = useState(false)

  // Default to fire pack colors if no packType provided
  const colors = packType?.colors || {
    primary: "from-orange-500 via-red-500 to-orange-600",
    secondary: "border-orange-300", 
    tertiary: "shadow-orange-500/50",
    border: "border-yellow-300",
  }

  const packName = packType?.name || "BOOSTER PACK"

  useEffect(() => {
    if (isOpening && packNFTs.length > 0) {
      console.log(`🎁 Starting pack opening animation with ${packNFTs.length} NFTs`);
      setAnimationStage("shaking")
      setCurrentCardIndex(0)
      setShowAllCards(false)

      // Animation timeline
      setTimeout(() => {
        setAnimationStage("ripping")
      }, 500)

      setTimeout(() => {
        setAnimationStage("pulling-cards")
      }, 900)

      setTimeout(() => {
        setAnimationStage("revealing-cards")
      }, 1400)

      // Start revealing cards one by one
      setTimeout(() => {
        setCurrentCardIndex(1)
      }, 1800)

      // Continue revealing cards every 600ms
      for (let i = 2; i <= packNFTs.length; i++) {
        setTimeout(() => {
          setCurrentCardIndex(i)
        }, 1800 + (i - 1) * 600)
      }

      // Show all cards together after individual reveals
      setTimeout(() => {
        setShowAllCards(true)
        setAnimationStage("complete")
      }, 2200 + packNFTs.length * 600)

    } else {
      setAnimationStage("idle")
    }
  }, [isOpening, packNFTs.length])

  const handleClose = () => {
    onComplete()
    onClose?.()
  }

  if (!isOpening || packNFTs.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      {/* Pack Animation Stage */}
      {(animationStage === "shaking" || animationStage === "ripping" || animationStage === "pulling-cards") && (
        <div
          className="absolute z-[300]"
          style={{
            left: packPosition.x - 100,
            top: packPosition.y - 150,
          }}
        >
          {/* Sparkle effects */}
          {(animationStage === "ripping" || animationStage === "pulling-cards") && (
            <>
              <Sparkles className="absolute -top-4 -left-4 h-8 w-8 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute -top-2 -right-6 h-6 w-6 text-blue-400 animate-pulse delay-100" />
              <Sparkles className="absolute -bottom-4 -right-2 h-10 w-10 text-purple-400 animate-pulse delay-200" />
              <Sparkles className="absolute -bottom-2 -left-6 h-7 w-7 text-green-400 animate-pulse delay-300" />
            </>
          )}

          <Card
            className={`
              relative h-60 w-48 overflow-hidden transition-all duration-300
              ${colors.secondary} ${colors.tertiary} ${colors.border}
              ${animationStage === "shaking" ? "animate-bounce" : ""}
              ${animationStage === "ripping" ? "transform scale-110" : ""}
              ${animationStage === "pulling-cards" ? "opacity-50 scale-75" : ""}
            `}
          >
            <CardContent className="p-0 h-full">
              <div className={`h-full w-full bg-gradient-to-br ${colors.primary} relative flex items-center justify-center`}>
                <div className="text-center text-white">
                  <Package className="h-16 w-16 mx-auto mb-4" />
                  <div className="font-bold text-lg">{packName}</div>
                  {packId && (
                    <div className="text-sm opacity-75">#{packId}</div>
                  )}
                </div>

                {/* Ripping effect */}
                {animationStage === "ripping" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Card Reveal Stage */}
      {(animationStage === "revealing-cards" || animationStage === "complete") && (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="relative max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">
                🎉 Pack Opened! 🎉
              </h2>
              <p className="text-xl text-gray-300">
                You got {packNFTs.length} new Nadmon{packNFTs.length > 1 ? 's' : ''}!
              </p>
              {packId && (
                <Badge variant="outline" className="mt-2 text-white border-white/20">
                  Pack #{packId}
                </Badge>
              )}
            </div>

            {/* Individual Card Reveals */}
            {!showAllCards && (
              <div className="flex justify-center">
                {packNFTs.slice(0, currentCardIndex).map((nft, index) => (
                  <div
                    key={nft.id}
                    className={`
                      transition-all duration-500 transform
                      ${index === currentCardIndex - 1 ? 'scale-110 z-10' : 'scale-95 opacity-75'}
                    `}
                    style={{
                      marginLeft: index > 0 ? '-60px' : '0',
                      animation: index === currentCardIndex - 1 ? 'cardReveal 0.6s ease-out' : undefined,
                    }}
                  >
                    <div className="relative">
                      <MonsterCard
                        card={nft}
                        onClick={() => {}}
                        isEquipped={false}
                        canEquip={false}
                        showActions={false}
                      />
                      
                      {/* New card indicator */}
                      {index === currentCardIndex - 1 && (
                        <div className="absolute -top-4 -right-4">
                          <Star className="h-8 w-8 text-yellow-400 animate-spin" />
                        </div>
                      )}
                      
                      {/* Rarity indicator */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge 
                          variant="outline" 
                          className={`
                            text-xs
                            ${nft.rarity === 'legendary' ? 'border-yellow-400 text-yellow-400' :
                              nft.rarity === 'epic' ? 'border-purple-400 text-purple-400' :
                              nft.rarity === 'rare' ? 'border-blue-400 text-blue-400' :
                              'border-gray-400 text-gray-400'}
                          `}
                        >
                          {nft.rarity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Cards Display */}
            {showAllCards && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center">
                  {packNFTs.map((nft, index) => (
                    <div
                      key={nft.id}
                      className="transform transition-all duration-300 hover:scale-105"
                      style={{
                        animation: `cardFloat 0.8s ease-out ${index * 0.1}s`,
                      }}
                    >
                      <div className="relative">
                        <MonsterCard
                          card={nft}
                          onClick={() => {}}
                          isEquipped={false}
                          canEquip={false}
                          showActions={false}
                        />
                        
                        {/* Stats preview */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black/60 rounded px-2 py-1 text-xs text-white">
                            <div className="flex justify-between">
                              <span>HP: {nft.hp}</span>
                              <span>ATK: {nft.attack}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Rarity badge */}
                        <div className="absolute -top-2 -right-2">
                          <Badge 
                            variant="outline" 
                            className={`
                              text-xs
                              ${nft.rarity === 'legendary' ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' :
                                nft.rarity === 'epic' ? 'border-purple-400 text-purple-400 bg-purple-400/10' :
                                nft.rarity === 'rare' ? 'border-blue-400 text-blue-400 bg-blue-400/10' :
                                'border-gray-400 text-gray-400 bg-gray-400/10'}
                            `}
                          >
                            {nft.rarity.charAt(0).toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="bg-black/40 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-4 text-center">Pack Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{packNFTs.length}</div>
                      <div className="text-sm text-gray-300">Total Cards</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {packNFTs.reduce((sum, nft) => sum + nft.hp, 0)}
                      </div>
                      <div className="text-sm text-gray-300">Total HP</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {packNFTs.reduce((sum, nft) => sum + nft.attack, 0)}
                      </div>
                      <div className="text-sm text-gray-300">Total Attack</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {new Set(packNFTs.map(nft => nft.type)).size}
                      </div>
                      <div className="text-sm text-gray-300">Types</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <Button onClick={handleClose} className="px-8 py-3 text-lg">
                    Awesome! Continue Playing
                  </Button>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes cardReveal {
          0% {
            transform: translateY(-100px) scale(0.5) rotateY(180deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) scale(1.1) rotateY(90deg);
          }
          100% {
            transform: translateY(0) scale(1.1) rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes cardFloat {
          0% {
            transform: translateY(50px) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default PackOpeningEnhanced