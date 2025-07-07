"use client"

import React from "react"
import { AlertTriangle, Flame, X } from "lucide-react"
import { PokemonCard } from "@/types/card"
import Image from "next/image"

interface BurnConfirmationDialogProps {
  card: PokemonCard | null
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function BurnConfirmationDialog({
  card,
  isOpen,
  onConfirm,
  onCancel,
}: BurnConfirmationDialogProps) {
  if (!isOpen || !card) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md glass-panel rounded-2xl backdrop-blur-lg bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Burn Monster</h2>
              <p className="text-red-300/80 text-sm">Permanent Action</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Monster Preview */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-red-500/20">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=200&width=150"
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm truncate uppercase">
                {card.name}
              </h3>
              <div className="text-xs text-white/60">#{card.id}</div>
              <div className="text-xs text-red-300 mt-1">
                {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)} • {card.type}
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-yellow-200 font-medium text-sm">
                  🚧 Burn functionality is not yet available
                </p>
                <ul className="text-yellow-300/90 text-xs space-y-1 list-disc list-inside">
                  <li>Burning is not currently supported by the NFT contract</li>
                  <li>This feature will be available in a future update</li>
                  <li>The confirmation dialog is ready for when burning becomes available</li>
                  <li>When implemented, this would permanently destroy the monster</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-white/80 text-sm">
                Are you sure you want to burn <span className="font-semibold text-red-300">{card.name}</span>?
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/30"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 border border-red-500 hover:border-red-400 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4" />
            Burn
          </button>
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}