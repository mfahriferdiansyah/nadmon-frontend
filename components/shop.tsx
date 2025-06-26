"use client"

import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Package, Star, Zap } from "lucide-react"
import { PACK_TYPES, type PackType } from "@/constants/packs"
import type { PokemonCard } from "@/types/card"

interface ShopProps {
  collection: PokemonCard[]
  onPackSelect: (packType: PackType, event: React.MouseEvent) => void
  isOpening: boolean
}

export function Shop({
  collection,
  onPackSelect,
  isOpening,
}: ShopProps) {
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null)

  const handlePackClick = (packType: PackType) => {
    setSelectedPack(packType)
  }

  const handleBuyPack = (event: React.MouseEvent) => {
    if (selectedPack && !isOpening) {
      onPackSelect(selectedPack, event)
    }
  }

  return (
    <div className="p-3">
      <div className="max-w-7xl mx-auto">
        {/* Shop Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-wider">CARD SHOP</h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold">
            Purchase booster packs to expand your collection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Pack Selection Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 border border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-black text-white tracking-wider">BOOSTER PACKS</h2>
                <div className="bg-gray-700 border border-gray-600 px-2 py-1">
                  <span className="text-white text-xs font-bold">{PACK_TYPES.length} AVAILABLE</span>
                </div>
              </div>

              {/* Pack Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {PACK_TYPES.map((packType) => (
                  <div key={packType.id} className="relative">
                    {/* Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${packType.colors.primary} rounded-2xl blur-xl opacity-30`}
                    ></div>

                    <div className="relative pack-container">
                      <div
                        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 group ${
                          selectedPack?.id === packType.id ? 'ring-2 ring-white scale-105' : ''
                        }`}
                        onClick={() => handlePackClick(packType)}
                      >
                        <Card
                          className={`w-full h-48 bg-gradient-to-br ${packType.colors.primary} border-2 ${packType.colors.secondary} shadow-xl ${packType.colors.tertiary} rounded-2xl overflow-hidden`}
                        >
                          <CardContent className="p-3 flex flex-col items-center justify-center h-full text-white relative">
                            {/* Holographic Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <Package className="w-10 h-10 mb-2 drop-shadow-lg" />
                            <h3 className="text-base font-black mb-1 tracking-wider">NADMON</h3>
                            <p className="text-sm opacity-90 text-center mb-1 font-semibold">{packType.name}</p>
                            <p className="text-xs opacity-75 text-center mb-2">{packType.description}</p>
                            <div className="text-xs opacity-75 bg-black/30 px-2 py-1 rounded-full">5 CARDS INSIDE</div>

                            {/* Selection Indicator */}
                            {selectedPack?.id === packType.id && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <div className="bg-white text-gray-900 rounded-full p-1">
                                  <Star className="w-3 h-3" />
                                </div>
                              </div>
                            )}

                            {/* Corner Decorations */}
                            <div
                              className={`absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 ${packType.colors.border}`}
                            ></div>
                            <div
                              className={`absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 ${packType.colors.border}`}
                            ></div>
                            <div
                              className={`absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 ${packType.colors.border}`}
                            ></div>
                            <div
                              className={`absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 ${packType.colors.border}`}
                            ></div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Side Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 p-4 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-black text-white tracking-wider">PACK DETAILS</h2>
              </div>

              {selectedPack ? (
                <div className="space-y-4">
                  {/* Selected Pack Preview */}
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${selectedPack.colors.primary} rounded-xl blur-sm opacity-40`}
                    ></div>
                    <div className="relative">
                      <Card
                        className={`w-full h-32 bg-gradient-to-br ${selectedPack.colors.primary} border-2 ${selectedPack.colors.secondary} shadow-lg rounded-xl overflow-hidden`}
                      >
                        <CardContent className="p-3 flex flex-col items-center justify-center h-full text-white">
                          <Package className="w-8 h-8 mb-1 drop-shadow-lg" />
                          <p className="text-sm font-black tracking-wider">{selectedPack.name}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Pack Information */}
                  <div className="space-y-3">
                    <div className="bg-gray-700 border border-gray-600 p-3 rounded">
                      <h4 className="text-white font-bold text-sm mb-2">DESCRIPTION</h4>
                      <p className="text-gray-300 text-xs">{selectedPack.description}</p>
                    </div>

                    <div className="bg-gray-700 border border-gray-600 p-3 rounded">
                      <h4 className="text-white font-bold text-sm mb-2">CONTENTS</h4>
                      <ul className="text-gray-300 text-xs space-y-1">
                        <li>• 5 Random Cards</li>
                        <li>• Guaranteed Rare or Higher</li>
                        <li>• {selectedPack.name.split(' ')[0]} Element Focus</li>
                      </ul>
                    </div>

                    <div className="bg-gray-700 border border-gray-600 p-3 rounded">
                      <h4 className="text-white font-bold text-sm mb-2">PRICE</h4>
                      <div className="text-yellow-400 font-bold text-lg">100 COINS</div>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <Button
                    onClick={handleBuyPack}
                    disabled={isOpening}
                    className={`w-full bg-gradient-to-r ${selectedPack.colors.primary} hover:opacity-90 text-white font-bold py-3 text-sm transition-all duration-300 disabled:opacity-50`}
                  >
                    {isOpening ? 'OPENING...' : 'BUY & OPEN PACK'}
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-bold mb-1">SELECT A PACK</p>
                  <p className="text-xs opacity-75">Choose a pack to view details and purchase</p>
                </div>
              )}
            </div>
          </div>
        </div>

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
