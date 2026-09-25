import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { Sparkles, TrendingUp, Lightbulb, Zap } from 'lucide-react';

export const SmartFinancialInsights: React.FC = () => {
  const { transactions, currency, budgetGoals } = useFinance();

  const insights = useMemo(() => {
    const list: { id: string; title: string; desc: string; type: 'positive' | 'warning' | 'info' }[] = [];

    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthKey = lastMonth.toISOString().slice(0, 7);

    // Current & Last Month calculations
    let currentExpense = 0;
    let lastExpense = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        if (tx.date.startsWith(currentMonthKey)) {
          currentExpense += tx.amount;
          catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
        } else if (tx.date.startsWith(lastMonthKey)) {
          lastExpense += tx.amount;
        }
      }
    });

    // Top Category Insight
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length > 0) {
      const [topCat, topAmount] = sortedCats[0];
      const pct = currentExpense > 0 ? ((topAmount / currentExpense) * 100).toFixed(0) : 0;
      list.push({
        id: 'top-cat',
        title: `Primary Expense Driver: ${topCat}`,
        desc: `Accounts for ${pct}% (${formatCurrency(topAmount, currency)}) of this month's overall spending.`,
        type: 'info',
      });
    }

    // Month-over-Month comparison
    if (lastExpense > 0 && currentExpense > 0) {
      const diffPct = (((currentExpense - lastExpense) / lastExpense) * 100).toFixed(1);
      const isHigher = currentExpense > lastExpense;
      list.push({
        id: 'mom-trend',
        title: isHigher ? `Spending +${diffPct}% vs Last Month` : `Spending ${diffPct}% vs Last Month`,
        desc: isHigher
          ? `You have spent ${formatCurrency(currentExpense - lastExpense, currency)} more than during the same window last month.`
          : `Great job! Outflow is trending lower by ${formatCurrency(lastExpense - currentExpense, currency)} compared to last month.`,
        type: isHigher ? 'warning' : 'positive',
      });
    }

    // Budget overage alerts
    const overBudgets = budgetGoals.filter(bg => (catMap[bg.category] || 0) > bg.monthlyLimit && bg.monthlyLimit > 0);
    if (overBudgets.length > 0) {
      list.push({
        id: 'budget-over',
        title: `${overBudgets.length} Budget Target(s) Exceeded`,
        desc: `Categories exceeding limits: ${overBudgets.map(b => b.category).join(', ')}. Consider moderating discretionary spend.`,
        type: 'warning',
      });
    } else {
      list.push({
        id: 'budget-healthy',
        title: 'Budget Discipline on Track',
        desc: 'All categorized spending remains within your configured monthly thresholds.',
        type: 'positive',
      });
    }

    // Recurring subscriptions count
    const recurringCount = transactions.filter(t => t.recurring && t.type === 'expense').length;
    if (recurringCount > 0) {
      const recurringSum = transactions
        .filter(t => t.recurring && t.type === 'expense' && t.date.startsWith(currentMonthKey))
        .reduce((sum, t) => sum + t.amount, 0);

      list.push({
        id: 'recurring-info',
        title: `${recurringCount} Active Recurring Subscriptions`,
        desc: `Estimated fixed commitments consume ${formatCurrency(recurringSum, currency)} every month.`,
        type: 'info',
      });
    }

    return list.slice(0, 3);
  }, [transactions, budgetGoals, currency]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Smart Financial Insights</h3>
            <p className="text-xs text-slate-300">Automated analysis of your spending behavior</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-full text-slate-200">
          Real-time Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-2">
        {insights.map(item => (
          <div
            key={item.id}
            className={`p-3.5 rounded-xl border backdrop-blur-md transition ${
              item.type === 'positive'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                : item.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                : 'bg-white/5 border-white/10 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 font-bold text-xs">
              {item.type === 'positive' && <Zap className="w-4 h-4 text-emerald-400" />}
              {item.type === 'warning' && <TrendingUp className="w-4 h-4 text-amber-400" />}
              {item.type === 'info' && <Lightbulb className="w-4 h-4 text-blue-400" />}
              <span className="text-white">{item.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
