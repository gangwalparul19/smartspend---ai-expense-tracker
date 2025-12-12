export type TransactionType = 'expense' | 'income' | 'investment';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  isDefault?: boolean;
  budgetLimit?: number; // Optional monthly limit for this category
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  categoryId: string;
  type: TransactionType;
  frequency: Frequency;
  nextDueDate: string; // ISO Date YYYY-MM-DD
  active: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string; // Stores the Category Name
  categoryId?: string; // Optional reference to Category ID
  type: TransactionType;
  currentValue?: number; // For investments: current market value
  tags?: string[]; // Optional tags for better organization
  receiptUrl?: string; // Firebase Storage URL for receipt
  receiptFileName?: string; // Original filename
  receiptUploadedAt?: string; // Timestamp when receipt was uploaded
}

export interface FinancialSummary {
  income: number;
  expenses: number;
  investments: number;
  balance: number;
  investmentReturns: number;
}