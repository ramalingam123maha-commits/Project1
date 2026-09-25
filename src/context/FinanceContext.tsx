import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, BudgetGoal, ExpenseCategory } from '../types/finance';
import { INITIAL_TRANSACTIONS, DEFAULT_BUDGETS } from '../data/mockData';

interface FinanceContextType {
  transactions: Transaction[];
  budgetGoals: BudgetGoal[];
  currency: string;
  setCurrency: (c: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudgetGoal: (category: ExpenseCategory, monthlyLimit: number) => void;
  resetToDefaults: () => void;
  clearAllData: () => void;
  importData: (data: { transactions: Transaction[]; budgetGoals?: BudgetGoal[] }) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY_TX = 'finance_tracker_transactions_v1';
const STORAGE_KEY_BUDGETS = 'finance_tracker_budgets_v1';
const STORAGE_KEY_CURRENCY = 'finance_tracker_currency_v1';

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TX);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BUDGETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading budgets from localStorage', e);
    }
    return DEFAULT_BUDGETS;
  });

  const [currency, setCurrencyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_CURRENCY) || '$';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgetGoals));
  }, [budgetGoals]);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY_CURRENCY, c);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updatedFields } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const updateBudgetGoal = (category: ExpenseCategory, monthlyLimit: number) => {
    setBudgetGoals(prev => {
      const exists = prev.some(b => b.category === category);
      if (exists) {
        return prev.map(b => (b.category === category ? { ...b, monthlyLimit } : b));
      }
      return [...prev, { category, monthlyLimit }];
    });
  };

  const resetToDefaults = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgetGoals(DEFAULT_BUDGETS);
  };

  const clearAllData = () => {
    setTransactions([]);
  };

  const importData = (data: { transactions: Transaction[]; budgetGoals?: BudgetGoal[] }) => {
    if (data.transactions && Array.isArray(data.transactions)) {
      setTransactions(data.transactions);
    }
    if (data.budgetGoals && Array.isArray(data.budgetGoals)) {
      setBudgetGoals(data.budgetGoals);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgetGoals,
        currency,
        setCurrency,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudgetGoal,
        resetToDefaults,
        clearAllData,
        importData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
