import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiObjectId } from '@mysten/sui/utils';
import type { SuiMoveNormalizedModules } from '@mysten/sui/client';

export type Network = 'mainnet' | 'testnet' | 'devnet';

const MAINNET_URL = 'https://fullnode.mainnet.sui.io:443';
const TESTNET_URL = 'https://fullnode.testnet.sui.io:443';
const DEVNET_URL = 'https://fullnode.devnet.sui.io:443';

/** Zero address for dev-inspect read-only calls (no signer needed) */
const DEV_INSPECT_SENDER = '0x0000000000000000000000000000000000000000000000000000000000000000';

export class SuiService {
  private client: SuiClient;
  private currentNetwork: Network;

  constructor(network: Network = 'mainnet') {
    this.currentNetwork = network;
    const url = network === 'mainnet' ? MAINNET_URL : 
                network === 'testnet' ? TESTNET_URL : DEVNET_URL;
    this.client = new SuiClient({ url });
  }

  setNetwork(network: Network) {
    if (this.currentNetwork === network) return;
    
    this.currentNetwork = network;
    const url = network === 'mainnet' ? MAINNET_URL : 
                network === 'testnet' ? TESTNET_URL : DEVNET_URL;
    this.client = new SuiClient({ url });
  }

  getNetwork(): Network {
    return this.currentNetwork;
  }

  getClient(): SuiClient {
    return this.client;
  }

  async getTransaction(digest: string) {
    try {
      const transaction = await this.client.getTransactionBlock({
        digest,
        options: {
          showInput: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
          showRawInput: true,
        },
      });
      return transaction;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw new Error('Failed to fetch transaction. Please check the digest and try again.');
    }
  }

  async getNormalizedMoveModulesByPackage(packageId: string): Promise<SuiMoveNormalizedModules> {
    try {
      const modules = await this.client.getNormalizedMoveModulesByPackage({
        package: packageId,
      });
      return modules;
    } catch (error) {
      console.error('Error fetching contract modules:', error);
      throw new Error('Failed to fetch contract. Please check the package ID and try again.');
    }
  }

  async devInspectMoveCall(
    packageId: string,
    module: string,
    functionName: string,
    typeArguments: string[] = [],
    args: (string | number | boolean | bigint)[],
    objectRefIndices: number[] = []
  ) {
    const tx = new Transaction();
    const isObjectRef = (i: number) => objectRefIndices.includes(i);
    tx.moveCall({
      target: `${packageId}::${module}::${functionName}`,
      typeArguments,
      arguments: args.map((arg, i) => {
        if (isObjectRef(i) && typeof arg === 'string' && arg.startsWith('0x')) {
          return tx.object(normalizeSuiObjectId(arg));
        }
        if (typeof arg === 'string' && arg.startsWith('0x')) {
          return tx.pure.address(normalizeSuiObjectId(arg));
        }
        if (typeof arg === 'string') {
          return tx.pure.string(arg);
        }
        if (typeof arg === 'number') {
          return tx.pure.u64(arg);
        }
        if (typeof arg === 'boolean') {
          return tx.pure.bool(arg);
        }
        if (typeof arg === 'bigint') {
          return tx.pure.u64(arg);
        }
        return tx.pure.string(String(arg));
      }),
    });

    const result = await this.client.devInspectTransactionBlock({
      sender: DEV_INSPECT_SENDER,
      transactionBlock: tx,
    });

    return result;
  }
}

export const suiService = new SuiService('mainnet');

