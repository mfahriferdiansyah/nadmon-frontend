import type { PokemonCard } from "@/types/card"

export function generateRandomCards(availableCards: PokemonCard[], count = 5): PokemonCard[] {
  const newCards: PokemonCard[] = []

  for (let i = 0; i < count; i++) {
    const rand = Math.random()
    let rarity: "common" | "rare" | "epic" | "legendary"

    if (rand < 0.5) rarity = "common"
    else if (rand < 0.8) rarity = "rare"
    else if (rand < 0.95) rarity = "epic"
    else rarity = "legendary"

    const availableCardsOfRarity = availableCards.filter((card) => card.rarity === rarity)
    const randomCard = availableCardsOfRarity[Math.floor(Math.random() * availableCardsOfRarity.length)]
    if (randomCard) {
      newCards.push(randomCard)
    }
  }

  return newCards
}

export function openPack(cardData: PokemonCard[]): PokemonCard[] {
  // This function can be customized to accept specific card arrays
  // For now, it returns the provided cards or generates random ones
  if (cardData && cardData.length > 0) {
    return cardData.slice(0, 5) // Take first 5 cards
  }

  // Fallback to empty array if no cards provided
  return []
}
