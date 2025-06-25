import type { PokemonCard } from "@/types/card"

export const MOCK_CARDS: PokemonCard[] = [
  {
    id: 1,
    name: "Pikachu",
    type: "Neutral",
    rarity: "rare",
    image: "/placeholder.svg?height=200&width=150",
    hp: 60,
    attack: 55,
    defense: 40,
    speed: 90,
    critical: 15,
    color: "#D1D5DB", // Neutral gray
  },
  {
    id: 3,
    name: "Blastoise",
    type: "Water",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=150",
    hp: 100,
    attack: 85,
    defense: 100,
    speed: 78,
    critical: 20,
    color: "#BFDBFE", // Water blue
  },
  {
    id: 4,
    name: "Venusaur",
    type: "Grass",
    rarity: "epic",
    image: "/placeholder.svg?height=200&width=150",
    hp: 100,
    attack: 82,
    defense: 83,
    speed: 80,
    critical: 18,
    color: "#BBF7D0", // Grass green
  },
  {
    id: 5,
    name: "Squirtle",
    type: "Water",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=150",
    hp: 40,
    attack: 35,
    defense: 65,
    speed: 43,
    critical: 8,
    color: "#BFDBFE", // Water blue
  },
  {
    id: 6,
    name: "Charmander",
    type: "Fire",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=150",
    hp: 39,
    attack: 40,
    defense: 43,
    speed: 65,
    critical: 10,
    color: "#FED7AA", // Fire orange
  },
  {
    id: 7,
    name: "Bulbasaur",
    type: "Grass",
    rarity: "common",
    image: "/placeholder.svg?height=200&width=150",
    hp: 45,
    attack: 38,
    defense: 49,
    speed: 45,
    critical: 7,
    color: "#BBF7D0", // Grass green
  },
  {
    id: 8,
    name: "Mewtwo",
    type: "Neutral",
    rarity: "legendary",
    image: "/placeholder.svg?height=200&width=150",
    hp: 130,
    attack: 110,
    defense: 90,
    speed: 130,
    critical: 30,
    color: "#D1D5DB", // Neutral gray
  },
]

export const RARITY_STYLES = {
  common: {
    bg: "bg-gray-500",
    border: "border-gray-300",
    shadow: "shadow-lg shadow-gray-400/30",
    text: "text-gray-100",
  },
  rare: {
    bg: "bg-blue-600",
    border: "border-blue-300",
    shadow: "shadow-lg shadow-blue-400/30",
    text: "text-blue-100",
  },
  epic: {
    bg: "bg-purple-600",
    border: "border-purple-300",
    shadow: "shadow-lg shadow-purple-400/30",
    text: "text-purple-100",
  },
  legendary: {
    bg: "bg-yellow-500",
    border: "border-yellow-300",
    shadow: "shadow-lg shadow-yellow-400/30",
    text: "text-yellow-900",
  },
} as const

// Element color themes with patterns - Only 4 types now
export const ELEMENT_THEMES = {
  Fire: {
    primary: "#FED7AA",
    secondary: "#FB923C",
    accent: "#EA580C",
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(234, 88, 12, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)",
  },
  Water: {
    primary: "#BFDBFE",
    secondary: "#60A5FA",
    accent: "#2563EB",
    pattern:
      "linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, transparent 50%), linear-gradient(45deg, rgba(37, 99, 235, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(96, 165, 250, 0.2) 0%, transparent 50%)",
  },
  Grass: {
    primary: "#BBF7D0",
    secondary: "#4ADE80",
    accent: "#16A34A",
    pattern:
      "linear-gradient(60deg, rgba(74, 222, 128, 0.2) 0%, transparent 50%), linear-gradient(-60deg, rgba(22, 163, 74, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(74, 222, 128, 0.15) 0%, transparent 50%)",
  },
  Neutral: {
    primary: "#D1D5DB",
    secondary: "#9CA3AF",
    accent: "#6B7280",
    pattern:
      "linear-gradient(45deg, rgba(156, 163, 175, 0.1) 0%, transparent 50%), linear-gradient(-45deg, rgba(107, 114, 128, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(156, 163, 175, 0.15) 0%, transparent 50%)",
  },
} as const
