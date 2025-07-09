"use client"

import type React from "react"
import { useState } from "react"
import { X, Users, Merge, UserX, Loader2, RefreshCw } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import { MonsterCard } from "@/components/card-component"
import { WalletHandle } from "@/components/wallet-handle"
import { MobileFusionPopup } from "@/components/mobile-fusion-popup"
import { BurnConfirmationDialog } from "@/components/burn-confirmation-dialog"
import { useNadmonBurn } from "@/hooks/use-nadmon-burn"

interface MobileInventoryPopupProps {
  collection: PokemonCard[]
  equippedCards: PokemonCard[]
  onEquipCard: (card: PokemonCard) => void
  onUnequipCard: (cardId: number) => void
  isCardEquipped: (cardId: number) => boolean
  onSummonMonster: (card: PokemonCard) => void
  onClose: () => void
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
  onFusionComplete?: (targetCard: PokemonCard, sacrificeCards: PokemonCard[]) => void
}

export function MobileInventoryPopup({
  collection,
  equippedCards,
  onEquipCard,
  onUnequipCard,
  isCardEquipped,
  onSummonMonster,
  onClose,
  isLoading = false,
  error,
  onRefresh,
  onFusionComplete,
}: MobileInventoryPopupProps) {
  const [fusionTarget, setFusionTarget] = useState<PokemonCard | null>(null)
  const [burnTarget, setBurnTarget] = useState<PokemonCard | null>(null)
  const { burnMonster, isLoading: isBurning } = useNadmonBurn()

  const handleEquipCard = (card: PokemonCard) => {
    if (equippedCards.length < 3 && !isCardEquipped(card.id)) {
      onEquipCard(card)
    }
  }

  const handleUnequipCard = (card: PokemonCard) => {
    onUnequipCard(card.id)
  }

  const handleSummonMonster = (card: PokemonCard) => {
    onSummonMonster(card)
  }

  const handleBurnRequest = (card: PokemonCard) => {
    setBurnTarget(card)
  }

  const handleBurnConfirm = async () => {
    if (burnTarget) {
      await burnMonster(burnTarget)
    }
  }

  const handleBurnCancel = () => {
    setBurnTarget(null)
  }

  const handleCloseFusion = () => {
    setFusionTarget(null)
  }

  const handleMergeCard = (card: PokemonCard) => {
    setFusionTarget(card)
  }

  const handleFusionComplete = (targetCard: PokemonCard, sacrificeCards: PokemonCard[]) => {
    if (onFusionComplete) {
      onFusionComplete(targetCard, sacrificeCards)
    }
    setFusionTarget(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-4 px-2">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Wallet Handle - Outside and Above Popup */}
      <div className="relative z-10 mb-4 px-4">
        <WalletHandle />
      </div>
      
      {/* Popup Container */}
      <div className="relative w-full max-w-lg h-full max-h-[95vh] glass-panel rounded-t-2xl rounded-b-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-1.5 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-r from-purple-500/30 to-blue-500/30 flex items-center justify-center backdrop-blur-sm">
              <Users className="w-2.5 h-2.5 text-purple-300" />
            </div>
            <h2 className="text-sm font-semibold text-white">Monster Inventory</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fixed Equipped Strip - Always Visible */}
        <div className="border-b border-white/20 bg-white/5 p-1.5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-green-400" />
              <span className="font-medium text-xs text-white">Equipped ({equippedCards.length}/3)</span>
            </div>
          </div>
          
          <div className="flex gap-1.5 justify-center px-2">
            {/* Always show 3 slots */}
            {Array.from({ length: 3 }).map((_, index) => {
              const card = equippedCards[index]
              return (
                <div key={card ? `equipped-${card.id}` : `empty-slot-${index}`} className="flex-1 max-w-[80px]">
                  {card ? (
                    <MonsterCard
                      card={card}
                      isEquipped={true}
                      variant="nano"
                      onUnequip={() => handleUnequipCard(card)}
                      onSummon={() => handleSummonMonster(card)}
                      onMerge={() => handleMergeCard(card)}
                      showEquippedBadge={false}
                      mergeLevel={card.fusion || 0}
                      className="w-full"
                    />
                  ) : (
                    <div className="aspect-[3/4] border border-dashed border-white/20 rounded flex items-center justify-center bg-white/5 mx-auto">
                      <Users className="w-3 h-3 text-white/30" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Collection Header with Stats */}
        <div className="p-1.5 border-b border-white/20 bg-white/5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-white flex items-center gap-1.5">
              Collection ({collection.length})
              {isLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
            </h3>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-1 rounded hover:bg-white/10 transition-colors text-white/70 hover:text-white disabled:opacity-50"
                title="Refresh NFTs"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          
          {error && (
            <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded p-2">
              <p className="font-medium">Failed to load NFTs</p>
              <p className="text-red-300 text-xs mt-0.5">{error}</p>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="mt-1 text-xs bg-red-500/20 hover:bg-red-500/30 px-1.5 py-0.5 rounded transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Collection Grid */}
        <div className="flex-1 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-white/70">
              <div className="text-center">
                <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin text-blue-400" />
                <p className="text-xs">Loading NFTs...</p>
              </div>
            </div>
          ) : collection.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-white/50">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <h4 className="font-medium mb-1 text-sm">No Monsters Yet</h4>
                <p className="text-xs">Visit the shop to buy your first pack!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1 pb-12">
              {collection.map((card) => {
                const equipped = isCardEquipped(card.id)
                
                return (
                  <MonsterCard
                    key={card.id}
                    card={card}
                    isEquipped={equipped}
                    variant="nano"
                    onEquip={() => handleEquipCard(card)}
                    onUnequip={() => handleUnequipCard(card)}
                    onSummon={() => handleBurnRequest(card)}
                    onMerge={() => handleMergeCard(card)}
                    showEquippedBadge={false}
                    mergeLevel={card.fusion || 0}
                    className="w-full"
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Minimal Action Bar */}
        <div className="p-1.5 bg-white/5 border-t border-white/20">
          <div className="flex gap-1">
            <button
              onClick={onClose}
              className="flex-1 py-1.5 px-2 rounded bg-white/10 text-white hover:bg-white/20 transition-colors font-medium text-xs"
            >
              Close
            </button>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="px-2 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1 text-xs"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
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

      {/* Fusion Popup */}
      {fusionTarget && (
        <MobileFusionPopup
          targetCard={fusionTarget}
          collection={collection}
          onClose={handleCloseFusion}
          onFusionComplete={handleFusionComplete}
          onSwapTarget={setFusionTarget}
        />
      )}

      {/* Burn Confirmation Dialog */}
      <BurnConfirmationDialog
        card={burnTarget}
        isOpen={!!burnTarget}
        onConfirm={handleBurnConfirm}
        onCancel={handleBurnCancel}
      />
    </div>
  )
}