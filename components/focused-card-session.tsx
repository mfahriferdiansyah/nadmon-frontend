"use client"

import { useEffect } from "react"
import { CardComponent } from "./card-component"
import { Button } from "@/components/ui/button"
import { useCardSession } from "@/hooks/use-card-session"
import type { FocusedCardSessionProps } from "@/types/card"
import { SkipForward } from "lucide-react"

export function FocusedCardSession({ cards, onComplete }: FocusedCardSessionProps) {
  const {
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
  } = useCardSession(cards)

  useEffect(() => {
    if (cards.length > 0 && thrownCards.size === cards.length) {
      setTimeout(() => {
        onComplete(revealedCards)
      }, 500)
    }
  }, [thrownCards.size, cards.length, revealedCards, onComplete])

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-sm">
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          {/* Container sized for XL Pokemon cards */}
          <div className="relative pokemon-card-xl">
            {cards.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className="animate-card-enter-from-top"
                style={{
                  animationDelay: `${(cards.length - 1 - index) * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <CardComponent
                  card={card}
                  index={index}
                  currentCardIndex={currentCardIndex}
                  isFlipped={flippedCards.has(index)}
                  isThrown={thrownCards.has(index)}
                  isInFinalRow={false}
                  onCardClick={handleCardClick}
                  onThrowComplete={index === currentCardIndex ? handleCardThrowComplete : undefined}
                  onFocusComplete={index === currentCardIndex ? handleFocusComplete : undefined}
                  onFlipComplete={index === currentCardIndex ? handleFlipComplete : undefined}
                  autoThrowAfterFlip={index === currentCardIndex ? autoThrowAfterFlip : undefined}
                  isAnimating={isAnimating}
                  isAutoPlaying={isAutoPlaying}
                  isFocusAnimating={isFocusAnimating}
                  isFlipAnimating={isFlipAnimating}
                  isClickCooldown={isClickCooldown}
                  cards={cards}
                  size="xl"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center text-white text-base md:text-lg font-medium px-4">
            {getCurrentInstruction()}
          </div>
          <div className="text-center text-white/60 text-sm">{getCardProgress()}</div>
          
          {/* Skip Button */}
          {currentCardIndex >= 0 && thrownCards.size < cards.length && (
            <div className="flex justify-center">
              <Button
                onClick={handleSkip}
                disabled={isAnimating || isFocusAnimating || isAutoPlaying || isFlipAnimating || isClickCooldown}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white font-bold py-2 px-4 border border-gray-500 transition-all duration-300"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                {isAutoPlaying ? "AUTO-PLAYING..." : "AUTO PLAY ALL"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
