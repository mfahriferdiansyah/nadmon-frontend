"use client"

import React, { useState } from "react"
import { Gamepad2, Wallet, ArrowRight, Zap, Shield, Sword, Crown, Package, Users, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { WalletHandle } from "@/components/wallet-handle"
import { useAccount, useChainId } from "wagmi"
import { monadTestnet } from "@/lib/web3-config"

interface GameLandingPopupProps {
  isOpen: boolean
  onEnterGame: () => void
  onClose?: () => void
}

export function GameLandingPopup({
  isOpen,
  onEnterGame,
  onClose,
}: GameLandingPopupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const isOnCorrectChain = chainId === monadTestnet.id

  const canEnterGame = isConnected && isOnCorrectChain

  if (!isOpen) return null


  const steps = [
    {
      title: "Welcome to NADMON",
      subtitle: "The Ultimate Monster Collection Game",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              Enter a world where you collect, evolve, and battle with powerful digital creatures. 
              Build your ultimate team and embark on epic adventures!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Quick Start Guide",
      subtitle: "Get Started in 3 Simple Steps",
      content: (
        <div className="space-y-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-300 font-bold text-sm">1</span>
              </div>
              <h4 className="text-green-300 font-semibold text-sm">Connect Wallet</h4>
            </div>
            <ul className="text-green-200/90 text-xs space-y-1 ml-8">
              <li>• Use MetaMask or compatible wallet</li>
              <li>• Switch to Monad Testnet</li>
            </ul>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-300 font-bold text-sm">2</span>
              </div>
              <h4 className="text-purple-300 font-semibold text-sm">Buy Monster Pack</h4>
            </div>
            <ul className="text-purple-200/90 text-xs space-y-1 ml-8">
              <li>• Visit Shop → Select pack</li>
              <li>• Pay with MON or COOKIES</li>
              <li>• Get 5 random monsters</li>
            </ul>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-300 font-bold text-sm">3</span>
              </div>
              <h4 className="text-blue-300 font-semibold text-sm">Build Team</h4>
            </div>
            <ul className="text-blue-200/90 text-xs space-y-1 ml-8">
              <li>• Open Inventory</li>
              <li>• Equip up to 3 monsters</li>
              <li>• Use fusion to evolve</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Connect Your Wallet",
      subtitle: "Join the NADMON Universe",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Connect your wallet to start collecting monsters, making purchases, and saving your progress on the blockchain.
            </p>
          </div>

          <div className="flex justify-center">
            <WalletHandle className="scale-110" />
          </div>


          {isConnected && !isOnCorrectChain && (
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-300 text-xs">
                Please switch to Monad Testnet to continue
              </p>
            </div>
          )}

          {canEnterGame && (
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-300 text-xs flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Wallet connected! Ready to enter the game
              </p>
            </div>
          )}
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      {/* Popup */}
      <div className="relative w-full max-w-lg glass-panel rounded-2xl backdrop-blur-lg bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentStepData.title}</h2>
              <p className="text-blue-300/80 text-sm">{currentStepData.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-white/60 text-xs">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Actions */}
        <div className="p-6 pt-0">
          <div className="flex gap-3 mb-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border border-blue-500 hover:border-blue-400 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onEnterGame}
                disabled={!canEnterGame}
                className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  canEnterGame
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 border border-green-500 hover:border-green-400 shadow-lg hover:shadow-green-500/25'
                    : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                {canEnterGame ? 'Enter Game' : 'Connect Wallet First'}
              </button>
            )}
          </div>
          
          {/* Skip text below buttons */}
          <div className="text-center">
            <button
              onClick={onEnterGame}
              className="text-xs text-white/50 hover:text-white/80 transition-colors underline decoration-dotted underline-offset-2 hover:decoration-solid"
            >
              Skip intro and enter game
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(15px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}