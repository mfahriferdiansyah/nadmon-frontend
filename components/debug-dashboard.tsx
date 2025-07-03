'use client';

import { useAccount, useChainId, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { monadTestnet } from '@/lib/web3-config';

export function DebugDashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address: address,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Debug Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Wallet Connection */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <div className="space-y-2">
            <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
            <p><strong>Address:</strong> {address || 'Not connected'}</p>
            <p><strong>Balance:</strong> {balance ? `${balance.formatted} ${balance.symbol}` : 'Unknown'}</p>
          </div>
          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>



        {/* Contract Addresses */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Contract Addresses</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NadmonNFT:</strong> 0xd6486e985Db773f3eb5767cE5FBe099e31D87A1e</p>
            <p><strong>CookiesToken:</strong> 0xC5f6e87a61dAa7a15B458318e4D05C82C0cCD10b</p>
            <p><strong>PvEBattle:</strong> 0xAb87cf4A9ee8Ab510ca8a96546E71f97CD92DC8a</p>
            <p><strong>PvPBattle:</strong> 0xe1DD9f7C03281A659998bDDd84019c93473F5C7e</p>
            <p><strong>ExpeditionCenter:</strong> 0x5a7fc62B6EF9ACc5AD1a9a7E582b2A636ab83504</p>
            <p><strong>WeeklyRewards:</strong> 0xE0E0C7731b99659dC0b3624f2147bD929E3B503D</p>
          </div>
        </div>

        {/* Game Status */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Game Status</h2>
          <div className="space-y-2">
            <p><strong>Ready to Play:</strong> {isConnected ? 'Yes' : 'No'}</p>
            <p><strong>Wallet Required:</strong> {!isConnected ? 'Connect wallet first' : 'Connected'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}