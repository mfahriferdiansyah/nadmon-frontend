"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, Zap, Shield, Heart, Target, Flame, Droplets, Leaf, Brain, Mountain, Bug } from "lucide-react"
import { RARITY_STYLES, ELEMENT_THEMES } from "@/constants/cards"
import type { CardComponentProps } from "@/types/card"

// Type icon mapping
const getTypeIcon = (type: string, size: "sm" | "md" | "lg" = "md") => {
  const sizeClass = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"

  switch (type.toLowerCase()) {
    case "fire":
      return <Flame className={`${sizeClass} text-red-500`} />
    case "water":
      return <Droplets className={`${sizeClass} text-blue-500`} />
    case "grass":
      return <Leaf className={`${sizeClass} text-green-500`} />
    case "electric":
      return <Zap className={`${sizeClass} text-yellow-500`} />
    case "psychic":
      return <Brain className={`${sizeClass} text-purple-500`} />
    case "dragon":
      return <Mountain className={`${sizeClass} text-orange-500`} />
    default:
      return <Bug className={`${sizeClass} text-gray-500`} />
  }
}

export function CardComponent({
  card,
  index,
  currentCardIndex,
  isFlipped,
  isThrown,
  isInFinalRow,
  onCardClick,
  onThrowComplete,
  onFocusComplete,
  onFlipComplete,
  autoThrowAfterFlip,
  cards = [],
  size = "md",
  isAnimating = false,
  isAutoPlaying = false,
  isFocusAnimating = false,
  isFlipAnimating = false,
  isClickCooldown = false,
}: CardComponentProps & { size?: "sm" | "md" | "lg" | "xl" }) {
  const isActive = index === currentCardIndex
  const isBelow = index > currentCardIndex

  const getCardTransform = () => {
    if (isInFinalRow) {
      return `translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1)`
    }

    if (isThrown) {
      return `translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1, 1, 1)`
    }

    if (isActive) {
      return `translate3d(0px, -8px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale3d(1.03, 1.03, 1)`
    }

    if (isBelow) {
      // Fan effect for cards behind current card
      const offset = index - currentCardIndex
      const fanRotation = offset * 8
      const fanOffsetX = offset * 15
      const fanOffsetY = offset * 3
      return `translate3d(${fanOffsetX}px, ${fanOffsetY}px, 0px) rotateZ(${fanRotation}deg) scale3d(0.96, 0.96, 1)`
    }

    // Cards above current card (not yet reached) - CHAOTIC stacking like real messy cards!
    const stackOffset = currentCardIndex - index
    
    // Much more chaotic rotations - different patterns for visual chaos
    const rotationBase = (index % 7 - 3) * 4 // Base rotation: -12° to +12°
    const rotationChaos = (index * 17) % 11 - 5 // Additional chaos: -5° to +5°
    const totalRotation = rotationBase + rotationChaos
    
    // Chaotic horizontal offsets - much larger and more varied
    const baseOffsetX = (index % 5 - 2) * 8 // -16px to +16px
    const chaoticOffsetX = ((index * 23) % 13 - 6) * 2 // Additional -12px to +12px
    const totalOffsetX = baseOffsetX + chaoticOffsetX
    
    // Chaotic vertical offsets - cards scattered vertically
    const baseOffsetY = stackOffset * 2 // Base depth offset
    const chaoticOffsetY = ((index * 31) % 9 - 4) * 3 // -12px to +12px chaos
    const totalOffsetY = baseOffsetY + chaoticOffsetY
    
    // More noticeable scale variations
    const baseScale = 1 - (stackOffset * 0.01) // Depth scaling
    const chaoticScale = ((index * 41) % 7 - 3) * 0.008 // -0.024 to +0.024 chaos
    const totalScale = Math.max(0.94, Math.min(1.06, baseScale + chaoticScale)) // Clamp between 0.94-1.06
    
    return `translate3d(${totalOffsetX}px, ${totalOffsetY}px, 0px) rotateZ(${totalRotation}deg) scale3d(${totalScale}, ${totalScale}, 1)`
  }

  const getZIndex = () => {
    if (isInFinalRow) return 10
    if (isThrown) return 1
    if (isActive) return 200 // Increased from 100
    return 50 - index // Changed to decrease z-index for cards behind
  }

  const getOpacity = () => {
    if (isThrown && !isInFinalRow) return 0
    return 1
  }

  // Card size classes with significantly increased minimum sizes
  const getCardSizeClass = () => {
    if (size === "xl") return "pokemon-card-xl"
    if (size === "lg") return "pokemon-card-lg"
    if (size === "sm" || isInFinalRow) return "pokemon-card-sm"
    return "pokemon-card-md"
  }

  const cardSizeClass = getCardSizeClass()

  // Updated layout classes for larger cards with better proportions
  const getLayoutClasses = () => {
    if (size === "xl") {
      return {
        // Header section
        headerPadding: "p-5",
        nameText: "text-lg font-bold",
        nameTextSmall: "text-base font-bold",
        typeText: "text-sm",

        // Image section
        imageMargin: "m-4",
        badgeText: "text-sm px-2 py-1",

        // Stats section
        statsPadding: "p-5 space-y-4",
        statsText: "text-sm",
        statsIconSize: "w-4 h-4",
        powerBarHeight: "h-3",
        typeIconSize: "lg" as const,
      }
    } else if (size === "lg") {
      return {
        headerPadding: "p-4",
        nameText: "text-base font-bold",
        nameTextSmall: "text-sm font-bold",
        typeText: "text-sm",

        imageMargin: "m-3",
        badgeText: "text-sm px-1.5 py-0.5",

        statsPadding: "p-4 space-y-3",
        statsText: "text-sm",
        statsIconSize: "w-4 h-4",
        powerBarHeight: "h-2.5",
        typeIconSize: "md" as const,
      }
    } else if (size === "sm" || isInFinalRow) {
      return {
        headerPadding: "p-3",
        nameText: "text-sm font-bold",
        nameTextSmall: "text-xs font-bold",
        typeText: "text-xs",

        imageMargin: "m-2.5",
        badgeText: "text-xs px-1 py-0.5",

        statsPadding: "p-3 space-y-2.5",
        statsText: "text-xs",
        statsIconSize: "w-3 h-3",
        powerBarHeight: "h-2",
        typeIconSize: "sm" as const,
      }
    } else {
      return {
        headerPadding: "p-4",
        nameText: "text-base font-bold",
        nameTextSmall: "text-sm font-bold",
        typeText: "text-sm",

        imageMargin: "m-3",
        badgeText: "text-sm px-1.5 py-0.5",

        statsPadding: "p-4 space-y-3",
        statsText: "text-sm",
        statsIconSize: "w-4 h-4",
        powerBarHeight: "h-2.5",
        typeIconSize: "sm" as const,
      }
    }
  }

  const layout = getLayoutClasses()

  // Get element theme
  const elementTheme = ELEMENT_THEMES[card.type as keyof typeof ELEMENT_THEMES] || ELEMENT_THEMES.Fire

  // Turn off glow effects when throwing to reduce lag
  const getGlowClass = () => {
    if (!isFlipped || isInFinalRow || isThrown) return ""
    if (card.rarity === "legendary") return "animate-legendary-glow"
    if (card.rarity === "epic") return "animate-epic-glow"
    if (card.rarity === "rare") return "animate-rare-glow"
    return ""
  }

  // Turn off orbiting glow when throwing to reduce lag
  const shouldShowOrbitingGlow = () => {
    return (
      isFlipped &&
      !isInFinalRow &&
      !isThrown &&
      (card.rarity === "rare" || card.rarity === "epic" || card.rarity === "legendary")
    )
  }

  const getOrbitingGlowClass = () => {
    if (card.rarity === "legendary") return "animate-intense-glow-orbit"
    return "animate-glow-orbit"
  }

  const getOrbitingGlowColor = () => {
    if (card.rarity === "legendary") return "bg-yellow-400 shadow-lg shadow-yellow-400/70"
    if (card.rarity === "epic") return "bg-purple-400 shadow-lg shadow-purple-400/70"
    return "bg-blue-400 shadow-lg shadow-blue-400/70"
  }

  // Check if name is too long and needs smaller font
  const getNameClass = () => {
    const nameLength = card.name.length
    if (nameLength > 20) return layout.nameTextSmall
    return layout.nameText
  }

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === 'cardThrowGaming' && onThrowComplete) {
      onThrowComplete()
    }
  }

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Only handle the transform transition for the flip animation
    if (e.propertyName === 'transform' && onFlipComplete && isFlipAnimating) {
      onFlipComplete()
      
      // If auto-playing, trigger the throw after flip
      if (isAutoPlaying && autoThrowAfterFlip) {
        autoThrowAfterFlip()
      }
    }
  }

  const handleContainerTransitionEnd = (e: React.TransitionEvent) => {
    // Handle focus animation completion when card moves from chaotic to neat position
    if (e.propertyName === 'transform' && onFocusComplete && isFocusAnimating && isActive) {
      onFocusComplete()
    }
  }

  return (
    <div
      className={`perspective-1000 ${cardSizeClass} ${isInFinalRow ? "relative" : "absolute inset-0"} ${
        isActive && !isInFinalRow && !isAnimating && !isAutoPlaying && !isFocusAnimating && !isFlipAnimating && !isClickCooldown ? "cursor-pointer" : ""
      } ${isThrown && !isInFinalRow ? "animate-card-throw-smooth" : ""} gpu-accelerated bg-transparent isolation-auto`}
      style={{
        ...(isInFinalRow
          ? {
              willChange: "transform, opacity",
              transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          : {
              transform: getCardTransform(),
              zIndex: getZIndex(),
              opacity: getOpacity(),
              willChange: "transform, opacity",
              transition: isThrown ? "none" : "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              pointerEvents: isActive && !isInFinalRow ? "auto" : "none",
            }),
      }}
      onClick={isActive && !isInFinalRow ? onCardClick : undefined}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleContainerTransitionEnd}
    >
      {/* Optimized orbiting glow effects - disabled when throwing */}
      {shouldShowOrbitingGlow() && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 w-3 h-3 ${getOrbitingGlowClass()}`}>
            <div className={`w-3 h-3 rounded-full ${getOrbitingGlowColor()}`} />
          </div>
          {(card.rarity === "epic" || card.rarity === "legendary") && (
            <div
              className={`absolute top-1/2 left-1/2 w-2 h-2 ${getOrbitingGlowClass()}`}
              style={{ animationDelay: "1s" }}
            >
              <div className={`w-2 h-2 rounded-full ${getOrbitingGlowColor()}`} />
            </div>
          )}
          {card.rarity === "legendary" && (
            <div
              className={`absolute top-1/2 left-1/2 w-4 h-4 ${getOrbitingGlowClass()}`}
              style={{ animationDelay: "0.5s" }}
            >
              <div className={`w-4 h-4 rounded-full ${getOrbitingGlowColor()}`} />
            </div>
          )}
        </div>
      )}

      <div
        className={`relative w-full h-full transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""} ${getGlowClass()}`}
        style={{
          transition: "transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          willChange: "transform",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <Card
            className={`w-full h-full bg-indigo-600 border-2 border-indigo-300 ${
              isActive && !isInFinalRow ? "shadow-2xl" : "shadow-lg"
            } rounded-xl gpu-accelerated`}
            style={{
              transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease",
              transform: isActive && !isInFinalRow ? "scale(1.02)" : "scale(1)",
              willChange: "transform, box-shadow",
            }}
          >
            <CardContent
              className={`${layout.headerPadding} flex flex-col items-center justify-center h-full text-white`}
            >
              <Package
                className={`${size === "xl" ? "w-20 h-20 mb-4" : size === "sm" ? "w-12 h-12 mb-2" : "w-16 h-16 mb-3"}`}
              />
              <div className={`${layout.nameText} text-center`}>NADMON</div>
              <div className={`${layout.typeText} opacity-80 mt-1`}>CARD</div>
            </CardContent>
          </Card>
        </div>

        {/* Card Front - Enhanced with overall soft element theming */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <Card
            className={`w-full h-full border-4 ${RARITY_STYLES[card.rarity].border} ${RARITY_STYLES[card.rarity].shadow} rounded-xl overflow-hidden gpu-accelerated bg-white isolation-auto`}
            style={{
              // More subtle overall card background, letting image area be the focus
              background: `
                linear-gradient(135deg, 
                  ${elementTheme.primary}20 0%, 
                  rgba(255, 255, 255, 0.98) 30%, 
                  rgba(255, 255, 255, 0.95) 70%, 
                  ${elementTheme.primary}15 100%
                ), 
                ${elementTheme.pattern}
              `,
              transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease",
              transform: isActive && !isInFinalRow ? "scale(1.02)" : "scale(1)",
              willChange: "transform, box-shadow",
            }}
          >
            <CardContent className="p-0 h-full flex flex-col backdrop-blur-none bg-white/100">
              {/* SECTION 1: Header with soft element tint */}
              <div
                className={`${layout.headerPadding} backdrop-blur-sm border-b border-white/30 flex-shrink-0`}
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.95) 0%, 
                    ${elementTheme.primary}20 50%, 
                    rgba(255, 255, 255, 0.9) 100%
                  )`,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-3">
                    {/* Single line name with responsive font size */}
                    <h3 className={`${getNameClass()} text-slate-800 leading-tight truncate`}>{card.name}</h3>
                  </div>
                  {/* Attribute (type) with icon */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getTypeIcon(card.type, layout.typeIconSize)}
                    <span className={`${layout.typeText} text-slate-600 font-medium capitalize`}>{card.type}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Image with enhanced element theming */}
              <div
                className={`flex-1 ${layout.imageMargin} relative overflow-hidden rounded-lg`}
                style={{
                  background: `
    linear-gradient(135deg, 
      ${elementTheme.primary}60 0%, 
      ${elementTheme.secondary}40 50%, 
      ${elementTheme.accent}50 100%
    ),
    radial-gradient(circle at 30% 70%, ${elementTheme.primary}40 0%, transparent 60%),
    radial-gradient(circle at 70% 30%, ${elementTheme.secondary}30 0%, transparent 50%)
  `,
                }}
              >
                <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-full object-cover" />

                {/* Rarity badge only */}
              </div>

              {/* SECTION 3: Stats with soft element tint */}
              <div
                className={`${layout.statsPadding} backdrop-blur-sm border-t border-white/30 flex-shrink-0`}
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.95) 0%, 
                    ${elementTheme.primary}15 50%, 
                    rgba(255, 255, 255, 0.9) 100%
                  )`,
                }}
              >
                <div className={`grid grid-cols-2 gap-3 ${layout.statsText}`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Zap className={`${layout.statsIconSize} text-red-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">ATK</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.attack}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Shield className={`${layout.statsIconSize} text-blue-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">DEF</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.defense}</span>
                  </div>
                </div>

                <div className={`grid grid-cols-2 gap-3 ${layout.statsText} mt-2.5`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Heart className={`${layout.statsIconSize} text-pink-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">HP</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.hp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Target className={`${layout.statsIconSize} text-purple-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">CRIT</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.critical}%</span>
                  </div>
                </div>

                {/* Power level indicator with element color */}
                <div className="flex items-center gap-2.5 mt-2.5">
                  <div className={`flex-1 bg-slate-200 rounded-full ${layout.powerBarHeight}`}>
                    <div
                      className={`${layout.powerBarHeight} rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min((card.hp + card.attack + card.defense) / 5, 100)}%`,
                        background: `linear-gradient(90deg, ${elementTheme.secondary} 0%, ${elementTheme.accent} 100%)`,
                      }}
                    />
                  </div>
                  <span className={`${layout.statsText} text-slate-500 font-medium flex-shrink-0`}>PWR</span>
                </div>
              </div>

              {/* Enhanced holographic effect with element colors */}
              {(card.rarity === "rare" || card.rarity === "epic" || card.rarity === "legendary") && (
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        transparent 0%, 
                        ${elementTheme.secondary}40 30%, 
                        transparent 60%, 
                        ${elementTheme.accent}30 100%
                      ),
                      radial-gradient(circle at 70% 30%, ${elementTheme.primary}30 0%, transparent 50%)
                    `,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
