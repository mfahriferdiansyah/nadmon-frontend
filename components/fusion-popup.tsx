"use client"

import type React from "react"
import { useState } from "react"
import { X, Merge, Flame, Sparkles, Target, Check, AlertCircle } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import { MonsterCard } from "@/components/card-component"

interface FusionPopupProps {
  targetCard: PokemonCard
  collection: PokemonCard[]
  onClose: () => void
  onFusion: (targetCard: PokemonCard, sacrificeCard: PokemonCard) => void
  isLoading?: boolean
}

export function FusionPopup({
  targetCard,
  collection,
  onClose,
  onFusion,
  isLoading = false
}: FusionPopupProps) {
  const [selectedSacrifice, setSelectedSacrifice] = useState<PokemonCard | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Filter monsters of the same type as the target, excluding the target itself
  const compatibleMonsters = collection.filter(
    card => card.type === targetCard.type && card.id !== targetCard.id
  )

  // Calculate fusion progress (mock data for now)
  const fusionProgress = 3 // This would come from props or state
  const maxFusionLevel = 10

  const handleSacrificeSelect = (card: PokemonCard) => {
    setSelectedSacrifice(card)
  }

  const handleConfirmFusion = () => {
    if (selectedSacrifice) {
      onFusion(targetCard, selectedSacrifice)
      setShowConfirmation(false)
    }
  }

  const handleProceedToConfirm = () => {
    if (selectedSacrifice) {
      setShowConfirmation(true)
    }
  }

  const canFuse = selectedSacrifice && fusionProgress < maxFusionLevel && !isLoading

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Merge className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Monster Fusion</h2>
              <p className="text-white/70 text-sm md:text-base">Combine monsters to increase fusion level</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {showConfirmation ? (
          /* Confirmation Dialog */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="glass-panel max-w-md w-full p-6 rounded-2xl bg-white/10 border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-300" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">Confirm Fusion</h3>
              <p className="text-white/70 mb-6">
                Are you sure you want to sacrifice <strong className="text-white">{selectedSacrifice?.name}</strong> 
                {" "}to enhance <strong className="text-white">{targetCard.name}</strong>?
              </p>
              <p className="text-red-300 text-sm mb-6">
                ⚠️ The sacrificed monster will be permanently destroyed
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmFusion}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Fusing...
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4" />
                      Confirm Fusion
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Main Fusion Interface */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Target Card Section */}
            <div className="w-full md:w-80 p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/20 bg-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Target Monster</h3>
              </div>
              
              <div className="space-y-4">
                {/* Target Card Display */}
                <div className="relative">
                  <MonsterCard
                    card={targetCard}
                    variant="inventory"
                    showActions={false}
                    mergeLevel={fusionProgress}
                    maxMergeLevel={maxFusionLevel}
                    className="ring-2 ring-green-400/50 shadow-lg shadow-green-400/20"
                  />
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-400 text-black text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    TARGET
                  </div>
                </div>

                {/* Fusion Progress */}
                <div className="glass-panel rounded-lg p-4 bg-white/5 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm">Fusion Progress</span>
                    <span className="text-white font-bold text-sm">{fusionProgress}/{maxFusionLevel}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(fusionProgress / maxFusionLevel) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>Beginner</span>
                    <span>Master</span>
                  </div>
                </div>

                {/* Fusion Benefits */}
                <div className="glass-panel rounded-lg p-4 bg-white/5 border border-white/20">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Fusion Benefits
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/80">
                      <span>HP Bonus:</span>
                      <span className="text-green-400">+{fusionProgress * 5}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Attack Bonus:</span>
                      <span className="text-orange-400">+{fusionProgress * 3}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Defense Bonus:</span>
                      <span className="text-blue-400">+{fusionProgress * 2}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacrifice Selection Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 md:p-6 border-b border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Select Sacrifice ({compatibleMonsters.length} compatible)
                    </h3>
                  </div>
                  
                  {selectedSacrifice && (
                    <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-300 text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
                
                <p className="text-white/70 text-sm">
                  Choose a monster of the same type <strong className="text-white">({targetCard.type})</strong> to sacrifice for fusion
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {compatibleMonsters.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-white/50">
                    <div className="text-center">
                      <Flame className="w-12 h-12 mx-auto mb-3 opacity-50 text-red-400" />
                      <h4 className="text-lg font-semibold mb-2">No Compatible Monsters</h4>
                      <p className="text-sm">You need another <strong className="text-white">{targetCard.type}</strong> type monster for fusion</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {compatibleMonsters.map((card) => (
                      <div
                        key={card.id}
                        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                          selectedSacrifice?.id === card.id 
                            ? 'ring-2 ring-red-400 shadow-lg shadow-red-400/30' 
                            : 'hover:ring-2 hover:ring-white/30'
                        }`}
                        onClick={() => handleSacrificeSelect(card)}
                      >
                        <MonsterCard
                          card={card}
                          variant="inventory"
                          showActions={false}
                          className={selectedSacrifice?.id === card.id ? 'ring-2 ring-red-400/50' : ''}
                        />
                        {selectedSacrifice?.id === card.id && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-400 to-orange-400 text-black text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                            SACRIFICE
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer - Action Buttons */}
        {!showConfirmation && (
          <div className="p-4 md:p-6 border-t border-white/20 bg-white/5">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToConfirm}
                disabled={!canFuse}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  canFuse
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                <Merge className="w-5 h-5" />
                {!selectedSacrifice ? 'Select a Monster to Sacrifice' : 
                 fusionProgress >= maxFusionLevel ? 'Fusion Level Maxed' : 
                 'Proceed to Fusion'}
              </button>
            </div>
          </div>
        )}
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