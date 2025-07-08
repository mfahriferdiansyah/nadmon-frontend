"use client"

import type React from "react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { X, Merge, Flame, Target, Check, AlertCircle, Trash2, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import { MonsterCard } from "@/components/card-component"
import { MobileFusionTargetCard } from "@/components/mobile-fusion-target-card"
import { WalletHandle } from "@/components/wallet-handle"
import { useNadmonFusion } from "@/hooks/use-nadmon-fusion"

interface MobileFusionPopupProps {
  targetCard: PokemonCard
  collection: PokemonCard[]
  onClose: () => void
  onFusionComplete?: (targetCard: PokemonCard, sacrificeCards: PokemonCard[]) => void
  onSwapTarget?: (newTargetCard: PokemonCard) => void
}

export function MobileFusionPopup({
  targetCard,
  collection,
  onClose,
  onFusionComplete,
  onSwapTarget
}: MobileFusionPopupProps) {
  const [selectedSacrifices, setSelectedSacrifices] = useState<PokemonCard[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentStep, setCurrentStep] = useState<'select' | 'confirm'>('select')

  const { fuseMonsters, isLoading, isSuccess, error, resetError, state } = useNadmonFusion()

  const compatibleMonsters = useMemo(() => 
    collection.filter(card => 
      card.name === targetCard.name &&
      card.type === targetCard.type &&
      card.id !== targetCard.id
    ),
    [collection, targetCard]
  )

  const currentFusionLevel = targetCard.fusion || 0
  const maxFusionLevel = 10
  const currentTargetFusion = targetCard.fusion || 0
  const pointsFromSacrifices = selectedSacrifices.length
  const totalFusionPoints = currentTargetFusion + pointsFromSacrifices
  const projectedFusionLevel = Math.min(totalFusionPoints, maxFusionLevel)

  const handleSacrificeToggle = useCallback((card: PokemonCard) => {
    const tempSacrifices = selectedSacrifices.some(s => s.id === card.id) 
      ? selectedSacrifices.filter(s => s.id !== card.id)
      : [...selectedSacrifices, card]
    
    const tempTotalFusion = currentTargetFusion + tempSacrifices.length

    if (tempTotalFusion <= maxFusionLevel) {
      setSelectedSacrifices(tempSacrifices)
    }
  }, [selectedSacrifices, targetCard, maxFusionLevel])

  const handleSwapToTarget = useCallback((card: PokemonCard) => {
    if (onSwapTarget) {
      onSwapTarget(card)
      setSelectedSacrifices([])
    }
  }, [onSwapTarget])

  const handleClearSelection = useCallback(() => {
    setSelectedSacrifices([])
  }, [])

  const handleConfirmFusion = useCallback(async () => {
    if (selectedSacrifices.length > 0) {
      try {
        await fuseMonsters(targetCard, selectedSacrifices)
      } catch (error) {
        console.error('Fusion failed:', error)
      }
    }
  }, [selectedSacrifices, fuseMonsters, targetCard])

  const handleProceedToConfirm = useCallback(() => {
    if (selectedSacrifices.length === 0) {
      return
    }
    setCurrentStep('confirm')
    setShowConfirmation(true)
  }, [selectedSacrifices])

  const canFuse = selectedSacrifices.length > 0 && !isLoading

  useEffect(() => {
    if (isSuccess) {
      if (onFusionComplete) {
        onFusionComplete(targetCard, selectedSacrifices)
      }
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [isSuccess, onFusionComplete, targetCard, selectedSacrifices, onClose])

  useEffect(() => {
    resetError()
  }, [resetError])

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-4 px-2">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Wallet Handle - Outside and Above Popup */}
        <div className="relative z-10 mb-3">
          <WalletHandle />
        </div>
        
        {/* Popup Container */}
        <div className="relative w-full max-w-sm glass-panel rounded-t-2xl rounded-b-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-white">Confirm Fusion</h2>
                <p className="text-white/60 text-xs">Review your fusion</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Confirmation Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-300" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4 text-center">Confirm Fusion</h3>
            <p className="text-white/70 mb-6 text-center px-4">
              Are you sure you want to sacrifice <strong className="text-white">{selectedSacrifices.length} {targetCard.name}</strong> 
              {selectedSacrifices.length === 1 ? ' monster' : ' monsters'} to enhance your target <strong className="text-white">{`${targetCard.name} #${targetCard.id}`}</strong>?
            </p>
            
            {/* Target and Sacrifices Preview */}
            {/* <div className="w-full max-w-sm mb-6">
              <div className="text-center mb-4">
                <h4 className="text-white font-semibold mb-2">Target Monster</h4>
                <div className="w-24 mx-auto">
                  <MonsterCard
                    card={targetCard}
                    variant="compact"
                    showActions={false}
                    mergeLevel={currentFusionLevel}
                    className="ring-2 ring-green-400/50"
                  />
                </div>
                <p className="text-green-400 text-sm mt-2">
                  {currentFusionLevel} → {projectedFusionLevel} Fusion Points
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="text-white font-semibold mb-2">Sacrificing ({selectedSacrifices.length})</h4>
                <div className="flex justify-center gap-2 flex-wrap">
                  {selectedSacrifices.slice(0, 4).map((card, index) => (
                    <div key={card.id} className="w-16">
                      <MonsterCard
                        card={card}
                        variant="compact"
                        showActions={false}
                        className="ring-2 ring-red-400/50"
                      />
                    </div>
                  ))}
                  {selectedSacrifices.length > 4 && (
                    <div className="w-16 h-20 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                      <span className="text-white/60 text-xs">+{selectedSacrifices.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </div> */}
            
            <p className="text-red-300 text-sm mb-6 text-center px-4">
              ⚠️ The sacrificed monsters will be permanently destroyed
            </p>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-black/20 border-t border-white/20">
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFusion}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
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
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-4 px-2">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Wallet Handle - Outside and Above Popup */}
      <div className="relative z-10 mb-3">
        <WalletHandle />
      </div>
      
      {/* Popup Container */}
      <div className="relative w-full max-w-sm h-[92vh] glass-panel rounded-t-2xl rounded-b-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 flex items-center justify-center backdrop-blur-sm">
              <RefreshCw className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Monster Fusion</h2>
              <p className="text-white/70 text-xs">{totalFusionPoints} fusion points total</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Card Section - Using Equipped Card Style */}
        <div className="p-4 border-b border-white/20 bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Target Monster</h3>
          </div>
          
          <MobileFusionTargetCard
            card={targetCard}
            currentFusionLevel={currentFusionLevel}
            maxFusionLevel={maxFusionLevel}
            totalFusionPoints={totalFusionPoints}
            projectedFusionLevel={projectedFusionLevel}
            selectedSacrificesCount={selectedSacrifices.length}
          />
        </div>

        {/* Sacrifice Selection Header */}
        <div className="p-3 border-b border-white/20 bg-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-semibold text-white">
                Sacrifices ({compatibleMonsters.length})
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedSacrifices.length > 0 && (
                <>
                  <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full">
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
            Tap to select <strong className="text-white">{targetCard.name}</strong> monsters
          </p>
        </div>

        {/* Sacrifice Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {compatibleMonsters.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-white/50">
              <div className="text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 opacity-50 text-red-400" />
                <h4 className="text-sm font-semibold mb-1">No Compatible Monsters</h4>
                <p className="text-xs">Need another <strong className="text-white">{targetCard.name}</strong> for fusion</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-4">
              {compatibleMonsters.map((card) => {
                const isSelected = selectedSacrifices.some(s => s.id === card.id)
                const tempSacrifices = isSelected 
                  ? selectedSacrifices.filter(s => s.id !== card.id)
                  : [...selectedSacrifices, card]
                const wouldBeTotalFusion = currentTargetFusion + tempSacrifices.length
                const wouldExceedMax = wouldBeTotalFusion > maxFusionLevel && !isSelected
                const isDisabled = wouldExceedMax
                
                return (
                  <div
                    key={card.id}
                    className={`relative group transition-all duration-200 ${
                      isDisabled 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer'
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
                    
                    {/* Selection Badge */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-400 to-orange-400 text-black text-xs px-1.5 py-0.5 rounded-full font-bold shadow-lg z-10">
                        {selectedSacrifices.findIndex(s => s.id === card.id) + 1}
                      </div>
                    )}
                    
                    {/* Fusion Points */}
                    <div className="absolute top-1 left-1 bg-blue-500/80 text-white text-xs px-1 py-0.5 rounded font-bold z-10">
                      +1
                    </div>
                    
                    {/* Swap Button */}
                    {onSwapTarget && !isSelected && !isDisabled && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-active:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center z-20">
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
                    
                    {/* Disabled Overlay */}
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

        {/* Action Bar */}
        <div className="p-3 border-t border-white/20 bg-white/5">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToConfirm}
              disabled={!canFuse}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
                canFuse
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <Merge className="w-4 h-4" />
              {selectedSacrifices.length === 0 ? 'Select Monsters' : 
               state === 'pending' ? 'Confirm...' :
               state === 'confirming' ? 'Processing...' :
               `Fuse ${selectedSacrifices.length} Monster${selectedSacrifices.length > 1 ? 's' : ''}`}
            </button>
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
    </div>
  )
}