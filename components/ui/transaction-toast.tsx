"use client";

import { toast } from "sonner";
import { ExternalLink, Copy, Loader2, CheckCircle, XCircle } from "lucide-react";
import { truncateHash, getExplorerUrl, copyToClipboard, formatTransactionError } from "@/lib/transaction-utils";

export interface TransactionToastProps {
  hash?: string;
  message: string;
  type: "pending" | "confirming" | "success" | "error";
  duration?: number;
}

/**
 * Creates a transaction toast with appropriate styling and actions
 */
export function showTransactionToast({
  hash,
  message,
  type,
  duration = getDefaultDuration(type),
}: TransactionToastProps) {
  const toastId = toast.custom(
    (t) => (
      <div className="flex items-start gap-2 p-2 sm:p-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-md min-w-[260px] max-w-[300px] sm:max-w-[350px]">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {type === "pending" && (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          )}
          {type === "confirming" && (
            <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
          )}
          {type === "success" && (
            <CheckCircle className="w-4 h-4 text-green-400" />
          )}
          {type === "error" && (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-xs leading-tight">{message}</div>
          
          {hash && (
            <div className="flex items-center gap-2 mt-1">
              {/* Hash with copy functionality */}
              <button
                onClick={async () => {
                  await copyToClipboard(hash);
                  // Removed redundant toast call to prevent nested state updates
                }}
                className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors p-1 -m-1 rounded"
              >
                <Copy className="w-3 h-3 flex-shrink-0" />
                <span className="font-mono text-xs">{truncateHash(hash)}</span>
              </button>

              {/* Explorer link */}
              <a
                href={getExplorerUrl(hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors p-1 -m-1 rounded"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                <span className="text-xs">View</span>
              </a>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            // Defer dismiss to prevent render state updates
            setTimeout(() => toast.dismiss(t), 0)
          }}
          className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors p-1 rounded"
        >
          <XCircle className="w-3 h-3" />
        </button>
      </div>
    ),
    {
      id: `transaction-${type}-${hash || Date.now()}`,
      duration,
    }
  );

  return toastId;
}

/**
 * Gets default duration based on toast type
 */
function getDefaultDuration(type: TransactionToastProps["type"]): number {
  switch (type) {
    case "pending":
    case "confirming":
      return 4000; // 4 seconds
    case "success":
      return 3000; // 3 seconds
    case "error":
      return 5000; // 5 seconds
    default:
      return 3000;
  }
}

/**
 * Convenience functions for different transaction states
 */
export const transactionToast = {
  pending: (message: string) => 
    showTransactionToast({ message, type: "pending" }),
  
  confirming: (message: string, hash: string) => 
    showTransactionToast({ message, hash, type: "confirming" }),
  
  success: (message: string, hash: string) => 
    showTransactionToast({ message, hash, type: "success" }),
  
  error: (error: any) => 
    showTransactionToast({ 
      message: formatTransactionError(error), 
      type: "error" 
    }),
};