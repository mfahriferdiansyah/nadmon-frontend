"use client"

import type React from "react"
import { useState } from "react"
import { GameCanvas } from "@/components/game-canvas"
import { GameUI } from "@/components/game-ui"
import { InventoryPopup } from "@/components/inventory-popup"
import { ShopPopup } from "@/components/shop-popup"
import { BattlegroundPopup } from "@/components/battleground-popup"
import { PackOpeningAnimation } from "@/components/pack-opening-animation"
import { FocusedCardSession } from "@/components/focused-card-session"
import { generateRandomCards } from "@/utils/card-utils"
import { MOCK_CARDS } from "@/constants/cards"
import type { PackType } from "@/constants/packs"
import type { PokemonCard } from "@/types/card"

type ActivePopup = "inventory" | "shop" | "battleground" | null

export default function GachaGame() {
  // Popup states
  const [activePopup, setActivePopup] = useState<ActivePopup>(null)

  // Game states
  const [collection, setCollection] = useState<PokemonCard[]>([
    ...MOCK_CARDS,
    ...MOCK_CARDS.slice(0, 5),
    ...MOCK_CARDS.slice(2, 7),
  ])
  const [equippedCards, setEquippedCards] = useState<PokemonCard[]>([MOCK_CARDS[1], MOCK_CARDS[2], MOCK_CARDS[6]])

  // Shop states
  const [currentCards, setCurrentCards] = useState<PokemonCard[]>([])
  const [isOpening, setIsOpening] = useState(false)
  const [selectedPackType, setSelectedPackType] = useState<PackType | null>(null)
  const [packPosition, setPackPosition] = useState({ x: 0, y: 0 })
  const [showFocusedSession, setShowFocusedSession] = useState(false)

  // Popup handlers
  const openPopup = (popup: ActivePopup) => {
    setActivePopup(popup)
  }

  const closePopup = () => {
    setActivePopup(null)
  }

  // Pack opening handlers
  const handlePackSelect = async (packType: PackType, event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    setPackPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    setSelectedPackType(packType)
    setIsOpening(true)
  }

  const handlePackOpenComplete = () => {
    const newCards = generateRandomCards(MOCK_CARDS, 5)
    setCurrentCards(newCards)
    setCollection((prev) => [...prev, ...newCards])
    setIsOpening(false)
    setShowFocusedSession(true)
  }

  const handleOpenAnother = () => {
    setShowFocusedSession(false)
    setCurrentCards([])
    
    if (selectedPackType) {
      setIsOpening(true)
    }
  }

  const handleFinish = () => {
    setShowFocusedSession(false)
    setCurrentCards([])
    setSelectedPackType(null)
  }

  const handleFocusedSessionComplete = (cards: PokemonCard[]) => {
    setShowFocusedSession(false)
  }

  // Card management handlers
  const handleEquipCard = (card: PokemonCard) => {
    if (equippedCards.length < 3 && !equippedCards.find((c) => c.id === card.id)) {
      setEquippedCards((prev) => [...prev, card])
    }
  }

  const handleUnequipCard = (cardId: number) => {
    setEquippedCards((prev) => prev.filter((c) => c.id !== cardId))
  }

  const isCardEquipped = (cardId: number) => {
    return equippedCards.find((c) => c.id === cardId) !== undefined
  }

  // Monster summoning (for showing monsters in game view)
  const handleSummonMonster = (card: PokemonCard) => {
    // This now just closes the inventory to show the equipped monster in the game
    closePopup()
  }

        return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Game Background & Canvas */}
      <GameCanvas 
        equippedMonsters={equippedCards}
      />
      
      {/* Game UI - Floating Action Buttons */}
      <GameUI 
        onOpenInventory={() => openPopup("inventory")}
        onOpenShop={() => openPopup("shop")}
        onOpenBattleground={() => openPopup("battleground")}
        equippedCardsCount={equippedCards.length}
        collectionCount={collection.length}
          />

      {/* Glass Popups */}
      {activePopup === "inventory" && (
        <InventoryPopup
            collection={collection}
            equippedCards={equippedCards}
            onEquipCard={handleEquipCard}
            onUnequipCard={handleUnequipCard}
            isCardEquipped={isCardEquipped}
          onSummonMonster={handleSummonMonster}
          onClose={closePopup}
        />
      )}

      {activePopup === "shop" && (
        <ShopPopup
          collection={collection}
          onPackSelect={handlePackSelect}
          isOpening={isOpening}
          onClose={closePopup}
        />
      )}

      {activePopup === "battleground" && (
        <BattlegroundPopup
          equippedCards={equippedCards}
          onClose={closePopup}
        />
      )}

      {/* Pack Opening Animation */}
      <PackOpeningAnimation
        isOpening={isOpening}
        onComplete={handlePackOpenComplete}
        packPosition={packPosition}
        packType={selectedPackType || undefined}
      />

      {/* Focused Card Session */}
      {showFocusedSession && (
        <FocusedCardSession 
          cards={currentCards} 
          onComplete={handleFocusedSessionComplete}
          onOpenAnother={handleOpenAnother}
          onFinish={handleFinish}
          selectedPackType={selectedPackType}
        />
      )}
    </div>
  )
}
