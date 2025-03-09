export type TransactionType = 'RENT' | 'INCOME';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  serverId?: string;
  serverName?: string;
}

// Получить цвет для типа транзакции
export const getTransactionColor = (type: TransactionType): string => {
  switch (type) {
    case 'RENT':
      return '#10B3A3';
    case 'INCOME':
      return '#28a745';
    default:
      return '#6c757d';
  }
}; 