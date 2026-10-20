import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { GeneratedReport, ReportPeriod, Transaction } from '../types/finance';
import { 
  formatRupiah, 
  formatCompactRupiah, 
  formatDateIndo 
} from '../utils/formatters';
import { exportTransactionsToCSV, generateShareableSummary } from '../utils/reportGenerator';
import { CategoryDonutChart } from './CategoryDonutChart';
import { DailyTrendChart } from './DailyTrendChart';
import { CategoryIcon } from './CategoryIcon';

interface AutomaticReportViewProps {
  report: GeneratedReport;
  rawTransactions: Transaction[];
  selectedPeriod: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  customStartDate: string;
  customEndDate: string;
  onCustomDateChange: (start: string, end: string) => void;
  onOpenBudgetManager: () => void;
  onPrintReport: () => void;
}

export const AutomaticReportView: React.FC<AutomaticReportViewProps> = ({
  report,
  rawTransactions,
  selectedPeriod,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
  onOpenBudgetManager,
  onPrintReport,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleCopySummary = async () => {
    const text = generateShareableSummary(report);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Fallback
      alert('Teks ringkasan telah siap disalin.');
    }
  };

  const handleExportCSV = () => {
    // Filter transactions to report range
    const filtered = rawTransactions.filter(
      (t) => t.date >= report.startDate && t.date <= report.endDate
    );
    exportTransactionsToCSV(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Period Filter & Action Buttons */}
      <div className="no-print bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Period Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl">
          <button
            onClick={() => onPeriodChange('daily')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'daily'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => onPeriodChange('weekly')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'weekly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => onPeriodChange('monthly')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => onPeriodChange('custom')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'custom'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kustom
          </button>
        </div>

        {/* Custom Date Pickers */}
        {selectedPeriod === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            />
            <span className="text-slate-400">s/d</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            />
          </div>
        )}

        {/* Action Buttons: Print, Export, Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Salin ringkasan teks untuk WhatsApp"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bagikan</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Download CSV / Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          <button
            onClick={onPrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Report Header & Executive Summary */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Laporan Otomatis
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {report.transactionCount} Transaksi Teranalisis
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              {report.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Ringkasan otomatis arus kas, efisiensi anggaran, dan analisis pengeluaran harian.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                Tingkat Tabungan
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {report.savingsRate}%
              </span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                Rata-rata Harian
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-200">
                {formatCompactRupiah(report.dailyAverageExpense)}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards: Pemasukan, Pengeluaran, Saldo Bersih */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Pemasukan</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-400 mt-2">
              {formatRupiah(report.totalIncome)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {report.incomeCount} transaksi masuk
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Total Pengeluaran</span>
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-rose-400 mt-2">
              {formatRupiah(report.totalExpense)}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {report.expenseCount} transaksi keluar
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Sisa Arus Kas / Tabungan</span>
              <div
                className={`p-1.5 rounded-lg ${
                  report.netSavings >= 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p
              className={`text-2xl font-black mt-2 ${
                report.netSavings >= 0 ? 'text-white' : 'text-rose-400'
              }`}
            >
              {report.netSavings >= 0
                ? formatRupiah(report.netSavings)
                : `-${formatRupiah(Math.abs(report.netSavings))}`}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {report.netSavings >= 0 ? 'Surplus kas bersih' : 'Defisit operasional'}
            </span>
          </div>
        </div>
      </div>

      {/* Automated Smart Insights Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Analisis Finansial Cerdas Otomatis
              </h3>
              <p className="text-xs text-slate-500">
                Dievaluasi langsung dari catatan pengeluaran harian dan kepatuhan anggaran Anda.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {report.insights.length} Temuan Otomatis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {report.insights.map((ins) => {
            const isWarning = ins.type === 'warning';
            const isAchievement = ins.type === 'achievement';
            const isTip = ins.type === 'tip';

            return (
              <div
                key={ins.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isWarning
                    ? 'bg-rose-50/50 border-rose-200'
                    : isAchievement
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isTip
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isWarning
                        ? 'bg-rose-100 text-rose-600'
                        : isAchievement
                        ? 'bg-emerald-100 text-emerald-600'
                        : isTip
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isWarning ? (
                      <AlertOctagon className="w-4 h-4" />
                    ) : isAchievement ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                        {ins.title}
                      </h4>
                      {ins.metric && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            isWarning
                              ? 'bg-rose-100 text-rose-700'
                              : isAchievement
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ins.metric}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {ins.message}
                    </p>

                    {ins.actionableSuggestion && (
                      <div className="mt-2.5 pt-2 border-t border-black/5 flex items-start gap-1.5 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700 shrink-0">Saran:</span>
                        <span>{ins.actionableSuggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Grid: Donut + Daily Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Donut Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-800">
                Porsi Pengeluaran per Kategori
              </h3>
              <p className="text-xs text-slate-500">
                Komposisi pengeluaran terbesar periode ini
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {report.topCategories.length} Kategori
            </span>
          </div>

          <CategoryDonutChart
            categories={report.topCategories}
            totalExpense={report.totalExpense}
          />
        </div>

        {/* Daily Spending Trend */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Tren Pengeluaran Harian
                </h3>
                <p className="text-xs text-slate-500">
                  Grafik fluktuasi biaya harian sepanjang periode
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Rata-rata</span>
                <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                  {formatRupiah(report.dailyAverageExpense)}/hari
                </span>
              </div>
            </div>

            <DailyTrendChart
              dailyStats={report.dailyStats}
              highestDay={report.highestExpenseDay}
            />
          </div>

          {/* Quick takeaway below daily trend */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Hari Terboros:</span>
            {report.highestExpenseDay && report.highestExpenseDay.amount > 0 ? (
              <span className="font-bold text-rose-600">
                {report.highestExpenseDay.dayName} ({formatRupiah(report.highestExpenseDay.amount)})
              </span>
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Budget Adherence Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="font-bold text-base text-slate-800">
              Evaluasi Pagu Anggaran per Kategori (Real-Time Tracking)
            </h3>
            <p className="text-xs text-slate-500">
              Membandingkan realisasi belanja dengan batas kuota anggaran yang telah ditetapkan
            </p>
          </div>

          <button
            onClick={onOpenBudgetManager}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            Kelola Pagu Anggaran
          </button>
        </div>

        {report.topCategories.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Belum ada transaksi pengeluaran pada rentang waktu ini.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="pb-3 pl-2">Kategori</th>
                  <th className="pb-3 text-right">Realisasi</th>
                  <th className="pb-3 text-right">Anggaran Bulanan</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Sisa / Selisih</th>
                  <th className="pb-3 pl-4 w-44">Progres Pagu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {report.topCategories.map((c) => {
                  const budget = c.budget || 0;
                  const isExceeded = budget > 0 && c.amount > budget;
                  const isNear = budget > 0 && !isExceeded && (c.budgetUsage || 0) >= 80;
                  const remaining = budget - c.amount;

                  return (
                    <tr key={c.category} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: c.bgColor, color: c.color }}
                          >
                            <CategoryIcon name={c.icon} className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{c.category}</span>
                            <span className="text-[11px] text-slate-400">
                              {c.count} kali transaksi ({c.percentage}%)
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 text-right font-bold text-slate-900">
                        {formatRupiah(c.amount)}
                      </td>

                      <td className="py-3.5 text-right text-slate-600 font-semibold">
                        {budget > 0 ? formatRupiah(budget) : <span className="text-slate-400">Belum diset</span>}
                      </td>

                      <td className="py-3.5 text-center">
                        {budget === 0 ? (
                          <span className="text-slate-400 text-[11px]">-</span>
                        ) : isExceeded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            <AlertOctagon className="w-3 h-3" />
                            Terlampaui
                          </span>
                        ) : isNear ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            Hampir Habis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Aman
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 text-right font-bold">
                        {budget === 0 ? (
                          <span className="text-slate-400">-</span>
                        ) : remaining >= 0 ? (
                          <span className="text-emerald-600">+{formatRupiah(remaining)}</span>
                        ) : (
                          <span className="text-rose-600">-{formatRupiah(Math.abs(remaining))}</span>
                        )}
                      </td>

                      <td className="py-3.5 pl-4">
                        {budget > 0 ? (
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                              <span className={isExceeded ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-slate-600'}>
                                {c.budgetUsage}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isExceeded ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, c.budgetUsage || 0)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[11px]">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
