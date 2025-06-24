"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, Trophy } from "lucide-react"
import { CardComponent } from "@/components/card-component"
import { PackSelection } from "@/components/pack-selection"
import type { PackType } from "@/constants/packs"
import type { PokemonCard } from "@/types/card"

interface ShopProps {
  isPackOpen: boolean
  revealedCards: PokemonCard[]
  selectedPackType: PackType | null
  collection: PokemonCard[]
  onPackSelect: (packType: PackType, event: React.MouseEvent) => void
  onResetPack: () => void
  isOpening: boolean
}

export function Shop({
  isPackOpen,
  revealedCards,
  selectedPackType,
  collection,
  onPackSelect,
  onResetPack,
  isOpening,
}: ShopProps) {
  return (
    <div className="p-3">
      <div className="max-w-7xl mx-auto">
        {!isPackOpen ? (
          <div>
            {/* Shop Header */}
            <div className="text-center mb-4">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-wider">CARD SHOP</h1>
              <p className="text-gray-300 text-sm md:text-base font-semibold">
                Purchase booster packs to expand your collection
              </p>
            </div>

            <PackSelection onPackSelect={onPackSelect} isOpening={isOpening} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="animate-fade-in-up text-center">
              <div className="relative inline-block mb-3">
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-wider">PACK RESULTS</h2>
              </div>

              {/* Pack Type Indicator */}
              {selectedPackType && (
                <div className="mb-3">
                  <div
                    className={`inline-block bg-gradient-to-r ${selectedPackType.colors.primary} px-3 py-1 border-2 ${selectedPackType.colors.secondary}`}
                  >
                    <span className="text-white font-bold text-sm tracking-wider">{selectedPackType.name}</span>
                  </div>
                </div>
              )}

              {/* Cards Display */}
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {revealedCards.map((card, index) => (
                  <div
                    key={`final-${index}`}
                    className="animate-slide-in-from-bottom relative"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <CardComponent
                      card={card}
                      index={index}
                      currentCardIndex={-1}
                      isFlipped={true}
                      isThrown={false}
                      isInFinalRow={true}
                      onCardClick={() => {}}
                      cards={revealedCards}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <Button
                onClick={onResetPack}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 border border-gray-500 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                OPEN ANOTHER PACK
              </Button>
            </div>
          </div>
        )}

        {/* Collection Stats */}
        {collection.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Card className="bg-gray-800 border border-gray-600">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-gray-400" />
                    <h3 className="text-base font-black text-white tracking-wider">COLLECTION STATS</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-700 p-2 border border-gray-600">
                      <div className="text-white font-bold text-sm">{collection.length}</div>
                      <div className="text-gray-400 text-xs uppercase tracking-wide">Total Cards</div>
                    </div>
                    <div className="bg-gray-700 p-2 border border-gray-600">
                      <div className="text-white font-bold text-sm">
                        {collection.filter((c) => c.rarity === "legendary").length}
                      </div>
                      <div className="text-gray-400 text-xs uppercase tracking-wide">Legendary</div>
                    </div>
                    <div className="bg-gray-700 p-2 border border-gray-600">
                      <div className="text-white font-bold text-sm">
                        {collection.filter((c) => c.rarity === "epic").length}
                      </div>
                      <div className="text-gray-400 text-xs uppercase tracking-wide">Epic</div>
                    </div>
                    <div className="bg-gray-700 p-2 border border-gray-600">
                      <div className="text-white font-bold text-sm">
                        {collection.filter((c) => c.rarity === "rare").length}
                      </div>
                      <div className="text-gray-400 text-xs uppercase tracking-wide">Rare</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
