"use client"

import React, { useState } from "react"
import { X, ArrowRight, ArrowLeft, Gamepad2, Package, Sparkles, Users, Crown, Shield, Coins, Lock, AlertTriangle, CheckCircle, Info, Target } from "lucide-react"

interface GameInstructionsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function GameInstructionsPopup({ isOpen, onClose }: GameInstructionsPopupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [activeSection, setActiveSection] = useState('start')

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
      
      {/* Desktop Layout - Single Page */}
      <div className="hidden md:block relative w-full max-w-7xl my-8 glass-panel rounded-2xl backdrop-blur-lg bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">NADMON Game Guide</h2>
              <p className="text-blue-300/80 text-sm">Everything you need to know</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Menu */}
        <div className="p-6 pb-0">
          <div className="flex gap-2 mb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-500/30 text-white border border-blue-400/50'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {section.icon}
                <span>{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content - Conditional sections */}
        <div className="px-6 pb-6 h-[500px] overflow-hidden">
          {/* Getting Started Section */}
          {activeSection === 'getting-started' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Welcome to NADMON</h3>
                <p className="text-white/80 text-sm">
                  Your complete guide to blockchain monster collection and evolution
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-300 font-bold text-xs">1</span>
                    </div>
                    <h4 className="text-green-300 font-semibold text-sm">Connect Your Wallet</h4>
                  </div>
                  <p className="text-green-200/90 text-xs mb-2">Connect to Monad Testnet to access all features</p>
                  <div className="text-green-200/80 text-xs">
                    <p>• Use MetaMask or compatible wallet</p>
                    <p>• Switch to Monad Testnet network</p>
                  </div>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-purple-300 font-bold text-xs">2</span>
                    </div>
                    <h4 className="text-purple-300 font-semibold text-sm">Buy Your First Pack</h4>
                  </div>
                  <p className="text-purple-200/90 text-xs mb-2">Visit Shop to purchase monster packs</p>
                  <div className="text-purple-200/80 text-xs">
                    <p>• Each pack contains 5 monsters</p>
                    <p>• Pay with MON tokens or COOKIES</p>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-300 font-bold text-xs">3</span>
                    </div>
                    <h4 className="text-blue-300 font-semibold text-sm">Build Your Team</h4>
                  </div>
                  <p className="text-blue-200/90 text-xs mb-2">Open Inventory to equip up to 3 monsters</p>
                  <div className="text-blue-200/80 text-xs">
                    <p>• Maximum 3 monsters equipped</p>
                    <p>• Balance different types and rarities</p>
                  </div>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <span className="text-orange-300 font-bold text-xs">4</span>
                    </div>
                    <h4 className="text-orange-300 font-semibold text-sm">Evolve & Battle</h4>
                  </div>
                  <p className="text-orange-200/90 text-xs mb-2">Use fusion to evolve and prepare for battles</p>
                  <div className="text-orange-200/80 text-xs">
                    <p>• Sacrifice weaker monsters for power</p>
                    <p>• Unlock advanced abilities</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interface Section */}
          {activeSection === 'interface' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Game Interface</h3>
                <p className="text-white/80 text-sm">Master the NADMON interface and navigation</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-6 h-6 text-purple-400" />
                    <h4 className="font-semibold text-purple-200 text-sm">Shop</h4>
                  </div>
                  <p className="text-purple-300/90 text-xs mb-3">Purchase monster packs with MON tokens or COOKIES.</p>
                  <div className="text-purple-200/80 text-xs space-y-1">
                    <p>• Browse different pack types</p>
                    <p>• View pack contents and prices</p>
                    <p>• 5 monsters per pack guaranteed</p>
                    <p>• Varying rarity distributions</p>
                  </div>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-6 h-6 text-green-400" />
                    <h4 className="font-semibold text-green-200 text-sm">Inventory</h4>
                  </div>
                  <p className="text-green-300/90 text-xs mb-3">Manage your collection and perform operations.</p>
                  <div className="text-green-200/80 text-xs space-y-1">
                    <p>• View all owned monsters</p>
                    <p>• Equip/unequip from team</p>
                    <p>• Perform fusion operations</p>
                    <p>• View monster stats and details</p>
                    <p className="text-yellow-300">• Burn monsters (coming soon)</p>
                  </div>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-6 h-6 text-orange-400" />
                    <h4 className="font-semibold text-orange-200 text-sm">Battleground</h4>
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">Coming Soon</span>
                  </div>
                  <p className="text-orange-300/90 text-xs mb-3">Engage in PvE battles and expeditions.</p>
                  <div className="text-orange-200/80 text-xs space-y-1">
                    <p>• Battle with equipped monsters</p>
                    <p>• Send monsters on expeditions</p>
                    <p>• Earn rewards and experience</p>
                    <p className="text-yellow-300 font-medium">⚠️ Not yet implemented</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evolution Section */}
          {activeSection === 'evolution' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Evolution & Fusion</h3>
                <p className="text-white/80 text-sm">Master the art of monster evolution</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-200 text-sm">How to Evolve</h4>
                  </div>
                  <div className="text-blue-200/80 text-xs space-y-1">
                    <p>1. Open Inventory → Select monster → Click "Fusion"</p>
                    <p>2. Choose monsters to sacrifice → Confirm transaction</p>
                    <p>3. Target gets +1 fusion level per sacrificed monster</p>
                  </div>
                </div>
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold text-purple-200 text-sm">Evolution Effects</h4>
                  </div>
                  <div className="text-purple-200/80 text-xs space-y-1">
                    <p>• +10% HP, Attack, Defense per fusion level</p>
                    <p>• Visual changes at fusion milestones</p>
                    <p>• Enhanced rarity appearance & battle power</p>
                    <p className="text-yellow-300">• Advanced abilities (coming soon)</p>
                  </div>
                </div>
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-green-200 text-sm">Evolution Example</h4>
                  </div>
                  <div className="text-green-200/80 text-xs space-y-1">
                    <p><span className="text-purple-300">Epic Monster</span> + 3 Common = <span className="text-orange-300">+3 Fusion Levels</span></p>
                    <p>Result: 30% stronger stats + visual upgrade</p>
                    <p>Sacrificed monsters are permanently destroyed</p>
                  </div>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-orange-400" />
                    <h4 className="font-semibold text-orange-200 text-sm">Strategic Tips</h4>
                  </div>
                  <div className="text-orange-200/80 text-xs space-y-1">
                    <p>• Focus on evolving your best monsters first</p>
                    <p>• Use commons to power up rares/epics</p>
                    <p>• Save legendaries as fusion targets</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economy Section */}
          {activeSection === 'economy' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Economy & Tokens</h3>
                <p className="text-white/80 text-sm">Understand NADMON's economic system</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Coins className="w-6 h-6 text-purple-400" />
                    <h4 className="font-semibold text-purple-200 text-sm">MON Tokens</h4>
                  </div>
                  <p className="text-purple-300/90 text-xs mb-3">Primary premium currency</p>
                  <div className="text-purple-200/80 text-xs space-y-1">
                    <p>• Purchase premium monster packs</p>
                    <p>• Access exclusive content</p>
                    <p>• Participate in special events</p>
                    <p>• Trade on supported exchanges</p>
                  </div>
                </div>
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Coins className="w-6 h-6 text-orange-400" />
                    <h4 className="font-semibold text-orange-200 text-sm">COOKIES</h4>
                  </div>
                  <p className="text-orange-300/90 text-xs mb-3">Secondary gameplay currency</p>
                  <div className="text-orange-200/80 text-xs space-y-1">
                    <p>• Earned through gameplay activities</p>
                    <p>• Used for basic pack purchases</p>
                    <p>• Daily login bonuses</p>
                    <p>• More accessible for new players</p>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-6 h-6 text-blue-400" />
                    <h4 className="font-semibold text-blue-200 text-sm">Soulbound Tokens</h4>
                  </div>
                  <p className="text-blue-300/90 text-xs mb-3">Your permanent monster collection</p>
                  <div className="text-blue-200/80 text-xs space-y-1">
                    <p>• Cannot be traded or transferred</p>
                    <p>• Permanently linked to your wallet</p>
                    <p>• Progress stays with you forever</p>
                    <p>• Ensures true ownership</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          {activeSection === 'features' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Features & Roadmap</h3>
                <p className="text-white/80 text-sm">Current features and upcoming developments</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <h4 className="text-green-300 font-semibold text-sm">Available Now</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <p className="text-green-200 text-xs">Monster Pack Purchasing (MON/COOKIES)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <p className="text-green-200 text-xs">Collection Management (Full inventory)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <p className="text-green-200 text-xs">Fusion System (Evolution through sacrifice)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <p className="text-green-200 text-xs">Team Building (Equip up to 3 monsters)</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    <h4 className="text-yellow-300 font-semibold text-sm">Coming Soon</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                      <p className="text-yellow-200 text-xs">PvE Battles (Fight monsters, earn rewards)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                      <p className="text-yellow-200 text-xs">Monster Expeditions (Send on adventures)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                      <p className="text-yellow-200 text-xs">Burning System (Destroy for resources)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                      <p className="text-yellow-200 text-xs">Leaderboards (Competitive rankings)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-blue-200 text-xs">
                  🚀 NADMON is actively in development. New features and improvements are being added regularly!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Simple Close Button */}
        <div className="p-6 pt-0 border-t border-blue-500/20">
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 border border-green-500 hover:border-green-400 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2 mx-auto"
            >
              <CheckCircle className="w-4 h-4" />
              Got It!
            </button>
          </div>
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