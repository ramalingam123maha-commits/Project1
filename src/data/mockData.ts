import { ExpenseCategory, IncomeCategory, Transaction, BudgetGoal } from '../types/finance';

export const EXPENSE_CATEGORIES_INFO: Record<ExpenseCategory, { color: string; icon: string; bg: string }> = {
  'Housing & Rent': { color: '#6366F1', icon: 'Home', bg: 'bg-indigo-50 text-indigo-700' },
  'Groceries & Food': { color: '#10B981', icon: 'ShoppingBag', bg: 'bg-emerald-50 text-emerald-700' },
  'Dining & Restaurants': { color: '#F59E0B', icon: 'Utensils', bg: 'bg-amber-50 text-amber-700' },
  'Transportation': { color: '#3B82F6', icon: 'Car', bg: 'bg-blue-50 text-blue-700' },
  'Utilities & Bills': { color: '#EC4899', icon: 'Zap', bg: 'bg-pink-50 text-pink-700' },
  'Healthcare & Fitness': { color: '#14B8A6', icon: 'Activity', bg: 'bg-teal-50 text-teal-700' },
  'Entertainment & Leisure': { color: '#8B5CF6', icon: 'Film', bg: 'bg-purple-50 text-purple-700' },
  'Shopping & Personal': { color: '#F43F5E', icon: 'ShoppingBag', bg: 'bg-rose-50 text-rose-700' },
  'Education & Learning': { color: '#06B6D4', icon: 'BookOpen', bg: 'bg-cyan-50 text-cyan-700' },
  'Travel & Vacation': { color: '#F97316', icon: 'Plane', bg: 'bg-orange-50 text-orange-700' },
  'Savings & Investments': { color: '#84CC16', icon: 'TrendingUp', bg: 'bg-lime-50 text-lime-700' },
  'Other Expenses': { color: '#64748B', icon: 'MoreHorizontal', bg: 'bg-slate-50 text-slate-700' },
};

export const INCOME_CATEGORIES_INFO: Record<IncomeCategory, { color: string; icon: string; bg: string }> = {
  'Salary & Wages': { color: '#10B981', icon: 'Briefcase', bg: 'bg-emerald-50 text-emerald-700' },
  'Freelance & Consulting': { color: '#06B6D4', icon: 'Laptop', bg: 'bg-cyan-50 text-cyan-700' },
  'Investments & Dividends': { color: '#8B5CF6', icon: 'TrendingUp', bg: 'bg-purple-50 text-purple-700' },
  'Business Income': { color: '#3B82F6', icon: 'Building2', bg: 'bg-blue-50 text-blue-700' },
  'Rental Income': { color: '#6366F1', icon: 'Home', bg: 'bg-indigo-50 text-indigo-700' },
  'Gifts & Grants': { color: '#EC4899', icon: 'Gift', bg: 'bg-pink-50 text-pink-700' },
  'Other Income': { color: '#64748B', icon: 'DollarSign', bg: 'bg-slate-50 text-slate-700' },
};

export const DEFAULT_BUDGETS: BudgetGoal[] = [
  { category: 'Housing & Rent', monthlyLimit: 1500 },
  { category: 'Groceries & Food', monthlyLimit: 550 },
  { category: 'Dining & Restaurants', monthlyLimit: 300 },
  { category: 'Transportation', monthlyLimit: 250 },
  { category: 'Utilities & Bills', monthlyLimit: 220 },
  { category: 'Entertainment & Leisure', monthlyLimit: 180 },
  { category: 'Shopping & Personal', monthlyLimit: 250 },
  { category: 'Healthcare & Fitness', monthlyLimit: 150 },
  { category: 'Education & Learning', monthlyLimit: 100 },
];

// Helper to generate dynamic recent dates across last 6 months
const getDateDaysAgo = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Current Month / Recent
  { id: 'tx-1', type: 'income', title: 'Monthly Tech Salary', amount: 4850, category: 'Salary & Wages', date: getDateDaysAgo(2), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-2', type: 'expense', title: 'Apartment Monthly Rent', amount: 1450, category: 'Housing & Rent', date: getDateDaysAgo(3), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-3', type: 'expense', title: 'Whole Foods Market', amount: 142.80, category: 'Groceries & Food', date: getDateDaysAgo(4), paymentMethod: 'Credit Card' },
  { id: 'tx-4', type: 'expense', title: 'Electric & High-speed Fiber', amount: 135.00, category: 'Utilities & Bills', date: getDateDaysAgo(5), paymentMethod: 'Credit Card', recurring: true },
  { id: 'tx-5', type: 'expense', title: 'Weekend Sushi Bar', amount: 68.50, category: 'Dining & Restaurants', date: getDateDaysAgo(6), paymentMethod: 'Credit Card' },
  { id: 'tx-6', type: 'income', title: 'UX Design Client Project', amount: 950, category: 'Freelance & Consulting', date: getDateDaysAgo(8), paymentMethod: 'Bank Transfer' },
  { id: 'tx-7', type: 'expense', title: 'Monthly Metro Pass', amount: 90.00, category: 'Transportation', date: getDateDaysAgo(9), paymentMethod: 'Debit Card', recurring: true },
  { id: 'tx-8', type: 'expense', title: 'Climbing Gym Membership', amount: 85.00, category: 'Healthcare & Fitness', date: getDateDaysAgo(11), paymentMethod: 'Credit Card', recurring: true },
  { id: 'tx-9', type: 'expense', title: 'Netflix & Spotify Streaming', amount: 32.98, category: 'Entertainment & Leisure', date: getDateDaysAgo(13), paymentMethod: 'Credit Card', recurring: true },
  { id: 'tx-10', type: 'expense', title: 'Trader Joe\'s Groceries', amount: 115.40, category: 'Groceries & Food', date: getDateDaysAgo(15), paymentMethod: 'Credit Card' },
  { id: 'tx-11', type: 'expense', title: 'Running Shoes & Apparel', amount: 129.99, category: 'Shopping & Personal', date: getDateDaysAgo(18), paymentMethod: 'Credit Card' },
  { id: 'tx-12', type: 'expense', title: 'TypeScript & Cloud Book Bundle', amount: 45.00, category: 'Education & Learning', date: getDateDaysAgo(20), paymentMethod: 'Credit Card' },
  { id: 'tx-13', type: 'income', title: 'Quarterly ETF Dividends', amount: 245.50, category: 'Investments & Dividends', date: getDateDaysAgo(22), paymentMethod: 'Bank Transfer' },
  { id: 'tx-14', type: 'expense', title: 'Uber rides & Gas', amount: 54.20, category: 'Transportation', date: getDateDaysAgo(25), paymentMethod: 'Credit Card' },

  // Last Month (~30-55 days ago)
  { id: 'tx-15', type: 'income', title: 'Monthly Tech Salary', amount: 4850, category: 'Salary & Wages', date: getDateDaysAgo(32), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-16', type: 'expense', title: 'Apartment Monthly Rent', amount: 1450, category: 'Housing & Rent', date: getDateDaysAgo(33), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-17', type: 'expense', title: 'Supermarket Wholesale Haul', amount: 260.40, category: 'Groceries & Food', date: getDateDaysAgo(36), paymentMethod: 'Credit Card' },
  { id: 'tx-18', type: 'expense', title: 'Electricity & Water bill', amount: 140.00, category: 'Utilities & Bills', date: getDateDaysAgo(38), paymentMethod: 'Debit Card' },
  { id: 'tx-19', type: 'expense', title: 'Bistro Italian Dinner with Friends', amount: 125.00, category: 'Dining & Restaurants', date: getDateDaysAgo(40), paymentMethod: 'Credit Card' },
  { id: 'tx-20', type: 'income', title: 'Frontend Consultation Gig', amount: 800.00, category: 'Freelance & Consulting', date: getDateDaysAgo(42), paymentMethod: 'Bank Transfer' },
  { id: 'tx-21', type: 'expense', title: 'Car Maintenance & Oil change', amount: 175.00, category: 'Transportation', date: getDateDaysAgo(45), paymentMethod: 'Credit Card' },
  { id: 'tx-22', type: 'expense', title: 'Concert Tickets', amount: 140.00, category: 'Entertainment & Leisure', date: getDateDaysAgo(48), paymentMethod: 'Credit Card' },
  { id: 'tx-23', type: 'expense', title: 'Winter Coat & Jeans', amount: 189.50, category: 'Shopping & Personal', date: getDateDaysAgo(51), paymentMethod: 'Credit Card' },
  { id: 'tx-24', type: 'expense', title: 'Dentist Checkup & Cleaning', amount: 95.00, category: 'Healthcare & Fitness', date: getDateDaysAgo(54), paymentMethod: 'Debit Card' },

  // 2 Months ago (~60-85 days ago)
  { id: 'tx-25', type: 'income', title: 'Monthly Tech Salary', amount: 4850, category: 'Salary & Wages', date: getDateDaysAgo(62), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-26', type: 'expense', title: 'Apartment Monthly Rent', amount: 1450, category: 'Housing & Rent', date: getDateDaysAgo(63), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-27', type: 'expense', title: 'Weekly Groceries Organic', amount: 310.20, category: 'Groceries & Food', date: getDateDaysAgo(66), paymentMethod: 'Credit Card' },
  { id: 'tx-28', type: 'expense', title: 'Flights for Weekend Getaway', amount: 340.00, category: 'Travel & Vacation', date: getDateDaysAgo(70), paymentMethod: 'Credit Card' },
  { id: 'tx-29', type: 'expense', title: 'Hotel Booking', amount: 280.00, category: 'Travel & Vacation', date: getDateDaysAgo(72), paymentMethod: 'Credit Card' },
  { id: 'tx-30', type: 'expense', title: 'Utilities & Broadband', amount: 130.00, category: 'Utilities & Bills', date: getDateDaysAgo(75), paymentMethod: 'Credit Card' },
  { id: 'tx-31', type: 'expense', title: 'Coffee Shops & Lunches', amount: 145.80, category: 'Dining & Restaurants', date: getDateDaysAgo(78), paymentMethod: 'Credit Card' },
  { id: 'tx-32', type: 'income', title: 'Side Project API Sales', amount: 420.00, category: 'Business Income', date: getDateDaysAgo(82), paymentMethod: 'Bank Transfer' },

  // 3 Months ago (~90-115 days ago)
  { id: 'tx-33', type: 'income', title: 'Monthly Tech Salary', amount: 4850, category: 'Salary & Wages', date: getDateDaysAgo(92), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-34', type: 'expense', title: 'Apartment Monthly Rent', amount: 1450, category: 'Housing & Rent', date: getDateDaysAgo(93), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-35', type: 'expense', title: 'Groceries Market', amount: 410.00, category: 'Groceries & Food', date: getDateDaysAgo(98), paymentMethod: 'Credit Card' },
  { id: 'tx-36', type: 'expense', title: 'Online Course Subscription', amount: 99.00, category: 'Education & Learning', date: getDateDaysAgo(104), paymentMethod: 'Credit Card' },
  { id: 'tx-37', type: 'expense', title: 'Dining & Delivery Food', amount: 215.30, category: 'Dining & Restaurants', date: getDateDaysAgo(108), paymentMethod: 'Credit Card' },
  { id: 'tx-38', type: 'income', title: 'Stock Dividend', amount: 180.00, category: 'Investments & Dividends', date: getDateDaysAgo(112), paymentMethod: 'Bank Transfer' },

  // 4 Months ago (~120-145 days ago)
  { id: 'tx-39', type: 'income', title: 'Monthly Tech Salary', amount: 4850, category: 'Salary & Wages', date: getDateDaysAgo(122), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-40', type: 'expense', title: 'Apartment Monthly Rent', amount: 1450, category: 'Housing & Rent', date: getDateDaysAgo(123), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-41', type: 'expense', title: 'Groceries Haul', amount: 380.00, category: 'Groceries & Food', date: getDateDaysAgo(128), paymentMethod: 'Credit Card' },
  { id: 'tx-42', type: 'expense', title: 'Gadgets & Ergonomic Chair', amount: 320.00, category: 'Shopping & Personal', date: getDateDaysAgo(135), paymentMethod: 'Credit Card' },
  { id: 'tx-43', type: 'expense', title: 'Utilities & Power', amount: 125.00, category: 'Utilities & Bills', date: getDateDaysAgo(140), paymentMethod: 'Debit Card' },

  // 5 Months ago (~150-175 days ago)
  { id: 'tx-44', type: 'income', title: 'Monthly Tech Salary', amount: 4850, category: 'Salary & Wages', date: getDateDaysAgo(152), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-45', type: 'expense', title: 'Apartment Monthly Rent', amount: 1450, category: 'Housing & Rent', date: getDateDaysAgo(153), paymentMethod: 'Bank Transfer', recurring: true },
  { id: 'tx-46', type: 'expense', title: 'Monthly Food & Pantry', amount: 395.00, category: 'Groceries & Food', date: getDateDaysAgo(158), paymentMethod: 'Credit Card' },
  { id: 'tx-47', type: 'expense', title: 'Car Insurance (Annual Portion)', amount: 220.00, category: 'Transportation', date: getDateDaysAgo(165), paymentMethod: 'Bank Transfer' },
  { id: 'tx-48', type: 'income', title: 'Freelance Design Retainer', amount: 1200.00, category: 'Freelance & Consulting', date: getDateDaysAgo(170), paymentMethod: 'Bank Transfer' },
];
