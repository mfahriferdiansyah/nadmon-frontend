'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { monadTestnet } from '@/lib/web3-config';

interface WalletConnectionPopupProps {
  onClose?: () => void;
}

export function WalletConnectionPopup({ onClose }: WalletConnectionPopupProps) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [isConnecting, setIsConnecting] = useState(false);

  const isOnCorrectChain = chainId === monadTestnet.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Glass Popup */}
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl" />
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Logo/Title */}
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">🔮</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome to Nadmon</h1>
            <p className="text-white/80 text-sm">
              Connect your wallet to start collecting and battling digital creatures
            </p>
          </div>

          {/* Connection Status */}
          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-white/70 text-sm mb-4">
                  Choose your preferred wallet to connect
                </p>
                
                {/* Custom styled RainbowKit Connect Button */}
                <div className="[&>button]:w-full [&>button]:bg-gradient-to-r [&>button]:from-blue-500 [&>button]:to-purple-600 [&>button]:border-0 [&>button]:text-white [&>button]:font-semibold [&>button]:py-3 [&>button]:px-6 [&>button]:rounded-lg [&>button]:hover:from-blue-600 [&>button]:hover:to-purple-700 [&>button]:transition-all [&>button]:duration-200">
                  <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      authenticationStatus,
                      mounted,
                    }) => {
                      const ready = mounted && authenticationStatus !== 'loading';
                      const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                          authenticationStatus === 'authenticated');

                      return (
                        <div
                          {...(!ready && {
                            'aria-hidden': true,
                            style: {
                              opacity: 0,
                              pointerEvents: 'none',
                              userSelect: 'none',
                            },
                          })}
                        >
                          {(() => {
                            if (!connected) {
                              return (
                                <Button
                                  onClick={openConnectModal}
                                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                                >
                                  Connect Wallet
                                </Button>
                              );
                            }

                            if (chain.unsupported) {
                              return (
                                <Button
                                  onClick={openChainModal}
                                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                                >
                                  Wrong network
                                </Button>
                              );
                            }

                            return (
                              <div className="flex gap-3">
                                <Button
                                  onClick={openAccountModal}
                                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                                  variant="outline"
                                >
                                  {account.displayName}
                                  {account.displayBalance
                                    ? ` (${account.displayBalance})`
                                    : ''}
                                </Button>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }}
                  </ConnectButton.Custom>
                </div>
              </div>


            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected State */}
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <span className="text-green-100 font-semibold">Wallet Connected</span>
                </div>
                
                {!isOnCorrectChain ? (
                  <div className="space-y-2">
                    <p className="text-orange-200 text-sm">
                      Please switch to the correct network to play
                    </p>
                    <ConnectButton.Custom>
                      {({ openChainModal }) => (
                        <Button
                          onClick={openChainModal}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                          size="sm"
                        >
                          Switch Network
                        </Button>
                      )}
                    </ConnectButton.Custom>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-green-100 text-sm">
                      You're ready to start your adventure!
                    </p>
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
                    >
                      Enter Game
                    </Button>
                  </div>
                )}
              </div>

              {/* Wallet Info */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <ConnectButton.Custom>
                  {({ account }) => (
                    <div className="text-center">
                      <p className="text-white text-sm font-mono">
                        {account?.displayName}
                      </p>
                    </div>
                  )}
                </ConnectButton.Custom>
              </div>
            </div>
          )}

          {/* Game Features Preview */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm">What awaits you:</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-lg mb-1">🎴</div>
                <p className="text-white/80">Collect NFTs</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-lg mb-1">⚔️</div>
                <p className="text-white/80">Epic Battles</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-lg mb-1">🛍️</div>
                <p className="text-white/80">Buy Packs</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-lg mb-1">🏆</div>
                <p className="text-white/80">Win Rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}