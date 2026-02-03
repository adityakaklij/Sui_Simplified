import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { SimplifiedTransaction, DetailedTransaction, ViewMode } from '../types/transaction';
import { JourneyDataExtractor } from '../utils/journeyData';

interface JourneyMapProps {
  transaction: SimplifiedTransaction | DetailedTransaction;
  viewMode: ViewMode;
}

const JourneyMap: React.FC<JourneyMapProps> = ({ transaction }) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [animatedStages, setAnimatedStages] = useState<Set<number>>(new Set());
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  const isSuccess = transaction.status === 'success';
  
  // Memoize stages to prevent unnecessary recalculations and effect triggers
  const stages = useMemo(
    () => JourneyDataExtractor.extractStages(transaction),
    [transaction.digest] // Only recalculate when transaction changes
  );
  
  const balanceChanges = transaction.balanceChanges || [];

  // Animate stages sequentially with proper cleanup
  useEffect(() => {
    // Reset animation state for new transaction
    setAnimatedStages(new Set());
    
    // Clear any existing animation timeouts
    animationTimeoutsRef.current.forEach(clearTimeout);
    animationTimeoutsRef.current = [];
    
    // Schedule new animations
    stages.forEach((stage, index) => {
      const timeoutId = setTimeout(() => {
        setAnimatedStages(prev => new Set(prev).add(stage.stage));
      }, index * 300);
      animationTimeoutsRef.current.push(timeoutId);
    });
    
    // Cleanup on unmount or when transaction changes
    return () => {
      animationTimeoutsRef.current.forEach(clearTimeout);
      animationTimeoutsRef.current = [];
    };
  }, [transaction.digest, stages]);

  const copyToClipboard = useCallback(async (text: string, label: string = 'Copied!') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(label);
      
      // Clear previous timeout if any
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      
      copyTimeoutRef.current = setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);
  
  // Cleanup copy timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const shortenAddr = (addr: string) => {
    if (!addr || addr === 'Unknown') return addr;
    if (addr.length <= 20) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      'comic-blue': 'bg-comic-blue',
      'comic-red': 'bg-comic-red',
      'comic-yellow': 'bg-comic-yellow',
      'comic-green': 'bg-comic-green',
      'red-500': 'bg-red-500',
    };
    return colors[color] || 'bg-comic-blue';
  };

  return (
    <div className="mt-16 max-w-5xl mx-auto relative">
      {/* Copy Feedback Toast */}
      {copyFeedback && (
        <div className="fixed bottom-24 right-8 z-50 bg-comic-green text-black px-4 py-2 rounded-lg border-4 border-black shadow-comic font-bold animate-bounce">
          ✓ {copyFeedback}
        </div>
      )}

      {/* From/To Addresses - Enhanced with Balance Info */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-comic-blue">account_circle</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">From (Sender)</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-bold text-gray-900 dark:text-white break-all flex-1">
                  {shortenAddr(transaction.sender)}
                </p>
                <button
                  onClick={() => copyToClipboard(transaction.sender, 'Sender copied!')}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex-shrink-0 transition-colors"
                  title="Copy sender address"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
              </div>
              {balanceChanges.filter(c => !c.isPositive).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sent:</p>
                  {balanceChanges.filter(c => !c.isPositive).slice(0, 2).map((change, idx) => (
                    <p key={idx} className="text-xs font-bold text-red-500">
                      -{parseFloat(change.amount) / 1_000_000_000} {change.coinType}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-comic-green">flag</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                To (Recipients)
              </p>
              {transaction.recipients.length > 0 ? (
                <div className="space-y-1">
                  {transaction.recipients.slice(0, 2).map((recipient, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <p className="font-mono text-sm font-bold text-gray-900 dark:text-white break-all flex-1">
                        {shortenAddr(recipient)}
                      </p>
                      <button
                        onClick={() => copyToClipboard(recipient, 'Recipient copied!')}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex-shrink-0 transition-colors"
                        title="Copy recipient address"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                      </button>
                    </div>
                  ))}
                  {transaction.recipients.length > 2 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      +{transaction.recipients.length - 2} more
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {transaction.summary.category === 'contract' ? 'Smart Contract' : 'Self'}
                </p>
              )}
              {balanceChanges.filter(c => c.isPositive).length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Received:</p>
                  {balanceChanges.filter(c => c.isPositive).slice(0, 2).map((change, idx) => (
                    <p key={idx} className="text-xs font-bold text-comic-green">
                      +{parseFloat(change.amount) / 1_000_000_000} {change.coinType}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
          Your Journey Unfolds!
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {/* Follow the adventure from start to finish! 🗺️ */}
          Watch how your transaction travels across the Sui world
        </p>
      </div>
      
      <div className="map-bg p-5 sm:p-8 relative overflow-hidden">
        {/* Quest Status Badge */}
        <div className={`flex items-center gap-2 absolute top-4 right-4 z-20 ${
          isSuccess ? 'bg-white dark:bg-gray-900' : 'bg-red-100 dark:bg-red-900'
        } rounded-full py-1 px-3 border-2 border-black dark:border-white shadow-sm animate-pulse`}>
          <span className="relative flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              isSuccess ? 'bg-comic-green' : 'bg-red-500'
            } opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
              isSuccess ? 'bg-comic-green' : 'bg-red-500'
            } border-2 border-black dark:border-white`}></span>
          </span>
          <span className={`text-sm font-black uppercase ${
            isSuccess ? 'text-comic-green' : 'text-red-500'
          }`}>
            {isSuccess ? 'Tx Complete!' : 'Tx Failed!'}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-around gap-y-12 lg:gap-x-8 relative py-8">
          {/* Animated Path Lines - Desktop */}
          <div className="absolute lg:top-1/2 lg:left-[calc(10%_+_50px)] lg:w-[calc(80%_-_100px)] lg:h-8 flex lg:items-center justify-between pointer-events-none z-0">
            <div className="absolute w-[calc(33%_-_40px)] h-4 bg-map-path rounded-full -rotate-6 top-1/2 -translate-y-1/2 left-[calc(15%_-_20px)] hidden lg:block">
              <div className="h-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full animate-flow-path"></div>
            </div>
            <div className="absolute w-[calc(33%_-_40px)] h-4 bg-map-path rounded-full rotate-6 top-1/2 -translate-y-1/2 left-[calc(48%_-_20px)] hidden lg:block" style={{ animationDelay: '0.3s' }}>
              <div className="h-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full animate-flow-path"></div>
            </div>
            <div className="absolute w-[calc(33%_-_40px)] h-4 bg-map-path rounded-full -rotate-6 top-1/2 -translate-y-1/2 left-[calc(81%_-_20px)] hidden lg:block" style={{ animationDelay: '0.6s' }}>
              <div className="h-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent rounded-full animate-flow-path"></div>
            </div>
          </div>

          {/* Path Lines - Mobile */}
          <div className="absolute lg:hidden left-1/2 w-4 h-[calc(100%_-_100px)] bg-map-path rounded-full -translate-x-1/2 z-0 animate-pulse"></div>

          {stages.map((stage, index) => {
            const isAnimated = animatedStages.has(stage.stage);
            const showSparkles = stage.stage === 3 && transaction.summary.objectsCreated > 0;

            return (
              <React.Fragment key={stage.stage}>
                {/* Stage */}
                <div 
                  className={`flex flex-col items-center text-center z-10 w-40 relative transition-all duration-500 ${
                    isAnimated ? 'landmark-elevate opacity-100' : 'opacity-50 scale-95'
                  }`}
                >
                  {/* Desktop Info Bubble */}
                  <div className={`map-bubble ${
                    index % 2 === 0 ? 'map-bubble-right' : 'map-bubble-left'
                  } absolute ${index % 2 === 0 ? '-right-4' : '-left-4'} top-1/2 -translate-y-1/2 hidden md:block`}>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {stage.childFriendlyDescription}
                    </p>
                  </div>

                  {/* Icon with Animation */}
                  <div className={`w-28 h-28 flex items-center justify-center ${getColorClass(stage.color)} rounded-full border-4 border-black dark:border-white p-4 shadow-map-landmark dark:shadow-map-landmark-dark relative transition-all duration-500 ${
                    isAnimated ? 'scale-100 animate-bounce-in' : 'scale-75 opacity-50'
                  }`}>
                    {/* Sparkles for creation */}
                    {showSparkles && isAnimated && (
                      <div className="absolute inset-0 animate-pulse-slow pointer-events-none">
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 text-2xl animate-bounce">✨</span>
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-2 text-2xl rotate-180 animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 text-2xl -rotate-90 animate-bounce" style={{ animationDelay: '0.4s' }}>✨</span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 text-2xl rotate-90 animate-bounce" style={{ animationDelay: '0.6s' }}>✨</span>
                      </div>
                    )}

                    {/* Coin icons for balance changes - Removed emoji icons */}

                    {/* Pulsing ring for active stage */}
                    {isAnimated && (
                      <div className={`absolute inset-0 rounded-full border-4 ${getColorClass(stage.color)} opacity-30 animate-ping`}></div>
                    )}

                    <span className="material-symbols-outlined text-6xl text-white dark:text-black relative z-10">
                      {stage.icon}
                    </span>
                  </div>

                  {/* Title and Subtitle */}
                  <p className="mt-3 text-sm font-black text-gray-700 dark:text-gray-300 uppercase">
                    {stage.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stage.subtitle}
                  </p>

                  {/* Additional Info Badge */}
                  {stage.details?.count !== undefined && stage.details.count > 0 && (
                    <div className={`mt-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full border-2 border-black dark:border-white text-xs font-bold transition-all duration-300 ${
                      isAnimated ? 'scale-100' : 'scale-0'
                    }`}>
                      {stage.details.count} {stage.details.count === 1 ? 'item' : 'items'}
                    </div>
                  )}

                  {/* Balance change indicator for stage 4 */}
                  {stage.stage === 4 && balanceChanges.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {balanceChanges.slice(0, 2).map((change, idx) => (
                        <div key={idx} className={`px-2 py-1 rounded-md text-xs font-bold border-2 border-black dark:border-white ${
                          change.isPositive 
                            ? 'bg-comic-green text-black' 
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {change.isPositive ? '+' : '-'}
                          {(parseFloat(change.amount) / 1_000_000_000).toFixed(4)} {change.coinType}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mobile Info Bubble */}
                  <div className={`map-bubble ${
                    index % 2 === 0 ? 'map-bubble-left' : 'map-bubble-right'
                  } mt-4 md:hidden`}>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {stage.childFriendlyDescription}
                    </p>
                  </div>
                </div>

                {/* Arrow between stages (except last) */}
                {index < stages.length - 1 && (
                  <div className="flex-shrink-0 z-10 hidden lg:block">
                    <span 
                      className={`material-symbols-outlined text-6xl text-map-path transition-all duration-500 ${
                        index % 2 === 0 ? '-rotate-6' : 'rotate-6'
                      } ${isAnimated ? 'opacity-100' : 'opacity-30'}`}
                      style={{ animation: isAnimated ? 'slideRight 1s ease-in-out infinite' : 'none' }}
                    >
                      arrow_right_alt
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Summary Card at Bottom */}
        <div className="mt-8 bg-white dark:bg-gray-900 p-4 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800 dark:text-gray-200">
                Gas Fee: <span className="text-comic-red">{transaction.gasUsed.totalSUI} SUI</span>
              </span>
            </div>
            {transaction.summary.objectsCreated > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  Created: <span className="text-comic-green">{transaction.summary.objectsCreated}</span>
                </span>
              </div>
            )}
            {transaction.summary.objectsMutated > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  Changed: <span className="text-comic-yellow">{transaction.summary.objectsMutated}</span>
                </span>
              </div>
            )}
            {transaction.summary.eventsEmitted > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  Events: <span className="text-comic-blue">{transaction.summary.eventsEmitted}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default JourneyMap;
