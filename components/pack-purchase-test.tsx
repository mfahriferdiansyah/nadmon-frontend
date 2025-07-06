"use client"

import type React from "react"
import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, Database, PlayCircle, CheckCircle, XCircle, Clock, Sparkles } from "lucide-react"

// Import only the enhanced implementation
import { useNadmonPackBuyingEnhanced } from "@/hooks/use-nadmon-pack-buying-enhanced"
import { PackOpeningEnhanced } from "@/components/pack-opening-enhanced"
import { ShopPopupEnhanced } from "@/components/shop-popup-enhanced"
import { PACKS } from "@/constants/packs"

interface PackPurchaseTestProps {
  onClose?: () => void
}

export function PackPurchaseTest({ onClose }: PackPurchaseTestProps) {
  const { address, isConnected } = useAccount()
  const [showShop, setShowShop] = useState(false)
  const [showTestAnimation, setShowTestAnimation] = useState(false)

  // Enhanced pack buying hook
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

  // Get trial pack for testing
  const trialPack = PACKS.find(pack => pack.id === 'trial') || PACKS[0]

  if (!isConnected) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet to Test</h2>
        <p className="text-gray-600">Please connect your wallet to test the enhanced pack purchasing system.</p>
      </div>
    )
  }

  const renderStateIcon = (state: string, isLoading: boolean) => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />
    
    switch (state) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
      case 'confirming':
      case 'fetching-pack':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <PlayCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStateDescription = (state: string) => {
    switch (state) {
      case 'idle':
        return 'Ready to purchase'
      case 'pending':
        return 'Waiting for wallet confirmation'
      case 'confirming':
        return 'Transaction confirming on blockchain'
      case 'fetching-pack':
        return 'Getting pack data from API - this is the magic! ✨'
      case 'success':
        return 'Pack purchased successfully!'
      case 'error':
        return 'Purchase failed'
      default:
        return state
    }
  }

  const handleTestAnimation = () => {
    // Mock pack NFTs for testing the animation
    const mockNFTs = [
      {
        id: 999,
        name: "Demo Sunny",
        type: "Water",
        rarity: "common" as const,
        hp: 117,
        attack: 29,
        defense: 23,
        speed: 16,
        critical: 10,
        color: "#4ecdc4",
        image: "/monster/sunny-i.png"
      },
      {
        id: 998,
        name: "Demo Medusa",
        type: "Fire",
        rarity: "rare" as const,
        hp: 110,
        attack: 35,
        defense: 16,
        speed: 16,
        critical: 6,
        color: "#ff6b6b",
        image: "/monster/medusa-i.png"
      },
      {
        id: 997,
        name: "Demo Urchin",
        type: "Grass",
        rarity: "epic" as const,
        hp: 112,
        attack: 24,
        defense: 23,
        speed: 15,
        critical: 7,
        color: "#6c757d",
        image: "/monster/urchin-i.png"
      },
      {
        id: 996,
        name: "Demo Cervus",
        type: "Water",
        rarity: "legendary" as const,
        hp: 93,
        attack: 22,
        defense: 16,
        speed: 13,
        critical: 5,
        color: "#4ecdc4",
        image: "/monster/cervus-i.png"
      },
      {
        id: 995,
        name: "Demo Brindle",
        type: "Grass",
        rarity: "common" as const,
        hp: 91,
        attack: 20,
        defense: 15,
        speed: 12,
        critical: 9,
        color: "#6c757d",
        image: "/monster/brindle-i.png"
      }
    ]

    console.log('🎮 Testing enhanced pack opening animation')
    setShowTestAnimation(true)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🎁 Enhanced Pack Purchase Test</h1>
          <p className="text-gray-600 mt-2">
            Test the new pack purchasing system with real NFT data integration
          </p>
          <p className="text-sm text-gray-500">
            Address: <code className="bg-gray-100 px-2 py-1 rounded">{address}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowShop(true)}
            variant="default"
          >
            <Package className="h-4 w-4 mr-2" />
            Open Enhanced Shop
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Pack Buying */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              Enhanced Pack Buying
            </CardTitle>
            <CardDescription>
              Complete pack purchase with real NFT data from API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {renderStateIcon(state, isLoading)}
                  <Badge variant={state === 'success' ? "default" : state === 'error' ? "destructive" : "secondary"}>
                    {state}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {getStateDescription(state)}
                </div>
              </div>

              {packNFTs.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Pack Contents: {packNFTs.length} NFTs
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Pack ID: {packId}
                  </div>
                  <div className="grid grid-cols-5 gap-1 mt-2">
                    {packNFTs.slice(0, 5).map((nft) => (
                      <div key={nft.id} className="text-xs bg-white rounded px-1 py-0.5 text-center">
                        <div className="font-medium truncate">{nft.name}</div>
                        <div className="text-gray-500">#{nft.id}</div>
                        <div className={`text-xs ${
                          nft.rarity === 'legendary' ? 'text-yellow-600' :
                          nft.rarity === 'epic' ? 'text-purple-600' :
                          nft.rarity === 'rare' ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {nft.rarity.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <Alert>
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {transactionHash && (
                <div className="text-xs text-gray-500 break-all">
                  TX: {transactionHash}
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-1">
                <div>✅ Complete transaction lifecycle</div>
                <div>✅ Real NFT data from API</div>
                <div>✅ Enhanced pack opening animation</div>
                <div>✅ Auto inventory update</div>
                <div>✅ Fallback methods for reliability</div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={buyPackWithMON}
                  disabled={isLoading}
                  size="sm"
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Package className="h-4 w-4 mr-2" />
                  )}
                  Buy with MON (0.01)
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Test */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Animation Test
            </CardTitle>
            <CardDescription>
              Test the pack opening animation with demo data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                <h4 className="font-medium text-purple-700 mb-2">Test Features:</h4>
                <div className="text-sm text-purple-600 space-y-1">
                  <div>🎬 Pack shaking and ripping animation</div>
                  <div>✨ Card reveal with sparkle effects</div>
                  <div>🃏 Real NFT display with stats</div>
                  <div>🏆 Rarity indicators and colors</div>
                  <div>📊 Pack summary with totals</div>
                </div>
              </div>

              <Button
                onClick={handleTestAnimation}
                className="w-full"
                variant="outline"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Test Pack Opening Animation
              </Button>

              <div className="text-xs text-gray-500">
                This will show the animation with demo NFTs to test the visual experience
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Guide */}
      <Card className="mt-6 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">🚀 Ready to Integrate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Main Integration:</h4>
              <div className="space-y-1 text-gray-600">
                <div>1. Replace <code>useNadmonPackBuying</code></div>
                <div>2. Use <code>ShopPopupEnhanced</code></div>
                <div>3. Add environment variable</div>
                <div>4. Test with real pack purchase</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Benefits:</h4>
              <div className="space-y-1 text-gray-600">
                <div>🎁 Real pack contents revealed</div>
                <div>⚡ Instant inventory update</div>
                <div>🎨 Beautiful animations</div>
                <div>🔄 Reliable error handling</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Shop Modal */}
      {showShop && (
        <ShopPopupEnhanced
          onClose={() => setShowShop(false)}
          onPackPurchased={() => {
            console.log('Pack purchased via enhanced shop!')
          }}
          onInventoryUpdate={() => {
            console.log('Inventory should update now!')
          }}
        />
      )}

      {/* Test Animation Modal */}
      {showTestAnimation && (
        <PackOpeningEnhanced
          isOpening={showTestAnimation}
          onComplete={() => setShowTestAnimation(false)}
          packType={trialPack}
          packNFTs={[
            {
              id: 999,
              name: "Demo Sunny",
              type: "Water",
              rarity: "common" as const,
              hp: 117,
              attack: 29,
              defense: 23,
              speed: 16,
              critical: 10,
              color: "#4ecdc4",
              image: "/monster/sunny-i.png"
            },
            {
              id: 998,
              name: "Demo Medusa",
              type: "Fire",
              rarity: "rare" as const,
              hp: 110,
              attack: 35,
              defense: 16,
              speed: 16,
              critical: 6,
              color: "#ff6b6b",
              image: "/monster/medusa-i.png"
            },
            {
              id: 997,
              name: "Demo Urchin",
              type: "Grass",
              rarity: "epic" as const,
              hp: 112,
              attack: 24,
              defense: 23,
              speed: 15,
              critical: 7,
              color: "#6c757d",
              image: "/monster/urchin-i.png"
            },
            {
              id: 996,
              name: "Demo Cervus",
              type: "Water",
              rarity: "legendary" as const,
              hp: 93,
              attack: 22,
              defense: 16,
              speed: 13,
              critical: 5,
              color: "#4ecdc4",
              image: "/monster/cervus-i.png"
            },
            {
              id: 995,
              name: "Demo Brindle",
              type: "Grass",
              rarity: "common" as const,
              hp: 91,
              attack: 20,
              defense: 15,
              speed: 12,
              critical: 9,
              color: "#6c757d",
              image: "/monster/brindle-i.png"
            }
          ]}
          packId={123}
          onClose={() => setShowTestAnimation(false)}
        />
      )}
    </div>
  )
}

export default PackPurchaseTest