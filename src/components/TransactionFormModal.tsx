import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Calendar, 
  Clock, 
  FileText, 
  CreditCard, 
  Check, 
  AlertTriangle, 
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import { Transaction, TransactionType, Category, CategoryStat, BudgetConfig } from '../types/finance';
import { PAYMENT_METHODS } from '../utils/categories';
import { 
  formatRupiah, 
  formatNumberWithDots, 
  parseRupiahInput, 
  getTodayDateString, 
  getCurrentTimeString 
} from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>, editId?: string) => void;
  editingTransaction?: Transaction | null;
  categories: Category[];
  budgetConfig: BudgetConfig;
  categoryStats: CategoryStat[];
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
  categories,
  budgetConfig,
  categoryStats,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState<string>('');
  const [category, setCategory] = useState<string>('Makanan & Minuman');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS');
  const [note, setNote] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Reset or populate when modal opens or editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmountInput(formatNumberWithDots(editingTransaction.amount));
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setTime(editingTransaction.time);
      setPaymentMethod(editingTransaction.paymentMethod || 'QRIS');
      setNote(editingTransaction.note || '');
    } else {
      setType('expense');
      setAmountInput('');
      setCategory('Makanan & Minuman');
      setDate(getTodayDateString());
      setTime(getCurrentTimeString());
      setPaymentMethod('QRIS');
      setNote('');
    }
    setErrorMsg('');
  }, [editingTransaction, isOpen]);

  // Keep category in sync with current type
  const availableCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (!availableCategories.some((c) => c.name === category)) {
      if (availableCategories.length > 0) {
        setCategory(availableCategories[0].name);
      }
    }
  }, [type, availableCategories, category]);

  if (!isOpen) return null;

  const currentAmount = parseRupiahInput(amountInput);

  // Real-time Budget Check for the selected category
  const selectedCatBudget = budgetConfig.categoryBudgets[category] || 
    (categories.find(c => c.name === category)?.budget || 0);

  const stat = categoryStats.find((s) => s.category === category);
  // If editing, subtract old amount first to get true prior usage
  const priorSpent = stat 
    ? (editingTransaction && editingTransaction.category === category ? Math.max(0, stat.amount - editingTransaction.amount) : stat.amount)
    : 0;

  const projectedSpent = priorSpent + currentAmount;
  const currentUsagePercent = selectedCatBudget > 0 ? Math.round((priorSpent / selectedCatBudget) * 100) : 0;
  const projectedUsagePercent = selectedCatBudget > 0 ? Math.round((projectedSpent / selectedCatBudget) * 100) : 0;

  const willExceedBudget = type === 'expense' && selectedCatBudget > 0 && projectedSpent > selectedCatBudget;
  const willBeNearLimit = type === 'expense' && selectedCatBudget > 0 && !willExceedBudget && projectedUsagePercent >= 80;

  const handleQuickAddAmount = (addValue: number) => {
    const cur = parseRupiahInput(amountInput);
    setAmountInput(formatNumberWithDots(cur + addValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) {
      setErrorMsg('Harap masukkan nominal transaksi lebih dari Rp 0.');
      return;
    }

    onSave(
      {
        type,
        amount: currentAmount,
        category,
        date,
        time,
        paymentMethod,
        note: note.trim(),
      },
      editingTransaction?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                type === 'expense' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {type === 'expense' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                {editingTransaction ? 'Edit Catatan Transaksi' : 'Catat Transaksi Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan harian langsung memperbarui laporan otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle: Pengeluaran vs Pemasukan */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Pemasukan</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Nominal Transaksi (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">
                Rp
              </span>
              <input
                type="text"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(formatNumberWithDots(e.target.value));
                  setErrorMsg('');
                }}
                placeholder="0"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xl sm:text-2xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all tracking-tight"
                autoFocus
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[10000, 25000, 50000, 100000, 200000, 500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAddAmount(amt)}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  +{formatNumberWithDots(amt)}
                </button>
              ))}
              {amountInput && (
                <button
                  type="button"
                  onClick={() => setAmountInput('')}
                  className="px-2 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50 rounded-lg ml-auto cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* REAL-TIME BUDGET WARNING IN THE FORM */}
          {type === 'expense' && selectedCatBudget > 0 && (
            <div
              className={`p-3.5 rounded-2xl border text-xs transition-all ${
                willExceedBudget
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : willBeNearLimit
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {willExceedBudget ? (
                  <AlertOctagon className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                ) : willBeNearLimit ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Plafon Anggaran: {category}</span>
                    <span>{formatRupiah(selectedCatBudget)}</span>
                  </div>

                  <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                    {willExceedBudget ? (
                      <span className="font-semibold text-rose-700">
                        🚨 Peringatan: Transaksi ini akan membuat pengeluaran kategori {category}{' '}
                        menjadi {formatRupiah(projectedSpent)}, melebihi anggaran sebesar{' '}
                        {formatRupiah(projectedSpent - selectedCatBudget)} ({projectedUsagePercent}%)!
                      </span>
                    ) : willBeNearLimit ? (
                      <span className="font-semibold text-amber-700">
                        ⚠️ Perhatian: Anggaran kategori {category} akan terpakai{' '}
                        {projectedUsagePercent}%. Sisa kuota hanya tersisa{' '}
                        {formatRupiah(selectedCatBudget - projectedSpent)}.
                      </span>
                    ) : (
                      <span>
                        Anggaran aman. Terpakai saat ini {currentUsagePercent}% (
                        {formatRupiah(priorSpent)}). Sisa alokasi:{' '}
                        {formatRupiah(Math.max(0, selectedCatBudget - projectedSpent))}.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Pilih Kategori
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200/80 rounded-2xl bg-slate-50/50">
              {availableCategories.map((c) => {
                const isSelected = category === c.name;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all text-xs cursor-pointer border ${
                      isSelected
                        ? 'border-emerald-500 bg-white shadow-xs font-bold text-slate-900 ring-2 ring-emerald-500/20'
                        : 'border-transparent hover:bg-white/80 text-slate-600'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: c.bgColor, color: c.color }}
                    >
                      <CategoryIcon name={c.icon} className="w-4 h-4" />
                    </div>
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Tanggal
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Waktu
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Metode Pembayaran
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {pm.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Catatan / Keterangan (Opsional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Makan siang Warteg, Bensin motor, dll."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </p>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{editingTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
