"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import type { PokemonCard } from "@/types/card"
import Image from "next/image"
import { MonsterCard } from "@/components/card-component"

interface GameCanvasProps {
  equippedMonsters: PokemonCard[]
}

interface MonsterPosition {
  id: number
  x: number
  y: number
  card: PokemonCard
}

export function GameCanvas({ equippedMonsters }: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [monsterPositions, setMonsterPositions] = useState<MonsterPosition[]>([])

  // Update monster positions when equipped monsters change
  useEffect(() => {
    // Filter out any undefined/null monsters
    const validMonsters = equippedMonsters.filter(monster => monster && monster.id)
    
    const newPositions = validMonsters.map((monster, index) => {
      const existingPosition = monsterPositions.find(pos => pos.id === monster.id)
      if (existingPosition) {
        return existingPosition
      }
      
      // Generate predetermined positions for equipped monsters (max 3)
      const basePositions = [
        { x: 300, y: 300 }, // Left position
        { x: 600, y: 250 }, // Center position  
        { x: 900, y: 350 }, // Right position
      ]
      
      const position = basePositions[index] || basePositions[0]
      // Add some randomness to avoid perfect alignment
      const x = position.x + (Math.random() - 0.5) * 100
      const y = position.y + (Math.random() - 0.5) * 100
      
      return {
        id: monster.id,
        x: Math.max(100, Math.min(x, 1800)), // Keep within bounds
        y: Math.max(200, Math.min(y, 900)),  // Keep within bounds
        card: monster
      }
    })
    
    setMonsterPositions(newPositions)
  }, [equippedMonsters])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/game-background.webp"
          alt="Game Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Scrollable Monster Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full overflow-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="relative w-[2000px] h-[1200px] min-w-full min-h-full">
          {/* Equipped Monsters */}
          {monsterPositions.map((position) => (
            <div
              key={position.id}
              className="absolute transform transition-transform duration-200 z-10"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            >
              <div className="w-32 md:w-40">
                <MonsterCard
                  card={position.card}
                  isEquipped={true}
                  variant="battle"
                  showActions={false}
                  className="shadow-2xl"
                />
              </div>
            </div>
          ))}

          {/* Empty State Message */}
          {equippedMonsters.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="glass-panel rounded-2xl p-8 backdrop-blur-md bg-white/10 border border-white/20 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">No Monsters Equipped</h3>
                <p className="text-white/70 mb-6">
                  Open your inventory and equip some monsters to see them in the battlefield!
                </p>
                <div className="text-4xl mb-4">⚔️</div>
                <p className="text-white/50 text-sm">
                  Equip up to 3 monsters at once
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 