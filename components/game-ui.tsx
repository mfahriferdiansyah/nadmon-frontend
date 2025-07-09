"use client"

import type React from "react"
import { Package, Sword, ShoppingBag, Swords, BarChart3, Heart, Shield, Target, UserX, ChevronUp, ChevronDown, Flame, Droplets, Leaf, Zap, Lock, PawPrint, Info } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import Image from "next/image"
import { useState } from "react"

interface GameUIProps {
  onOpenInventory: () => void
  onOpenShop: () => void
  onOpenBattleground: () => void
  onOpenInstructions?: () => void
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
  onOpenInstructions,
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
      // Battle locked - no monsters equipped
      return
    }
    onOpenBattleground()
  }

  const handleInventoryClick = () => {
    onOpenInventory()
  }

  const handleShopClick = () => {
    onOpenShop()
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Top Bar - Game Title Only */}
        <div className="absolute top-4 left-4 right-4 flex justify-center items-start pointer-events-auto">
          {/* Game Title */}
          <div className="glass-panel px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <h1 className="text-white text-xl font-bold">NADMON on MONAD</h1>
          </div>
        </div>

        {/* Monster Stats & Equipped Display - Top Left Vertical */}
        <div className="absolute top-4 left-4 pointer-events-auto">
          <div className="glass-panel rounded-xl backdrop-blur-md bg-white/5 border border-white/20 w-56">
            {/* Header with Toggle and Stats */}
            <div className="flex items-center justify-between p-3 border-b border-white/20">
              <div className="flex items-center gap-3">
                <h3 className="text-white text-sm font-semibold">
                  Monsters
                </h3>
                <div className="flex items-center gap-3 text-white/70 text-xs">
                  <div className="flex items-center gap-1">
                    <PawPrint className="w-3 h-3" />
                    <span>{collectionCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sword className="w-3 h-3" />
                    <span>{equippedCardsCount}/3</span>
                  </div>
                </div>
              </div>
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
                                src={card.image}
                                alt={card.name}
                                fill
                                className="object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=150"
                                }}
                              />
                              
                              {/* Rarity indicator */}
                              <div className="absolute bottom-0 right-0 text-xs font-bold text-white bg-black/60 px-0.5 rounded-tl text-[10px]">
                                {card.rarity.charAt(0).toUpperCase()}
                              </div>
                            </div>

                            {/* Fusion Progress Bar */}
                            <div className="w-10 mt-1">
                              <div className="w-full bg-gray-700/50 rounded-full h-0.5">
                                <div 
                                  className={`h-0.5 rounded-full transition-all duration-300 ${
                                    (card.fusion || 0) >= 10 
                                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                                      : 'bg-gradient-to-r from-blue-400 to-purple-400'
                                  }`}
                                  style={{ width: `${Math.min((card.fusion || 0) / 10 * 100, 100)}%` }}
                                />
                              </div>
                              <div className={`text-[10px] text-center mt-0.5 ${
                                (card.fusion || 0) >= 10 ? 'text-yellow-400 font-bold' : 'text-white/60'
                              }`}>
                                {(card.fusion || 0) >= 10 ? 'MAX' : `${card.fusion || 0}/10`}
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

        {/* Instructions Button - Bottom Right Corner */}
        <div className="absolute bottom-8 left-8 pointer-events-auto">
          {onOpenInstructions && (
            <button
              onClick={onOpenInstructions}
              className="glass-menu-medium group"
              title="Game Instructions"
            >
              <Info className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors" />
              <span className="glass-tooltip">Game Guide</span>
            </button>
          )}
        </div>

        {/* Horizontal Glass Menu - Bottom Right */}
        <div className="absolute bottom-8 right-8 pointer-events-auto">
          <div className="flex items-end gap-4">
            {/* Inventory Button - Left */}
            <button
              onClick={handleInventoryClick}
              className={`glass-menu-medium group ${equippedCardsCount === 0 ? 'inventory-attention' : ''}`}
            >
              <PawPrint className="w-8 h-8 text-white" />
              <span className="glass-tooltip">Manage your cards</span>
            </button>

            {/* Shop Button - Center */}
            <button
              onClick={handleShopClick}
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

      {/* Mobile Layout - Ultra Compact Bottom Bar */}
      <div className="md:hidden">
        {/* Ultra Compact Bottom Navigation Bar */}
        <div className="absolute bottom-2 left-2 right-2 pointer-events-auto">
          <div className="glass-panel rounded-xl backdrop-blur-md bg-white/5 border border-white/10 px-3 py-2">
            <div className="flex items-center justify-between">
              
              {/* Left Side - Compact Stats + Guide */}
              <div className="flex items-center gap-2 text-white text-xs">
                <div className="flex items-center gap-1">
                  <PawPrint className="w-3 h-3" />
                  <span>{collectionCount}</span>
                </div>
                <div className="text-white/40">|</div>
                <div className="flex items-center gap-1">
                  <Sword className="w-3 h-3" />
                  <span>{equippedCardsCount}/3</span>
                </div>
                {onOpenInstructions && (
                  <>
                    <div className="text-white/40">|</div>
                    <button
                      onClick={onOpenInstructions}
                      className="w-6 h-6 rounded-full backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-200"
                      title="Game Instructions"
                    >
                      <Info className="w-3 h-3 text-white/70" />
                    </button>
                  </>
                )}
              </div>

              {/* Right Side - Navigation Buttons */}
              <div className="flex items-center gap-2">
                
                {/* Inventory Button */}
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={onOpenInventory}
                    className={`w-8 h-8 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 ${equippedCardsCount === 0 ? 'inventory-attention-mobile' : ''}`}
                    title="Inventory"
                  >
                    <PawPrint className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white/50 text-[10px] font-medium">INVENTORY</span>
                </div>

                {/* Shop Button */}
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={onOpenShop}
                    className="w-8 h-8 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                    title="Shop"
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white/50 text-[10px] font-medium">SHOP</span>
                </div>

                {/* Battle Button (Same Size) */}
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={handleBattleClick}
                    className={`w-8 h-8 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 relative ${
                      equippedCardsCount === 0 
                        ? 'bg-white/5 cursor-not-allowed' 
                        : 'bg-purple-500/20 border-purple-400/50 hover:bg-purple-500/30 hover:border-purple-400/70'
                    }`}
                    disabled={equippedCardsCount === 0}
                    title={equippedCardsCount === 0 ? 'Equip monsters to unlock battle' : 'Battle Arena'}
                  >
                    <Swords className={`w-4 h-4 ${
                      equippedCardsCount === 0 ? 'text-gray-400' : 'text-white'
                    }`} />
                    {equippedCardsCount === 0 && (
                      <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 bg-gray-500/90 rounded-full flex items-center justify-center border border-white/50 ${lockWiggle ? 'wiggle-animation' : ''}`}>
                        <Lock className="w-1.5 h-1.5 text-white" />
                      </div>
                    )}
                    {equippedCardsCount > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping bg-purple-400/60"></div>
                    )}
                  </button>
                  <span className={`text-[10px] font-medium ${
                    equippedCardsCount === 0 ? 'text-white/40' : 'text-white/50'
                  }`}>
                    {equippedCardsCount === 0 ? 'LOCKED' : 'BATTLE'}
                  </span>
                </div>
              </div>
              
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
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: scale(1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          50% { 
            background: rgba(131, 110, 249, 0.8);
            border-color: rgba(131, 110, 249, 1);
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(131, 110, 249, 0.6);
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