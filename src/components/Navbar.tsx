import React, { useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Plus,
  Target,
  RotateCcw,
  Download,
  Upload,
  TrendingUp,
} from 'lucide-react';

interface NavbarProps {
  onOpenTransactionModal: () => void;
  onOpenBudgetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTransactionModal,
  onOpenBudgetModal,
}) => {
  const { currency, setCurrency, resetToDefaults, importData, transactions, budgetGoals } = useFinance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      currency,
      budgetGoals,
      transactions,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financeflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          importData({
            transactions: parsed.transactions,
            budgetGoals: parsed.budgetGoals,
          });
          if (parsed.currency) setCurrency(parsed.currency);
          alert('Data imported successfully!');
        } else {
          alert('Invalid JSON backup file structure.');
        }
      } catch (err) {
        alert('Failed to parse the backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Finance<span className="text-emerald-600">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Personal Expense & Spending Trend Intelligence
              </p>
            </div>
          </div>

          {/* Action Tools & Modals */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency selector */}
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="py-1.5 px-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              title="Change default display currency"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="¥">JPY (¥)</option>
              <option value="₹">INR (₹)</option>
              <option value="C$">CAD (C$)</option>
              <option value="A$">AUD (A$)</option>
            </select>

            {/* Quick Actions Menu / Reset */}
            <div className="hidden md:flex items-center gap-1 border-l border-slate-200 pl-3">
              <button
                onClick={handleExportJSON}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition text-xs flex items-center gap-1"
                title="Backup all data to JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportJSON}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition text-xs flex items-center gap-1"
                title="Restore data from JSON"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Reset transactions and budgets to default demo records?')) {
                    resetToDefaults();
                  }
                }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                title="Reset sample mock data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Budget Target Modal Trigger */}
            <button
              onClick={onOpenBudgetModal}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
            >
              <Target className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Budgets</span>
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={onOpenTransactionModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
