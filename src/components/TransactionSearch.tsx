import React, { useState } from 'react';

interface TransactionSearchProps {
  onSearch: (digest: string) => void;
  loading: boolean;
}

const TransactionSearch: React.FC<TransactionSearchProps> = ({ onSearch, loading }) => {
  const [digest, setDigest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(digest);
  };

  const loadExample = (e: React.MouseEvent) => {
    e.preventDefault();
    const exampleDigest = 'BNZJ3RWCNYCDB8vwhEMn3ihifZNebCeid9GyEG2quWfz';
    setDigest(exampleDigest);
    onSearch(exampleDigest);
  };

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <label className="sr-only" htmlFor="transaction-digest">Sui Transaction Digest</label>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row w-full items-stretch rounded-lg shadow-comic dark:shadow-comic-dark border-4 border-black dark:border-white focus-within:ring-4 focus-within:ring-comic-yellow dark:focus-within:ring-comic-blue">
          <div className="flex items-center pl-4 bg-white dark:bg-gray-900 rounded-l-lg">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-3xl">search</span>
          </div>
          <input 
            className="form-input flex-grow block w-full min-w-0 resize-none overflow-hidden bg-white dark:bg-gray-900 border-0 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-500 py-4 text-base font-semibold" 
            id="transaction-digest" 
            name="transaction-digest" 
            placeholder="Paste your transaction diget here..." 
            type="text" 
            value={digest}
            onChange={(e) => setDigest(e.target.value)}
            disabled={loading}
          />
          <div className="flex items-center p-1.5 bg-white dark:bg-gray-900 rounded-r-lg">
            <button 
              type="submit"
              disabled={loading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-5 bg-comic-red text-white text-lg font-black tracking-wide hover:bg-comic-red/90 focus:outline-none uppercase border-2 border-black dark:border-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">{loading ? 'Loading...' : 'Map It!'}</span>
            </button>
          </div>
        </div>
      </form>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 font-semibold">
        <a className="underline hover:text-primary cursor-pointer" onClick={loadExample}>
        View an example digest
        </a>
      </p>
    </div>
  );
};

export default TransactionSearch;

