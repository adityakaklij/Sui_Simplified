import React, { useState } from 'react';
import type { SimplifiedTransaction, DetailedTransaction, ViewMode } from '../types/transaction';
import { TransactionParser } from '../utils/transactionParser';
import { useTokenLogo } from '../hooks/useTokenLogo';
import Tooltip from './Tooltip';

interface SecretLoreCodexProps {
  transaction: SimplifiedTransaction | DetailedTransaction;
  viewMode: ViewMode;
}

const SecretLoreCodex: React.FC<SecretLoreCodexProps> = ({ transaction, viewMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const detailedTx = viewMode === 'detailed' ? transaction as DetailedTransaction : null;
  const developerDetailsRef = React.useRef<HTMLDivElement>(null);

  const copyToClipboard = async (text: string, label: string = 'Copied!') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyFeedback('Copy failed');
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  // Scroll to developer details when view mode changes to detailed
  React.useEffect(() => {
    if (viewMode === 'detailed' && developerDetailsRef.current) {
      setTimeout(() => {
        developerDetailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [viewMode]);

  return (
    <div className="mt-8 relative" ref={viewMode === 'detailed' ? developerDetailsRef : null}>
      {/* Copy Feedback Toast */}
      {copyFeedback && (
        <div className="fixed bottom-24 right-8 z-50 bg-comic-green text-black px-4 py-2 rounded-lg border-4 border-black shadow-comic font-bold animate-bounce">
          ✓ {copyFeedback}
        </div>
      )}
      
      <details className="group bg-transparent" open={isOpen}>
        <summary 
          className="flex items-center justify-between p-5 cursor-pointer list-none bg-white dark:bg-gray-900/50 rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark overflow-hidden"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-base font-black text-gray-900 dark:text-white uppercase">
              {viewMode === 'simple' ? '📜 Transaction Summary' : '💻 Developer Details'}
            </h3>
          </div>
          <span className={`material-symbols-outlined transition-transform duration-300 text-3xl font-bold ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </summary>
        
        {isOpen && viewMode === 'simple' && (
          <div className="pt-8 grid grid-cols-1 gap-8">
            {/* Simple View - For Layman Users */}
            
            {/* Transaction Status */}
            <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
              <div className={`${
                transaction.status === 'success' ? 'bg-comic-green' : 'bg-red-500'
              } text-black dark:text-white p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3`}>
                <span className="material-symbols-outlined text-3xl">
                  {transaction.status === 'success' ? 'check_circle' : 'cancel'}
                </span>
                <h4 className="text-lg font-black uppercase">Transaction Status</h4>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-800 dark:text-gray-200">Status:</p>
                  <p className={`font-black text-lg uppercase ${
                    transaction.status === 'success' ? 'text-comic-green' : 'text-red-500'
                  }`}>
                    {transaction.status === 'success' ? '✓ Success' : '✗ Failed'}
                  </p>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-gray-800 dark:text-gray-200">What Happened:</p>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 text-right max-w-xs">
                    {transaction.summary.description}
                  </p>
                </div>
                <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-600 my-2"></div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">From:</p>
                    <div className="flex items-center gap-2">
                      <Tooltip content={transaction.sender} position="top">
                        <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md break-all flex-1 text-xs cursor-help">
                          {transaction.sender}
                        </p>
                      </Tooltip>
                      <Tooltip content="Copy sender address" position="top">
                        <button 
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex-shrink-0 transition-colors"
                          onClick={() => copyToClipboard(transaction.sender, 'Sender address copied!')}
                        >
                          <span className="material-symbols-outlined text-base">content_copy</span>
                        </button>
                      </Tooltip>
                    </div>
                </div>
                {transaction.recipients.length > 0 && (
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                      To ({transaction.recipients.length} recipient{transaction.recipients.length > 1 ? 's' : ''}):
                    </p>
                    <div className="space-y-2">
                      {transaction.recipients.slice(0, 3).map((recipient, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Tooltip content={recipient} position="top">
                            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md break-all flex-1 text-xs cursor-help">
                              {recipient}
                            </p>
                          </Tooltip>
                          <Tooltip content="Copy recipient address" position="top">
                            <button 
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex-shrink-0 transition-colors"
                              onClick={() => copyToClipboard(recipient, 'Recipient address copied!')}
                            >
                              <span className="material-symbols-outlined text-base">content_copy</span>
                            </button>
                          </Tooltip>
                        </div>
                      ))}
                      {transaction.recipients.length > 3 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 pl-2">
                          +{transaction.recipients.length - 3} more recipients
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-600 my-2"></div>
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-gray-800 dark:text-gray-200">Time:</p>
                  <p className="font-mono text-gray-700 dark:text-gray-300">{transaction.timestamp}</p>
                </div>
              </div>
            </div>

            {/* Balance Changes */}
            {transaction.balanceChanges.length > 0 && (
              <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                <div className="bg-comic-yellow text-black p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl">payments</span>
                  <h4 className="text-lg font-black uppercase">Your Balance Changes</h4>
                </div>
                <div className="p-5 space-y-4 text-sm">
                  {transaction.balanceChanges.map((change, idx) => (
                    <div key={idx} className={`p-3 rounded-md border-l-4 ${
                      change.isPositive 
                        ? 'bg-green-50 dark:bg-green-900/20 border-comic-green' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    }`}>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-800 dark:text-gray-200">{change.coinType}</p>
                        <p className={`font-black text-lg ${
                          change.isPositive ? 'text-comic-green' : 'text-red-500'
                        }`}>
                          {change.isPositive ? '+' : '-'}{TransactionParser.formatMIST(change.amount)} {change.coinType}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-600 mt-4 pt-4">
                    <div className="flex justify-between items-baseline">
                      <p className="font-black text-gray-900 dark:text-white uppercase">Gas Fee Paid:</p>
                      <p className="font-mono font-black text-red-500">{transaction.gasUsed.totalSUI} SUI</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Activity Summary */}
            <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
              <div className="bg-comic-blue text-white p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">summarize</span>
                <h4 className="text-lg font-black uppercase">Activity Summary</h4>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Objects Created:</span>
                  <span className="font-black text-comic-green text-lg">{transaction.summary.objectsCreated}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Objects Modified:</span>
                  <span className="font-black text-comic-yellow text-lg">{transaction.summary.objectsMutated}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md">
                  <span className="font-bold text-gray-800 dark:text-gray-200">Events Emitted:</span>
                  <span className="font-black text-comic-blue text-lg">{transaction.summary.eventsEmitted}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isOpen && viewMode === 'detailed' && detailedTx && (
          <div className="pt-8">
            {/* Use a more flexible grid that auto-balances columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-max">
              {/* Detailed View - For Developers */}
              
              {/* Left Column - Will auto-balance with right */}
              <div className="space-y-8 min-w-0">
              {/* Transaction Info */}
              <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                <div className="bg-comic-red text-white p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl">receipt_long</span>
                  <h4 className="text-lg font-black uppercase">Transaction Details</h4>
                </div>
                <div className="p-5 space-y-4 text-sm">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">Digest:</p>
                    <div className="flex items-center gap-2">
                      <Tooltip content={transaction.digest} position="top">
                        <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md truncate flex-1 text-xs cursor-help">
                          {transaction.digest}
                        </p>
                      </Tooltip>
                      <Tooltip content="Copy transaction digest" position="top">
                        <button 
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex-shrink-0 transition-colors"
                          onClick={() => copyToClipboard(transaction.digest, 'Digest copied!')}
                        >
                          <span className="material-symbols-outlined text-base">content_copy</span>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">Sender:</p>
                    <div className="flex items-center gap-2">
                      <Tooltip content={transaction.sender} position="top">
                        <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded-md truncate flex-1 text-xs cursor-help">
                          {transaction.sender}
                        </p>
                      </Tooltip>
                      <Tooltip content="Copy sender address" position="top">
                        <button 
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex-shrink-0 transition-colors"
                          onClick={() => copyToClipboard(transaction.sender, 'Sender address copied!')}
                        >
                          <span className="material-symbols-outlined text-base">content_copy</span>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">Status:</p>
                    <p className={`font-black uppercase ${
                      transaction.status === 'success' ? 'text-comic-green' : 'text-red-500'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">Timestamp:</p>
                    <p className="text-gray-700 dark:text-gray-300">{transaction.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Gas Costs */}
              <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                <div className="bg-comic-yellow text-black p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl">local_fire_department</span>
                  <h4 className="text-lg font-black uppercase">Gas Breakdown</h4>
                </div>
                <div className="p-5 space-y-4 text-sm">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-800 dark:text-gray-200">Computation Cost:</p>
                    <p className="font-mono font-bold text-comic-red">
                      {detailedTx.effects.computationCost} MIST
                    </p>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-800 dark:text-gray-200">Storage Cost:</p>
                    <p className="font-mono font-bold text-comic-blue">
                      {detailedTx.effects.storageCost} MIST
                    </p>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-800 dark:text-gray-200">Storage Rebate:</p>
                    <p className="font-mono font-bold text-comic-green">
                      -{detailedTx.effects.storageRebate} MIST
                    </p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-600 my-2"></div>
                  <div className="flex justify-between items-baseline">
                    <p className="font-black text-gray-900 dark:text-white uppercase text-base">Total Gas:</p>
                    <div className="text-right">
                      <p className="font-mono font-black text-lg text-comic-red">
                        {transaction.gasUsed.totalSUI} SUI
                      </p>
                      <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        ({transaction.gasUsed.total} MIST)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Contract Calls - Moved right after Gas Breakdown */}
              {detailedTx.moveCalls.length > 0 && (
                <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                  <div className="bg-purple-500 text-white p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-3xl">code</span>
                    <h4 className="text-lg font-black uppercase">Smart Contract Calls</h4>
                  </div>
                  <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
                    {detailedTx.moveCalls.map((call, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-md border-l-4 border-purple-500">
                        <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">
                          Call #{idx + 1}
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Module:</span>
                            <code className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              {call.module}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Function:</span>
                            <code className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              {call.function}
                            </code>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-400">Package:</span>
                            <Tooltip content={call.package} position="top">
                              <code className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs flex-1 truncate cursor-help">
                                {call.package}
                              </code>
                            </Tooltip>
                            <Tooltip content="Copy package address" position="top">
                              <button 
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex-shrink-0 transition-colors"
                                onClick={() => copyToClipboard(call.package, 'Package copied!')}
                              >
                                <span className="material-symbols-outlined text-xs">content_copy</span>
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

              {/* Right Column - Will auto-balance with left */}
              <div className="space-y-8 min-w-0">
                {/* Transaction Inputs - Moved to right column for better balance */}
                {detailedTx.inputs.length > 0 && (
                  <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                    <div className="bg-indigo-500 text-white p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">input</span>
                      <h4 className="text-lg font-black uppercase">Transaction Inputs</h4>
                    </div>
                    <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
                      {detailedTx.inputs.map((input, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-md border-l-4 border-indigo-500">
                          <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                            {input.label}
                          </p>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-400">Type:</span>
                              <code className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                {input.type}
                              </code>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-400">Value:</span>
                              <Tooltip content={input.value} position="top">
                                <code className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-1 break-all cursor-help">
                                  {input.formattedValue || input.value}
                                </code>
                              </Tooltip>
                              <Tooltip content="Copy input value" position="top">
                                <button 
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex-shrink-0 transition-colors"
                                  onClick={() => copyToClipboard(input.value, 'Input copied!')}
                                >
                                  <span className="material-symbols-outlined text-xs">content_copy</span>
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Object Changes - Enhanced */}
                {detailedTx.objectChanges.length > 0 && (
                  <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                    <div className="bg-comic-blue text-white p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">change_circle</span>
                      <h4 className="text-lg font-black uppercase">Object Changes</h4>
                    </div>
                    <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
                      {detailedTx.objectChanges.map((change, idx) => (
                        <ObjectChangeItem key={idx} change={change} copyToClipboard={copyToClipboard} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Transaction Operations - If exists */}
                {detailedTx.operations && detailedTx.operations.length > 0 && (
                  <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                    <div className="bg-orange-500 text-white p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">settings</span>
                      <h4 className="text-lg font-black uppercase">Transaction Operations</h4>
                    </div>
                    <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
                      {detailedTx.operations.map((op, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-md border-l-4 border-orange-500">
                          <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                            {op.description}
                          </p>
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer text-orange-600 hover:underline">
                              View operation details
                            </summary>
                            <div className="mt-2 bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                              <pre className="text-xs whitespace-pre-wrap break-words">
                                {JSON.stringify(op.details, null, 2)}
                              </pre>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events - If exists */}
                {detailedTx.events && detailedTx.events.length > 0 && (
                  <div className="codex-bg rounded-xl border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark">
                    <div className="bg-comic-green text-black p-3 rounded-t-lg border-b-4 border-black dark:border-white flex items-center gap-3">
                      <span className="material-symbols-outlined text-3xl">spatial_audio</span>
                      <h4 className="text-lg font-black uppercase">Events</h4>
                    </div>
                    <div className="p-5 space-y-3 text-sm max-h-96 overflow-y-auto">
                      {detailedTx.events.map((event, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-md border-l-4 border-comic-green">
                          <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">{event.description}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Module: {event.module}</p>
                          {Object.keys(event.data).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-xs cursor-pointer text-comic-blue hover:underline">
                                View event data
                              </summary>
                              <div className="mt-2 bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                                <pre className="text-xs whitespace-pre-wrap break-words">
                                  {JSON.stringify(event.data, null, 2)}
                                </pre>
                              </div>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </details>
    </div>
  );
};

// Separate component for object change item to use hooks
const ObjectChangeItem: React.FC<{
  change: any;
  copyToClipboard: (text: string, label: string) => void;
}> = ({ change, copyToClipboard }) => {
  const typeDetails = change.objectTypeDetails;
  const { logoUrl } = useTokenLogo(
    typeDetails.isCoin ? typeDetails.coinName : undefined
  );

  return (
    <div 
      className={`p-3 rounded-md border-l-4 ${
        change.type === 'created' ? 'bg-green-50 dark:bg-green-900/20 border-comic-green' :
        change.type === 'mutated' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-comic-yellow' :
        'bg-gray-50 dark:bg-gray-800/50 border-gray-500'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`font-bold uppercase text-xs px-2 py-1 rounded ${
          change.type === 'created' ? 'bg-comic-green text-black' :
          change.type === 'mutated' ? 'bg-comic-yellow text-black' :
          'bg-gray-500 text-white'
        }`}>
          {change.type}
        </span>
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={typeDetails.coinName || 'Token'} 
              className="w-5 h-5 rounded-full object-cover"
              onError={(e) => {
                // Hide image if it fails to load - don't show emoji fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : null}
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            {typeDetails.isCoin ? typeDetails.coinName : typeDetails.mainType}
          </span>
        </div>
      </div>
      
      {/* Object Type Details */}
      <div className="mb-2 p-2 bg-white dark:bg-gray-900 rounded text-xs">
        <div className="flex items-start gap-2">
          <span className="text-gray-600 dark:text-gray-400 min-w-[60px]">Type:</span>
          <Tooltip content={change.objectType} position="top">
            <code className="font-mono text-xs break-all cursor-help">
              {change.objectType}
            </code>
          </Tooltip>
        </div>
        {typeDetails.isCoin && typeDetails.coinType && (
          <div className="flex items-start gap-2 mt-1">
            <span className="text-gray-600 dark:text-gray-400 min-w-[60px]">Coin:</span>
            <code className="font-mono text-xs break-all">
              {typeDetails.coinType}
            </code>
          </div>
        )}
      </div>

      {/* Object ID with hover tooltip */}
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Object ID:</span>
          <Tooltip content={change.objectId} position="top">
            <code className="font-mono text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded flex-1 truncate cursor-help">
              {change.objectIdShort}
            </code>
          </Tooltip>
          <Tooltip content={`Copy full ID: ${change.objectId}`} position="top">
            <button 
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex-shrink-0 transition-colors"
              onClick={() => copyToClipboard(change.objectId, 'Object ID copied!')}
            >
              <span className="material-symbols-outlined text-xs">content_copy</span>
            </button>
          </Tooltip>
        </div>
        {change.digest && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">Digest:</span>
            <Tooltip content={change.digest} position="top">
              <code className="font-mono text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded flex-1 truncate cursor-help">
                {change.digest.slice(0, 10)}...{change.digest.slice(-8)}
              </code>
            </Tooltip>
            <Tooltip content={`Copy digest: ${change.digest}`} position="top">
              <button 
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex-shrink-0 transition-colors"
                onClick={() => copyToClipboard(change.digest!, 'Digest copied!')}
              >
                <span className="material-symbols-outlined text-xs">content_copy</span>
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Owner with hover tooltip */}
      {change.owner && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Owner:</span>
          <Tooltip content={change.owner} position="top">
            <code className="font-mono text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded flex-1 truncate cursor-help">
              {change.ownerShort || change.owner}
            </code>
          </Tooltip>
          <Tooltip content={`Copy owner: ${change.owner}`} position="top">
            <button 
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex-shrink-0 transition-colors"
              onClick={() => copyToClipboard(change.owner!, 'Owner address copied!')}
            >
              <span className="material-symbols-outlined text-xs">content_copy</span>
            </button>
          </Tooltip>
        </div>
      )}

      {/* Version Info */}
      {change.version !== undefined && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">Version:</span>
          <code className="font-mono text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded">
            {change.version}
          </code>
          {change.previousVersion !== undefined && (
            <>
              <span className="text-xs text-gray-500">→</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">Previous:</span>
              <code className="font-mono text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded">
                {change.previousVersion}
              </code>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SecretLoreCodex;
