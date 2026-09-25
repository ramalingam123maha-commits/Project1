# FinanceFlow — Personal Finance Tracker

A full-featured personal finance tracker web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Chart.js** (`react-chartjs-2`).

## Features

- **Categorized Expense & Income Tracking**: Manage expenses with predefined colorful categories (Housing, Food, Dining, Utilities, Entertainment, Health, Education, Travel, etc.) and income sources.
- **Visual Chart.js Dashboards**:
  - **Expense by Category**: Interactive Donut and Pie charts with time-range filtering (All Time, This Month, Last 30 Days, Last 90 Days) and real-time percentage breakdown.
  - **Monthly Spending & Inflow Trends**: Dual-series Bar and Line charts comparing monthly expenditures against revenues and calculating net savings rates over 3, 6, or 12 month horizons.
  - **Budget vs. Actual Spending**: Horizontal benchmark chart tracking real expenditure against target category caps with dynamic progress indicators and overbudget alerts.
- **Smart Financial Insights**: Automated algorithmic rules analyzing primary cost drivers, month-over-month variances, recurring subscriptions, and budget health.
- **Transaction Management**:
  - Full CRUD operations (Add, Edit, Delete).
  - Search, filter by type/category, and multi-parameter sorting.
  - Pagination support.
  - CSV Export of transactions.
- **Local Storage Persistence & Backups**:
  - Complete offline persistence in `localStorage`.
  - Export and restore backup data via JSON.
  - Multi-currency switcher ($, €, £, ¥, ₹, C$, A$).
