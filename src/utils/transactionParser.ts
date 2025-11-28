import type {
  SimplifiedTransaction,
  DetailedTransaction,
  BalanceChange,
  TransactionSummary,
  MoveCall,
  ObjectChange,
  TransactionEvent,
  TransactionInput,
  TransactionOperation,
} from '../types/transaction';

export class TransactionParser {
  static parseSimplified(rawTx: any): SimplifiedTransaction {
    const effects = rawTx.effects;
    const status = effects?.status?.status === 'success' ? 'success' : 'failure';
    const gasUsed = effects?.gasUsed;
    
    const totalGas = gasUsed ? 
      parseInt(gasUsed.computationCost) + parseInt(gasUsed.storageCost) - parseInt(gasUsed.storageRebate) :
      0;
    
    const balanceChanges = this.parseBalanceChanges(rawTx.balanceChanges || []);
    const recipients = this.extractRecipients(rawTx);
    const summary = this.generateSummary(rawTx);

    return {
      digest: rawTx.digest,
      status,
      sender: rawTx.transaction?.data?.sender || 'Unknown',
      recipients,
      timestamp: rawTx.timestampMs ? new Date(parseInt(rawTx.timestampMs)).toLocaleString() : 'Unknown',
      balanceChanges,
      gasUsed: {
        total: totalGas.toString(),
        totalSUI: (totalGas / 1_000_000_000).toFixed(6),
      },
      summary,
    };
  }

  static parseDetailed(rawTx: any): DetailedTransaction {
    const simplified = this.parseSimplified(rawTx);
    const effects = rawTx.effects;
    const transactions = rawTx.transaction?.data?.transaction?.transactions || [];
    
    return {
      ...simplified,
      inputs: this.parseInputs(rawTx.transaction?.data?.transaction?.inputs || []),
      moveCalls: this.parseMoveCalls(transactions),
      objectChanges: this.parseObjectChanges(rawTx.objectChanges || []),
      events: this.parseEvents(rawTx.events || []),
      operations: this.parseOperations(transactions),
      effects: {
        computationCost: effects?.gasUsed?.computationCost || '0',
        storageCost: effects?.gasUsed?.storageCost || '0',
        storageRebate: effects?.gasUsed?.storageRebate || '0',
        totalGasCost: simplified.gasUsed.total,
        dependencies: effects?.dependencies || [],
      },
      rawData: rawTx,
    };
  }

  private static parseOperations(transactions: any[]): TransactionOperation[] {
    const operations: TransactionOperation[] = [];
    
    transactions.forEach(tx => {
      if (tx.SplitCoins) {
        operations.push({
          type: 'split',
          description: `Split coins into ${tx.SplitCoins.amounts?.length || 'multiple'} parts`,
          details: tx.SplitCoins,
        });
      } else if (tx.MergeCoins) {
        operations.push({
          type: 'merge',
          description: 'Merge multiple coins into one',
          details: tx.MergeCoins,
        });
      } else if (tx.TransferObjects) {
        operations.push({
          type: 'transfer',
          description: `Transfer ${tx.TransferObjects.objects?.length || 1} object(s)`,
          details: tx.TransferObjects,
        });
      } else if (tx.Publish) {
        operations.push({
          type: 'publish',
          description: 'Publish new package/module',
          details: tx.Publish,
        });
      } else if (tx.Upgrade) {
        operations.push({
          type: 'upgrade',
          description: 'Upgrade package',
          details: tx.Upgrade,
        });
      } else if (tx.MakeMoveVec) {
        operations.push({
          type: 'other',
          description: 'Create Move vector',
          details: tx.MakeMoveVec,
        });
      }
    });

    return operations;
  }

  private static parseBalanceChanges(changes: any[]): BalanceChange[] {
    return changes.map(change => ({
      coinType: this.formatCoinType(change.coinType),
      amount: Math.abs(parseInt(change.amount)).toString(),
      isPositive: parseInt(change.amount) > 0,
      owner: this.shortenAddress(change.owner?.AddressOwner || change.owner),
    }));
  }

  private static extractRecipients(rawTx: any): string[] {
    const recipients = new Set<string>();
    const sender = rawTx.transaction?.data?.sender;
    
    // Get recipients from object changes
    const objectChanges = rawTx.objectChanges || [];
    objectChanges.forEach((change: any) => {
      if (change.owner?.AddressOwner && change.owner.AddressOwner !== sender) {
        recipients.add(change.owner.AddressOwner);
      }
    });

    // Get recipients from balance changes
    const balanceChanges = rawTx.balanceChanges || [];
    balanceChanges.forEach((change: any) => {
      const owner = change.owner?.AddressOwner;
      if (owner && owner !== sender && parseInt(change.amount) > 0) {
        recipients.add(owner);
      }
    });

    return Array.from(recipients);
  }

  private static generateSummary(rawTx: any): TransactionSummary {
    const transactions = rawTx.transaction?.data?.transaction?.transactions || [];
    const objectChanges = rawTx.objectChanges || [];
    const events = rawTx.events || [];

    let mainAction = 'Transaction';
    let description = 'Executed a blockchain transaction';
    let category: 'defi' | 'nft' | 'transfer' | 'contract' | 'other' = 'other';

    // Determine main action from move calls
    if (transactions.length > 0) {
      const firstCall = transactions[0];
      if (firstCall.MoveCall) {
        const func = firstCall.MoveCall.function;
        const module = firstCall.MoveCall.module;
        mainAction = this.formatFunctionName(func);
        description = `Called ${func} in ${module}`;

        // Categorize transaction
        if (func.includes('swap') || func.includes('trade') || func.includes('order') || func.includes('pool')) {
          category = 'defi';
          if (func.includes('swap')) {
            mainAction = 'Token Swap';
            description = 'Swapped tokens on DEX';
          } else if (func.includes('order')) {
            mainAction = 'Limit Order';
            description = 'Placed trading order';
          }
        } else if (func.includes('mint') || func.includes('nft') || func.includes('token')) {
          category = 'nft';
          if (func.includes('mint')) {
            mainAction = 'NFT Mint';
            description = 'Minted new NFT';
          }
        } else if (func.includes('transfer') || func.includes('send')) {
          category = 'transfer';
          mainAction = 'Transfer';
          description = 'Transferred assets';
        } else {
          category = 'contract';
        }
      }
    }

    // Check for simple transfers
    if (transactions.length === 0 && objectChanges.length > 0) {
      const hasTransfer = objectChanges.some((c: any) => c.type === 'mutated' || c.type === 'transferred');
      if (hasTransfer) {
        category = 'transfer';
        mainAction = 'Asset Transfer';
        description = 'Transferred objects between addresses';
      }
    }

    // Count changes
    const created = objectChanges.filter((c: any) => c.type === 'created').length;
    const mutated = objectChanges.filter((c: any) => c.type === 'mutated').length;

    return {
      mainAction,
      description,
      objectsCreated: created,
      objectsMutated: mutated,
      eventsEmitted: events.length,
      category,
    };
  }

  private static parseInputs(inputs: any[]): TransactionInput[] {
    return inputs.map((input, index) => {
      if (input.type === 'pure') {
        let displayValue = input.value?.toString() || 'N/A';
        let formattedValue = displayValue;
        
        // Format large numbers (like MIST amounts)
        if (input.valueType === 'u64' && displayValue !== 'N/A') {
          const numValue = BigInt(displayValue);
          if (numValue > BigInt(1000000)) {
            formattedValue = `${(Number(numValue) / 1_000_000_000).toFixed(6)} SUI (${displayValue} MIST)`;
          }
        }
        
        return {
          type: input.valueType || 'pure',
          value: displayValue,
          formattedValue,
          label: `Input ${index + 1}: ${input.valueType || 'Value'}`,
          fullData: input,
        };
      } else if (input.type === 'object') {
        const objectType = input.objectType || 'object';
        const typeDetails = this.parseObjectTypeDetails(objectType);
        
        return {
          type: objectType,
          value: input.objectId,
          formattedValue: this.shortenAddress(input.objectId),
          label: `Input ${index + 1}: ${typeDetails.isCoin ? typeDetails.coinName || 'Coin' : 'Object'}`,
          fullData: input,
        };
      }
      return {
        type: input.type,
        value: JSON.stringify(input),
        formattedValue: JSON.stringify(input),
        label: `Input ${index + 1}`,
        fullData: input,
      };
    });
  }

  private static parseMoveCalls(transactions: any[]): MoveCall[] {
    return transactions
      .filter(tx => tx.MoveCall)
      .map(tx => {
        const call = tx.MoveCall;
        return {
          package: this.shortenAddress(call.package),
          module: call.module,
          function: call.function,
          typeArguments: call.type_arguments,
          description: `${call.module}::${call.function}`,
        };
      });
  }

  private static parseObjectChanges(changes: any[]): ObjectChange[] {
    return changes.map(change => {
      const typeDetails = this.parseObjectTypeDetails(change.objectType);
      return {
        type: change.type as any,
        objectId: change.objectId, // Keep full ID for hover
        objectIdShort: this.shortenAddress(change.objectId),
        objectType: change.objectType, // Full type for display
        objectTypeDetails: typeDetails,
        owner: change.owner?.AddressOwner ? change.owner.AddressOwner : 
               change.owner?.Shared ? 'Shared' :
               change.owner?.ObjectOwner ? change.owner.ObjectOwner : undefined,
        ownerShort: change.owner?.AddressOwner ? this.shortenAddress(change.owner.AddressOwner) : 
                    change.owner?.Shared ? 'Shared' :
                    change.owner?.ObjectOwner ? this.shortenAddress(change.owner.ObjectOwner) : undefined,
        version: change.version,
        previousVersion: change.previousVersion,
        digest: change.reference?.digest || change.digest,
      };
    });
  }

  private static parseEvents(events: any[]): TransactionEvent[] {
    return events.map(event => {
      const typeParts = event.type.split('::');
      const eventName = typeParts[typeParts.length - 1];
      
      return {
        type: eventName,
        module: event.transactionModule,
        description: this.formatEventDescription(eventName, event.parsedJson),
        data: event.parsedJson || {},
      };
    });
  }

  private static formatEventDescription(eventName: string, _data: any): string {
    // Generate user-friendly descriptions based on event type
    if (eventName.includes('Order')) {
      return `Order ${eventName.replace(/([A-Z])/g, ' $1').trim()}`;
    }
    if (eventName.includes('Swap')) {
      return 'Token swap executed';
    }
    if (eventName.includes('Transfer')) {
      return 'Asset transferred';
    }
    return eventName.replace(/([A-Z])/g, ' $1').trim();
  }

  private static formatFunctionName(func: string): string {
    return func
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private static formatCoinType(coinType: string): string {
    if (coinType.includes('::sui::SUI')) return 'SUI';
    if (coinType.includes('::usdc::USDC')) return 'USDC';
    if (coinType.includes('::usdt::USDT')) return 'USDT';
    
    const parts = coinType.split('::');
    return parts[parts.length - 1];
  }

  private static parseObjectTypeDetails(objectType: string): {
    fullType: string;
    mainType: string;
    coinType?: string;
    isCoin: boolean;
    coinName?: string;
  } {
    if (!objectType) {
      return { fullType: 'Unknown', mainType: 'Unknown', isCoin: false };
    }

    const fullType = objectType;
    let mainType = objectType;
    let coinType: string | undefined;
    let isCoin = false;
    let coinName: string | undefined;

    // Check if it's a coin
    if (objectType.includes('::coin::Coin<')) {
      isCoin = true;
      const coinMatch = objectType.match(/::coin::Coin<([^>]+)>/);
      if (coinMatch) {
        coinType = coinMatch[1];
        // Extract coin name
        if (coinType.includes('::sui::SUI')) {
          coinName = 'SUI';
        } else if (coinType.includes('::usdc::USDC')) {
          coinName = 'USDC';
        } else if (coinType.includes('::usdt::USDT')) {
          coinName = 'USDT';
        } else {
          const coinParts = coinType.split('::');
          coinName = coinParts[coinParts.length - 1] || 'Unknown Coin';
        }
        mainType = `Coin<${coinName}>`;
      } else {
        mainType = 'Coin';
      }
    } else {
      // Extract main type name
      const parts = objectType.split('::');
      mainType = parts[parts.length - 1] || objectType;
      
      // Check for common types
      if (objectType.includes('::nft::')) {
        mainType = 'NFT';
      } else if (objectType.includes('::balance::Balance')) {
        mainType = 'Balance';
      } else if (objectType.includes('::dynamic_field::Field')) {
        mainType = 'Dynamic Field';
      }
    }

    return { fullType, mainType, coinType, isCoin, coinName };
  }

  private static shortenAddress(address: string | undefined): string {
    if (!address) return 'N/A';
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  }

  static formatMIST(mist: string | number): string {
    const value = typeof mist === 'string' ? parseInt(mist) : mist;
    return (value / 1_000_000_000).toFixed(6);
  }
}

