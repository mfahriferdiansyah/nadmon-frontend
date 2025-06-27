"use client"

import type React from "react"
import { Package, Sword, ShoppingBag, Swords, BarChart3, Heart, Shield, Target, UserX, ChevronUp, ChevronDown, Flame, Droplets, Leaf, Zap, Lock, PawPrint } from "lucide-react"
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
  const [lockWiggle, setLockWiggle] = useState(false)

  const handleBattleClick = () => {
    if (equippedCardsCount === 0) {
      // Trigger wiggle animation
      setLockWiggle(true)
      setTimeout(() => setLockWiggle(false), 500)
      return
    }
    onOpenBattleground()
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Top Stats Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-white" />
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

        {/* Horizontal Glass Menu - Bottom Right */}
        <div className="absolute bottom-8 right-8 pointer-events-auto">
          <div className="flex items-end gap-4">
            {/* Inventory Button - Left */}
            <button
              onClick={onOpenInventory}
              className={`glass-menu-medium group ${equippedCardsCount === 0 ? 'inventory-attention' : ''}`}
            >
              <PawPrint className="w-8 h-8 text-white" />
              <span className="glass-tooltip">Manage your cards</span>
            </button>

            {/* Shop Button - Center */}
            <button
              onClick={onOpenShop}
              className="glass-menu-medium group"
            >
              <ShoppingBag className="w-8 h-8 text-white" />
              <span className="glass-tooltip">Buy card packs</span>
            </button>

            {/* Battle Button - Right (Main) */}
            <button
              onClick={handleBattleClick}
              className={`glass-menu-main group relative ${
                equippedCardsCount === 0 
                  ? 'glass-menu-locked' 
                  : 'glass-menu-battle'
              }`}
            >
              {/* Always show battle icon */}
              <Swords className={`w-10 h-10 ${equippedCardsCount === 0 ? 'text-gray-300' : 'text-white'}`} />
              
              {/* Lock icon overlay when locked */}
              {equippedCardsCount === 0 && (
                <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gray-500/90 rounded-full flex items-center justify-center border-2 border-white/50 ${lockWiggle ? 'wiggle-animation' : ''}`}>
                  <Lock className="w-3 h-3 text-white" />
                </div>
              )}

              <span className="glass-tooltip">
                {equippedCardsCount === 0 ? 'Equip cards to unlock battle' : 'Enter Battle Arena'}
              </span>

              {/* Battle ready indicator */}
              {equippedCardsCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: 'rgba(131, 110, 249, 0.6)' }}></div>
              )}
            </button>
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
                  <PawPrint className="w-4 h-4 text-white" />
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
          <div className="glass-panel rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-4">
            <div className="flex justify-around items-center">
              <button
                onClick={onOpenInventory}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/15 transition-colors relative min-w-0 ${equippedCardsCount === 0 ? 'inventory-attention-mobile' : ''}`}
              >
                <PawPrint className="w-8 h-8 text-white" />
                <span className="text-white text-xs font-semibold">Inventory</span>
              </button>

              <button
                onClick={onOpenShop}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/15 transition-colors min-w-0"
              >
                <ShoppingBag className="w-8 h-8 text-white drop-shadow-lg" />
                <span className="text-white text-xs font-semibold">Shop</span>
              </button>

              <button
                onClick={onOpenBattleground}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors relative min-w-0 ${
                  equippedCardsCount === 0 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'monad-battle-hover'
                }`}
                disabled={equippedCardsCount === 0}
              >
                <div className="relative">
                  <Swords className={`w-8 h-8 drop-shadow-lg ${
                    equippedCardsCount === 0 ? 'text-gray-400' : 'text-white'
                  }`} />
                  {equippedCardsCount === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg">🔒</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs font-semibold ${
                  equippedCardsCount === 0 ? 'text-gray-400' : 'text-white'
                }`}>
                  {equippedCardsCount === 0 ? 'Locked' : 'Battle'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          @apply backdrop-blur-md bg-white/10 border border-white/20 shadow-lg;
        }

        .glass-menu-main {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .glass-menu-main:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .glass-menu-locked {
          background: rgba(156, 163, 175, 0.3) !important;
          border-color: rgba(156, 163, 175, 0.5) !important;
          color: rgb(209, 213, 219);
          cursor: not-allowed;
        }

        .glass-menu-locked:hover {
          transform: none !important;
        }

        .glass-menu-battle {
          background: rgba(131, 110, 249, 0.3) !important;
          border-color: rgba(131, 110, 249, 0.5) !important;
          color: white;
        }

        .glass-menu-battle:hover {
          background: rgba(131, 110, 249, 0.4) !important;
          border-color: rgba(131, 110, 249, 0.6) !important;
        }

        .glass-menu-medium {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .glass-menu-medium:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .glass-tooltip {
          position: absolute;
          bottom: 100%;
          margin-bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 12px;
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          white-space: nowrap;
          pointer-events: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .group:hover .glass-tooltip {
          opacity: 1;
        }

        .monad-battle-hover:hover {
          background-color: rgba(131, 110, 249, 0.2);
        }

        .inventory-attention {
          animation: inventoryBounce 1.5s ease-in-out infinite;
        }

        .inventory-attention-mobile {
          animation: inventoryBounceMobile 1.5s ease-in-out infinite;
        }

        .wiggle-animation {
          animation: wiggle 0.5s ease-in-out;
        }

        @keyframes inventoryBounce {
          0%, 100% { 
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            transform: scale(1) translateY(0);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          }
          50% { 
            background: rgba(131, 110, 249, 0.8) !important;
            border-color: rgba(131, 110, 249, 1) !important;
            transform: scale(1.1) translateY(-8px);
            box-shadow: 0 8px 25px rgba(131, 110, 249, 0.6);
          }
        }

        @keyframes inventoryBounceMobile {
          0%, 100% { 
            background-color: rgba(255, 255, 255, 0.05);
            transform: scale(1) translateY(0);
          }
          50% { 
            background-color: rgba(131, 110, 249, 0.7);
            transform: scale(1.05) translateY(-4px);
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-10deg); }
          30% { transform: rotate(10deg); }
          45% { transform: rotate(-8deg); }
          60% { transform: rotate(8deg); }
          75% { transform: rotate(-5deg); }
          90% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  )
} 