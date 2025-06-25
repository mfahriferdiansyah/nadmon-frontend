"use client"

import { useState } from "react"
import type { PokemonCard } from "@/types/card"

export function useCardSession(cards: PokemonCard[]) {
  const [currentCardIndex, setCurrentCardIndex] = useState(cards.length - 1)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [thrownCards, setThrownCards] = useState<Set<number>>(new Set())
  const [revealedCards, setRevealedCards] = useState<PokemonCard[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [isFocusAnimating, setIsFocusAnimating] = useState(false)
  const [isFlipAnimating, setIsFlipAnimating] = useState(false)
  const [isClickCooldown, setIsClickCooldown] = useState(false)

  const handleCardClick = () => {
    // Disable clicks during any animation, auto-play, or cooldown
    if (isAnimating || isFocusAnimating || isAutoPlaying || isFlipAnimating || isClickCooldown) return
    
    const currentCard = cards[currentCardIndex]
    if (!currentCard || currentCardIndex < 0) return

    // Start click cooldown immediately
    setIsClickCooldown(true)
    setTimeout(() => {
      setIsClickCooldown(false)
    }, 800) // 400ms cooldown

    const isCurrentCardFlipped = flippedCards.has(currentCardIndex)

    if (!isCurrentCardFlipped) {
      // Flip the card and start flip animation
      setIsFlipAnimating(true)
      setFlippedCards((prev) => new Set([...prev, currentCardIndex]))
    } else {
      // Throw the card - start animation
      setIsAnimating(true)
      setThrownCards((prev) => new Set([...prev, currentCardIndex]))
      setRevealedCards((prev) => [...prev, currentCard])
    }
  }

  const handleFlipComplete = () => {
    setIsFlipAnimating(false)
  }

  const handleCardThrowComplete = () => {
    const nextCardIndex = currentCardIndex - 1
    setCurrentCardIndex(nextCardIndex)
    setIsAnimating(false)
    
    // Continue auto-play for remaining cards (including the last card at index 0)
    if (nextCardIndex >= 0 && isAutoPlaying) {
      setIsFocusAnimating(true)
      // The focus animation callback will handle the rest
    } else if (nextCardIndex < 0) {
      // All cards thrown - stop auto-play
      setIsAutoPlaying(false)
    }
  }

  const handleFocusComplete = () => {
    setIsFocusAnimating(false)
    
    if (isAutoPlaying) {
      setTimeout(() => {
        // Use setCurrentCardIndex callback to get the latest state
        setCurrentCardIndex((latestIndex) => {
          autoPlayWithIndex(latestIndex)
          return latestIndex // Don't change the index, just trigger autoPlay
        })
      }, 200) // Brief pause between cards
    }
  }

  // Auto-click through all remaining cards with animations
  const handleSkip = () => {
    if (isAnimating || isFocusAnimating || isAutoPlaying || isClickCooldown) return
    
    setIsAutoPlaying(true)
    autoPlayCards()
  }

  const autoPlayCards = () => {
    autoPlayWithIndex(currentCardIndex)
  }

  const autoPlayWithIndex = (cardIndex: number) => {
    const currentCard = cards[cardIndex]
    if (!currentCard || cardIndex < 0) {
      setIsAutoPlaying(false)
      return
    }

    const isCurrentCardFlipped = flippedCards.has(cardIndex)

    if (!isCurrentCardFlipped) {
      // Auto-flip the card and start flip animation
      setIsFlipAnimating(true)
      setFlippedCards((prev) => new Set([...prev, cardIndex]))
      
      // The flip complete callback will handle the rest via autoThrowAfterFlip
    } else {
      // Auto-throw if already flipped
      setIsAnimating(true)
      setThrownCards((prev) => new Set([...prev, cardIndex]))
      // Only add to revealed cards once during throw, not during flip
      setRevealedCards((prev) => [...prev, currentCard])
    }
  }

  const autoThrowAfterFlip = () => {
    // Brief pause to show the flipped card, then throw
    setTimeout(() => {
      const currentCard = cards[currentCardIndex]
      if (currentCardIndex >= 0 && currentCard) {
        setIsAnimating(true)
        setThrownCards((prev) => new Set([...prev, currentCardIndex]))
        // Add to revealed cards here instead of during flip
        setRevealedCards((prev) => [...prev, currentCard])
      }
    }, 400) // Brief pause to appreciate the card
  }

  const getCurrentInstruction = () => {
    if (isAutoPlaying) {
      return "Auto-playing through cards..."
    }
    
    if (isFlipAnimating) {
      return "Card flipping..."
    }
    
    if (isAnimating) {
      return "Animation in progress..."
    }
    
    if (isFocusAnimating) {
      return "Card focusing..."
    }
    
    if (isClickCooldown) {
      return "Please wait a moment before clicking again..."
    }
    
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
    isAnimating,
    isAutoPlaying,
    isFocusAnimating,
    isFlipAnimating,
    isClickCooldown,
    handleCardClick,
    handleCardThrowComplete,
    handleFocusComplete,
    handleFlipComplete,
    autoThrowAfterFlip,
    handleSkip,
    getCurrentInstruction,
    getCardProgress,
  }
}
