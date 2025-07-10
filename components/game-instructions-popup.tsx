"use client"

import React, { useState } from "react"
import { X, ArrowRight, ArrowLeft, Gamepad2, Package, Sparkles, Users, Crown, Shield, Coins, Lock, AlertTriangle, CheckCircle, Info, Target } from "lucide-react"

interface GameInstructionsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function GameInstructionsPopup({ isOpen, onClose }: GameInstructionsPopupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [activeSection, setActiveSection] = useState('getting-started')

  if (!isOpen) return null

  const sections = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: <Gamepad2 className="w-4 h-4" />,
      description: 'First steps in NADMON'
    },
    {
      id: 'interface',
      name: 'Interface',
      icon: <Package className="w-4 h-4" />,
      description: 'Game menus & navigation'
    },
    {
      id: 'evolution',
      name: 'Evolution',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Fusion & monster growth'
    },
    {
      id: 'economy',
      name: 'Economy',
      icon: <Coins className="w-4 h-4" />,
      description: 'Tokens & currencies'
    },
    {
      id: 'features',
      name: 'Features',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Current & upcoming'
    }
  ]

  const steps = [
    {
      title: "Welcome to NADMON",
      subtitle: "Your Complete Game Guide",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              NADMON is a blockchain-based monster collection and evolution game where you collect, fuse, and battle with unique digital creatures.
            </p>
          </div>
          
          {/* <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              What Makes NADMON Special
            </h4>
            <ul className="text-blue-200/90 text-sm space-y-1 list-disc list-inside">
              <li>NFT-based monsters stored on the blockchain</li>
              <li>Fusion system to evolve and strengthen your creatures</li>
              <li>Real-time battles and expeditions</li>
              <li>Soulbound Tokens (SBT) - your progress stays with you</li>
            </ul>
          </div> */}
        </div>
      )
    },
    {
      title: "Game Interface & Navigation",
      subtitle: "Understanding Your Control Panel",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Package className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-purple-200 text-sm mb-1">Shop</h4>
                <p className="text-purple-300/90 text-xs">Purchase monster packs with MON tokens or COOKIES. Each pack contains 5 random monsters with varying rarities.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <Users className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-green-200 text-sm mb-1">Inventory</h4>
                <p className="text-green-300/90 text-xs">Manage your collection, equip monsters to your active team (max 3), and perform fusion operations.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <Crown className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-orange-200 text-sm mb-1">Battleground</h4>
                <p className="text-orange-300/90 text-xs">Engage in PvE battles and send monsters on expeditions. Currently under development.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Monster Collection & Fusion",
      subtitle: "Building Your Ultimate Team",
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-200 text-sm">Fusion System</h4>
                <p className="text-blue-300/90 text-xs">Sacrifice monsters to strengthen others. Each sacrificed monster adds 1 fusion point to the target.</p>
                <ul className="text-blue-200/80 text-xs space-y-1 list-disc list-inside ml-2">
                  <li>Higher fusion levels increase monster stats</li>
                  <li>Sacrificed monsters are permanently destroyed</li>
                  <li>Strategic fusion creates powerful teams</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Shield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-200 text-sm">Monster Rarities</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-300">Common - Gray</div>
                  <div className="text-green-300">Rare - Green</div>
                  <div className="text-purple-300">Epic - Purple</div>
                  <div className="text-orange-300">Legendary - Orange</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Economy & Tokens",
      subtitle: "Understanding the Game Economy",
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Coins className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-200 text-sm">MON Tokens</h4>
                <p className="text-purple-300/90 text-xs">Primary currency for purchasing premium packs and exclusive content.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <Coins className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold text-orange-200 text-sm">COOKIES</h4>
                <p className="text-orange-300/90 text-xs">Secondary currency earned through gameplay and used for basic purchases.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <Lock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-200 text-sm">Soulbound Tokens (SBT)</h4>
                <p className="text-blue-300/90 text-xs">Your monsters are SBTs - they cannot be traded or transferred, ensuring your progress and collection remain permanently yours.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Current Features & Roadmap",
      subtitle: "What's Available Now",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Currently Available
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-300 text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>Monster pack purchasing with MON/COOKIES</span>
              </div>
              <div className="flex items-center gap-2 text-green-300 text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>Monster collection and inventory management</span>
              </div>
              <div className="flex items-center gap-2 text-green-300 text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>Fusion system for monster evolution</span>
              </div>
              <div className="flex items-center gap-2 text-green-300 text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>Team building (equip up to 3 monsters)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Coming Soon
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-300 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>PvE battles and expeditions</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-300 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Monster burning functionality</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-300 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Advanced battle mechanics</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-300 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Leaderboards and competitive play</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-xs text-center">
              🚀 NADMON is actively in development. New features and improvements are being added regularly!
            </p>
          </div>
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
      
      {/* Desktop Layout - Compact Mobile-Inspired */}
      <div className="hidden md:block relative w-full max-w-3xl my-4 glass-panel rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
              <Info className="w-3 h-3 text-blue-300" />
            </div>
            <h2 className="text-sm font-bold text-white">Game Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Tab Navigation */}
        <div className="border-b border-white/20 bg-white/5">
          <div className="flex flex-wrap">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-all ${
                  activeSection === section.id 
                    ? 'text-white border-b-2 border-blue-400 bg-white/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.icon}
                <span>{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Compact Content */}
        <div className="p-3 max-h-[60vh] overflow-y-auto">
          {/* Getting Started Section */}
          {activeSection === 'getting-started' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white mb-2">Getting Started</h3>
              
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
          )}

          {/* Interface Section */}
          {activeSection === 'interface' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white mb-2">Navigation</h3>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-purple-400" />
                  <h4 className="font-semibold text-purple-200 text-xs">Shop</h4>
                </div>
                <ul className="text-purple-200/90 text-xs space-y-0.5">
                  <li>• Buy monster packs</li>
                  <li>• Use MON tokens or COOKIES</li>
                  <li>• 5 monsters per pack</li>
                </ul>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-green-400" />
                  <h4 className="font-semibold text-green-200 text-xs">Inventory</h4>
                </div>
                <ul className="text-green-200/90 text-xs space-y-0.5">
                  <li>• View all your monsters</li>
                  <li>• Equip/unequip from team</li>
                  <li>• Perform fusion operations</li>
                </ul>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-orange-400" />
                  <h4 className="font-semibold text-orange-200 text-xs">Battle</h4>
                  <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1 py-0.5 rounded">Soon</span>
                </div>
                <ul className="text-orange-200/90 text-xs space-y-0.5">
                  <li>• PvE battles (coming soon)</li>
                  <li>• Monster expeditions</li>
                  <li>• Earn rewards</li>
                </ul>
              </div>
            </div>
          )}

          {/* Evolution Section */}
          {activeSection === 'evolution' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white mb-2">Fusion & Evolution</h3>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h4 className="font-semibold text-blue-200 text-xs">How to Fuse</h4>
                </div>
                <ul className="text-blue-200/90 text-xs space-y-0.5">
                  <li>• Inventory → Select monster → Fusion</li>
                  <li>• Choose sacrifices → Confirm</li>
                  <li>• +1 fusion level per sacrifice</li>
                </ul>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <h4 className="font-semibold text-purple-200 text-xs">Effects</h4>
                </div>
                <ul className="text-purple-200/90 text-xs space-y-0.5">
                  <li>• +10% stats per fusion level</li>
                  <li>• Visual upgrades</li>
                  <li>• Enhanced battle power</li>
                </ul>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <h4 className="font-semibold text-green-200 text-xs">Tips</h4>
                </div>
                <ul className="text-green-200/90 text-xs space-y-0.5">
                  <li>• Evolve best monsters first</li>
                  <li>• Use commons for rare/epic fusion</li>
                  <li>• Sacrificed monsters destroyed</li>
                </ul>
              </div>
            </div>
          )}

          {/* Economy Section */}
          {activeSection === 'economy' && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white mb-2">Tokens & Economy</h3>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-purple-400" />
                  <h4 className="font-semibold text-purple-200 text-xs">MON Tokens</h4>
                </div>
                <ul className="text-purple-200/90 text-xs space-y-0.5">
                  <li>• Premium currency</li>
                  <li>• Buy premium packs</li>
                  <li>• Access exclusive content</li>
                </ul>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-orange-400" />
                  <h4 className="font-semibold text-orange-200 text-xs">COOKIES</h4>
                </div>
                <ul className="text-orange-200/90 text-xs space-y-0.5">
                  <li>• Earned through gameplay</li>
                  <li>• Basic pack purchases</li>
                  <li>• Daily bonuses</li>
                </ul>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <h4 className="font-semibold text-blue-200 text-xs">Soulbound (SBT)</h4>
                </div>
                <ul className="text-blue-200/90 text-xs space-y-0.5">
                  <li>• Cannot be traded</li>
                  <li>• Permanent ownership</li>
                  <li>• Progress stays with you</li>
                </ul>
              </div>
            </div>
          )}

          {/* Features Section */}
          {activeSection === 'features' && (
            <div className="space-y-2">
              <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <h4 className="text-green-300 font-semibold text-xs">Available Now</h4>
                </div>
                <ul className="text-green-200/90 text-xs space-y-0.5">
                  <li>• Monster pack purchasing</li>
                  <li>• Collection management</li>
                  <li>• Fusion system</li>
                  <li>• Team building (3 max)</li>
                </ul>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-yellow-300 font-semibold text-xs">Coming Soon</h4>
                </div>
                <ul className="text-yellow-200/90 text-xs space-y-0.5">
                  <li>• PvE battles & expeditions</li>
                  <li>• Monster burning system</li>
                  <li>• Leaderboards</li>
                  <li>• Advanced battle mechanics</li>
                </ul>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
                <p className="text-blue-200 text-xs">
                  🚀 New features added regularly!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Compact Action Button */}
        <div className="p-2 bg-white/5 border-t border-white/20">
          <button
            onClick={onClose}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Got It!
          </button>
        </div>
      </div>

      {/* Mobile Layout - Ultra Compact Bottom Sheet */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-end pb-4 px-2">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Mobile Popup Container */}
        <div className="relative w-full max-w-lg h-[70vh] glass-panel rounded-t-2xl rounded-b-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
          {/* Compact Header */}
          <div className="flex items-center justify-between p-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                <Info className="w-2.5 h-2.5 text-blue-300" />
              </div>
              <h2 className="text-sm font-bold text-white">Game Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-white/20 bg-white/5">
            <div className="flex">
              {[
                { id: 'start', name: 'Quick Start', icon: <Gamepad2 className="w-3 h-3" /> },
                { id: 'interface', name: 'Interface', icon: <Package className="w-3 h-3" /> },
                { id: 'features', name: 'Features', icon: <CheckCircle className="w-3 h-3" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-all ${
                    activeSection === tab.id 
                      ? 'text-white border-b-2 border-blue-400 bg-white/10' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Content */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* Quick Start Tab */}
            {activeSection === 'start' && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white mb-2">Getting Started</h3>
                
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
            )}

            {/* Interface Tab */}
            {activeSection === 'interface' && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white mb-2">Navigation</h3>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-purple-400" />
                    <h4 className="font-semibold text-purple-200 text-xs">Shop</h4>
                  </div>
                  <ul className="text-purple-200/90 text-xs space-y-0.5">
                    <li>• Buy monster packs</li>
                    <li>• Use MON tokens or COOKIES</li>
                    <li>• 5 monsters per pack</li>
                  </ul>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-green-400" />
                    <h4 className="font-semibold text-green-200 text-xs">Inventory</h4>
                  </div>
                  <ul className="text-green-200/90 text-xs space-y-0.5">
                    <li>• View all your monsters</li>
                    <li>• Equip/unequip from team</li>
                    <li>• Perform fusion operations</li>
                  </ul>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-orange-400" />
                    <h4 className="font-semibold text-orange-200 text-xs">Battle</h4>
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1 py-0.5 rounded">Soon</span>
                  </div>
                  <ul className="text-orange-200/90 text-xs space-y-0.5">
                    <li>• PvE battles (coming soon)</li>
                    <li>• Monster expeditions</li>
                    <li>• Earn rewards</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeSection === 'features' && (
              <div className="space-y-2">
                <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <h4 className="text-green-300 font-semibold text-xs">Available Now</h4>
                  </div>
                  <ul className="text-green-200/90 text-xs space-y-0.5">
                    <li>• Monster pack purchasing</li>
                    <li>• Collection management</li>
                    <li>• Fusion system</li>
                    <li>• Team building (3 max)</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-yellow-300 font-semibold text-xs">Coming Soon</h4>
                  </div>
                  <ul className="text-yellow-200/90 text-xs space-y-0.5">
                    <li>• PvE battles & expeditions</li>
                    <li>• Monster burning system</li>
                    <li>• Leaderboards</li>
                    <li>• Advanced battle mechanics</li>
                  </ul>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
                  <p className="text-blue-200 text-xs">
                    🚀 New features added regularly!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Single Action Button */}
          <div className="p-2 bg-white/5 border-t border-white/20">
            <button
              onClick={onClose}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Got It!
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