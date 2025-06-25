"use client"

import type React from "react"
import { X, Sword, Shield, Heart, Zap, Target } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import { RARITY_STYLES } from "@/constants/cards"
import Image from "next/image"

interface BattlegroundPopupProps {
  equippedCards: PokemonCard[]
  onClose: () => void
}

export function BattlegroundPopup({
  equippedCards,
  onClose,
}: BattlegroundPopupProps) {
  const calculateTotalStats = () => {
    return equippedCards.reduce(
      (total, card) => ({
        hp: total.hp + card.hp,
        attack: total.attack + card.attack,
        defense: total.defense + card.defense,
        speed: total.speed + card.speed,
        critical: total.critical + card.critical,
      }),
      { hp: 0, attack: 0, defense: 0, speed: 0, critical: 0 }
    )
  }

  const totalStats = calculateTotalStats()
  const battlePower = Math.round(
    (totalStats.hp + totalStats.attack + totalStats.defense + totalStats.speed + totalStats.critical) / 5
  )

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
            <h2 className="text-2xl font-bold text-white mb-1">Battleground</h2>
            <p className="text-white/70">Prepare your team for battle</p>
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
          {/* Battle Stats Overview */}
          <div className="mb-8 glass-panel rounded-xl p-6 backdrop-blur-md bg-white/5 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Team Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Team Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-white/70">Total HP</span>
                    </div>
                    <span className="text-white font-medium">{totalStats.hp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4 text-orange-400" />
                      <span className="text-white/70">Total Attack</span>
                    </div>
                    <span className="text-white font-medium">{totalStats.attack}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-white/70">Total Defense</span>
                    </div>
                    <span className="text-white font-medium">{totalStats.defense}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/70">Total Speed</span>
                    </div>
                    <span className="text-white font-medium">{totalStats.speed}</span>
                  </div>
                </div>
              </div>

              {/* Battle Power */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{battlePower}</div>
                  <div className="text-white/70">Battle Power</div>
                  <div className="mt-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      battlePower >= 80 ? 'bg-green-500/20 text-green-300' :
                      battlePower >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
                      battlePower >= 40 ? 'bg-orange-500/20 text-orange-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {battlePower >= 80 ? 'Elite' :
                       battlePower >= 60 ? 'Strong' :
                       battlePower >= 40 ? 'Average' :
                       'Weak'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Team Info</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Monsters</span>
                    <span className="text-white font-medium">{equippedCards.length}/3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Avg Level</span>
                    <span className="text-white font-medium">
                      {equippedCards.length > 0 ? Math.round(battlePower / equippedCards.length) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Ready</span>
                    <span className={`font-medium ${equippedCards.length === 3 ? 'text-green-400' : 'text-red-400'}`}>
                      {equippedCards.length === 3 ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equipped Monsters */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Battle Team</h3>
            {equippedCards.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 backdrop-blur-md bg-white/5 border border-white/20 text-center">
                <Target className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/50">No monsters equipped for battle</p>
                <p className="text-white/30 text-sm mt-2">Go to your inventory to equip monsters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {equippedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="glass-panel rounded-xl p-4 backdrop-blur-md bg-white/10 border border-white/20"
                  >
                    <div className="text-center mb-3">
                      <div className="text-sm text-white/70 font-medium">Position {index + 1}</div>
                    </div>
                    
                    {/* Monster Image */}
                    <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={`/monster/${card.id}.png`}
                        alt={card.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=150"
                        }}
                      />
                    </div>

                    {/* Monster Info */}
                    <div className="space-y-3">
                      <div className="text-center">
                        <h4 className="font-semibold text-white text-sm">{card.name}</h4>
                        <p className={`text-xs ${RARITY_STYLES[card.rarity].text} capitalize`}>
                          {card.rarity} • {card.type}
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-white/70">
                          <Heart className="w-3 h-3 text-red-400" />
                          <span>{card.hp}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <Sword className="w-3 h-3 text-orange-400" />
                          <span>{card.attack}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <Shield className="w-3 h-3 text-blue-400" />
                          <span>{card.defense}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/70">
                          <Zap className="w-3 h-3 text-yellow-400" />
                          <span>{card.speed}</span>
                        </div>
                      </div>

                      {/* Battle Readiness */}
                      <div className="text-center">
                        <div className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full">
                          Ready for Battle
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty slots */}
                {Array.from({ length: 3 - equippedCards.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="glass-panel rounded-xl p-4 backdrop-blur-md bg-white/5 border border-white/20 border-dashed"
                  >
                    <div className="text-center py-8">
                      <Target className="w-8 h-8 text-white/20 mx-auto mb-2" />
                      <p className="text-white/30 text-sm">Empty Slot</p>
                      <p className="text-white/20 text-xs">Position {equippedCards.length + index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Battle Actions */}
          <div className="glass-panel rounded-xl p-6 backdrop-blur-md bg-white/5 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-4">Battle Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  equippedCards.length === 3
                    ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white hover:from-green-500/30 hover:to-blue-500/30 hover:scale-105'
                    : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                }`}
                disabled={equippedCards.length !== 3}
              >
                Start Battle
              </button>
              <button
                className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 hover:scale-105 transition-all"
              >
                Training Mode
              </button>
            </div>
            <p className="text-white/50 text-sm text-center mt-4">
              {equippedCards.length < 3 
                ? `Equip ${3 - equippedCards.length} more monster${3 - equippedCards.length > 1 ? 's' : ''} to start battles`
                : 'Your team is ready for battle!'
              }
            </p>
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