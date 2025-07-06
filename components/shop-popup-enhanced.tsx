"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, ShoppingCart, Wallet, Loader2, Package, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccount, useChainId } from "wagmi"
import { useNadmonPackBuyingEnhanced } from "@/hooks/use-nadmon-pack-buying-enhanced"
import { PackOpeningEnhanced } from "@/components/pack-opening-enhanced"
import { TransactionToastManager } from "@/components/ui/transaction-toast"
import { monadTestnet } from "@/lib/web3-config"
import { PACKS, type PackType } from "@/constants/packs"
import type { PokemonCard } from "@/types/card"

interface ShopPopupEnhancedProps {
  onClose: () => void
  onPackPurchased?: () => void
  onInventoryUpdate?: () => void
}

export function ShopPopupEnhanced({ onClose, onPackPurchased, onInventoryUpdate }: ShopPopupEnhancedProps) {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"MON" | "COOKIES">("MON")
  const [currentToastId, setCurrentToastId] = useState<string | null>(null)
  const [showPackOpening, setShowPackOpening] = useState(false)
  const [packPosition, setPackPosition] = useState({ x: 0, y: 0 })

  const {
    buyPackWithMON,
    buyPackWithCookies,
    state,
    error,
    transactionHash,
    isLoading,
    packNFTs,
    packId,
    reset
  } = useNadmonPackBuyingEnhanced()

  const isOnCorrectChain = chainId === monadTestnet.id

  // Handle pack selection with position tracking
  const handlePackSelect = (pack: PackType, event: React.MouseEvent) => {
    if (!pack.unlocked) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    setPackPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    setSelectedPack(pack)
  }

  // Handle pack purchase
  const handlePurchase = () => {
    if (!selectedPack || !isConnected || !isOnCorrectChain) return

    console.log(`🛒 Starting pack purchase: ${selectedPack.name} with ${paymentMethod}`)

    const toastId = TransactionToastManager.create({
      status: 'loading',
      title: 'Buying Pack',
      description: `Purchasing ${selectedPack.name}...`,
    })
    setCurrentToastId(toastId)

    if (paymentMethod === "MON") {
      buyPackWithMON()
    } else {
      buyPackWithCookies()
    }
  }

  // Handle transaction state changes with enhanced messaging
  useEffect(() => {
    if (!currentToastId) return

    if (state === 'pending') {
      TransactionToastManager.update(currentToastId, {
        status: 'pending',
        title: 'Confirm Transaction',
        description: 'Please confirm the pack purchase in your wallet',
      })
    } else if (state === 'confirming') {
      TransactionToastManager.update(currentToastId, {
        status: 'pending',
        title: 'Transaction Processing',
        description: 'Your pack purchase is being confirmed on the blockchain...',
        transactionHash,
      })
    } else if (state === 'fetching-pack') {
      TransactionToastManager.update(currentToastId, {
        status: 'pending',
        title: 'Getting Your Cards',
        description: 'Transaction confirmed! Retrieving your new NFTs...',
        transactionHash,
      })
    } else if (state === 'success') {
      TransactionToastManager.update(currentToastId, {
        status: 'success',
        title: 'Pack Purchased Successfully!',
        description: `Got ${packNFTs.length} new cards! Opening pack...`,
        transactionHash,
      })
      
      // Start pack opening animation
      setTimeout(() => {
        setShowPackOpening(true)
        onPackPurchased?.()
      }, 1000)
      
    } else if (state === 'error') {
      TransactionToastManager.update(currentToastId, {
        status: 'error',
        title: 'Purchase Failed',
        description: error || 'Something went wrong with your pack purchase',
        transactionHash,
      })
    }
  }, [state, error, currentToastId, transactionHash, packNFTs.length, onPackPurchased])

  // Handle pack opening completion
  const handlePackOpeningComplete = () => {
    setShowPackOpening(false)
    setSelectedPack(null)
    reset()
    setCurrentToastId(null)
    onInventoryUpdate?.()
    onClose()
  }

  // Render connection status
  const renderConnectionStatus = () => {
    if (!isConnected) {
      return (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please connect your wallet to purchase packs
          </AlertDescription>
        </Alert>
      )
    }

    if (!isOnCorrectChain) {
      return (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please switch to Monad Testnet to purchase packs
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700">
          <Wallet className="h-4 w-4" />
          <span className="text-sm">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
      </div>
    )
  }

  // Render pack grid
  const renderPackGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {PACKS.map((pack) => (
        <Card
          key={pack.id}
          className={`
            cursor-pointer transition-all duration-300 hover:shadow-lg
            ${!pack.unlocked ? 'opacity-50 cursor-not-allowed' : ''}
            ${selectedPack?.id === pack.id ? 'ring-2 ring-blue-500 shadow-lg' : ''}
          `}
          onClick={(e) => handlePackSelect(pack, e)}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{pack.name}</CardTitle>
              {!pack.unlocked && (
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`
                h-32 rounded-lg mb-4 flex items-center justify-center
                bg-gradient-to-br ${pack.colors.primary}
              `}
            >
              <Package className="h-16 w-16 text-white" />
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{pack.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Price:</span>
                <div className="text-right">
                  <div className="font-bold">{pack.price.MON} MON</div>
                  <div className="text-sm text-gray-500">{pack.price.COOKIES} COOKIES</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cards:</span>
                <span className="text-sm">5 NFTs</span>
              </div>
              
              {pack.element && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Focus:</span>
                  <Badge variant="outline" className="text-xs">
                    {pack.element}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Render purchase section
  const renderPurchaseSection = () => {
    if (!selectedPack) {
      return (
        <div className="text-center py-8 text-gray-500">
          Select a pack to view purchase options
        </div>
      )
    }

    const canPurchase = isConnected && isOnCorrectChain && selectedPack.unlocked && !isLoading

    return (
      <div className="space-y-6">
        {/* Selected pack preview */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div
              className={`
                w-16 h-16 rounded-lg flex items-center justify-center
                bg-gradient-to-br ${selectedPack.colors.primary}
              `}
            >
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{selectedPack.name}</h3>
              <p className="text-sm text-gray-600">5 NFT Cards</p>
            </div>
            <div className="text-right">
              <div className="font-bold">
                {paymentMethod === "MON" ? selectedPack.price.MON : selectedPack.price.COOKIES}{" "}
                {paymentMethod}
              </div>
            </div>
          </div>
        </div>

        {/* Payment method selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Payment Method:</label>
          <div className="flex gap-3">
            <Button
              variant={paymentMethod === "MON" ? "default" : "outline"}
              onClick={() => setPaymentMethod("MON")}
              className="flex-1"
              disabled={isLoading}
            >
              <span className="mr-2">💎</span>
              {selectedPack.price.MON} MON
            </Button>
            <Button
              variant={paymentMethod === "COOKIES" ? "default" : "outline"}
              onClick={() => setPaymentMethod("COOKIES")}
              className="flex-1"
              disabled={isLoading}
            >
              <span className="mr-2">🍪</span>
              {selectedPack.price.COOKIES} COOKIES
            </Button>
          </div>
        </div>

        {/* Purchase button */}
        <Button
          onClick={handlePurchase}
          disabled={!canPurchase}
          className="w-full py-3 text-lg font-semibold"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {state === 'fetching-pack' ? 'Getting Your Cards...' : 'Processing...'}
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy {selectedPack.name}
            </>
          )}
        </Button>

        {/* Status messages */}
        {!canPurchase && selectedPack.unlocked && (
          <div className="text-center text-sm text-gray-500">
            {!isConnected && "Connect wallet to purchase"}
            {isConnected && !isOnCorrectChain && "Switch to Monad Testnet"}
          </div>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Main Shop Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-3xl font-bold">🏪 Pack Shop</h2>
              <p className="text-gray-600">Purchase booster packs to get new Nadmon cards</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)]">
            {/* Pack Selection */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Available Packs</h3>
              {renderConnectionStatus()}
              {renderPackGrid()}
            </div>

            {/* Purchase Panel */}
            <div className="lg:w-96 border-l bg-gray-50 p-6 overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">Purchase</h3>
              {renderPurchaseSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Pack Opening Animation */}
      {showPackOpening && (
        <PackOpeningEnhanced
          isOpening={showPackOpening}
          onComplete={handlePackOpeningComplete}
          packPosition={packPosition}
          packType={selectedPack}
          packNFTs={packNFTs}
          packId={packId}
          onClose={handlePackOpeningComplete}
        />
      )}
    </>
  )
}

export default ShopPopupEnhanced