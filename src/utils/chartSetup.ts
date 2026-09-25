import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

// Global Chart.js defaults
ChartJS.defaults.font.family = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
ChartJS.defaults.color = '#64748b';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#0f172a';
ChartJS.defaults.plugins.tooltip.titleColor = '#ffffff';
ChartJS.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
