"use client"

import type React from "react"
import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, Zap, Database, PlayCircle, CheckCircle, XCircle, Clock } from "lucide-react"

// Import both old and new implementations
import { useNadmonPackBuying } from "@/hooks/use-nadmon-pack-buying"
import { useNadmonPackBuyingEnhanced } from "@/hooks/use-nadmon-pack-buying-enhanced"
import { PackOpeningEnhanced } from "@/components/pack-opening-enhanced"
import { PACKS } from "@/constants/packs"

interface PackPurchaseDemoProps {
  onClose?: () => void
}

export function PackPurchaseDemo({ onClose }: PackPurchaseDemoProps) {
  const { address, isConnected } = useAccount()
  const [showComparison, setShowComparison] = useState(false)
  const [showEnhancedPackOpening, setShowEnhancedPackOpening] = useState(false)

  // Old implementation (current)
  const oldHook = useNadmonPackBuying()

  // New implementation (enhanced with API)
  const newHook = useNadmonPackBuyingEnhanced()

  // Get trial pack for testing
  const trialPack = PACKS.find(pack => pack.id === 'trial') || PACKS[0]

  if (!isConnected) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet to Test</h2>
        <p className="text-gray-600">Please connect your wallet to test pack purchasing functionality.</p>
      </div>
    )
  }

  const handleTestEnhancedOpening = () => {
    // Mock pack NFTs for testing the animation
    const mockNFTs = [
      {
        id: 999,
        name: "Test Sunny",
        type: "Water",
        rarity: "common" as const,
        hp: 117,
        attack: 29,
        defense: 23,
        speed: 16,
        critical: 10,
        color: "#4ecdc4",
        image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/sunny-i.png"
      },
      {
        id: 998,
        name: "Test Medusa",
        type: "Fire",
        rarity: "rare" as const,
        hp: 110,
        attack: 35,
        defense: 16,
        speed: 16,
        critical: 6,
        color: "#ff6b6b",
        image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/medusa-i.png"
      },
      {
        id: 997,
        name: "Test Urchin",
        type: "Grass",
        rarity: "epic" as const,
        hp: 112,
        attack: 24,
        defense: 23,
        speed: 15,
        critical: 7,
        color: "#6c757d",
        image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/urchin-i.png"
      },
      {
        id: 996,
        name: "Test Cervus",
        type: "Water",
        rarity: "legendary" as const,
        hp: 93,
        attack: 22,
        defense: 16,
        speed: 13,
        critical: 5,
        color: "#4ecdc4",
        image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/cervus-i.png"
      },
      {
        id: 995,
        name: "Test Brindle",
        type: "Grass",
        rarity: "common" as const,
        hp: 91,
        attack: 20,
        defense: 15,
        speed: 12,
        critical: 9,
        color: "#6c757d",
        image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/brindle-i.png"
      }
    ]

    // Set mock data in the new hook state
    // This is for testing purposes only
    console.log('🎮 Testing enhanced pack opening with mock NFTs')
    setShowEnhancedPackOpening(true)
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
        return 'Getting pack data from API'
      case 'success':
        return 'Pack purchased successfully!'
      case 'error':
        return 'Purchase failed'
      default:
        return state
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pack Purchase Demo</h1>
          <p className="text-gray-600 mt-2">
            Test enhanced pack purchasing with real NFT data from API
          </p>
          <p className="text-sm text-gray-500">
            Address: <code className="bg-gray-100 px-2 py-1 rounded">{address}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="outline"
          >
            {showComparison ? "Hide" : "Show"} Comparison
          </Button>
          <Button
            onClick={handleTestEnhancedOpening}
            variant="outline"
          >
            Test Animation
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Implementation */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Current Pack Buying
            </CardTitle>
            <CardDescription>
              Basic transaction handling without NFT data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {renderStateIcon(oldHook.state, oldHook.isLoading)}
                  <Badge variant={oldHook.state === 'success' ? "default" : oldHook.state === 'error' ? "destructive" : "secondary"}>
                    {oldHook.state}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {getStateDescription(oldHook.state)}
                </div>
              </div>

              {oldHook.error && (
                <Alert>
                  <AlertDescription className="text-red-700">
                    {oldHook.error}
                  </AlertDescription>
                </Alert>
              )}

              {oldHook.transactionHash && (
                <div className="text-xs text-gray-500 break-all">
                  TX: {oldHook.transactionHash}
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-1">
                <div>• Basic transaction handling</div>
                <div>• No pack content preview</div>
                <div>• Generic success message</div>
                <div>• Manual inventory refresh needed</div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={oldHook.buyPackWithMON}
                  disabled={oldHook.isLoading}
                  size="sm"
                  className="flex-1"
                >
                  {oldHook.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Package className="h-4 w-4 mr-2" />
                  )}
                  Buy with MON
                </Button>
                <Button
                  onClick={oldHook.reset}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Implementation */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              Enhanced Pack Buying
            </CardTitle>
            <CardDescription>
              Complete pack purchase with real NFT data and animations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {renderStateIcon(newHook.state, newHook.isLoading)}
                  <Badge variant={newHook.state === 'success' ? "default" : newHook.state === 'error' ? "destructive" : "secondary"}>
                    {newHook.state}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {getStateDescription(newHook.state)}
                </div>
              </div>

              {newHook.packNFTs.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-sm font-medium text-green-700">
                    Pack Contents: {newHook.packNFTs.length} NFTs
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Pack ID: {newHook.packId}
                  </div>
                  <div className="grid grid-cols-5 gap-1 mt-2">
                    {newHook.packNFTs.slice(0, 5).map((nft) => (
                      <div key={nft.id} className="text-xs bg-white rounded px-1 py-0.5 text-center">
                        <div className="font-medium">{nft.name}</div>
                        <div className="text-gray-500">#{nft.id}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newHook.error && (
                <Alert>
                  <AlertDescription className="text-red-700">
                    {newHook.error}
                  </AlertDescription>
                </Alert>
              )}

              {newHook.transactionHash && (
                <div className="text-xs text-gray-500 break-all">
                  TX: {newHook.transactionHash}
                </div>
              )}

              <div className="text-sm text-gray-600 space-y-1">
                <div>• Complete transaction lifecycle</div>
                <div>• Real NFT data from API</div>
                <div>• Pack opening animation</div>
                <div>• Auto inventory update</div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={newHook.buyPackWithMON}
                  disabled={newHook.isLoading}
                  size="sm"
                  className="flex-1"
                >
                  {newHook.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Package className="h-4 w-4 mr-2" />
                  )}
                  Buy with MON
                </Button>
                <Button
                  onClick={newHook.reset}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison */}
      {showComparison && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Feature</th>
                    <th className="text-left p-2">Current</th>
                    <th className="text-left p-2">Enhanced</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Transaction Handling</td>
                    <td className="p-2">✅ Basic</td>
                    <td className="p-2">✅ Advanced</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Pack Data Retrieval</td>
                    <td className="p-2">❌ None</td>
                    <td className="p-2">✅ Real NFT data</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Pack Opening Animation</td>
                    <td className="p-2">🔶 Generic</td>
                    <td className="p-2">✅ With real cards</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Error Handling</td>
                    <td className="p-2">🔶 Basic</td>
                    <td className="p-2">✅ Comprehensive</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Loading States</td>
                    <td className="p-2">🔶 Limited</td>
                    <td className="p-2">✅ Detailed progress</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Inventory Integration</td>
                    <td className="p-2">❌ Manual refresh</td>
                    <td className="p-2">✅ Auto update</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">User Experience</td>
                    <td className="p-2">🔶 Basic</td>
                    <td className="p-2">✅ Rich & engaging</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Migration Guide */}
      <Card className="mt-6 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div>
                <strong>Update Hook Import:</strong> Replace <code>useNadmonPackBuying</code> with <code>useNadmonPackBuyingEnhanced</code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div>
                <strong>Update Shop Component:</strong> Replace <code>ShopPopup</code> with <code>ShopPopupEnhanced</code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div>
                <strong>Add Pack Opening:</strong> Use <code>PackOpeningEnhanced</code> component for displaying real NFTs
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div>
                <strong>Environment Setup:</strong> Ensure <code>NEXT_PUBLIC_API_URL</code> points to your backend
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">5</Badge>
              <div>
                <strong>Test Thoroughly:</strong> Verify pack purchase, NFT data retrieval, and animations work correctly
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Pack Opening Modal */}
      {showEnhancedPackOpening && (
        <PackOpeningEnhanced
          isOpening={showEnhancedPackOpening}
          onComplete={() => setShowEnhancedPackOpening(false)}
          packType={trialPack}
          packNFTs={[
            {
              id: 999,
              name: "Test Sunny",
              type: "Water",
              rarity: "common" as const,
              hp: 117,
              attack: 29,
              defense: 23,
              speed: 16,
              critical: 10,
              color: "#4ecdc4",
              image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/sunny-i.png"
            },
            {
              id: 998,
              name: "Test Medusa",
              type: "Fire",
              rarity: "rare" as const,
              hp: 110,
              attack: 35,
              defense: 16,
              speed: 16,
              critical: 6,
              color: "#ff6b6b",
              image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/medusa-i.png"
            },
            {
              id: 997,
              name: "Test Urchin",
              type: "Grass",
              rarity: "epic" as const,
              hp: 112,
              attack: 24,
              defense: 23,
              speed: 15,
              critical: 7,
              color: "#6c757d",
              image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/urchin-i.png"
            },
            {
              id: 996,
              name: "Test Cervus",
              type: "Water",
              rarity: "legendary" as const,
              hp: 93,
              attack: 22,
              defense: 16,
              speed: 13,
              critical: 5,
              color: "#4ecdc4",
              image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/cervus-i.png"
            },
            {
              id: 995,
              name: "Test Brindle",
              type: "Grass",
              rarity: "common" as const,
              hp: 91,
              attack: 20,
              defense: 15,
              speed: 12,
              critical: 9,
              color: "#6c757d",
              image: "https://coral-tremendous-gerbil-970.mypinata.cloud/ipfs/bafybeigrfu7u4jq5dtojkxi5q5jsg6mnutrwziokvsmrbunt2oz4hcmzo4/brindle-i.png"
            }
          ]}
          packId={123}
          onClose={() => setShowEnhancedPackOpening(false)}
        />
      )}
    </div>
  )
}

export default PackPurchaseDemo