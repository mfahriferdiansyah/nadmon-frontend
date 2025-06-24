"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import { PACK_TYPES, type PackType } from "@/constants/packs"

interface PackSelectionProps {
  onPackSelect: (packType: PackType, event: React.MouseEvent) => void
  isOpening: boolean
}

export function PackSelection({ onPackSelect, isOpening }: PackSelectionProps) {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Pack Selection Title */}
      <div className="text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-wider">CHOOSE YOUR PACK</h2>
        <p className="text-gray-300 text-sm md:text-base font-semibold">
          Each pack contains different elemental powers
        </p>
      </div>

      {/* Pack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {PACK_TYPES.map((packType) => (
          <div key={packType.id} className="relative">
            {/* Glow Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${packType.colors.primary} rounded-2xl blur-xl opacity-50 animate-pulse`}
            ></div>

            <div className="relative pack-container">
              <div
                className="relative cursor-pointer transition-all duration-500 hover:scale-110 group"
                onClick={!isOpening ? (event) => onPackSelect(packType, event) : undefined}
              >
                <Card
                  className={`w-44 h-60 md:w-52 md:h-68 bg-gradient-to-br ${packType.colors.primary} border-4 ${packType.colors.secondary} shadow-2xl ${packType.colors.tertiary} rounded-2xl overflow-hidden`}
                >
                  <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center h-full text-white relative">
                    {/* Holographic Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <Package className="w-14 h-14 md:w-16 md:h-16 mb-3 drop-shadow-lg" />
                    <h2 className="text-lg md:text-xl font-black mb-2 tracking-wider">NADMON</h2>
                    <p className="text-sm opacity-90 text-center mb-2 font-semibold">{packType.name}</p>
                    <p className="text-xs opacity-75 text-center mb-3">{packType.description}</p>
                    <div className="text-xs opacity-75 bg-black/30 px-2 py-1 rounded-full">5 CARDS INSIDE</div>

                    {/* Corner Decorations */}
                    <div
                      className={`absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 ${packType.colors.border}`}
                    ></div>
                    <div
                      className={`absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 ${packType.colors.border}`}
                    ></div>
                    <div
                      className={`absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 ${packType.colors.border}`}
                    ></div>
                    <div
                      className={`absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 ${packType.colors.border}`}
                    ></div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
