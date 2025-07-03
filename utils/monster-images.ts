// Monster image mapping for exact file paths
export const MONSTER_IMAGES = {
  // Evolution 1 forms
  'brindle-i': '/monster/brindle-i.png',
  'cervus-i': '/monster/cervus-i.png',
  'fin-i': '/monster/fin-i.png',
  'kitsune-i': '/monster/kitsune-i.png',
  'medusa-i': '/monster/medusa-i.png',
  'selkie-i': '/monster/selkie-i.png',
  'sunny-i': '/monster/sunny-i.png',
  'urchin-i': '/monster/urchin-i.png',

  // Evolution 2 forms
  'brindle-ii': '/monster/brindle-ii.png',
  'cervus-ii': '/monster/cervus-ii.png',
  'fin-ii': '/monster/fin-ii.png',
  'kitsune-ii': '/monster/kitsune-ii.png',
  'medusa-ii': '/monster/medusa-ii.png',
  'selkie-ii': '/monster/selkie-ii.png',
  'sunny-ii': '/monster/sunny-ii.png',
  'urchin-ii': '/monster/urchin-ii.png',
} as const

export type MonsterImageKey = keyof typeof MONSTER_IMAGES

// Map blockchain NFT names to image keys
export function getMonsterImagePath(nadmonType: string, evolution: number = 1): string {
  // Convert blockchain nadmon type to image key
  const baseType = nadmonType.toLowerCase().replace(/\s+/g, '-')
  const evolutionSuffix = evolution === 2 ? '-ii' : '-i'
  const imageKey = `${baseType}${evolutionSuffix}` as MonsterImageKey

  // Return the exact image path or fallback
  return MONSTER_IMAGES[imageKey] || '/placeholder-logo.png'
}

// Get all available monster types
export function getAvailableMonsterTypes(): string[] {
  return Object.keys(MONSTER_IMAGES)
    .filter(key => key.endsWith('-i'))
    .map(key => key.replace('-i', ''))
}

// Check if a monster has evolution forms
export function hasEvolutionForm(monsterType: string): boolean {
  const baseType = monsterType.toLowerCase().replace(/\s+/g, '-')
  const evolutionKey = `${baseType}-ii` as MonsterImageKey
  return evolutionKey in MONSTER_IMAGES
}

// Get random monster image for placeholders
export function getRandomMonsterImage(): string {
  const imageKeys = Object.keys(MONSTER_IMAGES) as MonsterImageKey[]
  const randomKey = imageKeys[Math.floor(Math.random() * imageKeys.length)]
  return MONSTER_IMAGES[randomKey]
}

// Preload all monster images for better performance
export function preloadMonsterImages(): Promise<void[]> {
  const imagePromises = Object.values(MONSTER_IMAGES).map(imagePath => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`))
      img.src = imagePath
    })
  })

  return Promise.all(imagePromises)
} 