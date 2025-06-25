"use client"

import { useEffect, useState } from "react"
import { CardComponent } from "./pack-card-component"
import { Button } from "@/components/ui/button"
import { useCardSession } from "@/hooks/use-card-session"
import type { FocusedCardSessionProps } from "@/types/card"
import type { PackType } from "@/constants/packs"
import { SkipForward, RotateCcw, CheckCircle, Trophy } from "lucide-react"

interface ExtendedFocusedCardSessionProps extends FocusedCardSessionProps {
  onOpenAnother?: () => void
  onFinish?: () => void
  selectedPackType?: PackType | null
}

export function FocusedCardSession({ 
  cards, 
  onComplete, 
  onOpenAnother, 
  onFinish,
  selectedPackType 
}: ExtendedFocusedCardSessionProps) {
  const [showResults, setShowResults] = useState(false)
  
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
    if (cards.length > 0 && thrownCards.size === cards.length && !showResults) {
      setTimeout(() => {
        setShowResults(true)
      }, 500)
    }
  }, [thrownCards.size, cards.length, showResults])

  const handleOpenAnother = () => {
    if (onOpenAnother) {
      onOpenAnother()
    } else {
      // Fallback to original behavior
      onComplete(revealedCards)
    }
  }

  const handleFinish = () => {
    if (onFinish) {
      onFinish()
    } else {
      // Fallback to original behavior
      onComplete(revealedCards)
    }
  }

  if (showResults) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-sm">
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="text-center space-y-4 lg:space-y-6 max-w-6xl mx-auto px-4 w-full">
              {/* Results Header */}
              <div className="animate-fade-in-up">
                {/* Pack Type Indicator */}
                {selectedPackType && (
                  <div className="mb-6">
                    <div
                      className={`inline-block bg-gradient-to-r ${selectedPackType.colors.primary} px-4 py-2 border-2 ${selectedPackType.colors.secondary} rounded`}
                    >
                      <span className="text-white font-bold text-sm tracking-wider">{selectedPackType.name}</span>
                    </div>
                  </div>
                )}

                {/* Cards Display */}
                <div className="w-full mb-6">
                  <div className="flex flex-nowrap gap-3 px-4 pb-2 overflow-x-auto scrollbar-hide lg:justify-center lg:gap-4 lg:px-2">
                    {revealedCards.map((card, index) => (
                      <div
                        key={`final-${index}`}
                        className="animate-slide-in-from-bottom flex-shrink-0"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <CardComponent
                          card={card}
                          index={index}
                          currentCardIndex={-1}
                          isFlipped={true}
                          isThrown={false}
                          isInFinalRow={true}
                          onCardClick={() => {}}
                          cards={revealedCards}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                    <Button
                        onClick={handleFinish}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 border border-gray-500 transition-all duration-300 w-full sm:w-auto"
                    >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ENOUGH
                  </Button>
                  <Button
                    onClick={handleOpenAnother}
                    className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 border border-green-500 transition-all duration-300 w-full sm:w-auto"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    OPEN ANOTHER
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-sm">
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
          <div className="text-center text-white text-base md:text-lg font-medium px-4">
            {getCurrentInstruction()}
          </div>
          <div className="text-center text-white/60 text-sm">{getCardProgress()}</div>
        </div>
      </div>
    </div>
  )
}
