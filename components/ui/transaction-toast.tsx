"use client"

import React from 'react'
import { CheckCircle, XCircle, Loader2, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'sonner'

export type TransactionStatus = 'loading' | 'success' | 'error' | 'pending'

export interface TransactionToastData {
  id: string
  status: TransactionStatus
  title: string
  description?: string
  txHash?: string
  blockExplorerUrl?: string
}

const statusIcons = {
  loading: <Loader2 className="w-4 h-4 animate-spin text-blue-400" />,
  pending: <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />,
  success: <CheckCircle className="w-4 h-4 text-green-400" />,
  error: <XCircle className="w-4 h-4 text-red-400" />
}

const statusColors = {
  loading: 'bg-blue-500/20 border-blue-400/30',
  pending: 'bg-yellow-500/20 border-yellow-400/30', 
  success: 'bg-green-500/20 border-green-400/30',
  error: 'bg-red-500/20 border-red-400/30'
}

function TransactionToastContent({ data }: { data: TransactionToastData }) {
  const copyTxHash = () => {
    if (data.txHash) {
      navigator.clipboard.writeText(data.txHash)
      toast.success('Transaction hash copied!', { duration: 2000 })
    }
  }

  const openBlockExplorer = () => {
    if (data.blockExplorerUrl && data.txHash) {
      window.open(`${data.blockExplorerUrl}/tx/${data.txHash}`, '_blank')
    }
  }

  return (
    <div className={`
      flex items-start gap-3 p-3 rounded-lg border backdrop-blur-md
      ${statusColors[data.status]}
      bg-black/80 text-white min-w-[320px] max-w-[400px]
    `}>
      {/* Status Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {statusIcons[data.status]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm text-white">{data.title}</p>
            {data.description && (
              <p className="text-xs text-white/70 mt-1">{data.description}</p>
            )}
          </div>
        </div>

        {/* Transaction Hash & Actions */}
        {data.txHash && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 font-mono">
                {data.txHash.slice(0, 8)}...{data.txHash.slice(-6)}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={copyTxHash}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Copy transaction hash"
                >
                  <Copy className="w-3 h-3 text-white/60 hover:text-white/80" />
                </button>
                {data.blockExplorerUrl && (
                  <button
                    onClick={openBlockExplorer}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                    title="View on block explorer"
                  >
                    <ExternalLink className="w-3 h-3 text-white/60 hover:text-white/80" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export class TransactionToastManager {
  private static activeToasts = new Map<string, string | number>()

  static show(data: TransactionToastData): string | number {
    const toastId = toast.custom(() => <TransactionToastContent data={data} />, {
      id: data.id,
      duration: data.status === 'loading' || data.status === 'pending' ? Infinity : 5000,
      position: 'top-right',
    })

    this.activeToasts.set(data.id, toastId)
    return toastId
  }

  static update(id: string, updates: Partial<TransactionToastData>) {
    const existingToastId = this.activeToasts.get(id)
    if (existingToastId) {
      toast.dismiss(existingToastId)
    }

    const updatedData = { id, ...updates } as TransactionToastData
    return this.show(updatedData)
  }

  static dismiss(id: string) {
    const toastId = this.activeToasts.get(id)
    if (toastId) {
      toast.dismiss(toastId)
      this.activeToasts.delete(id)
    }
  }

  static success(title: string, description?: string, txHash?: string) {
    const id = `tx-${Date.now()}`
    return this.show({
      id,
      status: 'success',
      title,
      description,
      txHash,
      blockExplorerUrl: 'https://testnet.monadexplorer.com'
    })
  }

  static error(title: string, description?: string, txHash?: string) {
    const id = `tx-${Date.now()}`
    return this.show({
      id,
      status: 'error',
      title,
      description,
      txHash,
      blockExplorerUrl: 'https://testnet.monadexplorer.com'
    })
  }

  static loading(title: string, description?: string) {
    const id = `tx-${Date.now()}`
    return this.show({
      id,
      status: 'loading',
      title,
      description,
      blockExplorerUrl: 'https://testnet.monadexplorer.com'
    })
  }

  static pending(title: string, description?: string, txHash?: string) {
    const id = `tx-${Date.now()}`
    return this.show({
      id,
      status: 'pending',
      title,
      description,
      txHash,
      blockExplorerUrl: 'https://testnet.monadexplorer.com'
    })
  }
} 