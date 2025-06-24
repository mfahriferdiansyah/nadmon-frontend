"use client"

import { useState } from "react"
import type { PokemonCard } from "@/types/card"

export function useCardSession(cards: PokemonCard[]) {
  const [currentCardIndex, setCurrentCardIndex] = useState(cards.length - 1)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [thrownCards, setThrownCards] = useState<Set<number>>(new Set())
  const [revealedCards, setRevealedCards] = useState<PokemonCard[]>([])

  const handleCardClick = () => {
    const currentCard = cards[currentCardIndex]
    if (!currentCard || currentCardIndex < 0) return

    const isCurrentCardFlipped = flippedCards.has(currentCardIndex)

    if (!isCurrentCardFlipped) {
      // Flip the card
      setFlippedCards((prev) => new Set([...prev, currentCardIndex]))
    } else {
      // Throw the card and move to next
      setThrownCards((prev) => new Set([...prev, currentCardIndex]))
      setRevealedCards((prev) => [...prev, currentCard])
      setCurrentCardIndex((prev) => prev - 1)
    }
  }

  const getCurrentInstruction = () => {
    if (currentCardIndex < 0 || thrownCards.size === cards.length) {
      return "All cards revealed! Returning to main screen..."
    }

    const isCurrentFlipped = flippedCards.has(currentCardIndex)
    if (!isCurrentFlipped) {
      return "Tap the top card to flip it and see what Pokemon you got!"
    } else {
      return "Tap the card again to throw it out dramatically!"
    }
  }

  const getCardProgress = () => {
    const cardsRevealed = thrownCards.size
    return `Card ${cardsRevealed + 1} of ${cards.length}`
  }

  return {
    currentCardIndex,
    flippedCards,
    thrownCards,
    revealedCards,
    handleCardClick,
    getCurrentInstruction,
    getCardProgress,
  }
}
