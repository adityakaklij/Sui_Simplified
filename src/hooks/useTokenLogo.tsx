import { useState, useEffect, useRef } from 'react';
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
  
  // Track if component is mounted to avoid state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
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
        // Only update state if component is still mounted
        if (isMountedRef.current && apiLogo && apiLogo !== staticLogo) {
          setLogoUrl(apiLogo);
        }
      })
      .catch(() => {
        // Keep static logo on error, component might be unmounted
        if (isMountedRef.current) {
          console.debug(`Logo fetch failed for ${coinName}, using static logo`);
        }
      });
    
    // Cleanup: mark as unmounted to prevent state updates
    return () => {
      isMountedRef.current = false;
    };
  }, [coinName]);

  return {
    logoUrl,
    icon: getTokenIcon(coinName),
    isLoading,
  };
}

