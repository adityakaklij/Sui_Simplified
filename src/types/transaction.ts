// Simplified transaction types for UI
export interface SimplifiedTransaction {
  digest: string;
  status: 'success' | 'failure';
  sender: string;
  recipients: string[];
  timestamp: string;
  balanceChanges: BalanceChange[];
  gasUsed: {
    total: string;
    totalSUI: string;
  };
  summary: TransactionSummary;
}

export interface BalanceChange {
  coinType: string;
  amount: string;
  isPositive: boolean;
  owner: string;
}

export interface TransactionSummary {
  mainAction: string; // e.g., "Placed a limit order", "Swapped tokens", "Minted NFT"
  description: string;
  objectsCreated: number;
  objectsMutated: number;
  eventsEmitted: number;
  category: 'defi' | 'nft' | 'transfer' | 'contract' | 'other';
}

export interface DetailedTransaction extends SimplifiedTransaction {
  inputs: TransactionInput[];
  moveCalls: MoveCall[];
  objectChanges: ObjectChange[];
  events: TransactionEvent[];
  operations: TransactionOperation[];
  effects: Effects;
  rawData?: any;
}

export interface TransactionInput {
  type: string;
  value: string;
  formattedValue?: string;
  label: string;
  fullData?: any;
}

export interface MoveCall {
  package: string;
  module: string;
  function: string;
  typeArguments?: string[];
  description: string;
}

export interface ObjectChange {
  type: 'created' | 'mutated' | 'deleted' | 'transferred' | 'wrapped';
  objectId: string;
  objectIdShort: string;
  objectType: string;
  objectTypeDetails: {
    fullType: string;
    mainType: string;
    coinType?: string;
    isCoin: boolean;
    coinName?: string;
  };
  owner?: string;
  ownerShort?: string;
  version?: string;
  previousVersion?: string;
  digest?: string;
}

export interface TransactionOperation {
  type: 'split' | 'merge' | 'transfer' | 'publish' | 'upgrade' | 'other';
  description: string;
  details?: any;
}

export interface TransactionEvent {
  type: string;
  module: string;
  description: string;
  data: Record<string, any>;
}

export interface Effects {
  computationCost: string;
  storageCost: string;
  storageRebate: string;
  totalGasCost: string;
  dependencies: string[];
}

export type ViewMode = 'simple' | 'detailed';

