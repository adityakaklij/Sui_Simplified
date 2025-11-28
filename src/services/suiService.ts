import { SuiClient } from '@mysten/sui/client';

export type Network = 'mainnet' | 'testnet' | 'devnet';

const MAINNET_URL = 'https://fullnode.mainnet.sui.io:443';
const TESTNET_URL = 'https://fullnode.testnet.sui.io:443';
const DEVNET_URL = 'https://fullnode.devnet.sui.io:443';

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
}

export const suiService = new SuiService('mainnet');

