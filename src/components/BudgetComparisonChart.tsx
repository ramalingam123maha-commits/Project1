import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { Target, AlertTriangle } from 'lucide-react';

interface BudgetComparisonChartProps {
  onOpenBudgetModal: () => void;
}

export const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({
  onOpenBudgetModal,
}) => {
  const { transactions, budgetGoals, currency } = useFinance();

  // Compute current month expenses per category
  const comparisonData = useMemo(() => {
    const currentMonthKey = new Date().toISOString().slice(0, 7);

    // Filter expenses in current month
    const thisMonthExpenses = transactions.filter(
      tx => tx.type === 'expense' && tx.date.startsWith(currentMonthKey)
    );

    // Sum per category
    const actualMap: Record<string, number> = {};
    thisMonthExpenses.forEach(tx => {
      actualMap[tx.category] = (actualMap[tx.category] || 0) + tx.amount;
    });

    // Categories to display: all categories with a set budget or with expenses
    const categoriesWithData = budgetGoals
      .filter(b => b.monthlyLimit > 0 || (actualMap[b.category] || 0) > 0)
      .map(b => {
        const spent = actualMap[b.category] || 0;
        const limit = b.monthlyLimit;
        const diff = limit - spent;
        const pct = limit > 0 ? (spent / limit) * 100 : 0;
        return {
          category: b.category,
          spent,
          limit,
          diff,
          pct,
          isOver: spent > limit && limit > 0,
        };
      });

    return categoriesWithData.sort((a, b) => b.spent - a.spent);
  }, [transactions, budgetGoals]);

  const chartData = useMemo(() => {
    const labels = comparisonData.map(c => c.category);
    const spentData = comparisonData.map(c => c.spent);
    const limitData = comparisonData.map(c => c.limit);

    return {
      labels,
      datasets: [
        {
          label: 'Actual Spent (This Month)',
          data: spentData,
          backgroundColor: comparisonData.map(c => (c.isOver ? '#EF4444' : '#3B82F6')),
          borderRadius: 6,
        },
        {
          label: 'Budget Target',
          data: limitData,
          backgroundColor: '#E2E8F0',
          borderRadius: 6,
        },
      ],
    };
  }, [comparisonData]);

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          font: { size: 11, weight: 600 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return ` ${context.dataset.label}: ${formatCurrency(context.raw, currency)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10 },
          callback: (value: any) => formatCurrency(value, currency),
        },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11, weight: 500 } },
      },
    },
  };

  const overBudgetCategories = comparisonData.filter(c => c.isOver);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Budget vs. Actual Spending</h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
              Current Month
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor limits and prevent overspending in real-time
          </p>
        </div>

        <button
          onClick={onOpenBudgetModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition border border-emerald-200/60 self-start sm:self-auto"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Adjust Targets</span>
        </button>
      </div>

      {/* Overbudget Alert Banner if any */}
      {overBudgetCategories.length > 0 && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>
              <strong>{overBudgetCategories.length} categories</strong> have exceeded their monthly
              limit this month ({overBudgetCategories.map(c => c.category).join(', ')}).
            </span>
          </div>
        </div>
      )}

      {/* Main Chart Graphic */}
      <div className="h-64 w-full mb-6">
        {comparisonData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Target className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm font-semibold">No budget targets configured</p>
            <p className="text-xs mt-1">Click "Adjust Targets" above to set category spending limits.</p>
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      {/* Progress Bars List for top categories */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {comparisonData.slice(0, 4).map(c => {
            const pctDisplay = Math.min(Math.round(c.pct), 100);
            return (
              <div key={c.category} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">{c.category}</span>
                  <span
                    className={`font-bold ${c.isOver ? 'text-rose-600' : 'text-slate-600'}`}
                  >
                    {formatCurrency(c.spent, currency)} / {formatCurrency(c.limit, currency)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.isOver
                        ? 'bg-rose-500'
                        : c.pct > 80
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pctDisplay}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
