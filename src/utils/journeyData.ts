import type { SimplifiedTransaction, DetailedTransaction } from '../types/transaction';

export type JourneyStageData = {
  stage: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  childFriendlyDescription: string;
  details?: {
    amount?: string;
    coinType?: string;
    coinIcon?: string;
    count?: number;
    recipients?: string[];
  };
}

export class JourneyDataExtractor {
  static extractStages(transaction: SimplifiedTransaction | DetailedTransaction): JourneyStageData[] {
    const detailedTx = 'moveCalls' in transaction ? transaction as DetailedTransaction : null;
    const category = transaction.summary.category;
    const isSuccess = transaction.status === 'success';

    // Get balance changes for visual display
    const balanceChanges = transaction.balanceChanges || [];

    // Get coin types involved
    const coinTypes = [...new Set(balanceChanges.map(c => c.coinType))];
    const mainCoin = coinTypes[0] || 'SUI';

    // Stage 1: Transaction Started
    const stage1: JourneyStageData = {
      stage: 1,
      title: 'Your Wallet',
      subtitle: 'The Starting Point',
      icon: 'account_balance_wallet',
      color: 'comic-blue',
      description: `Transaction initiated by ${this.shortenAddress(transaction.sender)}`,
      childFriendlyDescription: `Your wallet started the adventure! 🎒`,
      details: {
        recipients: [transaction.sender],
      },
    };

    // Stage 2: Action Taken
    let stage2Description = transaction.summary.description;
    let stage2ChildFriendly = this.getChildFriendlyAction(category, transaction.summary.mainAction);
    
    const stage2: JourneyStageData = {
      stage: 2,
      title: this.getActionTitle(category),
      subtitle: transaction.summary.mainAction,
      icon: this.getActionIcon(category),
      color: 'comic-red',
      description: stage2Description,
      childFriendlyDescription: stage2ChildFriendly,
      details: {
        count: detailedTx?.moveCalls.length || 0,
      },
    };

    // Stage 3: What Changed
    const hasCreated = transaction.summary.objectsCreated > 0;
    const hasMutated = transaction.summary.objectsMutated > 0;
    
    let stage3Description = '';
    let stage3ChildFriendly = '';
    
    if (hasCreated) {
      stage3Description = `${transaction.summary.objectsCreated} new object${transaction.summary.objectsCreated > 1 ? 's' : ''} created`;
      stage3ChildFriendly = `✨ ${transaction.summary.objectsCreated} new thing${transaction.summary.objectsCreated > 1 ? 's' : ''} appeared! Like magic! ✨`;
    } else if (hasMutated) {
      stage3Description = `${transaction.summary.objectsMutated} object${transaction.summary.objectsMutated > 1 ? 's' : ''} changed`;
      stage3ChildFriendly = `🔄 ${transaction.summary.objectsMutated} thing${transaction.summary.objectsMutated > 1 ? 's' : ''} got updated!`;
    } else {
      stage3Description = 'No objects changed';
      stage3ChildFriendly = 'Nothing new was created, but the magic still happened! ✨';
    }

    const stage3: JourneyStageData = {
      stage: 3,
      title: 'Changes',
      subtitle: hasCreated ? 'New Things!' : 'Updates!',
      icon: 'category',
      color: 'comic-yellow',
      description: stage3Description,
      childFriendlyDescription: stage3ChildFriendly,
      details: {
        count: transaction.summary.objectsCreated + transaction.summary.objectsMutated,
      },
    };

    // Stage 4: Result
    let stage4Description = '';
    let stage4ChildFriendly = '';
    
    if (isSuccess) {
      if (transaction.recipients.length > 0) {
        stage4Description = `Successfully sent to ${transaction.recipients.length} recipient${transaction.recipients.length > 1 ? 's' : ''}`;
        stage4ChildFriendly = `🎉 Success! Your ${mainCoin} reached ${transaction.recipients.length} friend${transaction.recipients.length > 1 ? 's' : ''}!`;
      } else if (balanceChanges.length > 0) {
        const mainChange = balanceChanges[0];
        if (mainChange.isPositive) {
          stage4Description = `Received ${this.formatAmount(mainChange.amount, mainChange.coinType)}`;
          stage4ChildFriendly = `💰 You got ${this.formatAmount(mainChange.amount, mainChange.coinType)}! Awesome!`;
        } else {
          stage4Description = `Spent ${this.formatAmount(mainChange.amount, mainChange.coinType)}`;
          stage4ChildFriendly = `💸 You spent ${this.formatAmount(mainChange.amount, mainChange.coinType)}. Mission complete!`;
        }
      } else {
        stage4Description = 'Transaction completed successfully';
        stage4ChildFriendly = '🎊 Your quest is complete! Everything worked perfectly!';
      }
    } else {
      stage4Description = 'Transaction failed';
      stage4ChildFriendly = '😢 Oops! Something went wrong. But don\'t worry, you can try again!';
    }

    const stage4: JourneyStageData = {
      stage: 4,
      title: isSuccess ? 'Success!' : 'Failed',
      subtitle: `Gas: ${transaction.gasUsed.totalSUI} SUI`,
      icon: isSuccess ? 'check_circle' : 'cancel',
      color: isSuccess ? 'comic-green' : 'red-500',
      description: stage4Description,
      childFriendlyDescription: stage4ChildFriendly,
      details: {
        amount: transaction.gasUsed.totalSUI,
        coinType: 'SUI',
        recipients: transaction.recipients,
      },
    };

    return [stage1, stage2, stage3, stage4];
  }

  private static getActionTitle(category: string): string {
    switch (category) {
      case 'defi': return 'DeFi Magic';
      case 'nft': return 'NFT Creation';
      case 'transfer': return 'Sending';
      default: return 'Smart Contract';
    }
  }

  private static getActionIcon(category: string): string {
    switch (category) {
      case 'defi': return 'swap_horiz';
      case 'nft': return 'palette';
      case 'transfer': return 'send';
      default: return 'auto_stories';
    }
  }

  private static getChildFriendlyAction(
    category: string,
    mainAction: string
  ): string {
    switch (category) {
      case 'defi':
        if (mainAction.toLowerCase().includes('swap')) {
          return '🔄 Swapped some coins! Like trading cards!';
        } else if (mainAction.toLowerCase().includes('order')) {
          return '📋 Placed an order! Like ordering pizza!';
        }
        return '💱 Did some DeFi magic! Trading coins!';
      
      case 'nft':
        if (mainAction.toLowerCase().includes('mint')) {
          return '🎨 Created a new NFT! Like drawing a picture!';
        }
        return '🖼️ Did something with an NFT! Cool art!';
      
      case 'transfer':
        return '📦 Sent some coins to friends! Like sharing candy!';
      
      default:
        return '⚡ Cast a smart contract spell! Magic happened!';
    }
  }

  private static formatAmount(amount: string, coinType: string): string {
    const num = parseFloat(amount) / 1_000_000_000;
    if (num < 0.000001) {
      return `${num.toFixed(9)} ${coinType}`;
    } else if (num < 1) {
      return `${num.toFixed(6)} ${coinType}`;
    } else {
      return `${num.toFixed(4)} ${coinType}`;
    }
  }

  private static shortenAddress(address: string): string {
    if (!address || address === 'Unknown') return address;
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  }
}

