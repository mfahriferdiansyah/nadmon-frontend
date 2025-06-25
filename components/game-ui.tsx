"use client"

import type React from "react"
import { Package, Sword, ShoppingBag, Swords, BarChart3 } from "lucide-react"

interface GameUIProps {
  onOpenInventory: () => void
  onOpenShop: () => void
  onOpenBattleground: () => void
  equippedCardsCount: number
  collectionCount: number
}

export function GameUI({
  onOpenInventory,
  onOpenShop,
  onOpenBattleground,
  equippedCardsCount,
  collectionCount,
}: GameUIProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Top Stats Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
          <div className="glass-panel px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">{collectionCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4" />
                <span className="text-sm font-medium">{equippedCardsCount}/3</span>
              </div>
            </div>
          </div>

          {/* Game Title */}
          <div className="glass-panel px-6 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <h1 className="text-white text-xl font-bold">Monster Gacha</h1>
          </div>

          {/* Placeholder for balance */}
          <div className="w-32" />
        </div>

        {/* Side Menu - Simple like mobile */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
          {/* Inventory Button */}
          <button
            onClick={onOpenInventory}
            className="simple-menu-button group relative"
          >
            <Package className="w-5 h-5 text-white" />
            {collectionCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {collectionCount > 9 ? '9+' : collectionCount}
              </div>
            )}
            <span className="tooltip">Inventory</span>
          </button>

          {/* Shop Button */}
          <button
            onClick={onOpenShop}
            className="simple-menu-button group relative"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="tooltip">Shop</span>
          </button>

          {/* Battleground Button */}
          <button
            onClick={onOpenBattleground}
            className="simple-menu-button group relative"
          >
            <Swords className="w-5 h-5 text-white" />
            {equippedCardsCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {equippedCardsCount}
              </div>
            )}
            <span className="tooltip">Battle</span>
          </button>
        </div>
      </div>

      {/* Mobile Layout - Only one navigation */}
      <div className="md:hidden">
        {/* Mobile Top Bar */}
        <div className="absolute top-4 left-4 right-4 pointer-events-auto">
          <div className="glass-panel px-4 py-3 rounded-xl backdrop-blur-md bg-white/10 border border-white/20">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-lg font-bold">Monster Gacha</h1>
              <div className="flex items-center gap-3 text-white text-sm">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{collectionCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sword className="w-4 h-4" />
                  <span>{equippedCardsCount}/3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <div className="glass-panel rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-3">
            <div className="flex justify-around items-center">
              <button
                onClick={onOpenInventory}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors relative min-w-0"
              >
                <Package className="w-6 h-6 text-white" />
                <span className="text-white text-xs">Inventory</span>
                {collectionCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {collectionCount > 9 ? '9+' : collectionCount}
                  </div>
                )}
              </button>

              <button
                onClick={onOpenShop}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors min-w-0"
              >
                <ShoppingBag className="w-6 h-6 text-white" />
                <span className="text-white text-xs">Shop</span>
              </button>

              <button
                onClick={onOpenBattleground}
                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/10 transition-colors relative min-w-0"
              >
                <Swords className="w-6 h-6 text-white" />
                <span className="text-white text-xs">Battle</span>
                {equippedCardsCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {equippedCardsCount}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .simple-menu-button {
          @apply w-12 h-12 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 
                 flex items-center justify-center hover:bg-white/20 transition-all duration-200
                 shadow-lg;
        }

        .glass-panel {
          @apply backdrop-blur-md bg-white/10 border border-white/20 shadow-lg;
        }

        .tooltip {
          @apply absolute right-full mr-3 px-2 py-1 bg-black/80 text-white text-xs rounded-md
                 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none;
        }
      `}</style>
    </div>
  )
} 