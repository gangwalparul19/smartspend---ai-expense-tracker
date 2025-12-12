export type TransactionType = 'expense' | 'income' | 'investment';
export type Frequency = 'daily' | 'weekly' | 'monthly';

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
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  balance: number;
}