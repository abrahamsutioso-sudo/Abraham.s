import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Calendar, 
  Target, 
  Coffee, 
  Zap, 
  Utensils, 
  Car, 
  Sparkles,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { formatRupiah, formatCompactRupiah, getTodayDateString, getCurrentTimeString } from '../utils/formatters';
import { Transaction, BudgetConfig, CategoryStat } from '../types/finance';

interface DashboardOverviewProps {
  transactions: Transaction[];
  budgetConfig: BudgetConfig;
  categoryStats: CategoryStat[];
  onQuickAdd: (tx: Omit<Transaction, 'id'>) => void;
  onOpenReport: () => void;
  onOpenBudget: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  transactions,
  budgetConfig,
  categoryStats,
  onQuickAdd,
  onOpenReport,
  onOpenBudget,
}) => {
  const todayStr = getTodayDateString();

  // Today's metrics
  const todayTransactions = transactions.filter((t) => t.date === todayStr);
  const todayExpense = todayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayIncome = todayTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Month-to-date metrics
  const now = new Date();
  const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const monthTransactions = transactions.filter((t) => t.date >= startOfMonth);
  const monthExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = budgetConfig.monthlyTotalBudget || 6500000;
  const budgetUsagePercent = totalBudget > 0 ? Math.round((monthExpense / totalBudget) * 100) : 0;
  const budgetRemaining = totalBudget - monthExpense;

  // Preset quick logging
  const quickPresets = [
    { label: 'Makan Siang', amount: 25000, category: 'Makanan & Minuman', note: 'Makan Siang' },
    { label: 'Kopi / Minuman', amount: 20000, category: 'Makanan & Minuman', note: 'Kopi / Minuman' },
    { label: 'Bensin Motor', amount: 30000, category: 'Transportasi', note: 'Bensin Motor' },
    { label: 'Parkir', amount: 5000, category: 'Transportasi', note: 'Parkir Kendaraan' },
  ];

  return (
    <div className="space-y-4">
      {/* 3 Overview Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Hari Ini */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pengeluaran Hari Ini
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatRupiah(todayExpense)}
            </span>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span>{todayTransactions.filter((t) => t.type === 'expense').length} transaksi keluar</span>
              {todayIncome > 0 && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">+{formatRupiah(todayIncome)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Bulan Ini */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Pengeluaran Bulan Ini
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              {formatRupiah(monthExpense)}
            </span>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span>Pemasukan: <strong className="text-emerald-700">{formatRupiah(monthIncome)}</strong></span>
            </div>
          </div>
        </div>

        {/* Card 3: Pagu Anggaran Real-Time */}
        <div 
          onClick={onOpenBudget}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs cursor-pointer hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sisa Pagu Anggaran
            </span>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold group-hover:translate-x-0.5 transition-transform">
              <Target className="w-4 h-4" />
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  budgetRemaining >= 0 ? 'text-slate-900' : 'text-rose-600'
                }`}
              >
                {budgetRemaining >= 0
                  ? formatRupiah(budgetRemaining)
                  : `-${formatRupiah(Math.abs(budgetRemaining))}`}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {budgetUsagePercent}% terpakai
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetUsagePercent >= 100
                    ? 'bg-rose-500'
                    : budgetUsagePercent >= 80
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick 1-Click Logging Shortcuts */}
      <div className="no-print bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-50 border border-emerald-200/60 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Catat Cepat (1-Klik):
            </h4>
            <p className="text-[11px] text-slate-500">
              Pintasan transaksi harian yang paling sering dilakukan
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {quickPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                onQuickAdd({
                  type: 'expense',
                  amount: preset.amount,
                  category: preset.category,
                  date: todayStr,
                  time: getCurrentTimeString(),
                  note: preset.note,
                  paymentMethod: 'QRIS',
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{preset.label}</span>
              <span className="text-[11px] font-bold text-emerald-700">
                {formatCompactRupiah(preset.amount)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
