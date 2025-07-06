// API Configuration for Nadmon Backend
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
  
  // API endpoints
  ENDPOINTS: {
    // Player endpoints
    PLAYER_NFTS: (address: string) => `/api/players/${address}/nadmons`,
    PLAYER_PROFILE: (address: string) => `/api/players/${address}/profile`,
    PLAYER_PACKS: (address: string) => `/api/players/${address}/packs`,
    PLAYER_STATS: (address: string) => `/api/players/${address}/stats`,
    PLAYER_SEARCH: (address: string) => `/api/players/${address}/search`,
    
    // NFT endpoints
    NFT_DETAILS: (tokenId: number) => `/api/nfts/${tokenId}`,
    NFT_HISTORY: (tokenId: number) => `/api/nfts/${tokenId}/history`,
    NFT_BATCH: '/api/nfts', // ?ids=1,2,3,4,5
    
    // Pack endpoints
    PACK_DETAILS: (packId: number) => `/api/packs/${packId}`,
    RECENT_PACKS: '/api/packs/recent',
    
    // Game data endpoints
    GAME_STATS: '/api/stats/game',
    LEADERBOARD: '/api/leaderboard/collectors',
    
    // Health check
    HEALTH: '/health',
  },
  
  // WebSocket configuration
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081/api/ws',
  
  // Request timeouts
  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    PACK_FETCH: 15000, // 15 seconds for pack fetching
    BATCH_FETCH: 20000, // 20 seconds for batch operations
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF_MULTIPLIER: 2,
  },
  
  // Polling intervals
  POLLING: {
    INVENTORY_REFRESH: 30000, // 30 seconds
    PACK_STATUS: 2000, // 2 seconds when waiting for pack
    HEALTH_CHECK: 60000, // 1 minute
  },
} as const;

// Helper function to build full URL
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to build WebSocket URL for user
export function buildWsUrl(address: string): string {
  return `${API_CONFIG.WS_URL}/${address}`;
}

// HTTP client with default configuration
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT.DEFAULT);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Retry wrapper for API requests
export async function apiRequestWithRetry<T = any>(
  endpoint: string,
  options: RequestInit = {},
  maxAttempts: number = API_CONFIG.RETRY.MAX_ATTEMPTS
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await apiRequest<T>(endpoint, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxAttempts) {
        break;
      }
      
      // Wait before retrying with exponential backoff
      const delay = API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_MULTIPLIER, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`API request failed, retrying ${attempt}/${maxAttempts}...`);
    }
  }
  
  throw lastError;
}

// Utility functions for common API patterns
export const apiUtils = {
  // Check if address is valid Ethereum address
  isValidAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
  
  // Format error messages for user display
  formatErrorMessage: (error: unknown): string => {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return 'No NFTs found for this address';
      }
      if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      if (error.message.includes('network')) {
        return 'Network error. Please check your connection.';
      }
      return error.message;
    }
    return 'An unexpected error occurred';
  },
  
  // Parse pack ID from transaction receipt
  extractPackIdFromReceipt: (receipt: any, userAddress: string): number | null => {
    try {
      // Try to find PackMinted event for this user
      const packEvent = receipt.logs?.find((log: any) => {
        try {
          // This would need to be implemented based on your contract interface
          // For now, return null to fall back to polling methods
          return false;
        } catch {
          return false;
        }
      });
      
      if (packEvent) {
        // Extract pack ID from event
        return packEvent.args?.packId ? Number(packEvent.args.packId) : null;
      }
      
      return null;
    } catch {
      return null;
    }
  },
};