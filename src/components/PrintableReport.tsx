import React from 'react';
import { GeneratedReport, Transaction } from '../types/finance';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface PrintableReportProps {
  report: GeneratedReport;
  transactions: Transaction[];
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ report, transactions }) => {
  const filtered = transactions.filter(
    (t) => t.date >= report.startDate && t.date <= report.endDate
  );

  return (
    <div className="print-only p-8 text-black bg-white max-w-4xl mx-auto font-sans">
      {/* Print Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
            CatatUang - Laporan Keuangan Harian
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Sistem Pencatatan Finansial & Laporan Keuangan Otomatis
          </p>
          <div className="mt-2 text-xs font-semibold">
            <span>Periode: </span>
            <span className="font-bold">{report.title}</span>
          </div>
        </div>

        <div className="text-right text-xs">
          <div className="font-bold">DOKUMEN RESMI LAPORAN</div>
          <div className="text-slate-500 mt-1">
            Dicetak pada: {formatDateIndo(new Date().toISOString().slice(0, 10), true)}
          </div>
          <div className="text-slate-500">Ref ID: RPT-{Date.now().toString().slice(-8)}</div>
        </div>
      </div>

      {/* Financial Executive Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 border border-slate-300 rounded-lg">
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-500">Total Pemasukan</span>
          <span className="text-base font-extrabold text-slate-900 block mt-0.5">
            {formatRupiah(report.totalIncome)}
          </span>
          <span className="text-[10px] text-slate-500">{report.incomeCount} transaksi</span>
        </div>

        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-500">Total Pengeluaran</span>
          <span className="text-base font-extrabold text-slate-900 block mt-0.5">
            {formatRupiah(report.totalExpense)}
          </span>
          <span className="text-[10px] text-slate-500">{report.expenseCount} transaksi</span>
        </div>

        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-500">Arus Kas Bersih</span>
          <span className="text-base font-extrabold text-slate-900 block mt-0.5">
            {formatRupiah(report.netSavings)}
          </span>
          <span className="text-[10px] text-slate-500">Rasio Tabungan: {report.savingsRate}%</span>
        </div>

        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-500">Rata-rata Harian</span>
          <span className="text-base font-extrabold text-slate-900 block mt-0.5">
            {formatRupiah(report.dailyAverageExpense)}
          </span>
          <span className="text-[10px] text-slate-500">per hari kalender</span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          Rekapitulasi Pengeluaran per Kategori & Realisasi Anggaran
        </h3>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-300 font-bold bg-slate-100">
              <th className="py-2 px-2">Kategori</th>
              <th className="py-2 px-2 text-right">Frekuensi</th>
              <th className="py-2 px-2 text-right">Total Realisasi</th>
              <th className="py-2 px-2 text-right">Porsi (%)</th>
              <th className="py-2 px-2 text-right">Anggaran Bulanan</th>
              <th className="py-2 px-2 text-center">Status Anggaran</th>
            </tr>
          </thead>
          <tbody>
            {report.topCategories.map((c) => {
              const budget = c.budget || 0;
              const isExceeded = budget > 0 && c.amount > budget;
              const isNear = budget > 0 && !isExceeded && (c.budgetUsage || 0) >= 80;

              return (
                <tr key={c.category} className="border-b border-slate-200">
                  <td className="py-1.5 px-2 font-semibold">{c.category}</td>
                  <td className="py-1.5 px-2 text-right">{c.count}x</td>
                  <td className="py-1.5 px-2 text-right font-bold">{formatRupiah(c.amount)}</td>
                  <td className="py-1.5 px-2 text-right">{c.percentage}%</td>
                  <td className="py-1.5 px-2 text-right">{budget > 0 ? formatRupiah(budget) : '-'}</td>
                  <td className="py-1.5 px-2 text-center font-bold">
                    {budget === 0 ? (
                      '-'
                    ) : isExceeded ? (
                      'TERLAMPAUI'
                    ) : isNear ? (
                      'HAMPIR HABIS'
                    ) : (
                      'AMAN'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Automated Financial Evaluation Notes */}
      <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-2">
          Catatan & Evaluasi Otomatis Sistem
        </h3>
        <div className="space-y-1.5 text-slate-700">
          {report.insights.map((ins, i) => (
            <div key={ins.id} className="flex items-start gap-1.5">
              <span className="font-bold">{i + 1}.</span>
              <div>
                <strong>{ins.title}:</strong> {ins.message}
                {ins.actionableSuggestion && (
                  <span className="italic block text-slate-600">Saran: {ins.actionableSuggestion}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Details Table */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-slate-300 pb-1">
          Daftar Rincian Transaksi ({filtered.length} Transaksi)
        </h3>
        <table className="w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-300 font-bold bg-slate-100">
              <th className="py-1.5 px-2">Tanggal</th>
              <th className="py-1.5 px-2">Jenis</th>
              <th className="py-1.5 px-2">Kategori</th>
              <th className="py-1.5 px-2">Metode Bayar</th>
              <th className="py-1.5 px-2">Catatan</th>
              <th className="py-1.5 px-2 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 35).map((t) => (
              <tr key={t.id} className="border-b border-slate-200">
                <td className="py-1 px-2">{t.date} {t.time}</td>
                <td className="py-1 px-2 font-bold">
                  {t.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                </td>
                <td className="py-1 px-2">{t.category}</td>
                <td className="py-1 px-2">{t.paymentMethod}</td>
                <td className="py-1 px-2 italic text-slate-600 truncate max-w-xs">{t.note || '-'}</td>
                <td className="py-1 px-2 text-right font-bold">
                  {t.type === 'expense' ? `-${formatRupiah(t.amount)}` : `+${formatRupiah(t.amount)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 35 && (
          <p className="text-[10px] text-slate-500 mt-2 italic text-right">
            Menampilkan 35 transaksi teratas dari total {filtered.length} transaksi.
          </p>
        )}
      </div>

      {/* Footer Signatures */}
      <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between text-xs text-center">
        <div className="w-48">
          <p className="text-slate-500 mb-14">Diverifikasi Otomatis Oleh</p>
          <p className="font-bold border-t border-slate-400 pt-1">CatatUang Engine</p>
        </div>
        <div className="w-48">
          <p className="text-slate-500 mb-14">Pengguna / Pemilik Anggaran</p>
          <p className="font-bold border-t border-slate-400 pt-1">Tanda Tangan</p>
        </div>
      </div>
    </div>
  );
};
