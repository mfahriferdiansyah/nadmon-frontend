'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { monadTestnet } from '@/lib/web3-config';
import { Wallet, X, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WalletHandle } from '@/components/wallet-handle';

interface WalletConnectionPopupProps {
  onClose?: () => void;
}

export function WalletConnectionPopup({ onClose }: WalletConnectionPopupProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const isOnCorrectChain = chainId === monadTestnet.id;

  const handleClose = () => {
    if (!isConnected && onClose) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to access NADMON features.",
        variant: "destructive",
      });
    }
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      {/* Popup */}
      <div className="relative w-full max-w-md glass-panel rounded-2xl backdrop-blur-lg bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Connect Wallet</h2>
              <p className="text-blue-300/80 text-sm">Join NADMON</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Message */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Connect your wallet to start collecting monsters, making purchases, and saving your progress on the blockchain.
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="flex justify-center">
            <WalletHandle className="scale-110" />
          </div>

          {!isConnected && (
            <div className="text-center">
              <p className="text-yellow-300 text-xs">
                👆 Click above to connect your wallet
              </p>
            </div>
          )}

          {isConnected && !isOnCorrectChain && (
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-300 text-xs">
                Please switch to Monad Testnet to continue
              </p>
            </div>
          )}

          {isConnected && isOnCorrectChain && (
            <div className="space-y-4">
              <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-green-300 text-xs flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Wallet connected! Ready to enter the game
                </p>
              </div>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-full px-6 py-4 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 border border-green-500 hover:border-green-400 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Enter Game
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(15px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}