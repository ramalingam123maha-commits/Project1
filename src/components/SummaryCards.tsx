import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import {
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { transactions, currency } = useFinance();

  const metrics = useMemo(() => {
    const currentMonthKey = new Date().toISOString().slice(0, 7);

    // Current Month Metrics
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;

    // Total Lifetime / All-time Metrics
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(tx => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
        if (tx.date.startsWith(currentMonthKey)) {
          currentMonthIncome += tx.amount;
        }
      } else {
        totalExpense += tx.amount;
        if (tx.date.startsWith(currentMonthKey)) {
          currentMonthExpense += tx.amount;
        }
      }
    });

    const netSavingsThisMonth = currentMonthIncome - currentMonthExpense;
    const savingsRate =
      currentMonthIncome > 0
        ? Math.max(0, (netSavingsThisMonth / currentMonthIncome) * 100).toFixed(1)
        : '0';

    const netWorth = totalIncome - totalExpense;

    return {
      currentMonthIncome,
      currentMonthExpense,
      netSavingsThisMonth,
      savingsRate,
      netWorth,
      totalIncome,
      totalExpense,
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance / Net Worth */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Net Savings / Balance
          </span>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(metrics.netWorth, currency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
            <span className="text-slate-400">Total accumulated savings</span>
          </div>
        </div>
      </div>

      {/* Monthly Income */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly Inflow
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
            +{formatCurrency(metrics.currentMonthIncome, currency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-700">
            <span>This month's recorded earnings</span>
          </div>
        </div>
      </div>

      {/* Monthly Expenses */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly Outflow
          </span>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-rose-600 tracking-tight">
            -{formatCurrency(metrics.currentMonthExpense, currency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-rose-700">
            <span>This month's total spending</span>
          </div>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Savings Efficiency
          </span>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            {metrics.savingsRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-indigo-700">
            <span>
              {metrics.netSavingsThisMonth >= 0
                ? `Saved ${formatCurrency(metrics.netSavingsThisMonth, currency)} this month`
                : `Deficit of ${formatCurrency(Math.abs(metrics.netSavingsThisMonth), currency)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
