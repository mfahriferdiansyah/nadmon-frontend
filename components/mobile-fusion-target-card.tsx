"use client"

import type React from "react"
import { Heart, Sword, Shield, Target, Flame, Droplets, Leaf, Zap } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import Image from "next/image"

interface MobileFusionTargetCardProps {
  card: PokemonCard
  currentFusionLevel: number
  maxFusionLevel: number
  totalFusionPoints: number
  projectedFusionLevel: number
  selectedSacrificesCount: number
}

// Rarity styles for cards - matching game-ui.tsx
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

// Type icons - matching game-ui.tsx
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

export function MobileFusionTargetCard({
  card,
  currentFusionLevel,
  maxFusionLevel,
  totalFusionPoints,
  projectedFusionLevel,
  selectedSacrificesCount
}: MobileFusionTargetCardProps) {
  const rarityStyle = RARITY_STYLES[card.rarity] || RARITY_STYLES.common

  return (
    <div className="space-y-4">
      {/* Target Card - Clean Desktop Equipped Monster Style */}
      <div
        className={`relative rounded-lg p-2 border transition-all duration-300 ${
          rarityStyle.border
        } bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${
          rarityStyle.glow
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
                    currentFusionLevel >= 10 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-400'
                  }`}
                  style={{ width: `${Math.min(currentFusionLevel / 10 * 100, 100)}%` }}
                />
              </div>
              <div className={`text-[10px] text-center mt-0.5 ${
                currentFusionLevel >= 10 ? 'text-yellow-400 font-bold' : 'text-white/60'
              }`}>
                {currentFusionLevel >= 10 ? 'MAX' : `${currentFusionLevel}/10`}
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
              {/* Type Icon */}
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

      {/* Fusion Progress Section */}
      <div className="glass-panel rounded-lg p-3 bg-white/10 border border-white/20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium text-sm">Fusion Progress</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm ${selectedSacrificesCount > 0 ? 'text-green-400' : 'text-white/60'}`}>
                {totalFusionPoints}
              </span>
              <span className="text-white/60 text-sm">/</span>
              <span className="text-white/60 text-sm">10</span>
            </div>
          </div>
          
          <div className="relative w-full bg-gray-700/50 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                projectedFusionLevel >= maxFusionLevel 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                  : 'bg-gradient-to-r from-blue-400 to-purple-400'
              }`}
              style={{ width: `${(projectedFusionLevel / maxFusionLevel) * 100}%` }}
            />
            {/* Progress markers */}
            <div className="absolute inset-0 flex justify-between items-center px-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-0.5 h-1 bg-white/30 rounded-full"></div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <p className={`text-sm font-bold ${
              projectedFusionLevel >= 10 ? 'text-green-400' : 'text-orange-400'
            }`}>
              {selectedSacrificesCount > 0 ? (
                projectedFusionLevel >= 10 ? '🔥 READY TO EVOLVE! 🔥' : `Need ${10 - projectedFusionLevel} more fusion points`
              ) : (
                'Select monsters to sacrifice below'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}