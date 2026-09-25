export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Housing & Rent'
  | 'Groceries & Food'
  | 'Dining & Restaurants'
  | 'Transportation'
  | 'Utilities & Bills'
  | 'Healthcare & Fitness'
  | 'Entertainment & Leisure'
  | 'Shopping & Personal'
  | 'Education & Learning'
  | 'Travel & Vacation'
  | 'Savings & Investments'
  | 'Other Expenses';

export type IncomeCategory =
  | 'Salary & Wages'
  | 'Freelance & Consulting'
  | 'Investments & Dividends'
  | 'Business Income'
  | 'Gifts & Grants'
  | 'Rental Income'
  | 'Other Income';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  notes?: string;
  paymentMethod?: 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer' | 'Crypto' | 'Other';
  recurring?: boolean;
}

export interface BudgetGoal {
  category: ExpenseCategory;
  monthlyLimit: number;
}

export interface CategoryMetadata {
  name: TransactionCategory;
  color: string;
  icon: string;
  description: string;
}
