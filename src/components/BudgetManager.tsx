import React, { useState } from 'react';
import { 
  Target, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Save, 
  RotateCcw, 
  TrendingDown, 
  HelpCircle, 
  Edit3, 
  X,
  Plus
} from 'lucide-react';
import { Category, BudgetConfig, CategoryStat } from '../types/finance';
import { formatRupiah, formatNumberWithDots, parseRupiahInput } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface BudgetManagerProps {
  categories: Category[];
  budgetConfig: BudgetConfig;
  categoryStats: CategoryStat[];
  totalMonthlyExpense: number;
  onSaveBudgetConfig: (newConfig: BudgetConfig) => void;
  onClose?: () => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  categories,
  budgetConfig,
  categoryStats,
  totalMonthlyExpense,
  onSaveBudgetConfig,
  onClose,
}) => {
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  // Local state for editing
  const [totalBudget, setTotalBudget] = useState<number>(budgetConfig.monthlyTotalBudget || 6500000);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = { ...budgetConfig.categoryBudgets };
    // Ensure every expense category has a budget (or fallback to category default)
    expenseCategories.forEach((cat) => {
      if (initial[cat.name] === undefined) {
        initial[cat.name] = cat.budget || 500000;
      }
    });
    return initial;
  });

  const [activeCategoryEdit, setActiveCategoryEdit] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate sum of category budgets
  const sumCategoryBudgets = Object.values(categoryBudgets).reduce((a, b) => a + (b || 0), 0);

  const handleEditClick = (catName: string, currentBudget: number) => {
    setActiveCategoryEdit(catName);
    setTempValue(formatNumberWithDots(currentBudget));
  };

  const handleSaveCategoryBudget = (catName: string) => {
    const parsed = parseRupiahInput(tempValue);
    const updated = {
      ...categoryBudgets,
      [catName]: parsed,
    };
    setCategoryBudgets(updated);
    setActiveCategoryEdit(null);
  };

  const handleQuickAdd = (amount: number) => {
    const current = parseRupiahInput(tempValue);
    setTempValue(formatNumberWithDots(current + amount));
  };

  const handleSetExact = (amount: number) => {
    setTempValue(formatNumberWithDots(amount));
  };

  const handleSyncTotalWithSum = () => {
    setTotalBudget(sumCategoryBudgets);
  };

  const handleSaveAll = () => {
    const newConfig: BudgetConfig = {
      monthlyTotalBudget: totalBudget,
      categoryBudgets,
    };
    onSaveBudgetConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Stats calculation
  const totalBudgetSafe = totalBudget || 1;
  const totalPercentage = Math.round((totalMonthlyExpense / totalBudgetSafe) * 100);
  const remainingTotal = totalBudget - totalMonthlyExpense;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shadow-inner">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">Target & Anggaran Bulanan</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Peringatan Aktif
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tentukan batas pagu per kategori (contoh: Makanan Rp 1.000.000). Sistem akan memantau dan memberi notifikasi otomatis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Anggaran</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan anggaran bulanan berhasil disimpan dan telah diterapkan ke seluruh laporan.</span>
        </div>
      )}

      {/* Total Monthly Budget Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
        <div>
          <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">
            Total Batas Anggaran Bulanan
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {formatRupiah(totalBudget)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={formatNumberWithDots(totalBudget)}
              onChange={(e) => setTotalBudget(parseRupiahInput(e.target.value))}
              className="w-36 text-xs bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-emerald-400"
              placeholder="Nominal"
            />
            <button
              onClick={handleSyncTotalWithSum}
              className="text-[11px] text-emerald-300 hover:text-emerald-200 underline cursor-pointer"
              title="Samakan dengan total jumlah semua kategori"
            >
              Samakan dgn Kategori ({formatRupiah(sumCategoryBudgets)})
            </button>
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">
            Realisasi Pengeluaran
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
              {formatRupiah(totalMonthlyExpense)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-200">
              {totalPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-700/60 rounded-full h-2.5 mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalPercentage >= 100
                  ? 'bg-rose-500'
                  : totalPercentage >= 80
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, totalPercentage)}%` }}
            />
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-700/80 md:pl-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">
              Sisa Kuota Anggaran
            </span>
            <span
              className={`text-2xl sm:text-3xl font-extrabold block mt-1 ${
                remainingTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {remainingTotal >= 0
                ? formatRupiah(remainingTotal)
                : `-${formatRupiah(Math.abs(remainingTotal))}`}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            {remainingTotal >= 0
              ? 'Status arus kas aman. Anda masih memiliki alokasi belanja bulan ini.'
              : '⚠️ Pengeluaran Anda telah melebihi batas anggaran total yang ditentukan.'}
          </p>
        </div>
      </div>

      {/* Category Budgets Grid & Real-time tracking */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-800">
              Pagu Anggaran & Pelacakan Real-Time Tiap Kategori
            </h3>
            <p className="text-xs text-slate-500">
              Klik nominal atau tombol edit untuk memperbarui anggaran per pos belanja.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Aman (&lt;75%)
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Hampir Habis (75-99%)
            </span>
            <span className="inline-flex items-center gap-1.5 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Terlampaui (&ge;100%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expenseCategories.map((cat) => {
            const currentBudget = categoryBudgets[cat.name] || 0;
            const stat = categoryStats.find((s) => s.category === cat.name);
            const actualExpense = stat ? stat.amount : 0;
            const usagePercent = currentBudget > 0 ? Math.round((actualExpense / currentBudget) * 100) : 0;
            const remaining = currentBudget - actualExpense;
            const isExceeded = currentBudget > 0 && actualExpense > currentBudget;
            const isNearLimit = currentBudget > 0 && !isExceeded && usagePercent >= 75;
            const isEditing = activeCategoryEdit === cat.name;

            return (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl border transition-all duration-150 relative ${
                  isExceeded
                    ? 'border-rose-300 bg-rose-50/40'
                    : isNearLimit
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                {/* Category Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{cat.name}</h4>
                      <span className="text-xs text-slate-500">
                        Terpakai: <strong className="text-slate-700">{formatRupiah(actualExpense)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isExceeded ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Terlampaui {usagePercent}%
                      </span>
                    ) : isNearLimit ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Hampir Habis {usagePercent}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aman ({usagePercent}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : isNearLimit
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                    />
                  </div>
                </div>

                {/* Budget Details & Inline Editor */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Anggaran Bulanan</span>
                    <button
                      onClick={() => handleEditClick(cat.name, currentBudget)}
                      className="font-bold text-slate-700 hover:text-emerald-600 inline-flex items-center gap-1 group cursor-pointer"
                    >
                      <span>{formatRupiah(currentBudget)}</span>
                      <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-emerald-600" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">
                      {isExceeded ? 'Melebihi Anggaran' : 'Sisa Alokasi'}
                    </span>
                    <span
                      className={`font-bold ${
                        isExceeded ? 'text-rose-600' : isNearLimit ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {remaining >= 0 ? formatRupiah(remaining) : `+${formatRupiah(Math.abs(remaining))}`}
                    </span>
                  </div>
                </div>

                {/* Popover / Inline Input Editor */}
                {isEditing && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        Ubah Anggaran: {cat.name}
                      </span>
                      <button
                        onClick={() => setActiveCategoryEdit(null)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Contoh: 1.000.000"
                        autoFocus
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1">
                      {[500000, 1000000, 1500000, 2000000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleSetExact(preset)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 border border-slate-200 text-[10px] font-semibold text-slate-600 cursor-pointer"
                        >
                          {preset >= 1000000 ? `${preset / 1000000} jt` : `${preset / 1000} rb`}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveCategoryEdit(null)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 rounded cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveCategoryBudget(cat.name)}
                        className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
