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
        <div className="space-y-3">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Collect, evolve, and battle with powerful digital creatures. Build your ultimate team!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Quick Start Guide",
      subtitle: "Get Started in 3 Simple Steps",
      content: (
        <div className="space-y-2">
          <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-300 font-bold text-xs">1</span>
              </div>
              <h4 className="text-green-300 font-semibold text-xs">Connect Wallet</h4>
            </div>
            <ul className="text-green-200/90 text-xs space-y-0.5 ml-2">
              <li>• Use MetaMask or compatible wallet</li>
              <li>• Switch to Monad Testnet</li>
            </ul>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-300 font-bold text-xs">2</span>
              </div>
              <h4 className="text-purple-300 font-semibold text-xs">Buy Monster Pack</h4>
            </div>
            <ul className="text-purple-200/90 text-xs space-y-0.5 ml-2">
              <li>• Visit Shop → Select pack</li>
              <li>• Pay with MON or COOKIES</li>
              <li>• Get 5 random monsters</li>
            </ul>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-300 font-bold text-xs">3</span>
              </div>
              <h4 className="text-blue-300 font-semibold text-xs">Build Team</h4>
            </div>
            <ul className="text-blue-200/90 text-xs space-y-0.5 ml-2">
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
        <div className="space-y-3">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 text-xs leading-relaxed mb-3">
              Connect your wallet to start collecting monsters and saving progress on blockchain.
            </p>
          </div>

          <div className="flex justify-center">
            <WalletHandle />
          </div>

          {isConnected && !isOnCorrectChain && (
            <div className="text-center p-2 rounded bg-red-500/10 border border-red-500/30">
              <p className="text-red-300 text-xs">
                Please switch to Monad Testnet to continue
              </p>
            </div>
          )}

          {canEnterGame && (
            <div className="text-center p-2 rounded bg-green-500/10 border border-green-500/30">
              <p className="text-green-300 text-xs flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" />
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
      
      {/* Desktop Layout */}
      <div className="hidden md:block relative w-full max-w-2xl h-[500px] my-4 glass-panel rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
              <Gamepad2 className="w-3 h-3 text-blue-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{currentStepData.title}</h2>
              <p className="text-blue-300/80 text-xs">{currentStepData.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Compact Progress Indicator */}
        <div className="px-3 py-2 border-b border-white/10">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <div className="text-center mt-1">
            <span className="text-white/60 text-xs">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        {/* Compact Content - Fixed Height */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="h-full flex items-center justify-center">
            <div className="w-full">
              {currentStepData.content}
            </div>
          </div>
        </div>

        {/* Compact Actions */}
        <div className="p-3 bg-white/5 border-t border-white/20">
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

      {/* Mobile Layout - Bottom Sheet */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Mobile Popup Container */}
        <div className="relative w-full max-w-sm h-[480px] glass-panel rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                <Gamepad2 className="w-2.5 h-2.5 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white">{currentStepData.title}</h2>
                <p className="text-blue-300/80 text-xs">{currentStepData.subtitle}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Progress */}
          <div className="px-3 py-2 border-b border-white/10">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <div className="text-center mt-1">
              <span className="text-white/60 text-xs">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Mobile Content - Centered */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="h-full flex items-center justify-center">
              <div className="w-full">
                {currentStepData.content}
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="p-3 bg-white/5 border-t border-white/20">
            <div className="flex gap-2 mb-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border border-blue-500 hover:border-blue-400 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-1"
                >
                  Next
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={onEnterGame}
                  disabled={!canEnterGame}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1 ${
                    canEnterGame
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 border border-green-500 hover:border-green-400 shadow-lg hover:shadow-green-500/25'
                      : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                  }`}
                >
                  <Gamepad2 className="w-3 h-3" />
                  {canEnterGame ? 'Enter Game' : 'Connect Wallet'}
                </button>
              )}
            </div>
            
            {/* Mobile Skip */}
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