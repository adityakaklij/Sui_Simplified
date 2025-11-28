import { useState, useEffect } from 'react';
import { getTokenLogo, getTokenLogoAsync, getTokenIcon } from '../utils/tokenLogos';

/**
 * Hook to get token logo URL with async loading from CoinGecko
 * Returns the static logo immediately, then updates with API logo if available
 */
export function useTokenLogo(coinName?: string): {
  logoUrl: string | null;
  icon: string;
  isLoading: boolean;
} {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!coinName) {
      setLogoUrl(null);
      setIsLoading(false);
      return;
    }

    // Set static logo immediately for instant display
    const staticLogo = getTokenLogo(coinName);
    setLogoUrl(staticLogo);
    setIsLoading(false); // Set to false since we have static logo

    // Then try to fetch from CoinGecko API in background
    getTokenLogoAsync(coinName)
      .then(apiLogo => {
        // Update with API logo if different and valid
        if (apiLogo && apiLogo !== staticLogo) {
          setLogoUrl(apiLogo);
        }
      })
      .catch((error) => {
        // Keep static logo on error, don't log to avoid console spam
        console.debug(`Logo fetch failed for ${coinName}, using static logo`);
      });
  }, [coinName]);

  return {
    logoUrl,
    icon: getTokenIcon(coinName),
    isLoading,
  };
}

