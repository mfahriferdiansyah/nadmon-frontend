// Simple test to verify FusionPopup component
import { FusionPopup } from './components/fusion-popup'
import type { PokemonCard } from './types/card'

const testCard: PokemonCard = {
  id: 1,
  name: "Test Monster",
  type: "fire",
  rarity: "common",
  image: "/test.png",
  hp: 100,
  attack: 50,
  defense: 30,
  speed: 40,
  critical: 10,
  color: "#ff0000",
  fusion: 3
}

// This should not throw any errors
const Test = () => (
  <FusionPopup
    targetCard={testCard}
    collection={[testCard]}
    onClose={() => {}}
    onFusion={() => {}}
  />
)

export default Test