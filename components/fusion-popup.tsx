"use client"

import type React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { X, Merge, Flame, Sparkles, Target, Check, AlertCircle, Trash2, RefreshCw, ArrowUpDown } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import { MonsterCard } from "@/components/card-component"
import { useNadmonFusion } from "@/hooks/use-nadmon-fusion"

interface FusionPopupProps {
  targetCard: PokemonCard
  collection: PokemonCard[]
  onClose: () => void
  onFusionComplete?: (targetCard: PokemonCard, sacrificeCards: PokemonCard[]) => void
  onSwapTarget?: (newTargetCard: PokemonCard) => void
}

export function FusionPopup({
  targetCard,
  collection,
  onClose,
  onFusionComplete,
  onSwapTarget
}: FusionPopupProps) {
  const [selectedSacrifices, setSelectedSacrifices] = useState<PokemonCard[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [simulatedProgress, setSimulatedProgress] = useState(0)

  // Use the fusion hook
  const { fuseMonsters, isLoading, isSuccess, error, resetError, state } = useNadmonFusion()

  // Filter monsters of the same type AND name as the target (matching contract requirements)
  // Contract requires: same element (type field) AND same nadmonType (name field)
  const compatibleMonsters = useMemo(() => 
    collection.filter(card => 
      card.name === targetCard.name && // Same nadmonType (brindle, cervus, etc.)
      card.type === targetCard.type && // Same element (Fire, Water, etc.)
      card.id !== targetCard.id
    ),
    [collection, targetCard]
  )

  // Get actual fusion progress from NFT attribute
  const currentFusionLevel = targetCard.fusion || 0
  const maxFusionLevel = 10
  
  // Calculate total fusion points: target's current fusion + 1 point per sacrifice
  const currentTargetFusion = targetCard.fusion || 0
  const pointsFromSacrifices = selectedSacrifices.length // Each sacrifice = 1 point
  const totalFusionPoints = currentTargetFusion + pointsFromSacrifices
  
  const projectedFusionLevel = Math.min(totalFusionPoints, maxFusionLevel)

  // Removed toast functionality - will be rebuilt later

  const handleSacrificeToggle = useCallback((card: PokemonCard) => {
    // Check if fusion points would be sufficient for evolution
    const tempSacrifices = selectedSacrifices.some(s => s.id === card.id) 
      ? selectedSacrifices.filter(s => s.id !== card.id)
      : [...selectedSacrifices, card]
    
    const tempTotalFusion = currentTargetFusion + tempSacrifices.length

    setSelectedSacrifices(tempSacrifices)
    
    // Removed toast notifications - will be rebuilt later
  }, [selectedSacrifices, targetCard])

  const handleSwapToTarget = useCallback((card: PokemonCard) => {
    if (onSwapTarget) {
      onSwapTarget(card)
      setSelectedSacrifices([]) // Clear selections when swapping target
    }
  }, [onSwapTarget])

  const handleClearSelection = useCallback(() => {
    setSelectedSacrifices([])
  }, [])

  const handleConfirmFusion = useCallback(async () => {
    if (selectedSacrifices.length > 0) {
      try {
        await fuseMonsters(targetCard, selectedSacrifices)
        // The hook will handle the transaction, success will be handled in useEffect
      } catch (error) {
        console.error('Fusion failed:', error)
        // Error is handled by the hook
      }
    }
  }, [selectedSacrifices, fuseMonsters, targetCard])

  const handleProceedToConfirm = useCallback(() => {
    if (selectedSacrifices.length === 0) {
      // Removed toast notification - will be rebuilt later
      console.log('Error: Select at least 1 monster to sacrifice')
    } else {
      setShowConfirmation(true)
    }
  }, [selectedSacrifices])

  const canFuse = selectedSacrifices.length > 0 && !isLoading

  // Handle fusion success
  useEffect(() => {
    if (isSuccess) {
      if (onFusionComplete) {
        onFusionComplete(targetCard, selectedSacrifices)
      }
      // Close the popup after successful fusion
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [isSuccess, onFusionComplete, targetCard, selectedSacrifices, onClose])

  // Reset error when popup opens
  useEffect(() => {
    resetError()
  }, [resetError])

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
              <RefreshCw className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Monster Fusion</h2>
              <p className="text-white/70 text-sm md:text-base">Evolve monsters by sacrificing others ({totalFusionPoints} fusion points total)</p>
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
                Are you sure you want to sacrifice <strong className="text-white">{selectedSacrifices.length} {targetCard.name}</strong> 
                {selectedSacrifices.length === 1 ? ' monster' : ' monsters'} to enhance your target <strong className="text-white">{targetCard.name}</strong>?
              </p>
              <p className="text-red-300 text-sm mb-6">
                ⚠️ The sacrificed monsters will be permanently destroyed
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
            {/* Compact Target Card Section */}
            <div className="w-full md:w-72 p-3 md:p-4 border-b md:border-b-0 md:border-r border-white/20 bg-white/5 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-green-400" />
                <h3 className="text-base font-semibold text-white">Target</h3>
              </div>
              
              <div className="space-y-3">
                {/* Target Card Display - Compact */}
                <div className="relative">
                  <MonsterCard
                    card={targetCard}
                    variant="compact"
                    showActions={false}
                    mergeLevel={currentFusionLevel}
                    maxMergeLevel={maxFusionLevel}
                    className="ring-2 ring-green-400/50 shadow-lg shadow-green-400/20"
                  />
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-blue-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold shadow-lg">
                    TARGET
                  </div>
                </div>

                {/* Compact Fusion Progress */}
                <div className="glass-panel rounded-lg p-3 bg-white/5 border border-white/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs">Fusion Points</span>
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-xs ${selectedSacrifices.length > 0 ? 'text-green-400' : 'text-white/60'}`}>
                        {totalFusionPoints}
                      </span>
                      {selectedSacrifices.length > 0 && (
                        <Check className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 relative">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        projectedFusionLevel >= maxFusionLevel 
                          ? 'bg-gradient-to-r from-green-400 to-cyan-400' 
                          : 'bg-gradient-to-r from-blue-400 to-purple-400'
                      }`}
                      style={{ width: `${(projectedFusionLevel / maxFusionLevel) * 100}%` }}
                    />
                  </div>
                  <div className="text-center mt-1">
                    {selectedSacrifices.length > 0 ? (
                      <span className={`text-xs font-bold ${
                        projectedFusionLevel >= 10 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {projectedFusionLevel >= 10 ? 'READY TO EVOLVE!' : `${projectedFusionLevel}/10 FUSION (Need ${10 - projectedFusionLevel} more)`}
                      </span>
                    ) : (
                      <span className="text-white/60 text-xs">
                        Sacrifice 10 monster to evolve
                      </span>
                    )}
                  </div>
                </div>

                {/* Compact Benefits */}
                <div className="glass-panel rounded-lg p-3 bg-white/5 border border-white/20">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    Benefits
                  </h4>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className="text-white/80 text-center">
                      {selectedSacrifices.length > 0 ? (
                        <div className={`font-bold ${
                          projectedFusionLevel >= maxFusionLevel ? 'text-green-400' : 'text-blue-400'
                        }`}>
                          🔥 {projectedFusionLevel >= maxFusionLevel ? 'MAX' : projectedFusionLevel} Fusion! 🔥
                          <br />
                          <span className="text-xs">Sacrificing {selectedSacrifices.length} monster{selectedSacrifices.length > 1 ? 's' : ''}</span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-blue-400">Target Fusion: {currentTargetFusion} + {pointsFromSacrifices} = {totalFusionPoints}</div>
                          <div className="text-xs mt-1">
                            Each sacrificed monster provides +1 fusion point
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sacrifice Selection Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 md:p-4 border-b border-white/20 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-400" />
                    <h3 className="text-base font-semibold text-white">
                      Select Sacrifices ({compatibleMonsters.length} available)
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedSacrifices.length > 0 && (
                      <>
                        <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-green-300 text-xs font-medium">{selectedSacrifices.length}</span>
                        </div>
                        <button
                          onClick={handleClearSelection}
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                          title="Clear selection"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-white/70 text-xs">
                  Select multiple <strong className="text-white">{targetCard.name}</strong> ({targetCard.type}) monsters to sacrifice (click to select/deselect)
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 md:p-4" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                {compatibleMonsters.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-white/50">
                    <div className="text-center">
                      <Flame className="w-10 h-10 mx-auto mb-3 opacity-50 text-red-400" />
                      <h4 className="text-base font-semibold mb-2">No Compatible Monsters</h4>
                      <p className="text-xs">You need another <strong className="text-white">{targetCard.name}</strong> ({targetCard.type}) for fusion</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {compatibleMonsters.map((card) => {
                      const isSelected = selectedSacrifices.some(s => s.id === card.id)
                      const cardFusionLevel = card.fusion || 0
                      
                      // Calculate what the total fusion would be if we add this card
                      const tempSacrifices = isSelected 
                        ? selectedSacrifices.filter(s => s.id !== card.id)
                        : [...selectedSacrifices, card]
                      const wouldBeTotalFusion = currentTargetFusion + tempSacrifices.length
                      
                      const isMaxFusion = projectedFusionLevel >= maxFusionLevel
                      const wouldExceedMax = wouldBeTotalFusion > maxFusionLevel && !isSelected
                      const isDisabled = wouldExceedMax
                      
                      return (
                        <div
                          key={card.id}
                          className={`relative group transition-all duration-200 ${
                            isDisabled 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'cursor-pointer hover:scale-105'
                          } ${
                            isSelected 
                              ? 'ring-2 ring-red-400 shadow-lg shadow-red-400/30' 
                              : !isDisabled ? 'hover:ring-2 hover:ring-white/30' : ''
                          }`}
                          onClick={() => !isDisabled && handleSacrificeToggle(card)}
                        >
                          <MonsterCard
                            card={card}
                            variant="compact"
                            showActions={false}
                            className={isSelected ? 'ring-2 ring-red-400/50' : ''}
                          />
                          
                          {/* Selection number badge */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-400 to-orange-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold shadow-lg z-10">
                              {selectedSacrifices.findIndex(s => s.id === card.id) + 1}
                            </div>
                          )}
                          
                          {/* Fusion points indicator - each sacrifice = +1 point */}
                          <div className="absolute top-1 left-1 bg-blue-500/80 text-white text-xs px-1 py-0.5 rounded font-bold z-10">
                            +1
                          </div>
                          
                          {/* Swap to target button */}
                          {onSwapTarget && !isSelected && !isDisabled && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center z-20">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSwapToTarget(card)
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors flex items-center gap-1 text-xs"
                              >
                                <ArrowUpDown className="w-3 h-3" />
                                Swap
                              </button>
                            </div>
                          )}
                          
                          {/* Disabled overlay */}
                          {isDisabled && (
                            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center z-15">
                              <span className="text-red-300 text-xs font-bold">MAX</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
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
                {selectedSacrifices.length === 0 ? 'Select Monsters to Sacrifice' : 
                 state === 'pending' ? 'Confirm in Wallet...' :
                 state === 'confirming' ? 'Processing Fusion...' :
                 `Fuse with ${selectedSacrifices.length} Sacrifice${selectedSacrifices.length > 1 ? 's' : ''} (${totalFusionPoints} pts)`}
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