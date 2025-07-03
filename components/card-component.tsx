"use client"

import type React from "react"
import { Zap, Sword, Shield, Heart, Eye, X, Package, Flame, Droplets, Leaf, Brain, Mountain, Bug, Target, UserX, Merge } from "lucide-react"
import Image from "next/image"
import type { PokemonCard, CardComponentProps } from "@/types/card"
import { RARITY_STYLES, ELEMENT_THEMES } from "@/constants/cards"
import { GlassCard, GlassCardContent, GlassCardFooter, Card, CardContent } from "@/components/ui/card"

// Type icon mapping for the original CardComponent
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

// Original CardComponent for pack opening animations
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
      const offset = index - currentCardIndex
      const fanRotation = offset * 8
      const fanOffsetX = offset * 15
      const fanOffsetY = offset * 3
      return `translate3d(${fanOffsetX}px, ${fanOffsetY}px, 0px) rotateZ(${fanRotation}deg) scale3d(0.96, 0.96, 1)`
    }

    const stackOffset = currentCardIndex - index
    const rotationBase = (index % 8 - 2) * 4
    const rotationChaos = (index * 17) % 13 - 4
    const totalRotation = rotationBase + rotationChaos
    
    const baseOffsetX = (index % 5 - 2) * 8
    const chaoticOffsetX = ((index * 23) % 13 - 6) * 2
    const totalOffsetX = baseOffsetX + chaoticOffsetX
    
    const baseOffsetY = stackOffset * 2
    const chaoticOffsetY = ((index * 31) % 9 - 4) * 3
    const totalOffsetY = baseOffsetY + chaoticOffsetY
    
    const baseScale = 1 - (stackOffset * 0.01)
    const chaoticScale = ((index * 41) % 7 - 3) * 0.008
    const totalScale = Math.max(0.94, Math.min(1.06, baseScale + chaoticScale))
    
    return `translate3d(${totalOffsetX}px, ${totalOffsetY}px, 0px) rotateZ(${totalRotation}deg) scale3d(${totalScale}, ${totalScale}, 1)`
  }

  const getZIndex = () => {
    if (isInFinalRow) return 10
    if (isThrown) return 1
    if (isActive) return 200
    return 50 - index
  }

  const getOpacity = () => {
    if (isThrown && !isInFinalRow) return 0
    return 1
  }

  const getCardSizeClass = () => {
    if (size === "xl") return "pokemon-card-xl"
    if (size === "lg") return "pokemon-card-lg"
    if (size === "sm" || isInFinalRow) return "pokemon-card-sm"
    return "pokemon-card-md"
  }

  const cardSizeClass = getCardSizeClass()

  const getLayoutClasses = () => {
    if (size === "xl") {
      return {
        headerPadding: "p-5",
        nameText: "text-lg font-bold",
        nameTextSmall: "text-base font-bold",
        typeText: "text-sm",
        imageMargin: "m-4",
        badgeText: "text-sm px-2 py-1",
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
  const elementTheme = ELEMENT_THEMES[card.type as keyof typeof ELEMENT_THEMES] || ELEMENT_THEMES.Fire

  const getGlowClass = () => {
    if (!isFlipped || isInFinalRow || isThrown) return ""
    if (card.rarity === "legendary") return "animate-legendary-glow"
    if (card.rarity === "epic") return "animate-epic-glow"
    if (card.rarity === "rare") return "animate-rare-glow"
    return ""
  }

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
    if (e.propertyName === 'transform' && onFlipComplete && isFlipAnimating) {
      onFlipComplete()
      
      if (isAutoPlaying && autoThrowAfterFlip) {
        autoThrowAfterFlip()
      }
    }
  }

  const handleContainerTransitionEnd = (e: React.TransitionEvent) => {
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
      {/* Orbiting glow effects */}
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

        {/* Card Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <Card
            className={`w-full h-full border-4 ${RARITY_STYLES[card.rarity].border} ${RARITY_STYLES[card.rarity].shadow} rounded-xl overflow-hidden gpu-accelerated bg-white isolation-auto`}
            style={{
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
              {/* Header */}
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
                    <h3 className={`${getNameClass()} text-slate-800 leading-tight truncate text-center uppercase`}>{card.name}</h3>
                    <div className={`${layout.typeText} text-slate-500 font-medium text-center`}>#{card.id}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getTypeIcon(card.type, layout.typeIconSize)}
                    <span className={`${layout.typeText} text-slate-600 font-medium capitalize`}>{card.type}</span>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div
                className={`flex-1 ${layout.imageMargin} relative overflow-hidden rounded-lg bg-white`}
              >
                <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-full object-contain" />
              </div>

              {/* Stats */}
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
                    <Heart className={`${layout.statsIconSize} text-red-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">HP</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.hp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Sword className={`${layout.statsIconSize} text-orange-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">ATK</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.attack}</span>
                  </div>
                </div>

                <div className={`grid grid-cols-2 gap-3 ${layout.statsText} mt-2.5`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Shield className={`${layout.statsIconSize} text-blue-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">DEF</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.defense}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Target className={`${layout.statsIconSize} text-purple-500 flex-shrink-0`} />
                    <span className="text-slate-600 font-medium flex-shrink-0">CRIT</span>
                    <span className="font-bold text-slate-800 ml-auto flex-shrink-0">{card.critical}</span>
                  </div>
                </div>
              </div>

              {/* Holographic effect */}
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

// MonsterCard component for inventory displays
interface MonsterCardProps {
  card: PokemonCard
  isEquipped?: boolean
  showActions?: boolean
  variant?: "inventory" | "equipped" | "equipped-horizontal" | "battle" | "compact"
  onEquip?: () => void
  onUnequip?: () => void
  onSummon?: () => void
  onMerge?: () => void
  className?: string
  showEquippedBadge?: boolean
  mergeLevel?: number
  maxMergeLevel?: number
}

export function MonsterCard({
  card,
  isEquipped = false,
  showActions = true,
  variant = "inventory",
  onEquip,
  onUnequip,
  onSummon,
  onMerge,
  className = "",
  showEquippedBadge = true,
  mergeLevel = 0,
  maxMergeLevel = 10
}: MonsterCardProps) {
  // Rarity styles that match the main screen
  const MAIN_SCREEN_RARITY_STYLES = {
    common: {
      bg: "bg-gray-500",
      text: "text-gray-100",
      border: "border-gray-400",
      glow: "shadow-gray-400/30"
    },
    rare: {
      bg: "bg-blue-500",
      text: "text-blue-100",
      border: "border-blue-400",
      glow: "shadow-blue-400/30"
    },
    epic: {
      bg: "bg-purple-500",
      text: "text-purple-100",
      border: "border-purple-400",
      glow: "shadow-purple-400/30"
    },
    legendary: {
      bg: "bg-orange-500",
      text: "text-orange-100",
      border: "border-orange-400",
      glow: "shadow-orange-400/30"
    }
  }

  // Determine card variant based on rarity and equipped status
  const getCardVariant = () => {
    // Always use rarity-based variant, equipped status will be shown with silver glow
    switch (card.rarity) {
      case "rare": return "rare"
      case "epic": return "epic" 
      case "legendary": return "legendary"
      default: return "default"
    }
  }

  const handleEquipToggle = () => {
    if (isEquipped && onUnequip) {
      onUnequip()
    } else if (!isEquipped && onEquip) {
      onEquip()
    }
  }

  const isCompact = variant === "compact"
  const isBattle = variant === "battle"
  const isHorizontal = variant === "equipped-horizontal"

  // Get type icon with proper sizing and circular background
  const getTypeIcon = (size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4"
    const bgSize = size === "sm" ? "w-6 h-6" : "w-8 h-8"
    
    const iconElement = (() => {
      switch (card.type.toLowerCase()) {
        case "fire":
          return <Flame className={`${sizeClass} text-red-400`} />
        case "water":
          return <Droplets className={`${sizeClass} text-blue-400`} />
        case "grass":
          return <Leaf className={`${sizeClass} text-green-400`} />
        case "neutral":
          return <Bug className={`${sizeClass} text-gray-400`} />
        default:
          return <Bug className={`${sizeClass} text-gray-400`} />
      }
    })()

    return (
      <div className={`${bgSize} rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center`}>
        {iconElement}
      </div>
    )
  }

  if (isHorizontal) {
    return (
      <div 
        className={`relative transition-all duration-300 ${
          isEquipped ? "ring-2 ring-gray-300 shadow-lg shadow-gray-300/50" : ""
        } ${className} rounded-lg p-2 border ${
          MAIN_SCREEN_RARITY_STYLES[card.rarity].border
        } ${
          // Add transparent colored background based on rarity
          card.rarity === 'common' ? 'bg-gradient-to-br from-gray-500/20 to-gray-600/10' :
          card.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10' :
          card.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10' :
          card.rarity === 'legendary' ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10' :
          'bg-gradient-to-br from-white/10 to-white/5'
        } backdrop-blur-sm ${
          MAIN_SCREEN_RARITY_STYLES[card.rarity].glow
        }`}
      >
        <div className="flex gap-2">
          {/* Left Column - Image and Progress */}
          <div className="flex flex-col gap-1">
            {/* Image - Square for horizontal layout */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              {/* Blurred background */}
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-contain blur-sm scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=150"
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              
              {/* Sharp foreground image */}
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-contain relative z-10"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=200&width=150"
                }}
              />
              
              {/* Element icon - Top left corner with circular background */}
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center z-20">
                {getTypeIcon("sm")}
              </div>
              
              {/* Equipped silver inner glow effect */}
              {isEquipped && (
                <div className="absolute inset-0 rounded-lg ring-1 ring-gray-300/60 shadow-inner shadow-gray-300/30" />
              )}
              
              {/* Rarity indicator - bottom right with matching colors */}
              <div className="absolute bottom-0.5 right-0.5 z-20">
                <div className={`text-xs px-1 py-0.5 rounded ${MAIN_SCREEN_RARITY_STYLES[card.rarity].bg} ${MAIN_SCREEN_RARITY_STYLES[card.rarity].text} font-bold`}>
                  {card.rarity.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Rarity Glow Effect */}
              <div 
                className={`absolute inset-0 rounded-lg opacity-20 ${
                  MAIN_SCREEN_RARITY_STYLES[card.rarity].bg
                }`}
              />
            </div>

            {/* Merge Progress Bar - Below image */}
            <div className="w-20">
              <div className="w-full bg-gray-700/50 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(mergeLevel / maxMergeLevel) * 100}%` }}
                />
              </div>
              <div className="text-xs text-white/60 text-center mt-0.5">
                {mergeLevel}/{maxMergeLevel}
              </div>
            </div>
          </div>

          {/* Card Info - More compact without progress bar */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* Name and Token ID */}
            <div>
              <h4 className="font-semibold text-white text-sm truncate text-center uppercase">
                {card.name}
              </h4>
              <div className="text-xs text-white/60 text-center">#{card.id}</div>
            </div>

            {/* Horizontal Stats - Better arranged */}
            <div className="grid grid-cols-2 gap-1.5 text-xs mb-2">
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <Heart className="w-3 h-3 text-red-400" />
                <span className="text-white/90 font-medium">{card.hp}</span>
              </div>
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <Sword className="w-3 h-3 text-orange-400" />
                <span className="text-white/90 font-medium">{card.attack}</span>
              </div>
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <Shield className="w-3 h-3 text-blue-400" />
                <span className="text-white/90 font-medium">{card.defense}</span>
              </div>
              <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
                <Target className="w-3 h-3 text-purple-400" />
                <span className="text-white/90 font-medium">{card.critical}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex gap-1.5">
                <button
                  onClick={onUnequip}
                  className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-200 hover:from-red-500/40 hover:to-red-600/40 hover:scale-105 flex items-center justify-center gap-1 backdrop-blur-sm"
                >
                  <UserX className="w-3 h-3" />
                  Unequip
                </button>
                
                {onMerge && (
                  <button
                    onClick={onMerge}
                    className="px-2 py-1.5 bg-gradient-to-r from-purple-500/30 to-purple-600/30 text-purple-200 rounded text-xs font-medium hover:from-purple-500/40 hover:to-purple-600/40 hover:scale-105 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                  >
                    <Merge className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative transition-all duration-300 ${
        isBattle ? "hover:scale-110" : "hover:scale-105"
      } ${
        isEquipped ? "ring-2 ring-gray-300 shadow-lg shadow-gray-300/50" : ""
      } ${className} rounded-lg p-2 border ${
        MAIN_SCREEN_RARITY_STYLES[card.rarity].border
      } ${
        // Add transparent colored background based on rarity
        card.rarity === 'common' ? 'bg-gradient-to-br from-gray-500/20 to-gray-600/10' :
        card.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10' :
        card.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10' :
        card.rarity === 'legendary' ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10' :
        'bg-gradient-to-br from-white/10 to-white/5'
      } backdrop-blur-sm ${
        MAIN_SCREEN_RARITY_STYLES[card.rarity].glow
      }`}
    >
      {/* Card Image - Blurred background effect */}
      <div className={`relative mb-3 rounded-lg overflow-hidden ${
        isCompact ? "w-full h-28" : "w-full h-36"
      }`}>
        {/* Blurred background layer */}
        <div className="absolute inset-0">
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-contain blur-sm scale-110"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=200&width=150"
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        {/* Sharp foreground image */}
        <Image
          src={card.image}
          alt={card.name}
          fill
          className="object-contain relative z-10"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=200&width=150"
          }}
        />
        
        {/* Element icon - Top left corner with circular background */}
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center z-20">
          {getTypeIcon("sm")}
        </div>
        
        {/* Rarity indicator - bottom right with matching colors */}
        <div className="absolute bottom-2 right-2 z-20">
          <div className={`text-xs px-1 py-0.5 rounded ${MAIN_SCREEN_RARITY_STYLES[card.rarity].bg} ${MAIN_SCREEN_RARITY_STYLES[card.rarity].text} font-bold`}>
            {card.rarity.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Equipped silver inner glow effect */}
        {isEquipped && showEquippedBadge && (
          <div className="absolute inset-0 rounded-lg ring-1 ring-gray-300/60 shadow-inner shadow-gray-300/30 z-15" />
        )}

        {/* Rarity Glow Effect */}
        <div 
          className={`absolute inset-0 rounded-lg opacity-20 ${
            MAIN_SCREEN_RARITY_STYLES[card.rarity].bg
          }`}
        />
      </div>

      {/* Card Info */}
      <div className="space-y-2">
        <div>
          <h4 className={`font-semibold text-white ${
            isCompact ? "text-xs" : "text-sm"
          } truncate text-center uppercase`}>
            {card.name}
          </h4>
          <div className="text-xs text-white/60 text-center">#{card.id}</div>
          
          {/* Merge Progress Bar replacing rarity and type */}
          <div className="mt-2 space-y-1">
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(mergeLevel / maxMergeLevel) * 100}%` }}
              />
            </div>
            <div className="text-xs text-white/60 text-center">
              {mergeLevel}/{maxMergeLevel}
            </div>
          </div>
        </div>

        {/* Stats - Better arranged layout */}
        {isCompact ? (
          // Compact stats - 2x2 grid with backgrounds
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
              <span>❤️</span>
              <span className="text-white/90 font-medium">{card.hp}</span>
            </div>
            <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
              <span>⚔️</span>
              <span className="text-white/90 font-medium">{card.attack}</span>
            </div>
            <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
              <span>🛡️</span>
              <span className="text-white/90 font-medium">{card.defense}</span>
            </div>
            <div className="flex items-center justify-between bg-black/20 rounded px-2 py-1">
              <span>🎯</span>
              <span className="text-white/90 font-medium">{card.critical}</span>
            </div>
          </div>
        ) : (
          // Full stats - Better arranged 2x2 grid with backgrounds
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
              <Heart className="w-3 h-3 text-red-400" />
              <span className="text-white/90 font-medium">{card.hp}</span>
            </div>
            <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
              <Sword className="w-3 h-3 text-orange-400" />
              <span className="text-white/90 font-medium">{card.attack}</span>
            </div>
            <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-white/90 font-medium">{card.defense}</span>
            </div>
            <div className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2">
              <Target className="w-3 h-3 text-purple-400" />
              <span className="text-white/90 font-medium">{card.critical}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className={`${isCompact ? "mt-2 px-0" : "mt-3 px-0"}`}>
          <div className="flex gap-2 w-full">
            <button
              onClick={handleEquipToggle}
              className={`flex-1 ${isCompact ? "px-2 py-1.5" : "px-3 py-2"} rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                isEquipped
                  ? 'bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-200 hover:from-red-500/40 hover:to-red-600/40'
                  : 'bg-gradient-to-r from-blue-500/30 to-blue-600/30 text-blue-200 hover:from-blue-500/40 hover:to-blue-600/40'
              }`}
            >
              {isEquipped ? 'Unequip' : 'Equip'}
            </button>
            
            {isEquipped && onMerge && (
              <button
                onClick={onMerge}
                className={`${isCompact ? "px-2 py-1.5" : "px-3 py-2"} bg-gradient-to-r from-purple-500/30 to-purple-600/30 text-purple-200 rounded-lg text-xs font-medium hover:from-purple-500/40 hover:to-purple-600/40 hover:scale-105 transition-all duration-200 flex items-center gap-1 backdrop-blur-sm`}
              >
                {isCompact ? (
                  <Merge className="w-3 h-3" />
                ) : (
                  <>
                    <Merge className="w-3 h-3" />
                    Merge
                  </>
                )}
              </button>
            )}
            
            {!isEquipped && onSummon && (
              <button
                onClick={onSummon}
                className={`${isCompact ? "px-3 py-1.5" : "px-4 py-2"} rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r from-red-600/40 to-orange-600/40 text-orange-200 hover:from-red-600/50 hover:to-orange-600/50 backdrop-blur-sm flex items-center gap-1`}
              >
                <Flame className="w-3 h-3" />
                Burn
              </button>
            )}
          </div>
        </div>
      )}

      {/* Battle Mode - No actions, just hover effects */}
      {isBattle && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs px-2 py-1 rounded-full font-bold shadow-lg">
          ⚔️
        </div>
      )}
    </div>
  )
}
