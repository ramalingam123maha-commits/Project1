import React, { useState, useMemo } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES_INFO } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

export const CategoryBreakdownChart: React.FC = () => {
  const { transactions, currency } = useFinance();
  const [chartType, setChartType] = useState<'doughnut' | 'pie'>('doughnut');
  const [timeRange, setTimeRange] = useState<'all' | '30days' | '90days' | 'thisMonth'>('all');

  // Filter transactions based on time range
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const currentMonthKey = now.toISOString().slice(0, 7);

    return transactions.filter(tx => {
      if (tx.type !== 'expense') return false;

      if (timeRange === 'thisMonth') {
        return tx.date.startsWith(currentMonthKey);
      }
      if (timeRange === '30days') {
        const diffDays = (now.getTime() - new Date(tx.date).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 30;
      }
      if (timeRange === '90days') {
        const diffDays = (now.getTime() - new Date(tx.date).getTime()) / (1000 * 3600 * 24);
        return diffDays <= 90;
      }
      return true;
    });
  }, [transactions, timeRange]);

  // Aggregate expenses per category
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach(tx => {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    });
    // Sort descending
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses]);

  const totalExpense = useMemo(() => {
    return categoryTotals.reduce((sum, item) => sum + item[1], 0);
  }, [categoryTotals]);

  // Chart dataset
  const chartData = useMemo(() => {
    const labels = categoryTotals.map(([cat]) => cat);
    const data = categoryTotals.map(([, amount]) => amount);
    const backgroundColor = categoryTotals.map(([cat]) => {
      return (
        EXPENSE_CATEGORIES_INFO[cat as keyof typeof EXPENSE_CATEGORIES_INFO]?.color ||
        '#94A3B8'
      );
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };
  }, [categoryTotals]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.raw || 0;
            const percentage = totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(1) : '0';
            return ` ${formatCurrency(val, currency)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: chartType === 'doughnut' ? '68%' : '0%',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Expense by Category</h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full">
              {categoryTotals.length} active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Where your money is being spent</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as any)}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
            <button
              onClick={() => setChartType('doughnut')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                chartType === 'doughnut'
                  ? 'bg-white shadow text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Donut
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                chartType === 'pie'
                  ? 'bg-white shadow text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pie
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Content */}
      {categoryTotals.length === 0 ? (
        <div className="py-20 text-center">
          <PieIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">No expense records found</p>
          <p className="text-xs text-slate-400">Add expenses to view category breakdown.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Chart Graphic with Center Total for Doughnut */}
          <div className="md:col-span-6 relative h-64 flex items-center justify-center">
            {chartType === 'doughnut' ? (
              <Doughnut data={chartData} options={options} />
            ) : (
              <Pie data={chartData} options={options} />
            )}

            {chartType === 'doughnut' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total
                </span>
                <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {formatCurrency(totalExpense, currency)}
                </span>
              </div>
            )}
          </div>

          {/* Interactive Legend List */}
          <div className="md:col-span-6 space-y-2 max-h-64 overflow-y-auto pr-1">
            {categoryTotals.map(([category, amount]) => {
              const info =
                EXPENSE_CATEGORIES_INFO[category as keyof typeof EXPENSE_CATEGORIES_INFO];
              const pct = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : '0';

              return (
                <div
                  key={category}
                  className="p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: info?.color || '#94A3B8' }}
                    />
                    <span className="font-semibold text-slate-700 truncate">{category}</span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-slate-400 font-medium">{pct}%</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(amount, currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
