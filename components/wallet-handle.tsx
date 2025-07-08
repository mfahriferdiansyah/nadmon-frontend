'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCookiesBalance } from '@/hooks/use-nadmon-contracts';
import { formatCookies } from '@/contracts/utils';
import { Wallet } from 'lucide-react';
import Image from 'next/image';

interface WalletHandleProps {
  className?: string;
}

// Format numbers with K, M, B abbreviations
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

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
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 min-w-[80px]">
        <Image 
          src="/token/cookies.png" 
          alt="COOKIES" 
          width={16} 
          height={16} 
          className="w-4 h-4 flex-shrink-0"
        />
        <span className="text-amber-100 text-sm font-medium font-mono">
          {loadingCookies ? '...' : formatNumber(Number(formatCookies(typeof cookiesBalance === 'bigint' ? cookiesBalance : BigInt(0)).replace(/,/g, '')))}
        </span>
      </div>

      {/* MON Balance */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-400/30 min-w-[80px]">
        <Image 
          src="/token/mon.png" 
          alt="MON" 
          width={16} 
          height={16} 
          className="w-4 h-4 flex-shrink-0"
        />
        <span className="text-purple-100 text-sm font-medium font-mono">
          {loadingMON ? '...' : formatNumber(monBalance ? parseFloat(monBalance.formatted) : 0)}
        </span>
      </div>

      {/* Wallet Address and Button */}
      <ConnectButton.Custom>
        {({ openAccountModal }) => (
          <button
            onClick={openAccountModal}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Wallet className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm font-mono">
              {truncateAddress(address)}
            </span>
          </button>
        )}
      </ConnectButton.Custom>
    </div>
  );
} 