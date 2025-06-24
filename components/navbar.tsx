"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Swords, Trophy, Coins } from "lucide-react"

type ActiveSection = "shop" | "inventory" | "battleground"

interface NavbarProps {
  activeSection: ActiveSection
  onSectionChange: (section: ActiveSection) => void
}

export function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const navItems = [
    { id: "shop" as const, label: "SHOP", icon: ShoppingCart },
    { id: "inventory" as const, label: "INVENTORY", icon: Package },
    { id: "battleground" as const, label: "BATTLEGROUND", icon: Swords },
  ]

  return (
    <div className="bg-gray-900 border-b border-gray-700 p-2 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-xl font-black text-white tracking-wider">NADMON</div>
          <div className="text-xs text-gray-400 font-semibold">CARD GAME</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`px-3 py-2 font-bold text-xs transition-all duration-300 ${
                  isActive
                    ? "bg-gray-700 text-white border border-gray-600"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800 border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {item.label}
              </Button>
            )
          })}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-800 border border-gray-600 px-2 py-1">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-white text-xs font-bold">1,250</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-800 border border-gray-600 px-2 py-1">
            <Coins className="w-3 h-3 text-yellow-400" />
            <span className="text-white text-xs font-bold">5,000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
