"use client"

import type React from "react"
import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Zap, Database } from "lucide-react"

// Import both hooks for comparison
import { useNadmonNFTs } from "@/hooks/use-nadmon-nfts"
import { useNadmonNFTsAPI } from "@/hooks/use-nadmon-nfts-api"

interface InventoryMigrationDemoProps {
  onClose?: () => void
}

export function InventoryMigrationDemo({ onClose }: InventoryMigrationDemoProps) {
  const { address, isConnected } = useAccount()
  const [showComparison, setShowComparison] = useState(false)

  // Blockchain-based hook (current implementation)
  const { 
    nfts: blockchainNFTs, 
    loading: blockchainLoading, 
    error: blockchainError, 
    refetch: refetchBlockchain 
  } = useNadmonNFTs()

  // API-based hook (new implementation)
  const { 
    nfts: apiNFTs, 
    loading: apiLoading, 
    error: apiError, 
    refetch: refetchAPI 
  } = useNadmonNFTsAPI()

  if (!isConnected) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Wallet to Test</h2>
        <p className="text-gray-600">Please connect your wallet to compare inventory fetching methods.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Migration Demo</h1>
          <p className="text-gray-600 mt-2">
            Compare blockchain vs API-based NFT fetching for address: <code className="bg-gray-100 px-2 py-1 rounded">{address}</code>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="outline"
          >
            {showComparison ? "Hide" : "Show"} Comparison
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blockchain Method */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Blockchain Method (Current)
            </CardTitle>
            <CardDescription>
              Direct RPC calls to smart contract using wagmi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant={blockchainLoading ? "secondary" : blockchainError ? "destructive" : "default"}>
                  {blockchainLoading ? "Loading..." : blockchainError ? "Error" : `${blockchainNFTs.length} NFTs`}
                </Badge>
                <Button
                  onClick={refetchBlockchain}
                  disabled={blockchainLoading}
                  size="sm"
                  variant="outline"
                >
                  {blockchainLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {blockchainError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {blockchainError}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <div>• Multiple RPC calls per NFT</div>
                <div>• Slower for large collections</div>
                <div>• Direct blockchain dependency</div>
                <div>• Higher latency</div>
              </div>

              {blockchainNFTs.length > 0 && (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {blockchainNFTs.slice(0, 8).map((nft) => (
                    <div key={nft.id} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium">{nft.name}</div>
                      <div className="text-gray-600">#{nft.id} • {nft.type}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Method */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              API Method (New)
            </CardTitle>
            <CardDescription>
              Fast API calls to Go backend with Envio database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant={apiLoading ? "secondary" : apiError ? "destructive" : "default"}>
                  {apiLoading ? "Loading..." : apiError ? "Error" : `${apiNFTs.length} NFTs`}
                </Badge>
                <Button
                  onClick={refetchAPI}
                  disabled={apiLoading}
                  size="sm"
                  variant="outline"
                >
                  {apiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {apiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {apiError}
                </div>
              )}

              <div className="text-sm text-gray-600">
                <div>• Single API call for all NFTs</div>
                <div>• Real-time database queries</div>
                <div>• 3-second blockchain latency</div>
                <div>• Much faster response</div>
              </div>

              {apiNFTs.length > 0 && (
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {apiNFTs.slice(0, 8).map((nft) => (
                    <div key={nft.id} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium">{nft.name}</div>
                      <div className="text-gray-600">#{nft.id} • {nft.type}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison */}
      {showComparison && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Aspect</th>
                    <th className="text-left p-2">Blockchain Method</th>
                    <th className="text-left p-2">API Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">NFT Count</td>
                    <td className="p-2">{blockchainNFTs.length}</td>
                    <td className="p-2">{apiNFTs.length}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Loading State</td>
                    <td className="p-2">{blockchainLoading ? "Loading" : "Ready"}</td>
                    <td className="p-2">{apiLoading ? "Loading" : "Ready"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Error State</td>
                    <td className="p-2">{blockchainError ? "❌ Error" : "✅ OK"}</td>
                    <td className="p-2">{apiError ? "❌ Error" : "✅ OK"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Data Source</td>
                    <td className="p-2">Direct RPC calls</td>
                    <td className="p-2">Envio database</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Performance</td>
                    <td className="p-2">Slower (multiple calls)</td>
                    <td className="p-2">Faster (single call)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Real-time Updates</td>
                    <td className="p-2">15s polling</td>
                    <td className="p-2">30s polling + 3s blockchain latency</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Migration Instructions */}
      <Card className="mt-6 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700">Migration Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div>
                <strong>Test the API hook:</strong> Verify that <code>useNadmonNFTsAPI</code> returns the same data as the current blockchain method
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div>
                <strong>Update import:</strong> Change <code>import {`{useNadmonNFTs}`} from '@/hooks/use-nadmon-nfts'</code> to <code>import {`{useNadmonNFTsAPI as useNadmonNFTs}`} from '@/hooks/use-nadmon-nfts-api'</code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div>
                <strong>Set environment variable:</strong> Add <code>NEXT_PUBLIC_API_URL=http://localhost:8081</code> to your <code>.env.local</code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div>
                <strong>Test thoroughly:</strong> Ensure all inventory functionality works correctly with the new API
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-1">5</Badge>
              <div>
                <strong>Remove old code:</strong> Delete the old <code>use-nadmon-nfts.ts</code> file once migration is complete
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryMigrationDemo