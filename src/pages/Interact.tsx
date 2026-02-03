import React, { useState } from 'react';
import { suiService, type Network } from '../services/suiService';
import {
  formatMoveType,
  formatMoveTypeShort,
  isSystemType,
  getInputKind,
  isObjectReference,
} from '../utils/contractUtils';
import { decodeDevInspectReturnValues } from '../utils/returnValueDecoder';
import type { SuiMoveNormalizedModules, SuiMoveNormalizedType } from '@mysten/sui/client';

interface InteractProps {
  network: Network;
}

interface ReadFunction {
  module: string;
  name: string;
  params: { name: string; type: SuiMoveNormalizedType }[];
  returnType: SuiMoveNormalizedType[];
}

function extractReadFunctions(modules: SuiMoveNormalizedModules): ReadFunction[] {
  const result: ReadFunction[] = [];
  for (const [moduleName, module] of Object.entries(modules)) {
    for (const [fnName, fn] of Object.entries(module.exposedFunctions)) {
      if (!fn.isEntry && fn.visibility === 'Public') {
        const params = fn.parameters
          .map((type, i) => ({ name: `arg${i}`, type }))
          .filter((p) => !isSystemType(p.type));
        result.push({
          module: moduleName,
          name: fnName,
          params,
          returnType: fn.return,
        });
      }
    }
  }
  return result;
}

function parseArg(
  value: string,
  inputKind: string
): string | number | boolean | bigint {
  if (inputKind === 'bool') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  if (inputKind === 'u64') {
    return BigInt(value || '0');
  }
  return value;
}

const Interact: React.FC<InteractProps> = () => {
  const [contractInput, setContractInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readFunctions, setReadFunctions] = useState<ReadFunction[]>([]);
  const [selectedFn, setSelectedFn] = useState<ReadFunction | null>(null);
  const [argValues, setArgValues] = useState<Record<string, string>>({});
  const [callResult, setCallResult] = useState<string | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const [calling, setCalling] = useState(false);

  const handleLoadContract = async () => {
    const pkg = contractInput.trim();
    if (!pkg) {
      setError('Please enter a contract package ID');
      return;
    }

    setLoading(true);
    setError(null);
    setReadFunctions([]);
    setSelectedFn(null);
    setCallResult(null);
    setCallError(null);

    try {
      const mods = await suiService.getNormalizedMoveModulesByPackage(pkg);
      const readFns = extractReadFunctions(mods);
      setReadFunctions(readFns);
      if (readFns.length === 0) {
        setError('No public read functions found in this contract.');
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to load contract'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFunction = (fn: ReadFunction) => {
    setSelectedFn(fn);
    const initial: Record<string, string> = {};
    fn.params.forEach((_, i) => {
      initial[`arg${i}`] = '';
    });
    setArgValues(initial);
    setCallResult(null);
    setCallError(null);
  };

  const handleArgChange = (key: string, value: string) => {
    setArgValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCall = async () => {
    if (!selectedFn || !contractInput.trim()) return;

    setCalling(true);
    setCallResult(null);
    setCallError(null);

    try {
      const pkg = contractInput.trim();
      const args = selectedFn.params.map((p, i) => {
        const key = `arg${i}`;
        const val = argValues[key] ?? '';
        const kind = getInputKind(p.type);
        return parseArg(val, kind);
      });

      const objectRefIndices = selectedFn.params
        .map((p, i) => (isObjectReference(p.type) ? i : -1))
        .filter((i) => i >= 0);

      const result = await suiService.devInspectMoveCall(
        pkg,
        selectedFn.module,
        selectedFn.name,
        [],
        args,
        objectRefIndices
      );

      if (result.error) {
        setCallError(result.error);
        setCallResult(null);
        return;
      }

      const output: string[] = [];
      if (result.results && result.results.length > 0) {
        result.results.forEach((r) => {
          if (r.returnValues && r.returnValues.length > 0) {
            const decoded = decodeDevInspectReturnValues(
              r.returnValues,
              selectedFn.returnType
            );
            output.push(...decoded);
          }
        });
      }
      setCallResult(
        output.length > 0
          ? output.join('\n')
          : 'Call succeeded (no return values)'
      );
      setCallError(null);
    } catch (err: unknown) {
      setCallError(
        err instanceof Error ? err.message : 'Call failed'
      );
      setCallResult(null);
    } finally {
      setCalling(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">
          Contract Interact
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Paste a Sui contract package ID to view and call read functions.
        </p>

        {/* Contract input */}
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Contract Package ID
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={contractInput}
              onChange={(e) => setContractInput(e.target.value)}
              placeholder="0x..."
              className="flex-1 px-4 py-3 font-mono text-sm bg-white dark:bg-gray-800 border-4 border-black dark:border-white rounded-lg shadow-comic dark:shadow-comic-dark focus:ring-2 focus:ring-comic-blue focus:border-comic-blue outline-none"
            />
            <button
              onClick={handleLoadContract}
              disabled={loading}
              className="px-6 py-3 font-bold bg-comic-blue text-white rounded-lg border-4 border-black dark:border-white shadow-comic dark:shadow-comic-dark hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Loading...' : 'Load Contract'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-4 border-comic-red rounded-lg text-red-800 dark:text-red-200 font-medium">
            {error}
          </div>
        )}

        {readFunctions.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Read functions list */}
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-lg shadow-comic dark:shadow-comic-dark p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Read Functions
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {readFunctions.map((fn) => (
                  <button
                    key={`${fn.module}::${fn.name}`}
                    onClick={() => handleSelectFunction(fn)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 font-mono text-sm transition-colors ${
                      selectedFn?.module === fn.module &&
                      selectedFn?.name === fn.name
                        ? 'bg-comic-blue text-white border-comic-blue'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-comic-blue dark:hover:border-comic-blue'
                    }`}
                  >
                    <span className="font-bold">{fn.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      ({fn.params.length} args)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Function details & call */}
            <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-white rounded-lg shadow-comic dark:shadow-comic-dark p-6">
              {selectedFn ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {selectedFn.module}::{selectedFn.name}
                  </h2>

                  {selectedFn.params.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        Arguments
                      </h3>
                      {selectedFn.params.map((p, i) => {
                        const key = `arg${i}`;
                        const kind = getInputKind(p.type);
                        return (
                          <div key={key}>
                            <label 
                              className="block text-xs font-mono text-gray-500 dark:text-gray-400 mb-1 truncate"
                              title={formatMoveType(p.type)}
                            >
                              {formatMoveTypeShort(p.type)}
                            </label>
                            {kind === 'bool' ? (
                              <select
                                value={argValues[key] ?? ''}
                                onChange={(e) =>
                                  handleArgChange(key, e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm"
                              >
                                <option value="">Select...</option>
                                <option value="true">true</option>
                                <option value="false">false</option>
                              </select>
                            ) : (
                              <input
                                type={kind === 'u64' ? 'number' : 'text'}
                                value={argValues[key] ?? ''}
                                onChange={(e) =>
                                  handleArgChange(key, e.target.value)
                                }
                                placeholder={
                                  kind === 'address'
                                    ? '0x...'
                                    : kind === 'u64'
                                    ? '0'
                                    : 'Enter value'
                                }
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      No arguments required.
                    </p>
                  )}

                  <button
                    onClick={handleCall}
                    disabled={calling}
                    className="w-full py-3 font-bold bg-comic-green text-black rounded-lg border-4 border-black shadow-comic hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {calling ? 'Calling...' : 'Call Read Function'}
                  </button>

                  {callError && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border-2 border-comic-red rounded-lg text-red-800 dark:text-red-200 text-sm font-mono">
                      {callError}
                    </div>
                  )}

                  {callResult && (
                    <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 border-2 border-comic-green rounded-lg text-green-800 dark:text-green-200 text-sm font-mono whitespace-pre-wrap break-all">
                      {callResult}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Select a read function to call it.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interact;
