import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, ChevronRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { CategoryStat } from '../types/finance';

interface BudgetAlertBannerProps {
  categoryStats: CategoryStat[];
  onOpenBudgetManager: () => void;
  onFilterByCategory?: (category: string) => void;
}

export const BudgetAlertBanner: React.FC<BudgetAlertBannerProps> = ({
  categoryStats,
  onOpenBudgetManager,
  onFilterByCategory,
}) => {
  const [dismissed, setDismissed] = useState(false);

  // Find categories that exceeded budget (> 100%)
  const exceededCategories = categoryStats.filter(
    (c) => c.budget && c.budget > 0 && c.amount > c.budget
  );

  // Find categories that are close to exceeding (80% - 100%)
  const nearLimitCategories = categoryStats.filter(
    (c) => c.budget && c.budget > 0 && c.amount <= c.budget && (c.budgetUsage || 0) >= 80
  );

  if (dismissed || (exceededCategories.length === 0 && nearLimitCategories.length === 0)) {
    return null;
  }

  const hasExceeded = exceededCategories.length > 0;

  return (
    <div
      className={`no-print rounded-2xl p-4 transition-all duration-200 border shadow-sm ${
        hasExceeded
          ? 'bg-rose-50/90 border-rose-200 text-rose-950'
          : 'bg-amber-50/90 border-amber-200 text-amber-950'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl mt-0.5 shrink-0 ${
              hasExceeded ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {hasExceeded ? (
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm sm:text-base">
                {hasExceeded
                  ? `🚨 Peringatan Anggaran: ${exceededCategories.length} Kategori Terlampaui!`
                  : `⚠️ Peringatan: ${nearLimitCategories.length} Kategori Hampir Mencapai Batas!`}
              </h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  hasExceeded
                    ? 'bg-rose-200 text-rose-800'
                    : 'bg-amber-200 text-amber-800'
                }`}
              >
                Pantauan Real-time
              </span>
            </div>

            <p className="text-xs sm:text-sm mt-1 opacity-90">
              {hasExceeded
                ? 'Beberapa kategori pengeluaran Anda telah melebihi pagu bulanan yang ditetapkan. Disarankan untuk membatasi pengeluaran tambahan.'
                : 'Pengeluaran di kategori ini sudah menyerap lebih dari 80% anggaran bulanan. Waspadai transaksi berikutnya.'}
            </p>

            {/* Badges for affected categories */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {exceededCategories.map((c) => {
                const overAmount = c.amount - (c.budget || 0);
                return (
                  <button
                    key={c.category}
                    onClick={() => onFilterByCategory?.(c.category)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100/90 hover:bg-rose-200 text-rose-800 border border-rose-300 transition-colors cursor-pointer"
                    title={`Klik untuk lihat transaksi ${c.category}`}
                  >
                    <span>{c.category}</span>
                    <span className="font-bold">({c.budgetUsage}%)</span>
                    <span className="text-[11px] opacity-80">+lebih {formatRupiah(overAmount)}</span>
                  </button>
                );
              })}

              {nearLimitCategories.map((c) => {
                const remaining = (c.budget || 0) - c.amount;
                return (
                  <button
                    key={c.category}
                    onClick={() => onFilterByCategory?.(c.category)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100/90 hover:bg-amber-200 text-amber-800 border border-amber-300 transition-colors cursor-pointer"
                    title={`Klik untuk lihat transaksi ${c.category}`}
                  >
                    <span>{c.category}</span>
                    <span className="font-bold">({c.budgetUsage}%)</span>
                    <span className="text-[11px] opacity-80">Sisa {formatRupiah(remaining)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenBudgetManager}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
              hasExceeded
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
            }`}
          >
            <span>Atur Anggaran</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-black/5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
