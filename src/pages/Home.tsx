import React from 'react';
import HeroSection from '../components/HeroSection';
import TransactionSearch from '../components/TransactionSearch';
import JourneyMap from '../components/JourneyMap';
import SecretLoreCodex from '../components/SecretLoreCodex';
import { suiService } from '../services/suiService';
import { TransactionParser } from '../utils/transactionParser';
import type { SimplifiedTransaction, DetailedTransaction, ViewMode } from '../types/transaction';

interface HomeProps {
  network: string;
}

const Home: React.FC<HomeProps> = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>('simple');
  const [transaction, setTransaction] = React.useState<SimplifiedTransaction | DetailedTransaction | null>(null);

  const handleSearch = async (digest: string) => {
    if (!digest.trim()) {
      setError('Please enter a transaction digest');
      return;
    }

    setLoading(true);
    setError(null);
    setTransaction(null);

    try {
      const rawTx = await suiService.getTransaction(digest);
      
      // Always parse as detailed first to keep rawData
      const parsed = TransactionParser.parseDetailed(rawTx);
      setTransaction(parsed);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transaction');
      console.error('Transaction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <HeroSection />
      
      <TransactionSearch 
        onSearch={handleSearch} 
        loading={loading}
      />

      {/* View Mode Toggle */}
      {transaction && (
        <div className="mt-8 flex justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark p-1 inline-flex">
            <button
              onClick={() => handleViewModeChange('simple')}
              className={`px-6 py-2 font-bold text-sm uppercase rounded-md transition-colors ${
                viewMode === 'simple'
                  ? 'bg-comic-green text-black'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              👤 Simple View
            </button>
            <button
              onClick={() => handleViewModeChange('detailed')}
              className={`px-6 py-2 font-bold text-sm uppercase rounded-md transition-colors ${
                viewMode === 'detailed'
                  ? 'bg-comic-blue text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              💻 NERD MODE
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-comic-blue"></div>
          <p className="mt-4 text-lg font-bold text-gray-700 dark:text-gray-300">
            Fetching your quest details...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-12">
          <div className="bg-red-50 dark:bg-red-900/20 border-4 border-red-500 p-4 rounded-xl shadow-comic dark:shadow-none">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-red-500 text-3xl">error</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Oh no! Something went wrong on the map.</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Display */}
      {transaction && !loading && (
        <>
          <JourneyMap 
            transaction={transaction}
            viewMode={viewMode}
          />
          <SecretLoreCodex 
            transaction={transaction}
            viewMode={viewMode}
          />
        </>
      )}
    </div>
  );
};

export default Home;

