import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { EXPENSE_CATEGORIES_INFO } from '../data/mockData';
import { ExpenseCategory } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { Target, X, Check, Edit2, AlertCircle } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { budgetGoals, updateBudgetGoal, currency } = useFinance();
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [tempLimit, setTempLimit] = useState<string>('');

  if (!isOpen) return null;

  const handleStartEdit = (category: ExpenseCategory, currentLimit: number) => {
    setEditingCategory(category);
    setTempLimit(currentLimit.toString());
  };

  const handleSave = (category: ExpenseCategory) => {
    const val = parseFloat(tempLimit);
    if (!isNaN(val) && val >= 0) {
      updateBudgetGoal(category, val);
    }
    setEditingCategory(null);
  };

  const allExpenseCategories = Object.keys(EXPENSE_CATEGORIES_INFO) as ExpenseCategory[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Monthly Budget Targets</h3>
              <p className="text-xs text-slate-500">Set limits per expense category to track monthly spending</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {allExpenseCategories.map(cat => {
            const currentGoal = budgetGoals.find(b => b.category === cat);
            const limit = currentGoal ? currentGoal.monthlyLimit : 0;
            const info = EXPENSE_CATEGORIES_INFO[cat];
            const isEditing = editingCategory === cat;

            return (
              <div key={cat} className="pt-3 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: info.color }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">{cat}</h4>
                    <p className="text-xs text-slate-400">Monthly spending cap</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <div className="relative w-28">
                        <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-slate-400 font-bold">
                          {currency}
                        </span>
                        <input
                          type="number"
                          step="10"
                          min="0"
                          autoFocus
                          value={tempLimit}
                          onChange={e => setTempLimit(e.target.value)}
                          className="w-full pl-6 pr-2 py-1 text-sm font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(cat)}
                        className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-800">
                        {limit > 0 ? formatCurrency(limit, currency) : <span className="text-slate-400 font-normal italic">No limit</span>}
                      </span>
                      <button
                        onClick={() => handleStartEdit(cat, limit)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit Target"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-emerald-500" />
            <span>Budgets update comparisons across all charts instantly</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
