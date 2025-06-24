export interface PackType {
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

export const PACK_TYPES: PackType[] = [
  {
    id: "fire",
    name: "FIRE PACK",
    colors: {
      primary: "from-orange-500 via-red-500 to-orange-600",
      secondary: "border-orange-300",
      tertiary: "shadow-orange-500/50",
      border: "border-yellow-300",
    },
    description: "Blazing power awaits",
  },
  {
    id: "water",
    name: "WATER PACK",
    colors: {
      primary: "from-blue-500 via-cyan-500 to-blue-600",
      secondary: "border-blue-300",
      tertiary: "shadow-blue-500/50",
      border: "border-cyan-300",
    },
    description: "Depths of mystery",
  },
  {
    id: "nature",
    name: "NATURE PACK",
    colors: {
      primary: "from-green-500 via-emerald-500 to-green-600",
      secondary: "border-green-300",
      tertiary: "shadow-green-500/50",
      border: "border-lime-300",
    },
    description: "Natural forces unleashed",
  },
]
