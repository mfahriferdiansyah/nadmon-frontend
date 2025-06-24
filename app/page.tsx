"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Shop } from "@/components/shop"
import { Inventory } from "@/components/inventory"
import { Battleground } from "@/components/battleground"
import { PackOpeningAnimation } from "@/components/pack-opening-animation"
import { FocusedCardSession } from "@/components/focused-card-session"
import { generateRandomCards } from "@/utils/card-utils"
import { MOCK_CARDS } from "@/constants/cards"
import type { PackType } from "@/constants/packs"
import type { PokemonCard } from "@/types/card"

type ActiveSection = "shop" | "inventory" | "battleground"

export default function GachaCards() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("shop")
  const [collection, setCollection] = useState<PokemonCard[]>([
    ...MOCK_CARDS,
    ...MOCK_CARDS.slice(0, 5),
    ...MOCK_CARDS.slice(2, 7),
  ])
  const [equippedCards, setEquippedCards] = useState<PokemonCard[]>([MOCK_CARDS[1], MOCK_CARDS[2], MOCK_CARDS[7]])

  // Shop states
  const [isPackOpen, setIsPackOpen] = useState(false)
  const [currentCards, setCurrentCards] = useState<PokemonCard[]>([])
  const [isOpening, setIsOpening] = useState(false)
  const [selectedPackType, setSelectedPackType] = useState<PackType | null>(null)
  const [revealedCards, setRevealedCards] = useState<PokemonCard[]>([])
  const [packPosition, setPackPosition] = useState({ x: 0, y: 0 })
  const [showFocusedSession, setShowFocusedSession] = useState(false)

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

  const handleFocusedSessionComplete = (cards: PokemonCard[]) => {
    setRevealedCards(cards)
    setShowFocusedSession(false)
    setIsPackOpen(true)
  }

  const resetPack = () => {
    setIsPackOpen(false)
    setCurrentCards([])
    setRevealedCards([])
    setShowFocusedSession(false)
    setSelectedPackType(null)
  }

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

  const renderActiveSection = () => {
    switch (activeSection) {
      case "shop":
        return (
          <Shop
            isPackOpen={isPackOpen}
            revealedCards={revealedCards}
            selectedPackType={selectedPackType}
            collection={collection}
            onPackSelect={handlePackSelect}
            onResetPack={resetPack}
            isOpening={isOpening}
          />
        )
      case "inventory":
        return (
          <Inventory
            collection={collection}
            equippedCards={equippedCards}
            onEquipCard={handleEquipCard}
            onUnequipCard={handleUnequipCard}
            isCardEquipped={isCardEquipped}
          />
        )
      case "battleground":
        return <Battleground equippedCards={equippedCards} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      <div className="relative z-10 flex flex-col h-screen">
        <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />

        <div className="flex-1 overflow-y-auto">{renderActiveSection()}</div>
      </div>

      <PackOpeningAnimation
        isOpening={isOpening}
        onComplete={handlePackOpenComplete}
        packPosition={packPosition}
        packType={selectedPackType}
      />
      {showFocusedSession && <FocusedCardSession cards={currentCards} onComplete={handleFocusedSessionComplete} />}
    </div>
  )
}
