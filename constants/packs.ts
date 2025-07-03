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
  elementFocus?: string
  locked?: boolean
  price: {
    mon: number
    cookies: number
  }
}

export const PACK_TYPES: PackType[] = [
  {
    id: "trial",
    name: "TRIAL PACK",
    colors: {
      primary: "from-purple-500 via-violet-500 to-purple-600",
      secondary: "border-purple-300",
      tertiary: "shadow-purple-500/50",
      border: "border-violet-300",
    },
    description: "Start your journey",
    elementFocus: "No Element Focus",
    locked: false,
    price: {
      mon: 0.01,
      cookies: 100
    }
  },
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
    elementFocus: "Fire Element Focus",
    locked: true,
    price: {
      mon: 0.02,
      cookies: 200
    }
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
    elementFocus: "Water Element Focus",
    locked: true,
    price: {
      mon: 0.02,
      cookies: 200
    }
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
    elementFocus: "Nature Element Focus",
    locked: true,
    price: {
      mon: 0.02,
      cookies: 200
    }
  },
]
