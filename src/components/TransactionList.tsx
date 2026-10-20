import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  X,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { Transaction, Category } from '../types/finance';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onAddNew: () => void;
  activeCategoryFilter?: string | null;
  onClearCategoryFilter?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onEditTransaction,
  onDeleteTransaction,
  onAddNew,
  activeCategoryFilter,
  onClearCategoryFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCat, setSelectedCat] = useState<string>(activeCategoryFilter || 'all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');

  // Sync if parent passes activeCategoryFilter
  React.useEffect(() => {
    if (activeCategoryFilter) {
      setSelectedCat(activeCategoryFilter);
    }
  }, [activeCategoryFilter]);

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (selectedCat !== 'all' && t.category !== selectedCat) return false;
      if (selectedPayment !== 'all' && t.paymentMethod !== selectedPayment) return false;

      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const noteMatch = (t.note || '').toLowerCase().includes(q);
        const catMatch = t.category.toLowerCase().includes(q);
        const payMatch = (t.paymentMethod || '').toLowerCase().includes(q);
        const amountMatch = t.amount.toString().includes(q);
        return noteMatch || catMatch || payMatch || amountMatch;
      }

      return true;
    });
  }, [transactions, typeFilter, selectedCat, selectedPayment, searchTerm]);

  // Group by Date
  const groupedByDate = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    filteredTransactions.forEach((t) => {
      const arr = map.get(t.date) || [];
      arr.push(t);
      map.set(t.date, arr);
    });

    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredTransactions]);

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari transaksi, catatan, atau nominal..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setTypeFilter('expense')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  typeFilter === 'expense' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setTypeFilter('income')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  typeFilter === 'income' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Pemasukan
              </button>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters: Category & Payment Method */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Filter:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.type === 'expense' ? 'Keluar' : 'Masuk'})
              </option>
            ))}
          </select>

          {/* Payment Method Dropdown */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Metode Bayar</option>
            <option value="Tunai">Tunai (Cash)</option>
            <option value="QRIS">QRIS</option>
            <option value="BCA">BCA</option>
            <option value="Mandiri">Mandiri</option>
            <option value="BRI">BRI</option>
            <option value="GoPay">GoPay</option>
            <option value="OVO">OVO</option>
            <option value="Dana">DANA</option>
            <option value="ShopeePay">ShopeePay</option>
            <option value="Kartu Kredit">Kartu Kredit</option>
          </select>

          {activeCategoryFilter && (
            <button
              onClick={() => {
                setSelectedCat('all');
                onClearCategoryFilter?.();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
            >
              <span>Reset filter: {activeCategoryFilter}</span>
              <X className="w-3 h-3" />
            </button>
          )}

          <div className="ml-auto text-slate-400 text-[11px] font-medium">
            {filteredTransactions.length} transaksi ditampilkan
          </div>
        </div>
      </div>

      {/* Filtered Summary Bar */}
      {(typeFilter !== 'all' || selectedCat !== 'all' || searchTerm) && (
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <span>
            Total Terfilter:{' '}
            <strong>{filteredTransactions.length} transaksi</strong>
          </span>
          <div className="flex items-center gap-4">
            {totalFilteredExpense > 0 && (
              <span>
                Pengeluaran: <strong className="text-rose-600">{formatRupiah(totalFilteredExpense)}</strong>
              </span>
            )}
            {totalFilteredIncome > 0 && (
              <span>
                Pemasukan: <strong className="text-emerald-700">{formatRupiah(totalFilteredIncome)}</strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grouped Transaction Cards */}
      {groupedByDate.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">Tidak Ada Transaksi Ditemukan</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Tidak ada transaksi yang cocok dengan kriteria pencarian atau filter yang dipilih.
          </p>
          <button
            onClick={onAddNew}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Sekarang</span>
          </button>
        </div>
      ) : (
        groupedByDate.map(([dateStr, items]) => {
          const dayExpense = items
            .filter((t) => t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);

          const dayIncome = items
            .filter((t) => t.type === 'income')
            .reduce((s, t) => s + t.amount, 0);

          return (
            <div
              key={dateStr}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Date Group Header */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-800">
                    {formatDateIndo(dateStr, true)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    ({items.length} transaksi)
                  </span>
                </div>

                <div className="flex items-center gap-3 font-semibold">
                  {dayExpense > 0 && (
                    <span className="text-rose-600">
                      -{formatRupiah(dayExpense)}
                    </span>
                  )}
                  {dayIncome > 0 && (
                    <span className="text-emerald-600">
                      +{formatRupiah(dayIncome)}
                    </span>
                  )}
                </div>
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-slate-100">
                {items.map((tx) => {
                  const cat = categories.find((c) => c.name === tx.category);
                  const isExpense = tx.type === 'expense';

                  return (
                    <div
                      key={tx.id}
                      className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Category Icon */}
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                          style={{
                            backgroundColor: cat ? cat.bgColor : '#f1f5f9',
                            color: cat ? cat.color : '#64748b',
                          }}
                        >
                          <CategoryIcon name={cat ? cat.icon : 'CircleEllipsis'} className="w-5 h-5" />
                        </div>

                        {/* Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                              {tx.category}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                              {tx.paymentMethod}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="text-[11px] font-medium text-slate-400">
                              {tx.time}
                            </span>
                            {tx.note && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="truncate text-slate-600 italic">
                                  {tx.note}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Amount & Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span
                            className={`font-black text-sm sm:text-base tracking-tight block ${
                              isExpense ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {isExpense ? `-${formatRupiah(tx.amount)}` : `+${formatRupiah(tx.amount)}`}
                          </span>
                        </div>

                        {/* Action buttons (hover or mobile friendly) */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Transaksi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus catatan transaksi ${tx.category} senilai ${formatRupiah(tx.amount)}?`)) {
                                onDeleteTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Transaksi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
