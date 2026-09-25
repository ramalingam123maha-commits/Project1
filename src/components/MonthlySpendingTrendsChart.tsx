import React, { useState, useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { TrendingUp, BarChart3, LineChart } from 'lucide-react';

export const MonthlySpendingTrendsChart: React.FC = () => {
  const { transactions, currency } = useFinance();
  const [chartView, setChartView] = useState<'bar' | 'line'>('bar');
  const [includeIncome, setIncludeIncome] = useState(true);
  const [monthsCount, setMonthsCount] = useState<number>(6); // Last 6 or 12 months

  // Calculate monthly aggregations
  const monthlyData = useMemo(() => {
    // Generate chronological months
    const map: Record<string, { income: number; expense: number; net: number }> = {};

    transactions.forEach(tx => {
      const monthKey = tx.date.slice(0, 7); // YYYY-MM
      if (!map[monthKey]) {
        map[monthKey] = { income: 0, expense: 0, net: 0 };
      }
      if (tx.type === 'income') {
        map[monthKey].income += tx.amount;
      } else {
        map[monthKey].expense += tx.amount;
      }
      map[monthKey].net = map[monthKey].income - map[monthKey].expense;
    });

    // Sort chronologically ascending
    const sortedKeys = Object.keys(map).sort();
    const slicedKeys = sortedKeys.slice(-monthsCount);

    return {
      labels: slicedKeys.map(k => formatMonthYear(`${k}-01`)),
      keys: slicedKeys,
      expenses: slicedKeys.map(k => map[k]?.expense || 0),
      incomes: slicedKeys.map(k => map[k]?.income || 0),
      nets: slicedKeys.map(k => map[k]?.net || 0),
    };
  }, [transactions, monthsCount]);

  // Bar Chart Configuration
  const barChartData = useMemo(() => {
    const datasets: any[] = [
      {
        label: 'Monthly Expenses',
        data: monthlyData.expenses,
        backgroundColor: '#F43F5E',
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ];

    if (includeIncome) {
      datasets.unshift({
        label: 'Monthly Income',
        data: monthlyData.incomes,
        backgroundColor: '#10B981',
        borderRadius: 6,
        barPercentage: 0.6,
      });
    }

    return {
      labels: monthlyData.labels,
      datasets,
    };
  }, [monthlyData, includeIncome]);

  // Line Chart Configuration
  const lineChartData = useMemo(() => {
    const datasets: any[] = [
      {
        label: 'Expenses Trend',
        data: monthlyData.expenses,
        borderColor: '#F43F5E',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#F43F5E',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ];

    if (includeIncome) {
      datasets.unshift({
        label: 'Income Trend',
        data: monthlyData.incomes,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#10B981',
        pointRadius: 4,
        pointHoverRadius: 6,
      });
    }

    return {
      labels: monthlyData.labels,
      datasets,
    };
  }, [monthlyData, includeIncome]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: 11,
            weight: 600,
          },
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
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: (value: any) => formatCurrency(value, currency),
        },
      },
    },
  };

  // High-level averages
  const avgMonthlyExpense =
    monthlyData.expenses.length > 0
      ? monthlyData.expenses.reduce((a, b) => a + b, 0) / monthlyData.expenses.length
      : 0;

  const avgMonthlyIncome =
    monthlyData.incomes.length > 0
      ? monthlyData.incomes.reduce((a, b) => a + b, 0) / monthlyData.incomes.length
      : 0;

  const avgSavingsRate =
    avgMonthlyIncome > 0
      ? Math.max(0, ((avgMonthlyIncome - avgMonthlyExpense) / avgMonthlyIncome) * 100).toFixed(1)
      : '0';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Monthly Spending & Income Trends</h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
              {monthlyData.labels.length} months
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare monthly outflow, inflow and evaluate your savings trajectory
          </p>
        </div>

        {/* View toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Months Range */}
          <select
            value={monthsCount}
            onChange={e => setMonthsCount(Number(e.target.value))}
            className="text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last 12 Months</option>
          </select>

          {/* Toggle Income */}
          <button
            onClick={() => setIncludeIncome(!includeIncome)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              includeIncome
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            {includeIncome ? '✓ Income Included' : '+ Include Income'}
          </button>

          {/* Chart Type (Bar / Line) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
            <button
              onClick={() => setChartView('bar')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                chartView === 'bar'
                  ? 'bg-white shadow text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartView('line')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                chartView === 'line'
                  ? 'bg-white shadow text-slate-800'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Line Chart"
            >
              <LineChart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="h-72 w-full mb-6">
        {monthlyData.labels.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <TrendingUp className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">No transaction trends available.</p>
          </div>
        ) : chartView === 'bar' ? (
          <Bar data={barChartData} options={options} />
        ) : (
          <Line data={lineChartData} options={options} />
        )}
      </div>

      {/* Mini Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Avg. Monthly Spend
          </p>
          <p className="text-base font-bold text-slate-800 mt-0.5">
            {formatCurrency(avgMonthlyExpense, currency)}
          </p>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl">
          <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
            Avg. Monthly Income
          </p>
          <p className="text-base font-bold text-emerald-700 mt-0.5">
            {formatCurrency(avgMonthlyIncome, currency)}
          </p>
        </div>

        <div className="p-3 bg-indigo-50/60 rounded-xl">
          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
            Avg. Savings Rate
          </p>
          <p className="text-base font-bold text-indigo-700 mt-0.5">{avgSavingsRate}%</p>
        </div>
      </div>
    </div>
  );
};
