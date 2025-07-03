'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCookiesBalance } from '@/hooks/use-nadmon-contracts';
import { formatCookies } from '@/contracts/utils';
import { Wallet, Cookie, Coins } from 'lucide-react';

interface WalletHandleProps {
  className?: string;
}

export function WalletHandle({ className = '' }: WalletHandleProps) {
  const { address, isConnected } = useAccount();
  const { data: cookiesBalance, isLoading: loadingCookies } = useCookiesBalance(address);
  const { data: monBalance, isLoading: loadingMON } = useBalance({
    address: address,
  });

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button
            onClick={openConnectModal}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">Connect Wallet</span>
          </button>
        )}
      </ConnectButton.Custom>
    );
  }

  const truncateAddress = (address: string | undefined) => {
    if (!address) return '...';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Cookies Balance */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30">
        <Cookie className="w-3 h-3 text-amber-400" />
        <span className="text-amber-100 text-xs font-mono">
          {loadingCookies ? '...' : formatCookies(typeof cookiesBalance === 'bigint' ? cookiesBalance : BigInt(0))}
        </span>
      </div>

      {/* MON Balance */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30">
        <Coins className="w-3 h-3 text-blue-400" />
        <span className="text-blue-100 text-xs font-mono">
          {loadingMON ? '...' : (monBalance ? parseFloat(monBalance.formatted).toFixed(2) : '0.00')}
        </span>
      </div>

      {/* Wallet Address and Button */}
      <ConnectButton.Custom>
        {({ openAccountModal }) => (
          <button
            onClick={openAccountModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Wallet className="w-3 h-3 text-white/70" />
            <span className="text-white/70 text-xs font-mono">
              {truncateAddress(address)}
            </span>
          </button>
        )}
      </ConnectButton.Custom>
    </div>
  );
} 