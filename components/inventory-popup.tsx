"use client"

import type React from "react"
import { X, Users, Merge, UserX } from "lucide-react"
import type { PokemonCard } from "@/types/card"
import { MonsterCard } from "@/components/card-component"

interface InventoryPopupProps {
  collection: PokemonCard[]
  equippedCards: PokemonCard[]
  onEquipCard: (card: PokemonCard) => void
  onUnequipCard: (cardId: number) => void
  isCardEquipped: (cardId: number) => boolean
  onSummonMonster: (card: PokemonCard) => void
  onClose: () => void
}

export function InventoryPopup({
  collection,
  equippedCards,
  onEquipCard,
  onUnequipCard,
  isCardEquipped,
  onSummonMonster,
  onClose,
}: InventoryPopupProps) {
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

  const handleMergeCard = (card: PokemonCard) => {
    // Placeholder for merge functionality
    console.log("Merge card:", card.name)
  }

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
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Monster Inventory</h2>
            <p className="text-white/70 text-sm md:text-base">Manage your collection and equipped monsters</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Mobile Equipped Cards Section */}
        <div className="md:hidden border-b border-white/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">
              Equipped ({equippedCards.length}/3)
            </h3>
            <Users className="w-5 h-5 text-white/50" />
          </div>
          
          {equippedCards.length === 0 ? (
            <p className="text-white/50 text-center py-4">No monsters equipped</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {equippedCards.map((card) => (
                <div key={card.id} className="flex-shrink-0 w-24">
                  <MonsterCard
                    card={card}
                    isEquipped={true}
                    variant="compact"
                    onUnequip={() => handleUnequipCard(card)}
                    onSummon={() => handleSummonMonster(card)}
                    showEquippedBadge={false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-full overflow-hidden">
          {/* Equipped Cards Sidebar - Horizontal Layout */}
          <div className="w-80 p-6 border-r border-white/20 bg-white/5 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">
              Equipped Monsters ({equippedCards.length}/3)
            </h3>
            <div className="flex-1 space-y-3">
              {equippedCards.map((card) => (
                <div key={card.id} className="relative">
                  <MonsterCard
                    card={card}
                    isEquipped={true}
                    variant="equipped-horizontal"
                    onUnequip={() => handleUnequipCard(card)}
                    onSummon={() => handleSummonMonster(card)}
                    onMerge={() => handleMergeCard(card)}
                    showEquippedBadge={false}
                    className="w-full"
                  />
                </div>
              ))}
              {equippedCards.length === 0 && (
                <div className="flex items-center justify-center h-32 text-white/50 text-center">
                  <div>
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No monsters equipped</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Collection */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Collection ({collection.length} monsters)
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-28 pt-4">
                {collection.map((card) => {
                  const equipped = isCardEquipped(card.id)
                  
                  return (
                    <MonsterCard
                      key={card.id}
                      card={card}
                      isEquipped={equipped}
                      variant="inventory"
                      onEquip={() => handleEquipCard(card)}
                      onUnequip={() => handleUnequipCard(card)}
                      onSummon={() => handleSummonMonster(card)}
                      showEquippedBadge={false}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Collection */}
        <div className="md:hidden flex flex-col h-full">
          <div className="p-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-white mb-3">
              Collection ({collection.length} monsters)
            </h3>
          </div>
          
          <div className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 gap-3 pb-8">
              {collection.map((card) => {
                const equipped = isCardEquipped(card.id)
                
                return (
                  <MonsterCard
                    key={card.id}
                    card={card}
                    isEquipped={equipped}
                    variant="compact"
                    onEquip={() => handleEquipCard(card)}
                    onUnequip={() => handleUnequipCard(card)}
                    onSummon={() => handleSummonMonster(card)}
                    showEquippedBadge={false}
                  />
                )
              })}
            </div>
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