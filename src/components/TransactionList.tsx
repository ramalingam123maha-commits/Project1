import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType } from '../types/finance';
import { EXPENSE_CATEGORIES_INFO, INCOME_CATEGORIES_INFO } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Search,
  ArrowDownRight,
  ArrowUpRight,
  Edit2,
  Trash2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';

interface TransactionListProps {
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onEditTransaction }) => {
  const { transactions, deleteTransaction, currency } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) return false;

      // Category filter
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesCat = tx.category.toLowerCase().includes(query);
        const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
        const matchesMethod = tx.paymentMethod ? tx.paymentMethod.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesCat && !matchesNotes && !matchesMethod) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, selectedType, selectedCategory, searchTerm, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const allCategories = useMemo(() => {
    const exp = Object.keys(EXPENSE_CATEGORIES_INFO);
    const inc = Object.keys(INCOME_CATEGORIES_INFO);
    return Array.from(new Set([...exp, ...inc]));
  }, []);

  const exportCSV = () => {
    const headers = ['ID', 'Type', 'Title', 'Amount', 'Category', 'Date', 'Payment Method', 'Notes', 'Recurring'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.category}"`,
      t.date,
      t.paymentMethod || '',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      t.recurring ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              {filteredTransactions.length} items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter, search, edit and manage your expense logs
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value as any);
              setCurrentPage(1);
            }}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 max-w-[150px]"
          >
            <option value="all">All Categories</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>

          {/* Export button */}
          <button
            onClick={exportCSV}
            title="Export filtered transactions as CSV"
            className="p-1.5 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold px-3"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {paginatedTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No transactions found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search or filters, or record a new transaction to start tracking.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Transaction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedTransactions.map(tx => {
                const isExpense = tx.type === 'expense';
                const catInfo = isExpense
                  ? EXPENSE_CATEGORIES_INFO[tx.category as keyof typeof EXPENSE_CATEGORIES_INFO]
                  : INCOME_CATEGORIES_INFO[tx.category as keyof typeof INCOME_CATEGORIES_INFO];

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Title & Icon */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                            isExpense
                              ? 'bg-rose-50 text-rose-500'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {isExpense ? (
                            <ArrowDownRight className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            <span>{tx.title}</span>
                            {tx.recurring && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                Recurring
                              </span>
                            )}
                          </div>
                          {tx.notes && (
                            <p className="text-xs text-slate-400 line-clamp-1">{tx.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          catInfo?.bg || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: catInfo?.color || '#94a3b8' }}
                        />
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(tx.date)}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                      {tx.paymentMethod ? (
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                          {tx.paymentMethod}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-6 whitespace-nowrap text-right">
                      <span
                        className={`font-bold text-sm tracking-tight ${
                          isExpense ? 'text-slate-800' : 'text-emerald-600'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${tx.title}"?`)) {
                              deleteTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-700">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </strong>{' '}
            of <strong className="text-slate-700">{filteredTransactions.length}</strong> transactions
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
