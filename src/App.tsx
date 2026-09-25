import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { SummaryCards } from './components/SummaryCards';
import { SmartFinancialInsights } from './components/SmartFinancialInsights';
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart';
import { MonthlySpendingTrendsChart } from './components/MonthlySpendingTrendsChart';
import { BudgetComparisonChart } from './components/BudgetComparisonChart';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { Transaction } from './types/finance';
import './utils/chartSetup';

const FinanceApp: React.FC = () => {
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenAddTx = () => {
    setEditingTransaction(null);
    setIsTxModalOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenTransactionModal={handleOpenAddTx}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Metrics Summary Cards */}
        <SummaryCards />

        {/* AI & Automated Insights Banner */}
        <SmartFinancialInsights />

        {/* Chart.js Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Spending & Inflow Trends (Bar/Line) */}
          <div className="lg:col-span-8">
            <MonthlySpendingTrendsChart />
          </div>

          {/* Category Breakdown (Doughnut/Pie) */}
          <div className="lg:col-span-4">
            <CategoryBreakdownChart />
          </div>
        </div>

        {/* Budget vs Actual Comparison */}
        <div>
          <BudgetComparisonChart
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          />
        </div>

        {/* Full Transaction History & Management */}
        <div>
          <TransactionList onEditTransaction={handleEditTx} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} FinanceFlow — TypeScript, React & Chart.js Finance Tracker</p>
          <p>Local-first encrypted data storage • Real-time analytics engine</p>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        editingTransaction={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <FinanceProvider>
      <FinanceApp />
    </FinanceProvider>
  );
};

export default App;
