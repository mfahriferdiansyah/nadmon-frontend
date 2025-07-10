"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useAccount, useChainId } from "wagmi"
import { GameCanvas } from "@/components/game-canvas"
import { GameUI } from "@/components/game-ui"
import { InventoryPopup } from "@/components/inventory-popup"
import { MobileInventoryPopup } from "@/components/mobile-inventory-popup"
import { ShopPopup } from "@/components/shop-popup"
import { MobileShopPopup } from "@/components/mobile-shop-popup"
import { BattlegroundPopup } from "@/components/battleground-popup"
import { FusionPopup } from "@/components/fusion-popup"
import { MobileFusionPopup } from "@/components/mobile-fusion-popup"
import { useIsMobile } from "@/components/ui/use-mobile"
import { UnderDevelopmentOverlay } from "@/components/under-development-overlay"
import { PackOpeningAnimation } from "@/components/pack-opening-animation"
import { FocusedCardSession } from "@/components/focused-card-session"
import { WalletConnectionPopup } from "@/components/wallet-connection-popup"
import { WalletHandle } from "@/components/wallet-handle"
import { GameLandingPopup } from "@/components/game-landing-popup"
import { GameInstructionsPopup } from "@/components/game-instructions-popup"
import { generateRandomCards } from "@/utils/card-utils"
import { MOCK_CARDS } from "@/constants/cards"
import type { PackType } from "@/constants/packs"
import type { PokemonCard } from "@/types/card"
import { monadTestnet } from "@/lib/web3-config"
import { useNadmonNFTsAPI as useNadmonNFTs } from "@/hooks/use-nadmon-nfts-api"
import { useNadmonPackBuying } from "@/hooks/use-nadmon-pack-buying"
import { API_CONFIG, apiRequestWithRetry } from "@/lib/api-config"

type ActivePopup = "inventory" | "shop" | "battleground" | null

export default function GachaGame() {
  // Mobile detection
  const isMobile = useIsMobile()
  
  // Wallet connection state
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  
  // Check if user is on the correct chain
  const isOnCorrectChain = chainId === monadTestnet.id
  
  // Landing popup state
  const [showLandingPopup, setShowLandingPopup] = useState(true)
  const [hasEnteredGame, setHasEnteredGame] = useState(false)
  
  // Instructions popup state
  const [showInstructionsPopup, setShowInstructionsPopup] = useState(false)
  
  // Disable old wallet popup when using new onboarding
  const shouldShowWalletPopup = hasEnteredGame && (!isConnected || !isOnCorrectChain || showWalletPopup)

  // NFT data from API (much faster!)
  const { nfts: realNFTs, loading: nftsLoading, error: nftsError, refetch: refetchNFTs } = useNadmonNFTs()
  
  // Pack buying hook for "Open Another" functionality
  const { buyPackWithMON, buyPackWithCookies, state: packBuyingState, error: packBuyingError, isLoading: packBuyingLoading, packId: newPackId, reset: resetPackBuying } = useNadmonPackBuying()

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

  // Debounced equipped cards sync to prevent excessive updates
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const debouncedSyncEquippedCards = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      if (collection.length > 0 && equippedCards.length > 0) {
        console.log('🔄 Syncing equipped cards with collection update')
        console.log('Collection length:', collection.length)
        console.log('Equipped cards before sync:', equippedCards.map(c => `${c.name} (ID: ${c.id}, Fusion: ${c.fusion || 0})`))
        
        setEquippedCards(prev => {
          const updated = prev.map(equippedCard => {
            // Find the updated version of this card in the collection
            const updatedCard = collection.find(card => card.id === equippedCard.id)
            if (updatedCard && (updatedCard.fusion !== equippedCard.fusion || updatedCard.hp !== equippedCard.hp)) {
              console.log(`📈 Updating equipped card ${equippedCard.name} (ID: ${equippedCard.id}): fusion ${equippedCard.fusion || 0} → ${updatedCard.fusion || 0}`)
            }
            return updatedCard || equippedCard // Use updated version if found, otherwise keep original
          }).filter(card => {
            // Remove cards that no longer exist in collection (burned in fusion)
            const exists = collection.some(collectionCard => collectionCard.id === card.id)
            if (!exists) {
              console.log(`🔥 Removing burned card from equipped: ${card.name} (ID: ${card.id})`)
            }
            return exists
          })
          
          console.log('Equipped cards after sync:', updated.map(c => `${c.name} (ID: ${c.id}, Fusion: ${c.fusion || 0})`))
          return updated
        })
      }
    }, 300) // 300ms debounce
  }, [collection, equippedCards])

  // Update equipped cards when collection updates (to reflect evolved stats)
  useEffect(() => {
    debouncedSyncEquippedCards()
  }, [collection, debouncedSyncEquippedCards])

  // Handle "Open Another" pack purchase completion
  useEffect(() => {
    if (packBuyingState === 'success' && newPackId) {
      console.log('🎉 "Open Another" pack purchase successful, pack ID:', newPackId)
      // Trigger pack opening with the new pack ID
      handlePackPurchased(newPackId)
      // Reset pack buying state
      resetPackBuying()
    } else if (packBuyingState === 'error' && packBuyingError) {
      console.error('❌ "Open Another" pack purchase failed:', packBuyingError)
      // Could show error toast here if needed
    }
  }, [packBuyingState, newPackId, packBuyingError])

  // Shop states
  const [currentCards, setCurrentCards] = useState<PokemonCard[]>([])
  const [isOpening, setIsOpening] = useState(false)
  const [selectedPackType, setSelectedPackType] = useState<PackType | null>(null)
  const [packPosition, setPackPosition] = useState({ x: 0, y: 0 })
  const [showFocusedSession, setShowFocusedSession] = useState(false)
  
  // Track NFTs before purchase to identify newly minted ones (fallback method)
  const [nftCountBeforePurchase, setNftCountBeforePurchase] = useState<number>(0)
  const [isWaitingForNewNFTs, setIsWaitingForNewNFTs] = useState(false)
  
  // Track pack ID for METHOD 1 (preferred)
  const [purchasedPackId, setPurchasedPackId] = useState<number | null>(null)
  
  // Track when we're in pack purchase mode to pause auto-polling
  const [isInPackPurchaseMode, setIsInPackPurchaseMode] = useState(false)
  
  // Track last payment method used for "Open Another" functionality
  const [lastPaymentMethod, setLastPaymentMethod] = useState<'MON' | 'COOKIES' | null>(null)

  // Fetch NFTs by pack ID from API
  const fetchPackNFTs = async (packId: number): Promise<PokemonCard[]> => {
    try {
      console.log(`🎁 Fetching NFTs for pack ID: ${packId}`)
      
      const data = await apiRequestWithRetry(
        API_CONFIG.ENDPOINTS.PACK_DETAILS(packId),
        {},
        5 // More retries since indexing may take time
      )
      
      console.log(`✅ Pack API response:`, data)
      
      if (data.nfts && data.nfts.length > 0) {
        // Transform backend NFTs to frontend format
        const transformedNFTs = data.nfts.map((nft: any): PokemonCard => ({
          id: nft.id || nft.token_id,
          name: nft.name || nft.nadmon_type,
          image: nft.image,
          hp: nft.hp,
          attack: nft.attack,
          defense: nft.defense,
          speed: nft.speed || Math.floor((nft.hp + nft.attack + nft.defense) / 10),
          type: nft.type || nft.element,
          rarity: (nft.rarity?.toLowerCase() || 'common') as 'common' | 'rare' | 'epic' | 'legendary',
          critical: nft.critical || nft.crit,
          color: nft.color || '#6c757d',
          fusion: nft.fusion || 0,
          evo: nft.evo || 1,
        }))
        
        console.log(`🎯 Successfully transformed ${transformedNFTs.length} NFTs from pack ${packId}`)
        return transformedNFTs
      }
      
      throw new Error('No NFTs found in pack')
    } catch (error) {
      console.error(`❌ Failed to fetch pack ${packId}:`, error)
      throw error
    }
  }

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

  const handlePackOpenComplete = async () => {
    // If we're in pack purchase mode, METHOD 1 has already handled everything
    if (isInPackPurchaseMode) {
      console.log('🚫 Skipping pack opening animation - METHOD 1 already handled pack purchase')
      setIsOpening(false)
      return
    }
    
    if (purchasedPackId) {
      // METHOD 1: We have the exact pack ID! Fetch real NFTs from API
      console.log(`🎯 Using METHOD 1: Fetching NFTs for pack ID ${purchasedPackId}`)
      
      try {
        const packNFTs = await fetchPackNFTs(purchasedPackId)
        console.log(`✅ SUCCESS: Loaded ${packNFTs.length} real NFTs from pack ${purchasedPackId}`)
        setCurrentCards(packNFTs)
        setPurchasedPackId(null) // Clear pack ID after use
      } catch (error) {
        console.error(`❌ Failed to fetch pack NFTs, falling back to recent NFTs`)
        // Fallback to most recent NFTs if API call fails
        if (realNFTs.length >= 5) {
          setCurrentCards(realNFTs.slice(-5))
        } else {
          setCurrentCards(generateRandomCards(MOCK_CARDS, 5))
        }
      }
      
      setIsWaitingForNewNFTs(false)
    } else if (isWaitingForNewNFTs) {
      // Fallback method: Try to detect new NFTs by inventory comparison
      console.log('⚠️ Using FALLBACK: Comparing inventory before/after purchase')
      const newNFTs = realNFTs.slice(nftCountBeforePurchase)
      
      if (newNFTs.length >= 5) {
        console.log('✅ Found newly minted NFTs:', newNFTs.slice(0, 5))
        setCurrentCards(newNFTs.slice(0, 5))
        setIsWaitingForNewNFTs(false)
      } else if (newNFTs.length > 0) {
        const allAvailable = [...newNFTs, ...realNFTs.slice(-5)].slice(0, 5)
        console.log('⚠️ Found some new NFTs, using most recent ones:', allAvailable)
        setCurrentCards(allAvailable)
        setIsWaitingForNewNFTs(false)
      } else {
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
      console.log('📦 Regular pack opening - using mock cards')
      const newCards = generateRandomCards(MOCK_CARDS, 5)
      setCurrentCards(newCards)
    }
    
    setIsOpening(false)
    setShowFocusedSession(true)
  }

  // Handle pack purchase with pack ID from Method 1
  const handlePackPurchased = async (packId?: number, paymentMethod?: 'MON' | 'COOKIES') => {
    // Save payment method for "Open Another" functionality
    if (paymentMethod) {
      setLastPaymentMethod(paymentMethod)
    }
    console.log(`✅ Pack purchased with ID: ${packId}`)
    
    if (packId) {
      // METHOD 1: We have the exact pack ID! Fetch NFTs directly and skip animation
      console.log(`🎯 METHOD 1 SUCCESS: Fetching NFTs directly for pack ID ${packId}`)
      setIsInPackPurchaseMode(true)
      
      try {
        const packNFTs = await fetchPackNFTs(packId)
        console.log(`✅ SUCCESS: Loaded ${packNFTs.length} real NFTs from pack ${packId}`)
        
        // Set the cards and go directly to the focused session (skip pack animation)
        setCurrentCards(packNFTs)
        setShowFocusedSession(true)
        
        // Don't trigger pack opening animation for purchased packs
        setIsOpening(false)
        setPurchasedPackId(null)
        setIsWaitingForNewNFTs(false)
        setIsInPackPurchaseMode(false)
        
        // Refresh inventory after pack opening is complete
        setTimeout(() => {
          refetchNFTs()
        }, 3000)
        
      } catch (error) {
        console.error(`❌ Failed to fetch pack NFTs, falling back to regular flow`)
        // If API fails, fall back to the regular pack opening flow
        setPurchasedPackId(packId)
        setIsWaitingForNewNFTs(false)
        setIsInPackPurchaseMode(false)
      }
    } else {
      // Fallback: if pack ID wasn't detected, use the old method
      console.log('⚠️ No pack ID provided, falling back to NFT count tracking')
      setPurchasedPackId(null)
      setNftCountBeforePurchase(realNFTs?.length || 0)
      setIsWaitingForNewNFTs(true)
      setIsInPackPurchaseMode(false)
      
      // Still refresh inventory for fallback method
      if (isConnected && isOnCorrectChain) {
        setTimeout(() => {
          refetchNFTs()
        }, 2000)
        
        setTimeout(() => {
          refetchNFTs()
        }, 5000)
      }
    }
  }

  const handleOpenAnother = async () => {
    setShowFocusedSession(false)
    setCurrentCards([])
    
    if (selectedPackType && isConnected && isOnCorrectChain) {
      // Use the same payment method as the last purchase, default to MON
      const paymentMethod = lastPaymentMethod || 'MON'
      
      // Reset any previous pack buying state
      resetPackBuying()
      
      try {
        console.log(`🎁 "Open Another" using payment method: ${paymentMethod}`)
        
        if (paymentMethod === 'MON') {
          await buyPackWithMON()
        } else {
          await buyPackWithCookies()
        }
      } catch (error) {
        console.error('Pack purchase failed:', error)
        // If purchase fails, fall back to opening shop
        openPopup("shop")
      }
    } else {
      // If not connected or wrong chain, open wallet popup
      setShowWalletPopup(true)
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

  // Handle landing popup
  const handleEnterGame = () => {
    setShowLandingPopup(false)
    setHasEnteredGame(true)
  }

  const handleCloseLanding = () => {
    setShowLandingPopup(false)
    setHasEnteredGame(true)
  }

  // Handle instructions popup
  const handleOpenInstructions = () => {
    setShowInstructionsPopup(true)
  }

  const handleCloseInstructions = () => {
    setShowInstructionsPopup(false)
  }

  // Handle fusion completion
  const handleFusionComplete = (targetCard: PokemonCard, sacrificeCards: PokemonCard[]) => {
    console.log('🔥 Fusion completed:', targetCard, 'Sacrifices:', sacrificeCards)
    
    // Remove sacrificed cards from equipped cards if they were equipped
    const sacrificeIds = sacrificeCards.map(card => card.id)
    setEquippedCards(prev => prev.filter(card => !sacrificeIds.includes(card.id)))
    
    // Single smart refresh after a short delay to allow blockchain indexing
    setTimeout(() => {
      console.log('🔄 Refreshing inventory after fusion')
      refetchNFTs()
    }, 2000)
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
        onOpenInstructions={handleOpenInstructions}
        equippedCardsCount={equippedCards.length}
        collectionCount={collection.length}
        equippedCards={equippedCards}
        onUnequipCard={handleUnequipCard}
      />


      {/* Wallet Handle - Top Middle on Mobile, Top Right on Desktop */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 md:left-auto md:right-4 md:transform-none z-40">
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
        isMobile ? (
          <MobileInventoryPopup
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
            onFusionComplete={handleFusionComplete}
          />
        ) : (
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
            onFusionComplete={handleFusionComplete}
          />
        )
      )}

      {!shouldShowWalletPopup && activePopup === "shop" && (
        isMobile ? (
          <MobileShopPopup
            collection={collection}
            onPackSelect={handlePackSelect}
            isOpening={isOpening}
            onClose={closePopup}
            onPackPurchased={handlePackPurchased}
          />
        ) : (
          <ShopPopup
            collection={collection}
            onPackSelect={handlePackSelect}
            isOpening={isOpening}
            onClose={closePopup}
            onPackPurchased={handlePackPurchased}
          />
        )
      )}

      {!shouldShowWalletPopup && activePopup === "battleground" && (
        <BattlegroundPopup
          equippedCards={equippedCards}
          onClose={closePopup}
        />
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

      {/* Game Landing Popup */}
      <GameLandingPopup
        isOpen={showLandingPopup}
        onEnterGame={handleEnterGame}
        onClose={handleCloseLanding}
      />

      {/* Game Instructions Popup */}
      <GameInstructionsPopup
        isOpen={showInstructionsPopup}
        onClose={handleCloseInstructions}
      />
    </div>
  )
}
