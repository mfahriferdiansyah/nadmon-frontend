"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAccount, useChainId } from "wagmi"
import { GameCanvas } from "@/components/game-canvas"
import { GameUI } from "@/components/game-ui"
import { InventoryPopup } from "@/components/inventory-popup"
import { ShopPopup } from "@/components/shop-popup"
import { BattlegroundPopup } from "@/components/battleground-popup"
import { UnderDevelopmentOverlay } from "@/components/under-development-overlay"
import { PackOpeningAnimation } from "@/components/pack-opening-animation"
import { FocusedCardSession } from "@/components/focused-card-session"
import { GameDemo } from "@/components/game-demo"
import { WalletConnectionPopup } from "@/components/wallet-connection-popup"
import { WalletHandle } from "@/components/wallet-handle"
import { generateRandomCards } from "@/utils/card-utils"
import { MOCK_CARDS } from "@/constants/cards"
import type { PackType } from "@/constants/packs"
import type { PokemonCard } from "@/types/card"
import { Button } from "@/components/ui/button"
import { monadTestnet } from "@/lib/web3-config"
import { useNadmonNFTs } from "@/hooks/use-nadmon-nfts"
import { ToastDemo } from "@/components/toast-demo"

type ActivePopup = "inventory" | "shop" | "battleground" | "web3demo" | null

export default function GachaGame() {
  // Wallet connection state
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  
  // Check if user is on the correct chain
  const isOnCorrectChain = chainId === monadTestnet.id
  const shouldShowWalletPopup = !isConnected || !isOnCorrectChain || showWalletPopup

  // NFT data from blockchain
  const { nfts: realNFTs, loading: nftsLoading, error: nftsError, refetch: refetchNFTs } = useNadmonNFTs()

  // Popup states
  const [activePopup, setActivePopup] = useState<ActivePopup>(null)
  const [showUnderDevelopment, setShowUnderDevelopment] = useState(false)

  // Game states - use real NFTs only
  const collection = isConnected && isOnCorrectChain ? realNFTs : []
  
  const [equippedCards, setEquippedCards] = useState<PokemonCard[]>([])
  
  // Auto-equip first 3 NFTs when collection changes
  useEffect(() => {
    if (collection.length > 0 && equippedCards.length === 0) {
      setEquippedCards(collection.slice(0, 3))
    }
  }, [collection.length])

  // Shop states
  const [currentCards, setCurrentCards] = useState<PokemonCard[]>([])
  const [isOpening, setIsOpening] = useState(false)
  const [selectedPackType, setSelectedPackType] = useState<PackType | null>(null)
  const [packPosition, setPackPosition] = useState({ x: 0, y: 0 })
  const [showFocusedSession, setShowFocusedSession] = useState(false)
  
  // Track NFTs before purchase to identify newly minted ones
  const [nftCountBeforePurchase, setNftCountBeforePurchase] = useState<number>(0)
  const [isWaitingForNewNFTs, setIsWaitingForNewNFTs] = useState(false)

  // Wallet popup handlers
  const handleWalletPopupClose = () => {
    setShowWalletPopup(false)
  }

  const openWalletPopup = () => {
    setShowWalletPopup(true)
  }

  // Popup handlers
  const openPopup = (popup: ActivePopup) => {
    // Don't allow opening popups if wallet is not connected
    if (!isConnected || !isOnCorrectChain) {
      setShowWalletPopup(true)
      return
    }
    
    setActivePopup(popup)
    if (popup === "battleground") {
      setShowUnderDevelopment(true)
    }
  }

  const closePopup = () => {
    setActivePopup(null)
    setShowUnderDevelopment(false)
  }

  const closeUnderDevelopment = () => {
    setShowUnderDevelopment(false)
    setActivePopup(null)
  }

  // Pack opening handlers
  const handlePackSelect = async (packType: PackType, event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    setPackPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    setSelectedPackType(packType)
    setIsOpening(true)
  }

  const handlePackOpenComplete = () => {
    if (isWaitingForNewNFTs) {
      // We're waiting for new NFTs from a purchase, try to find them
      const newNFTs = realNFTs.slice(nftCountBeforePurchase)
      
      if (newNFTs.length >= 5) {
        // We found the new NFTs! Use them for the pack opening
        console.log('✅ Found newly minted NFTs:', newNFTs.slice(0, 5))
        setCurrentCards(newNFTs.slice(0, 5))
        setIsWaitingForNewNFTs(false)
      } else if (newNFTs.length > 0) {
        // Some NFTs found but not all 5 yet, use what we have and fill with the newest ones
        const allAvailable = [...newNFTs, ...realNFTs.slice(-5)].slice(0, 5)
        console.log('⚠️ Found some new NFTs, using most recent ones:', allAvailable)
        setCurrentCards(allAvailable)
        setIsWaitingForNewNFTs(false)
      } else {
        // No new NFTs found yet, fall back to most recent NFTs or mock cards
        if (realNFTs.length >= 5) {
          console.log('⚠️ No new NFTs detected yet, using most recent ones:', realNFTs.slice(-5))
          setCurrentCards(realNFTs.slice(-5))
        } else {
          console.log('⚠️ Fallback to mock cards as no NFTs available')
          setCurrentCards(generateRandomCards(MOCK_CARDS, 5))
        }
        setIsWaitingForNewNFTs(false)
      }
    } else {
      // Regular pack opening (not from purchase), use mock cards
      const newCards = generateRandomCards(MOCK_CARDS, 5)
      setCurrentCards(newCards)
    }
    
    setIsOpening(false)
    setShowFocusedSession(true)
  }

  // Handle pack purchase - track NFT count before purchase
  const handlePackPurchased = () => {
    setNftCountBeforePurchase(realNFTs?.length || 0)
    setIsWaitingForNewNFTs(true)
    
    // Refresh NFTs after successful purchase with multiple attempts
    if (isConnected && isOnCorrectChain) {
      // First refetch after 2 seconds
      setTimeout(() => {
        refetchNFTs()
      }, 2000)
      
      // Second refetch after 5 seconds in case the first one was too early
      setTimeout(() => {
        refetchNFTs()
      }, 5000)
      
      // Third refetch after 8 seconds for extra safety
      setTimeout(() => {
        refetchNFTs()
      }, 8000)
    }
  }

  const handleOpenAnother = () => {
    setShowFocusedSession(false)
    setCurrentCards([])
    
    if (selectedPackType) {
      setIsOpening(true)
    }
  }

  const handleFinish = () => {
    setShowFocusedSession(false)
    setCurrentCards([])
    setSelectedPackType(null)
    setIsWaitingForNewNFTs(false)
  }

  const handleFocusedSessionComplete = (cards: PokemonCard[]) => {
    setShowFocusedSession(false)
  }

  // Card management handlers
  const handleEquipCard = (card: PokemonCard) => {
    if (equippedCards.length < 3 && !equippedCards.find((c) => c.id === card.id)) {
      setEquippedCards((prev) => [...prev, card])
    }
  }

  const handleUnequipCard = (cardId: number) => {
    setEquippedCards((prev) => prev.filter((c) => c.id !== cardId))
  }

  const isCardEquipped = (cardId: number) => {
    return equippedCards.find((c) => c.id === cardId) !== undefined
  }

  // Monster summoning (for showing monsters in game view)
  const handleSummonMonster = (card: PokemonCard) => {
    // This now just closes the inventory to show the equipped monster in the game
    closePopup()
  }

  return (
    <div className="w-full h-screen overflow-hidden relative bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/game-background.webp')] bg-cover bg-center opacity-20" />
      
      {/* Game Canvas - Always behind UI */}
      <GameCanvas equippedMonsters={equippedCards} />
      
      {/* Game UI - Main interface */}
      <GameUI
        onOpenInventory={() => openPopup("inventory")}
        onOpenShop={() => openPopup("shop")}
        onOpenBattleground={() => openPopup("battleground")}
        equippedCardsCount={equippedCards.length}
        collectionCount={collection.length}
        equippedCards={equippedCards}
        onUnequipCard={handleUnequipCard}
      />

      {/* Debug Toggle - Top Left */}
      <div className="absolute top-4 left-4 z-40 space-x-2">
        <Button
          onClick={() => openPopup("web3demo")}
          variant="outline"
          size="sm"
          className="glass-panel text-white border-white/20 hover:bg-white/10"
        >
          Debug
        </Button>
      </div>

      {/* Toast Demo - Top Left Below Debug */}
      <div className="absolute top-16 left-4 z-40">
        <div className="glass-panel p-2 rounded">
          <ToastDemo />
        </div>
      </div>

      {/* Wallet Handle - Top Right */}
      <div className="absolute top-4 right-4 z-40">
        <WalletHandle />
      </div>

      {/* Wallet Connection Popup */}
      {shouldShowWalletPopup && (
        <WalletConnectionPopup 
          onClose={handleWalletPopupClose}
        />
      )}

      {/* Popups */}
      {!shouldShowWalletPopup && activePopup === "inventory" && (
        <InventoryPopup
            collection={collection}
            equippedCards={equippedCards}
            onEquipCard={handleEquipCard}
            onUnequipCard={handleUnequipCard}
            isCardEquipped={isCardEquipped}
          onSummonMonster={handleSummonMonster}
          onClose={closePopup}
          isLoading={nftsLoading}
          error={nftsError}
          onRefresh={refetchNFTs}
        />
      )}

      {!shouldShowWalletPopup && activePopup === "shop" && (
        <ShopPopup
          collection={collection}
          onPackSelect={handlePackSelect}
          isOpening={isOpening}
          onClose={closePopup}
          onPackPurchased={handlePackPurchased}
        />
      )}

      {!shouldShowWalletPopup && activePopup === "battleground" && (
        <BattlegroundPopup
          equippedCards={equippedCards}
          onClose={closePopup}
        />
      )}

      {!shouldShowWalletPopup && activePopup === "web3demo" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Web3 Integration Demo</h2>
              <Button onClick={closePopup} variant="outline" size="sm">
                Close
              </Button>
            </div>
            <div className="p-6">
              <GameDemo />
            </div>
          </div>
        </div>
      )}

      {/* Under Development Overlay - Higher z-index than battleground */}
      {showUnderDevelopment && (
        <UnderDevelopmentOverlay
          onClose={closeUnderDevelopment}
        />
      )}

      {/* Pack Opening Animation */}
      <PackOpeningAnimation
        isOpening={isOpening}
        onComplete={handlePackOpenComplete}
        packPosition={packPosition}
        packType={selectedPackType || undefined}
      />

      {/* Focused Card Session */}
      {showFocusedSession && (
        <FocusedCardSession 
          cards={currentCards} 
          onComplete={handleFocusedSessionComplete}
          onOpenAnother={handleOpenAnother}
          onFinish={handleFinish}
          selectedPackType={selectedPackType}
        />
      )}
    </div>
  )
}
