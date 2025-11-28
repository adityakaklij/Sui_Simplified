// CoinGecko API service with caching

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  last_updated: string;
}

interface CachedLogoData {
  logoUrl: string;
  priceData?: CoinGeckoMarketData;
  timestamp: number;
}

// Cache duration: 1 hour (3600000 ms)
const CACHE_DURATION = 60 * 60 * 1000;
const COINGECKO_API_KEY = 'CG-szxrubZPAKKwYnQXtkUuq57x';
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// In-memory cache
const logoCache = new Map<string, CachedLogoData>();

// Symbol to CoinGecko ID mapping
const SYMBOL_TO_ID: Record<string, string> = {
  'SUI': 'sui',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'ETH': 'ethereum',
  'BTC': 'bitcoin',
};

/**
 * Get coin ID from symbol
 */
function getCoinId(symbol: string): string | null {
  const normalizedSymbol = symbol.toUpperCase();
  return SYMBOL_TO_ID[normalizedSymbol] || null;
}

/**
 * Get cached logo data
 */
function getCachedLogo(symbol: string): CachedLogoData | null {
  const coinId = getCoinId(symbol);
  if (!coinId) return null;

  const cached = logoCache.get(coinId);
  if (!cached) return null;

  // Check if cache is still valid
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    logoCache.delete(coinId);
    return null;
  }

  return cached;
}

/**
 * Set cached logo data
 */
function setCachedLogo(symbol: string, data: CachedLogoData): void {
  const coinId = getCoinId(symbol);
  if (!coinId) return;

  logoCache.set(coinId, data);

  // Also cache in localStorage for persistence across page reloads
  try {
    const cacheKey = `coingecko_logo_${coinId}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {
    // localStorage might be disabled, ignore
    console.warn('Failed to cache logo in localStorage:', e);
  }
}

/**
 * Load from localStorage on initialization
 */
function loadFromLocalStorage(): void {
  try {
    Object.keys(SYMBOL_TO_ID).forEach(symbol => {
      const coinId = SYMBOL_TO_ID[symbol];
      const cacheKey = `coingecko_logo_${coinId}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const data: CachedLogoData = JSON.parse(cached);
          const now = Date.now();
          
          // Only use if cache is still valid
          if (now - data.timestamp <= CACHE_DURATION) {
            logoCache.set(coinId, data);
          } else {
            localStorage.removeItem(cacheKey);
          }
        } catch (e) {
          // Invalid cache, remove it
          localStorage.removeItem(cacheKey);
        }
      }
    });
  } catch (e) {
    // localStorage might be disabled, ignore
    console.warn('Failed to load logos from localStorage:', e);
  }
}

// Initialize cache from localStorage
loadFromLocalStorage();

/**
 * Fetch logo from CoinGecko API
 */
async function fetchLogoFromAPI(symbol: string): Promise<CachedLogoData | null> {
  // Check if we support this symbol
  const coinId = getCoinId(symbol);
  if (!coinId) {
    // Symbol not in our supported list, but try API anyway
    console.debug(`Symbol ${symbol} not in supported list, trying API anyway`);
  }

  try {
    // Use the symbol directly in the API call (lowercase, e.g., 'sui')
    const symbolLower = symbol.toLowerCase();
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&symbols=${symbolLower}&price_change_percentage=1h`;
    
    const response = await fetch(url, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });

    if (!response.ok) {
      console.warn(`CoinGecko API error for ${symbol}:`, response.status, response.statusText);
      return null;
    }

    const data: CoinGeckoMarketData[] = await response.json();
    
    if (!data || data.length === 0) {
      console.debug(`No data returned from CoinGecko for symbol: ${symbol}`);
      return null;
    }

    const marketData = data[0];
    if (!marketData.image) {
      console.warn(`No image URL in CoinGecko response for ${symbol}`);
      return null;
    }

    const cachedData: CachedLogoData = {
      logoUrl: marketData.image,
      priceData: marketData,
      timestamp: Date.now(),
    };

    setCachedLogo(symbol, cachedData);
    return cachedData;
  } catch (error) {
    console.error(`Error fetching logo for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get logo URL for a coin symbol
 * Uses cache first, then API if needed
 */
export async function getCoinGeckoLogo(symbol: string): Promise<string | null> {
  // Check cache first
  const cached = getCachedLogo(symbol);
  if (cached) {
    return cached.logoUrl;
  }

  // Fetch from API
  const data = await fetchLogoFromAPI(symbol);
  return data?.logoUrl || null;
}

/**
 * Get price data for a coin symbol
 */
export async function getCoinGeckoPriceData(symbol: string): Promise<CoinGeckoMarketData | null> {
  // Check cache first
  const cached = getCachedLogo(symbol);
  if (cached?.priceData) {
    return cached.priceData;
  }

  // Fetch from API
  const data = await fetchLogoFromAPI(symbol);
  return data?.priceData || null;
}

/**
 * Prefetch logos for common coins
 */
export async function prefetchCommonLogos(): Promise<void> {
  const commonCoins = ['SUI', 'USDC', 'USDT', 'ETH', 'BTC'];
  
  // Fetch in parallel, but don't wait for all
  Promise.all(
    commonCoins.map(symbol => getCoinGeckoLogo(symbol))
  ).catch(error => {
    console.warn('Error prefetching logos:', error);
  });
}

