"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Swords, Shield, Target, Play, RotateCcw } from "lucide-react"
import { CardComponent } from "@/components/card-component"
import type { PokemonCard } from "@/types/card"

interface BattlegroundProps {
  equippedCards: PokemonCard[]
}

export function Battleground({ equippedCards }: BattlegroundProps) {
  const [battleState, setBattleState] = useState<"idle" | "battling" | "victory" | "defeat">("idle")
  const [playerHP, setPlayerHP] = useState(100)
  const [enemyHP, setEnemyHP] = useState(100)

  // Mock enemy cards for demonstration
  const enemyCards: PokemonCard[] = [
    {
      id: 101,
      name: "Shadow Warrior",
      type: "Dark",
      rarity: "epic",
      image: "/placeholder.svg?height=200&width=150",
      hp: 85,
      attack: 90,
      defense: 70,
      speed: 95,
      critical: 20,
      color: "#6B7280",
    },
    {
      id: 102,
      name: "Void Dragon",
      type: "Dark",
      rarity: "legendary",
      image: "/placeholder.svg?height=200&width=150",
      hp: 120,
      attack: 110,
      defense: 85,
      speed: 100,
      critical: 25,
      color: "#374151",
    },
    {
      id: 103,
      name: "Night Stalker",
      type: "Dark",
      rarity: "rare",
      image: "/placeholder.svg?height=200&width=150",
      hp: 70,
      attack: 75,
      defense: 60,
      speed: 85,
      critical: 15,
      color: "#4B5563",
    },
  ]

  const startBattle = () => {
    setBattleState("battling")
    setPlayerHP(100)
    setEnemyHP(100)

    // Simulate battle outcome after 3 seconds
    setTimeout(() => {
      const playerPower = equippedCards.reduce((total, card) => total + card.attack + card.hp, 0)
      const enemyPower = enemyCards.reduce((total, card) => total + card.attack + card.hp, 0)

      if (playerPower > enemyPower) {
        setBattleState("victory")
        setEnemyHP(0)
      } else {
        setBattleState("defeat")
        setPlayerHP(0)
      }
    }, 3000)
  }

  const resetBattle = () => {
    setBattleState("idle")
    setPlayerHP(100)
    setEnemyHP(100)
  }

  const getBattleMessage = () => {
    switch (battleState) {
      case "idle":
        return "Ready to battle! Deploy your cards and face the enemy."
      case "battling":
        return "Battle in progress... Cards are clashing!"
      case "victory":
        return "Victory! Your cards have defeated the enemy!"
      case "defeat":
        return "Defeat! The enemy has overcome your cards."
      default:
        return ""
    }
  }

  return (
    <div className="p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-wider">BATTLEGROUND</h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold">
            Deploy your cards and battle against enemies
          </p>
        </div>

        {/* Battle Status */}
        <div className="bg-gray-800 border border-gray-700 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-black text-white tracking-wider">BATTLE STATUS</h2>
            </div>
            <div className="text-sm text-gray-400">{getBattleMessage()}</div>
          </div>

          {/* HP Bars */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-bold">YOUR TEAM</span>
                <span className="text-white text-sm">{playerHP}/100 HP</span>
              </div>
              <div className="w-full bg-gray-700 h-3 border border-gray-600">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${playerHP}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-sm font-bold">ENEMY TEAM</span>
                <span className="text-white text-sm">{enemyHP}/100 HP</span>
              </div>
              <div className="w-full bg-gray-700 h-3 border border-gray-600">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
                  style={{ width: `${enemyHP}%` }}
                />
              </div>
            </div>
          </div>

          {/* Battle Controls */}
          <div className="flex justify-center gap-2">
            {battleState === "idle" && (
              <Button
                onClick={startBattle}
                disabled={equippedCards.length === 0}
                className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 border border-red-600 transition-all duration-300"
              >
                <Play className="w-4 h-4 mr-2" />
                START BATTLE
              </Button>
            )}
            {(battleState === "victory" || battleState === "defeat") && (
              <Button
                onClick={resetBattle}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 border border-gray-500 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                RESET BATTLE
              </Button>
            )}
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-2 gap-4">
          {/* Player Side */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-black text-white tracking-wider">YOUR CARDS</h3>
              <div className="bg-blue-700 border border-blue-600 px-2 py-1">
                <span className="text-white text-xs font-bold">{equippedCards.length}/3</span>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-3">
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative">
                    {equippedCards[index] ? (
                      <div className="relative w-full flex justify-center">
                        <div className="pokemon-card-sm">
                          <CardComponent
                            card={equippedCards[index]}
                            index={0}
                            currentCardIndex={-1}
                            isFlipped={true}
                            isThrown={false}
                            isInFinalRow={true}
                            onCardClick={() => {}}
                            size="sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex justify-center">
                        <div className="pokemon-card-sm border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-800">
                          <div className="text-center text-gray-500">
                            <div className="text-xs font-bold">EMPTY</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {equippedCards.length === 0 && (
                <div className="text-center py-4">
                  <div className="text-gray-400 text-sm mb-2">No cards equipped!</div>
                  <div className="text-gray-500 text-xs">Go to Inventory to equip cards</div>
                </div>
              )}
            </div>
          </div>

          {/* Enemy Side */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-black text-white tracking-wider">ENEMY CARDS</h3>
              <div className="bg-red-700 border border-red-600 px-2 py-1">
                <span className="text-white text-xs font-bold">3/3</span>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-3">
              <div className="grid grid-cols-3 gap-2">
                {enemyCards.map((card, index) => (
                  <div key={index} className="relative">
                    <div className="relative w-full flex justify-center">
                      <div className="pokemon-card-sm">
                        <CardComponent
                          card={card}
                          index={0}
                          currentCardIndex={-1}
                          isFlipped={true}
                          isThrown={false}
                          isInFinalRow={true}
                          onCardClick={() => {}}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-800 border border-gray-600">
            <CardContent className="p-3">
              <div className="text-center">
                <h4 className="text-sm font-black text-blue-400 mb-2">YOUR TEAM POWER</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-700 p-2 border border-gray-600">
                    <div className="text-white font-bold">
                      {equippedCards.reduce((total, card) => total + card.attack, 0)}
                    </div>
                    <div className="text-gray-400">ATK</div>
                  </div>
                  <div className="bg-gray-700 p-2 border border-gray-600">
                    <div className="text-white font-bold">
                      {equippedCards.reduce((total, card) => total + card.defense, 0)}
                    </div>
                    <div className="text-gray-400">DEF</div>
                  </div>
                  <div className="bg-gray-700 p-2 border border-gray-600">
                    <div className="text-white font-bold">
                      {equippedCards.reduce((total, card) => total + card.hp, 0)}
                    </div>
                    <div className="text-gray-400">HP</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-600">
            <CardContent className="p-3">
              <div className="text-center">
                <h4 className="text-sm font-black text-red-400 mb-2">ENEMY TEAM POWER</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-700 p-2 border border-gray-600">
                    <div className="text-white font-bold">
                      {enemyCards.reduce((total, card) => total + card.attack, 0)}
                    </div>
                    <div className="text-gray-400">ATK</div>
                  </div>
                  <div className="bg-gray-700 p-2 border border-gray-600">
                    <div className="text-white font-bold">
                      {enemyCards.reduce((total, card) => total + card.defense, 0)}
                    </div>
                    <div className="text-gray-400">DEF</div>
                  </div>
                  <div className="bg-gray-700 p-2 border border-gray-600">
                    <div className="text-white font-bold">{enemyCards.reduce((total, card) => total + card.hp, 0)}</div>
                    <div className="text-gray-400">HP</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
