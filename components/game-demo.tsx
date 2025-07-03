'use client';

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { 
  useCookiesBalance, 
  useMONBalance, 
  useNadmonBalance, 
  useBuyPackWithMON,
  usePvEBattle 
} from '@/hooks/use-nadmon-contracts';
import { formatCookies, formatMON } from '@/contracts/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export function GameDemo() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  // Contract read hooks
  const { data: cookiesBalance, isLoading: loadingCookies } = useCookiesBalance(address);
  const { data: monBalance, isLoading: loadingMON } = useMONBalance(address);
  const { data: nadmonBalance, isLoading: loadingNadmons } = useNadmonBalance(address);

  // Contract write hooks
  const { buyPack, isPending: buyingPack, isConfirmed: packBought, error: buyError } = useBuyPackWithMON();
  const { battle, isPending: battling, isConfirmed: battleComplete, error: battleError } = usePvEBattle();

  const handleBuyPack = () => {
    buyPack();
  };

  const handleBattle = () => {
    // Use tokenId 1 with difficulty 1 for demo
    battle(1, 1);
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to play Nadmon on local Anvil network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isConnecting}
              variant="outline"
              className="w-full"
            >
              {isConnecting ? 'Connecting...' : `Connect ${connector.name}`}
            </Button>
          ))}
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Local Network:</strong> Anvil (Chain ID: 31337)</p>
            <p><strong>RPC:</strong> http://127.0.0.1:8545</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Account Connected</span>
            <Button onClick={() => disconnect()} variant="outline" size="sm">
              Disconnect
            </Button>
          </CardTitle>
          <CardDescription className="space-y-2">
            <div><strong>Address:</strong> {address}</div>
            <div className="flex items-center gap-2">
              <strong>Chain ID:</strong> 
              <span className={chainId === 31337 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {chainId}
              </span>
              {chainId === 31337 ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✅ Anvil Local
                </Badge>
              ) : (
                <Badge variant="destructive">
                  ❌ Wrong Network
                </Badge>
              )}
            </div>
            {chainId !== 31337 && (
              <div className="text-sm text-amber-600 mt-2">
                ⚠️ Please switch to Anvil Local network (Chain ID: 31337)
              </div>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Game Balances</CardTitle>
          <CardDescription>Your current in-game assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {loadingNadmons ? '...' : nadmonBalance?.toString() || '0'}
              </div>
              <div className="text-sm text-muted-foreground">Nadmons</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {loadingCookies ? '...' : formatCookies(typeof cookiesBalance === 'bigint' ? cookiesBalance : BigInt(0))}
              </div>
              <div className="text-sm text-muted-foreground">COOKIES</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">
                {loadingMON ? '...' : formatMON(typeof monBalance === 'bigint' ? monBalance : BigInt(0))}
              </div>
              <div className="text-sm text-muted-foreground">MON</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Game Actions</CardTitle>
          <CardDescription>Test the game functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              onClick={handleBuyPack} 
              disabled={buyingPack || chainId !== 31337}
              className="w-full"
            >
              {buyingPack ? 'Buying Pack...' : 'Buy Pack with MON (0.01 ETH)'}
            </Button>
            {packBought && (
              <Badge variant="secondary" className="w-full justify-center">
                ✅ Pack purchased successfully!
              </Badge>
            )}
            {buyError && (
              <Badge variant="destructive" className="w-full justify-center">
                ❌ Error: {buyError.message}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Button 
              onClick={handleBattle} 
              disabled={battling || !nadmonBalance || nadmonBalance === BigInt(0) || chainId !== 31337}
              variant="outline"
              className="w-full"
            >
              {battling ? 'Battling...' : 'PvE Battle (Nadmon #1, Difficulty 1)'}
            </Button>
            {battleComplete && (
              <Badge variant="secondary" className="w-full justify-center">
                ⚔️ Battle completed!
              </Badge>
            )}
            {battleError && (
              <Badge variant="destructive" className="w-full justify-center">
                ❌ Battle Error: {battleError.message}
              </Badge>
            )}
            {(!nadmonBalance || nadmonBalance === BigInt(0)) && chainId === 31337 && (
              <p className="text-sm text-muted-foreground text-center">
                You need at least 1 Nadmon to battle. Buy a pack first!
              </p>
            )}
            {chainId !== 31337 && (
              <p className="text-sm text-amber-600 text-center">
                ⚠️ Switch to Anvil Local network to use game features
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contract Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
          <CardDescription>Deployed contract addresses on Anvil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>NadmonNFT:</strong> 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707</div>
            <div><strong>CookiesToken:</strong> 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0</div>
            <div><strong>PvEBattle:</strong> 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318</div>
            <div><strong>MockMON:</strong> 0x5FbDB2315678afecb367f032d93F642f64180aa3</div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Dashboard Link */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Tools</CardTitle>
          <CardDescription>View detailed NFT ownership and blockchain data</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/debug">
            <Button variant="outline" className="w-full">
              Open Debug Dashboard
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            See all your NFTs, detailed stats, and blockchain explorer data
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 