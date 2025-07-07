export interface PokemonCard {
  id: number
  name: string
  type: string
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  hp: number
  attack: number
  defense: number
  speed: number
  critical: number
  color: string
  fusion?: number // Fusion level (0-10)
  evo?: number // Evolution level (generation)
}

export interface PackOpeningAnimationProps {
  isOpening: boolean
  onComplete: () => void
  packPosition: { x: number; y: number }
  packType?: {
    id: string
    name: string
    colors: {
      primary: string
      secondary: string
      tertiary: string
      border: string
    }
    description: string
  }
}

export interface CardComponentProps {
  card: PokemonCard
  index: number
  currentCardIndex: number
  isFlipped: boolean
  isThrown: boolean
  isInFinalRow: boolean
  onCardClick: () => void
  onThrowComplete?: () => void
  onFocusComplete?: () => void
  onFlipComplete?: () => void
  autoThrowAfterFlip?: () => void
  isAnimating?: boolean
  isAutoPlaying?: boolean
  isFocusAnimating?: boolean
  isFlipAnimating?: boolean
  isClickCooldown?: boolean
  cards?: PokemonCard[]
}

export interface FocusedCardSessionProps {
  cards: PokemonCard[]
  onComplete: (revealedCards: PokemonCard[]) => void
}
