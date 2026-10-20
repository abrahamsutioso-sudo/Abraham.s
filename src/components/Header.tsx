import React from 'react';
import { 
  Wallet, 
  Receipt, 
  PieChart, 
  Target, 
  Plus, 
  RotateCcw, 
  CalendarDays,
  Sparkles,
  Printer
} from 'lucide-react';
import { formatDateIndo, formatRupiah } from '../utils/formatters';

export type AppTab = 'transactions' | 'reports' | 'budgets';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenNewTransaction: () => void;
  onResetData: () => void;
  onPrintReport: () => void;
  monthlyBalance: {
    income: number;
    expense: number;
    net: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenNewTransaction,
  onResetData,
  onPrintReport,
  monthlyBalance,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <header className="no-print bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Catat<span className="text-emerald-600">Uang</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Laporan Otomatis
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Pencatat Pengeluaran Harian & Pengendali Anggaran
              </p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50">
            <button
              onClick={() => onTabChange('transactions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Daftar Transaksi</span>
            </button>

            <button
              onClick={() => onTabChange('reports')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Laporan Otomatis</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              onClick={() => onTabChange('budgets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'budgets'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Pagu Anggaran</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
              <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDateIndo(todayStr, true)}</span>
            </div>

            <button
              onClick={onPrintReport}
              className="hidden sm:flex items-center gap-1.5 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Cetak Laporan / Simpan PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (confirm('Kembalikan ke data sampel awal? Semua catatan kustom akan diperbarui ke contoh transaksi Indonesia.')) {
                  onResetData();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Reset ke Contoh Transaksi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNewTransaction}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Uang</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs (visible on small screens) */}
        <div className="flex md:hidden border-t border-slate-100 py-2.5 overflow-x-auto gap-1">
          <button
            onClick={() => onTabChange('transactions')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Transaksi</span>
          </button>

          <button
            onClick={() => onTabChange('reports')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Laporan</span>
          </button>

          <button
            onClick={() => onTabChange('budgets')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              activeTab === 'budgets'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Anggaran</span>
          </button>
        </div>
      </div>
    </header>
  );
};
