// Token logo utility with CoinGecko API integration
import { getCoinGeckoLogo, prefetchCommonLogos } from '../services/coingeckoService';

// Fallback static logos (used immediately while API loads)
const STATIC_LOGOS: Record<string, string> = {
  'SUI': 'https://strapi-dev.scand.app/uploads/sui_c07df05f00.png',
  'USDC': 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  'USDT': 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  'ETH': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  'BTC': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
};

// Fallback to a generic coin icon if logo fails to load
export const getTokenIcon = (coinName?: string): string => {
  if (!coinName) return '💰';
  
  const icons: Record<string, string> = {
    'SUI': '🟢',
    'USDC': '💵',
    'USDT': '💵',
    'ETH': '💎',
    'BTC': '₿',
  };
  
  return icons[coinName] || '🪙';
};

/**
 * Get static logo URL (synchronous, immediate return)
 * Use this for initial render, then update with async version
 */
export const getTokenLogo = (coinName?: string): string | null => {
  if (!coinName) return null;
  
  // Return static logo immediately
  return STATIC_LOGOS[coinName.toUpperCase()] || null;
};

/**
 * Get logo URL from CoinGecko API (async, with caching)
 * Falls back to static logo if API fails
 */
export const getTokenLogoAsync = async (coinName?: string): Promise<string | null> => {
  if (!coinName) return null;
  
  const normalizedName = coinName.toUpperCase();
  
  // Try CoinGecko API first
  try {
    const logoUrl = await getCoinGeckoLogo(normalizedName);
    if (logoUrl) {
      return logoUrl;
    }
  } catch (error) {
    console.warn(`Failed to fetch logo for ${coinName} from CoinGecko:`, error);
  }
  
  // Fallback to static logo
  return getTokenLogo(coinName);
};

/**
 * Prefetch common token logos on app initialization
 */
export const initializeTokenLogos = (): void => {
  // Prefetch in background
  prefetchCommonLogos().catch(error => {
    console.warn('Failed to prefetch token logos:', error);
  });
};
