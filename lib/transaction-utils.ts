/**
 * Utilities for handling transaction data in toast notifications
 */

/**
 * Truncates a transaction hash to a readable format
 * @param hash - The full transaction hash
 * @returns Truncated hash in format "0x1234...5678"
 */
export function truncateHash(hash: string): string {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * Generates block explorer URL for a transaction
 * @param hash - The transaction hash
 * @param chainId - Optional chain ID (defaults to testnet)
 * @returns Full URL to the transaction on block explorer
 */
export function getExplorerUrl(hash: string, chainId?: number): string {
  // For now, defaulting to Monad testnet explorer
  // Can be extended to support different chains based on chainId
  const baseUrl = "https://testnet.monadexplorer.com";
  return `${baseUrl}/tx/${hash}`;
}

/**
 * Copies text to clipboard with error handling
 * @param text - Text to copy
 * @returns Promise that resolves to boolean indicating success
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    } catch (fallbackError) {
      console.error("Failed to copy to clipboard:", fallbackError);
      return false;
    }
  }
}

/**
 * Formats error messages for user-friendly display
 * @param error - Error object or string
 * @returns Formatted error message
 */
export function formatTransactionError(error: any): string {
  if (typeof error === "string") {
    return error;
  }
  
  if (error?.message) {
    // Common Web3 error patterns
    if (error.message.includes("insufficient funds")) {
      return "Insufficient funds for transaction";
    }
    if (error.message.includes("user rejected")) {
      return "Transaction cancelled by user";
    }
    if (error.message.includes("gas")) {
      return "Transaction failed due to gas issues";
    }
    if (error.message.includes("nonce")) {
      return "Transaction nonce error - please try again";
    }
    
    // Return the original message if no pattern matches
    return error.message;
  }
  
  return "Transaction failed - please try again";
}