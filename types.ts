export type Category = 'Mechanic' | 'Electric' | 'Tools';

export interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  stock: number;
  minStock: number;
  unit: string;
  lastUpdated?: Date;
}

export type TransactionType = 'IN' | 'OUT';

export interface TransactionLog {
  id: string;
  itemId: string;
  itemName: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
}
