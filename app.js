const storageKey = 'expense-tracker-transactions';
const palette = ['#2563eb', '#14b8a6', '#f97316', '#8b5cf6', '#ec4899', '#22c55e', '#eab308', '#64748b'];
const demoTransactions = [
  { id: crypto.randomUUID(), title: 'Monthly salary', amount: 4200, type: 'income', category: 'Salary', date: new Date().toISOString().slice(0, 10) },
  { id: crypto.randomUUID(), title: 'Groceries', amount: 86.45, type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10) },
  { id: crypto.randomUUID(), title: 'Train pass', amount: 54, type: 'expense', category: 'Transport', date: new Date().toISOString().slice(0, 10) },
  { id: crypto.randomUUID(), title: 'Electric bill', amount: 118.2, type: 'expense', category: 'Utilities', date: new Date().toISOString().slice(0, 10) },
  { id: crypto.randomUUID(), title: 'New headphones', amount: 129.99, type: 'expense', category: 'Shopping', date: new Date().toISOString().slice(0, 10) }
];

const form = document.querySelector('#expenseForm');
const list = document.querySelector('#transactionList');
const dateInput = document.querySelector('#date');
let transactions = loadTransactions();

dateInput.value = new Date().toISOString().slice(0, 10);
render();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  transactions.unshift({
    id: crypto.randomUUID(),
    title: data.get('title').toString().trim(),
    amount: Number(data.get('amount')),
    type: data.get('type'),
    category: data.get('category'),
    date: data.get('date')
  });
  saveTransactions();
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  render();
});

document.querySelector('#clearAll').addEventListener('click', () => {
  transactions = [];
  saveTransactions();
  render();
});

document.querySelector('#resetData').addEventListener('click', () => {
  transactions = [...demoTransactions];
  saveTransactions();
  render();
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  transactions = transactions.filter((transaction) => transaction.id !== button.dataset.id);
  saveTransactions();
  render();
});

function loadTransactions() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return [...demoTransactions];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...demoTransactions];
  } catch {
    return [...demoTransactions];
  }
}

function saveTransactions() {
  localStorage.setItem(storageKey, JSON.stringify(transactions));
}

function render() {
  const income = sumByType('income');
  const expenses = sumByType('expense');
  document.querySelector('#incomeTotal').textContent = money(income);
  document.querySelector('#expenseTotal').textContent = money(expenses);
  document.querySelector('#balanceTotal').textContent = money(income - expenses);
  renderTransactions();
  renderCategoryChart();
  renderDonutChart(income, expenses);
}

function renderTransactions() {
  list.innerHTML = '';
  if (!transactions.length) {
    list.innerHTML = '<li class="empty">No transactions yet. Add one above to start tracking.</li>';
    return;
  }
  for (const transaction of transactions) {
    const item = document.createElement('li');
    item.className = 'transaction';
    item.innerHTML = `
      <div><div class="transaction-title"></div><div class="transaction-meta">${transaction.category} • ${formatDate(transaction.date)}</div></div>
      <span class="amount ${transaction.type}">${transaction.type === 'expense' ? '-' : '+'}${money(transaction.amount)}</span>
      <button class="delete" type="button" data-id="${transaction.id}">Delete</button>`;
    item.querySelector('.transaction-title').textContent = transaction.title;
    list.appendChild(item);
  }
}

function renderCategoryChart() {
  const canvas = document.querySelector('#categoryChart');
  const ctx = canvas.getContext('2d');
  const totals = categoryTotals();
  drawCanvasBase(ctx, canvas);
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return drawEmptyChart(ctx, canvas, 'Add expenses to see category spending');
  const max = Math.max(...entries.map(([, value]) => value));
  const chartWidth = canvas.width - 140;
  const barHeight = 26;
  entries.forEach(([category, value], index) => {
    const y = 42 + index * 36;
    const width = Math.max((value / max) * chartWidth, 4);
    ctx.fillStyle = palette[index % palette.length];
    ctx.fillRect(112, y, width, barHeight);
    ctx.fillStyle = '#14213d';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(category, 100, y + 18);
    ctx.textAlign = 'left';
    ctx.fillText(money(value), 122 + width, y + 18);
  });
}

function renderDonutChart(income, expenses) {
  const canvas = document.querySelector('#donutChart');
  const ctx = canvas.getContext('2d');
  drawCanvasBase(ctx, canvas);
  const total = income + expenses;
  if (!total) return drawEmptyChart(ctx, canvas, 'No data to chart yet');
  let start = -Math.PI / 2;
  [income, expenses].forEach((value, index) => {
    const slice = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(180, 138);
    ctx.arc(180, 138, 100, start, start + slice);
    ctx.closePath();
    ctx.fillStyle = index === 0 ? '#14b8a6' : '#ef4444';
    ctx.fill();
    start += slice;
  });
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(180, 138, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#14213d';
  ctx.font = '700 16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Balance', 180, 132);
  ctx.font = '800 18px system-ui';
  ctx.fillText(money(income - expenses), 180, 158);
  drawLegend(ctx, 62, 278, '#14b8a6', `Income ${money(income)}`);
  drawLegend(ctx, 206, 278, '#ef4444', `Expenses ${money(expenses)}`);
}

function drawCanvasBase(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawEmptyChart(ctx, canvas, text) {
  ctx.fillStyle = '#64748b';
  ctx.font = '16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawLegend(ctx, x, y, color, text) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y - 12, 14, 14);
  ctx.fillStyle = '#14213d';
  ctx.font = '13px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText(text, x + 20, y);
}

function categoryTotals() {
  return transactions.filter((transaction) => transaction.type === 'expense').reduce((totals, transaction) => {
    totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
    return totals;
  }, {});
}

function sumByType(type) {
  return transactions.filter((transaction) => transaction.type === type).reduce((total, transaction) => total + transaction.amount, 0);
}

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}
