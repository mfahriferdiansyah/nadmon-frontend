"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Package } from "lucide-react"
import type { PackOpeningAnimationProps } from "@/types/card"

export function PackOpeningAnimation({ isOpening, onComplete, packPosition, packType }: PackOpeningAnimationProps) {
  const [animationStage, setAnimationStage] = useState<"idle" | "shaking" | "ripping" | "pulling-cards" | "complete">(
    "idle",
  )

  // Default to fire pack colors if no packType provided
  const colors = packType?.colors || {
    primary: "from-orange-500 via-red-500 to-orange-600",
    secondary: "border-orange-300",
    tertiary: "shadow-orange-500/50",
    border: "border-yellow-300",
  }

  const packName = packType?.name || "BOOSTER PACK"

  useEffect(() => {
    if (isOpening) {
      setAnimationStage("shaking")

      setTimeout(() => {
        setAnimationStage("ripping")
      }, 500)

      setTimeout(() => {
        setAnimationStage("pulling-cards")
      }, 900)

      setTimeout(() => {
        setAnimationStage("complete")
        onComplete()
      }, 2100)
    } else {
      setAnimationStage("idle")
    }
  }, [isOpening, onComplete])

  if (!isOpening) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className="absolute z-[300]"
        style={{
          left: packPosition.x,
          top: packPosition.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Main Pack (visible during shaking) */}
        {animationStage === "shaking" && (
          <div className="w-40 h-52 md:w-48 md:h-64 animate-pack-shake">
            <Card
              className={`w-full h-full bg-gradient-to-br ${colors.primary} border-4 ${colors.secondary} shadow-2xl`}
            >
              <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center h-full text-white">
                <Package className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
                <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">NADMON</h2>
                <p className="text-sm opacity-90 text-center mb-2 md:mb-4">{packName}</p>
                <div className="text-xs opacity-75">5 CARDS INSIDE</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pack with small top ripped off */}
        {(animationStage === "ripping" || animationStage === "pulling-cards") && (
          <>
            <div className="absolute w-40 h-12 md:w-48 md:h-16 animate-pack-top-rip z-[310]">
              <div
                className={`w-full h-full bg-gradient-to-br ${colors.primary} border-4 ${colors.secondary} rounded-t-lg shadow-xl`}
              >
                <div className="p-1 md:p-2 flex items-center justify-center h-full text-white">
                  <div className="text-xs font-bold">NADMON</div>
                </div>
              </div>
            </div>

            <div className="w-40 h-52 md:w-48 md:h-64 z-[305]">
              <Card
                className={`w-full h-full bg-gradient-to-br ${colors.primary} border-4 ${colors.secondary} shadow-2xl relative overflow-hidden`}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-3 bg-slate-900"
                  style={{ borderRadius: "0 0 8px 8px" }}
                />
                <CardContent className="p-4 md:p-6 flex flex-col items-center justify-center h-full text-white pt-6 md:pt-8">
                  <Package className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
                  <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">NADMON</h2>
                  <p className="text-sm opacity-90 text-center mb-2 md:mb-4">{packName}</p>
                  <div className="text-xs opacity-75">5 CARDS INSIDE</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Cards being pulled out vertically */}
        {animationStage === "pulling-cards" && (
          <div className="absolute inset-0 z-[290]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-32 h-44 md:w-40 md:h-56 animate-card-pull-vertical"
                style={{
                  animationDelay: `${i * 150}ms`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-64px",
                  marginTop: "-88px",
                }}
              >
                <Card className="w-full h-full bg-indigo-600 border-2 border-indigo-300 shadow-2xl">
                  <CardContent className="p-2 md:p-4 flex flex-col items-center justify-center h-full text-white">
                    <Package className="w-8 h-8 md:w-12 md:h-12 mb-1 md:mb-2" />
                    <div className="text-xs md:text-sm font-bold text-center">NADMON</div>
                    <div className="text-xs opacity-80">CARD</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Sparkle Effects */}
        {(animationStage === "ripping" || animationStage === "pulling-cards") && (
          <div className="absolute inset-0 pointer-events-none z-[295]">
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute w-4 h-4 text-yellow-400 animate-sparkle"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 1000}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
