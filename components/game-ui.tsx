"use client"

import type React from "react"
import { Package, Sword, ShoppingBag, Swords, BarChart3, Heart, Shield, Target, UserX, ChevronUp, ChevronDown, Flame, Droplets, Leaf, Zap } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import Image from "next/image"
import { useState } from "react"

interface GameUIProps {
  onOpenInventory: () => void
  onOpenShop: () => void
  onOpenBattleground: () => void
  equippedCardsCount: number
  collectionCount: number
  equippedCards: PokemonCard[]
  onUnequipCard?: (cardId: number) => void
}

// Rarity styles for cards
const RARITY_STYLES = {
  common: {
    bg: "bg-gray-500",
    text: "text-gray-100",
    border: "border-gray-400",
    glow: "shadow-gray-400/30"
  },
  rare: {
    bg: "bg-blue-500",
    text: "text-blue-100",
    border: "border-blue-400",
    glow: "shadow-blue-400/30"
  },
  epic: {
    bg: "bg-purple-500",
    text: "text-purple-100",
    border: "border-purple-400",
    glow: "shadow-purple-400/30"
  },
  legendary: {
    bg: "bg-orange-500",
    text: "text-orange-100",
    border: "border-orange-400",
    glow: "shadow-orange-400/30"
  }
}

// Type icons - Now with proper attribute symbols
const getTypeIcon = (type: string) => {
  const iconClass = "w-4 h-4"
  switch (type.toLowerCase()) {
    case "fire":
      return <Flame className={`${iconClass} text-red-400`} />
    case "water":
      return <Droplets className={`${iconClass} text-blue-400`} />
    case "grass":
      return <Leaf className={`${iconClass} text-green-400`} />
    case "electric":
      return <Zap className={`${iconClass} text-yellow-400`} />
    default:
      return <Zap className={`${iconClass} text-gray-400`} />
  }
}

export function GameUI({
  onOpenInventory,
  onOpenShop,
  onOpenBattleground,
  equippedCardsCount,
  collectionCount,
  equippedCards,
  onUnequipCard,
}: GameUIProps) {
  const [showEquippedMonsters, setShowEquippedMonsters] = useState(true)

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Top Stats Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">{collectionCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4" />
                <span className="text-sm font-medium">{equippedCardsCount}/3</span>
              </div>
            </div>
          </div>

          {/* Game Title */}
          <div className="glass-panel px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <h1 className="text-white text-xl font-bold">nadMon on Monad</h1>
          </div>

          {/* Placeholder for balance */}
          <div className="w-32" />
        </div>

        {/* Equipped Monsters Display - Top Left Vertical */}
        <div className="absolute top-20 left-4 pointer-events-auto">
          <div className="glass-panel rounded-xl backdrop-blur-md bg-white/5 border border-white/20 w-56">
            {/* Header with Toggle */}
            <div className="flex items-center justify-between p-3 border-b border-white/20">
              <h3 className="text-white text-sm font-semibold">
                Equipped Monsters ({equippedCardsCount}/3)
              </h3>
          <button
                onClick={() => setShowEquippedMonsters(!showEquippedMonsters)}
                className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
              >
                {showEquippedMonsters ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Collapsible Content */}
            {showEquippedMonsters && (
              <div className="p-3">
                {equippedCardsCount > 0 ? (
                  <div className="space-y-2">
                    {equippedCards.map((card, index) => (
                      <div
                        key={card.id}
                        className={`relative rounded-lg p-2 border transition-all duration-300 hover:scale-[1.02] ${
                          RARITY_STYLES[card.rarity].border
                        } bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${
                          RARITY_STYLES[card.rarity].glow
                        }`}
                      >
                        <div className="flex gap-2">
                          {/* Left Column - Image and Progress */}
                          <div className="flex flex-col items-center">
                            {/* Monster Image */}
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={`/monster/${card.id}.png`}
                                alt={card.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=150"
                                }}
                              />
                              
                              {/* Rarity indicator */}
                              <div className="absolute bottom-0 right-0 text-xs font-bold text-white bg-black/60 px-0.5 rounded-tl text-[10px]">
                                {card.rarity.charAt(0).toUpperCase()}
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-10 mt-1">
                              <div className="w-full bg-gray-700/50 rounded-full h-0.5">
                                <div 
                                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-0.5 rounded-full transition-all duration-300"
                                  style={{ width: `0%` }}
                                />
                              </div>
                              <div className="text-[10px] text-white/60 text-center mt-0.5">
                                0/10
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Name, Type & Stats */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            {/* Name and Type */}
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white text-sm truncate flex-1 text-center">
                                {card.name}
                              </h4>
                              {/* Type Icon - Prominent with actual attribute symbol */}
                              <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center ml-1 flex-shrink-0">
                                {getTypeIcon(card.type)}
                              </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-0.5 text-xs">
                              <div className="flex items-center justify-between bg-black/20 rounded px-1 py-0.5">
                                <Heart className="w-2 h-2 text-red-400" />
                                <span className="text-white/90 font-medium text-[11px]">{card.hp}</span>
                              </div>
                              <div className="flex items-center justify-between bg-black/20 rounded px-1 py-0.5">
                                <Sword className="w-2 h-2 text-orange-400" />
                                <span className="text-white/90 font-medium text-[11px]">{card.attack}</span>
                              </div>
                              <div className="flex items-center justify-between bg-black/20 rounded px-1 py-0.5">
                                <Shield className="w-2 h-2 text-blue-400" />
                                <span className="text-white/90 font-medium text-[11px]">{card.defense}</span>
                              </div>
                              <div className="flex items-center justify-between bg-black/20 rounded px-1 py-0.5">
                                <Target className="w-2 h-2 text-purple-400" />
                                <span className="text-white/90 font-medium text-[11px]">{card.critical}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: 3 - equippedCards.length }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="relative rounded-lg p-2 border border-dashed border-white/20 bg-white/5 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-center h-12 text-white/40">
                          <div className="text-center">
                            <div className="text-[11px] font-medium">Empty Slot #{equippedCards.length + index + 1}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-xl mb-1">🐾</div>
                    <p className="text-white/50 text-[11px] mb-1">No monsters equipped</p>
                    <p className="text-white/30 text-[10px]">Open inventory to equip</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* New Circular Menu - Bottom Right */}
        <div className="absolute bottom-8 right-8 pointer-events-auto">
          <div className="relative">
            {/* Main Inventory Button - Large Circle */}
          <button
              onClick={onOpenInventory}
              className="circular-menu-main group relative"
            >
              <Package className="w-8 h-8 text-white" />
              {collectionCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {collectionCount > 9 ? '9+' : collectionCount}
                </div>
              )}
              <span className="circular-tooltip">Inventory</span>
          </button>

            {/* Battle Button - Smaller Circle on Top */}
          <button
            onClick={onOpenBattleground}
              className="circular-menu-small group absolute -top-16 left-1/2 transform -translate-x-1/2"
          >
            <Swords className="w-5 h-5 text-white" />
            {equippedCardsCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {equippedCardsCount}
              </div>
            )}
              <span className="circular-tooltip">Battle</span>
            </button>

            {/* Shop Button - Smaller Circle on the Side */}
            <button
              onClick={onOpenShop}
              className="circular-menu-small group absolute top-1/2 -left-16 transform -translate-y-1/2"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="circular-tooltip">Shop</span>
          </button>

            {/* Connecting Lines/Dots for Visual Appeal */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Connection to battle button */}
              <div className="absolute top-0 left-1/2 w-px h-8 bg-gradient-to-t from-white/20 to-transparent transform -translate-x-1/2"></div>
              
              {/* Connection to shop button */}
              <div className="absolute top-1/2 left-0 w-8 h-px bg-gradient-to-l from-white/20 to-transparent transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Keep existing */}
      <div className="md:hidden">
        {/* Mobile Top Bar */}
        <div className="absolute top-4 left-4 right-4 pointer-events-auto">
          <div className="glass-panel px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-lg font-bold">nadMon on Monad</h1>
              <div className="flex items-center gap-3 text-white text-sm">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{collectionCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sword className="w-4 h-4" />
                  <span>{equippedCardsCount}/3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <div className="glass-panel rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-3">
            <div className="flex justify-around items-center">
              <button
                onClick={onOpenInventory}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors relative min-w-0"
              >
                <Package className="w-6 h-6 text-white" />
                <span className="text-white text-xs">Inventory</span>
                {collectionCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {collectionCount > 9 ? '9+' : collectionCount}
                  </div>
                )}
              </button>

              <button
                onClick={onOpenShop}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors min-w-0"
              >
                <ShoppingBag className="w-6 h-6 text-white" />
                <span className="text-white text-xs">Shop</span>
              </button>

              <button
                onClick={onOpenBattleground}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors relative min-w-0"
              >
                <Swords className="w-6 h-6 text-white" />
                <span className="text-white text-xs">Battle</span>
                {equippedCardsCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {equippedCardsCount}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .circular-menu-main {
          @apply w-20 h-20 rounded-full backdrop-blur-md bg-white/15 border-2 border-white/30 
                 flex items-center justify-center hover:bg-white/25 transition-all duration-300
                 shadow-2xl hover:scale-110 hover:shadow-white/20;
        }

        .circular-menu-small {
          @apply w-14 h-14 rounded-full backdrop-blur-md bg-white/10 border border-white/20 
                 flex items-center justify-center hover:bg-white/20 transition-all duration-300
                 shadow-lg hover:scale-110;
        }

        .glass-panel {
          @apply backdrop-blur-md bg-white/10 border border-white/20 shadow-lg;
        }

        .circular-tooltip {
          @apply absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 px-3 py-1 
                 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 
                 transition-opacity whitespace-nowrap pointer-events-none;
        }
      `}</style>
    </div>
  )
} 