import { 
  Transaction, 
  GeneratedReport, 
  ReportPeriod, 
  CategoryStat, 
  DailyStat, 
  AutomatedInsight, 
  Category, 
  BudgetConfig 
} from '../types/finance';
import { 
  formatRupiah, 
  formatDateIndo, 
  formatMonthYear, 
  INDO_DAYS 
} from './formatters';
import { DEFAULT_CATEGORIES, getCategoryByName } from './categories';

interface GenerateReportOptions {
  transactions: Transaction[];
  period: ReportPeriod;
  customStartDate?: string;
  customEndDate?: string;
  budgetConfig: BudgetConfig;
  allCategories?: Category[];
}

export function generateAutomatedReport({
  transactions,
  period,
  customStartDate,
  customEndDate,
  budgetConfig,
  allCategories = DEFAULT_CATEGORIES,
}: GenerateReportOptions): GeneratedReport {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const padZero = (n: number) => String(n).padStart(2, '0');

  let startDate = '';
  let endDate = '';
  let periodTitle = '';

  if (period === 'daily') {
    const todayStr = `${year}-${padZero(month + 1)}-${padZero(day)}`;
    startDate = todayStr;
    endDate = todayStr;
    periodTitle = `Laporan Harian (${formatDateIndo(todayStr, true)})`;
  } else if (period === 'weekly') {
    const end = new Date(year, month, day);
    const start = new Date(year, month, day - 6);
    startDate = `${start.getFullYear()}-${padZero(start.getMonth() + 1)}-${padZero(start.getDate())}`;
    endDate = `${end.getFullYear()}-${padZero(end.getMonth() + 1)}-${padZero(end.getDate())}`;
    periodTitle = `Laporan Mingguan (7 Hari Terakhir: ${formatDateIndo(startDate, false)} - ${formatDateIndo(endDate, false)})`;
  } else if (period === 'monthly') {
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    startDate = `${year}-${padZero(month + 1)}-01`;
    endDate = `${year}-${padZero(month + 1)}-${padZero(lastDayOfMonth)}`;
    periodTitle = `Laporan Bulanan (${formatMonthYear(startDate)})`;
  } else {
    startDate = customStartDate || `${year}-${padZero(month + 1)}-01`;
    endDate = customEndDate || `${year}-${padZero(month + 1)}-${padZero(day)}`;
    periodTitle = `Laporan Kustom (${formatDateIndo(startDate, false)} - ${formatDateIndo(endDate, false)})`;
  }

  // Filter transactions within range
  const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);

  const totalIncome = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

  // Calculate day difference
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const diffDays = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / (1000 * 3600 * 24)) + 1);

  // For monthly report, divide by days passed so far in current month
  let activeDays = diffDays;
  if (period === 'monthly') {
    activeDays = Math.min(day, diffDays);
  }
  const dailyAverageExpense = activeDays > 0 ? Math.round(totalExpense / activeDays) : 0;

  // Category statistics for expenses
  const categoryMap = new Map<string, { amount: number; count: number }>();
  filtered
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
      categoryMap.set(t.category, {
        amount: existing.amount + t.amount,
        count: existing.count + 1,
      });
    });

  const topCategories: CategoryStat[] = Array.from(categoryMap.entries())
    .map(([catName, data]) => {
      const catInfo = allCategories.find(c => c.name === catName) || getCategoryByName(catName, 'expense');
      const catBudget = budgetConfig.categoryBudgets[catName] || catInfo.budget || 0;
      const percentage = totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0;
      const budgetUsage = catBudget > 0 ? Math.round((data.amount / catBudget) * 100) : 0;

      return {
        category: catName,
        type: 'expense' as const,
        amount: data.amount,
        count: data.count,
        percentage,
        color: catInfo.color,
        bgColor: catInfo.bgColor,
        icon: catInfo.icon,
        budget: catBudget,
        budgetUsage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Daily statistics timeline
  const dailyMap = new Map<string, { expense: number; income: number; count: number }>();
  
  // Fill all days in range for continuous visualization
  const cur = new Date(startD);
  while (cur <= endD) {
    const curStr = `${cur.getFullYear()}-${padZero(cur.getMonth() + 1)}-${padZero(cur.getDate())}`;
    dailyMap.set(curStr, { expense: 0, income: 0, count: 0 });
    cur.setDate(cur.getDate() + 1);
  }

  filtered.forEach(t => {
    const existing = dailyMap.get(t.date) || { expense: 0, income: 0, count: 0 };
    if (t.type === 'expense') {
      existing.expense += t.amount;
    } else {
      existing.income += t.amount;
    }
    existing.count += 1;
    dailyMap.set(t.date, existing);
  });

  const dailyStats: DailyStat[] = Array.from(dailyMap.entries()).map(([dateStr, data]) => {
    const [y, m, dt] = dateStr.split('-').map(Number);
    const dObj = new Date(y, m - 1, dt);
    const dayName = INDO_DAYS[dObj.getDay()];
    return {
      date: dateStr,
      formattedDate: `${dt}/${m}`,
      dayName,
      expense: data.expense,
      income: data.income,
      net: data.income - data.expense,
      transactionCount: data.count,
    };
  });

  // Highest and lowest expense day
  const daysWithExpense = dailyStats.filter(d => d.expense > 0);
  let highestExpenseDay: { date: string; amount: number; dayName: string } | null = null;
  let lowestExpenseDay: { date: string; amount: number; dayName: string } | null = null;

  if (daysWithExpense.length > 0) {
    const sortedDays = [...daysWithExpense].sort((a, b) => b.expense - a.expense);
    highestExpenseDay = {
      date: sortedDays[0].date,
      amount: sortedDays[0].expense,
      dayName: sortedDays[0].dayName,
    };
    lowestExpenseDay = {
      date: sortedDays[sortedDays.length - 1].date,
      amount: sortedDays[sortedDays.length - 1].expense,
      dayName: sortedDays[sortedDays.length - 1].dayName,
    };
  }

  // Budget calculations
  const totalBudget = budgetConfig.monthlyTotalBudget || 6500000;
  const usedAmount = totalExpense;
  const usedPercentage = totalBudget > 0 ? Math.round((usedAmount / totalBudget) * 100) : 0;
  const remainingAmount = totalBudget - usedAmount;

  let status: 'safe' | 'warning' | 'danger' = 'safe';
  if (usedPercentage >= 100) {
    status = 'danger';
  } else if (usedPercentage >= 80) {
    status = 'warning';
  }

  // Projected month-end expense
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const projectedMonthEndExpense = activeDays > 0 
    ? Math.round((totalExpense / activeDays) * daysInMonth)
    : totalExpense;

  // Automated Smart Insights Generation
  const insights: AutomatedInsight[] = [];

  // Insight 1: Cashflow & Savings Rate
  if (totalIncome > 0) {
    if (savingsRate >= 30) {
      insights.push({
        id: 'ins-savings-high',
        type: 'achievement',
        title: 'Tingkat Tabungan Sangat Sehat (Target >20%)',
        message: `Anda berhasil menyisihkan ${savingsRate}% dari total pemasukan (${formatRupiah(netSavings)}). Posisi finansial Anda berada di zona sangat prima.`,
        metric: `${savingsRate}% Tersimpan`,
        actionableSuggestion: 'Pertimbangkan untuk mengalokasikan surplus ini ke instrumen investasi (Reksadana/SBN) atau dana darurat.',
      });
    } else if (savingsRate >= 10) {
      insights.push({
        id: 'ins-savings-medium',
        type: 'info',
        title: 'Arus Kas Stabil dan Positif',
        message: `Tingkat tabungan Anda adalah ${savingsRate}% (${formatRupiah(netSavings)}). Keuangan Anda surplus, namun masih ada ruang efisiensi.`,
        metric: `${savingsRate}% Tabungan`,
        actionableSuggestion: 'Coba tekan 1 pos sekunder (seperti jajan atau rekreasi) agar rasio tabungan naik ke 20-30%.',
      });
    } else if (savingsRate >= 0) {
      insights.push({
        id: 'ins-savings-low',
        type: 'warning',
        title: 'Perhatian: Margin Tabungan Menipis',
        message: `Pengeluaran Anda telah menyerap hampir seluruh pemasukan (${100 - savingsRate}%). Sisa kas hanya tersisa ${formatRupiah(netSavings)}.`,
        metric: `${savingsRate}% Tersisa`,
        actionableSuggestion: 'Rem pengeluaran non-primer hingga siklus gajian berikutnya untuk menghindari defisit.',
      });
    } else {
      insights.push({
        id: 'ins-savings-negative',
        type: 'warning',
        title: 'Peringatan Defisit Anggaran',
        message: `Pengeluaran melebihi pemasukan sebesar ${formatRupiah(Math.abs(netSavings))}. Ini menandakan arus kas negatif dalam periode ini.`,
        metric: `Defisit ${formatRupiah(Math.abs(netSavings))}`,
        actionableSuggestion: 'Tinjau kembali pos pengeluaran besar dan tunda pembelian barang tersier.',
      });
    }
  }

  // Insight 2: Top Expense Category Dominance
  if (topCategories.length > 0) {
    const topCat = topCategories[0];
    if (topCat.percentage >= 40) {
      insights.push({
        id: 'ins-cat-domination',
        type: 'tip',
        title: `Kategori ${topCat.category} Mendominasi (${topCat.percentage}%)`,
        message: `Porsi terbesar pengeluaran Anda terkonsentrasi pada "${topCat.category}" dengan total ${formatRupiah(topCat.amount)} (${topCat.count} transaksi).`,
        metric: `${topCat.percentage}% Total Biaya`,
        actionableSuggestion: `Lakukan audit khusus pada pos ${topCat.category} untuk menemukan potensi penghematan rutin.`,
      });
    }
  }

  // Insight 3: Daily Average & Runway
  if (period !== 'daily' && dailyAverageExpense > 0) {
    insights.push({
      id: 'ins-daily-burn',
      type: 'info',
      title: 'Rata-rata Pengeluaran Harian',
      message: `Rata-rata pengeluaran Anda adalah ${formatRupiah(dailyAverageExpense)} per hari. Pada tren ini, estimasi pengeluaran 30 hari ke depan berkisar ${formatRupiah(projectedMonthEndExpense)}.`,
      metric: `${formatRupiah(dailyAverageExpense)}/hari`,
      actionableSuggestion: `Menjaga batas harian maksimal di Rp ${Math.round(dailyAverageExpense * 0.9 / 1000) * 1000} dapat menghemat ${formatRupiah(dailyAverageExpense * 0.1 * 30)} per bulan.`,
    });
  }

  // Insight 4: Category Budget Alerts
  const overBudgetCats = topCategories.filter(c => c.budget && c.budget > 0 && c.amount > c.budget);
  const warningBudgetCats = topCategories.filter(c => c.budget && c.budget > 0 && c.amount <= c.budget && c.budgetUsage && c.budgetUsage >= 80);

  if (overBudgetCats.length > 0) {
    const names = overBudgetCats.map(c => c.category).join(', ');
    insights.push({
      id: 'ins-budget-over',
      type: 'warning',
      title: `Overbudget: ${overBudgetCats.length} Kategori Melebihi Batas`,
      message: `Kategori [${names}] telah melampaui alokasi pagu anggaran yang direncanakan.`,
      metric: 'Overbudget',
      actionableSuggestion: 'Sesuaikan batas anggaran atau alihkan sisa kuota dari kategori lain yang masih hemat.',
    });
  } else if (warningBudgetCats.length > 0) {
    const names = warningBudgetCats.map(c => c.category).join(', ');
    insights.push({
      id: 'ins-budget-warning',
      type: 'warning',
      title: `Peringatan Kuota Anggaran [${names}]`,
      message: `Pos pengeluaran tersebut sudah menyerap lebih dari 80% kuota anggaran bulanan.`,
      metric: '>80% Terpakai',
      actionableSuggestion: 'Batasi transaksi di pos tersebut hingga akhir periode agar tidak jebol.',
    });
  } else {
    insights.push({
      id: 'ins-budget-healthy',
      type: 'achievement',
      title: 'Pengendalian Anggaran Prima',
      message: 'Seluruh pos pengeluaran terpantau aman dan terkontrol di bawah batas pagu yang telah ditetapkan.',
      metric: `${usedPercentage}% Terpakai`,
      actionableSuggestion: 'Disiplin finansial Anda sangat baik. Pertahankan pola pencatatan konsisten setiap hari!',
    });
  }

  // Insight 5: Peak Expense Day Analysis (for weekly/monthly)
  if (highestExpenseDay && highestExpenseDay.amount > 0 && period !== 'daily') {
    insights.push({
      id: 'ins-peak-day',
      type: 'tip',
      title: `Puncak Pengeluaran: ${highestExpenseDay.dayName} (${formatDateIndo(highestExpenseDay.date, false)})`,
      message: `Lonjakan pengeluaran tertinggi terjadi pada hari ${highestExpenseDay.dayName} sebesar ${formatRupiah(highestExpenseDay.amount)}.`,
      metric: formatRupiah(highestExpenseDay.amount),
      actionableSuggestion: 'Perhatikan pengeluaran di hari tersebut (biasanya terkait belanja mingguan atau tagihan rutin).',
    });
  }

  return {
    periodType: period,
    title: periodTitle,
    startDate,
    endDate,
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    dailyAverageExpense,
    transactionCount: filtered.length,
    expenseCount: filtered.filter(t => t.type === 'expense').length,
    incomeCount: filtered.filter(t => t.type === 'income').length,
    highestExpenseDay,
    lowestExpenseDay,
    topCategories,
    dailyStats,
    insights,
    budgetStatus: {
      totalBudget,
      usedAmount,
      usedPercentage,
      remainingAmount,
      status,
      projectedMonthEndExpense,
    },
  };
}

/**
 * Generate CSV data for export
 */
export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const headers = ['ID', 'Tanggal', 'Waktu', 'Jenis', 'Kategori', 'Nominal (Rp)', 'Metode Pembayaran', 'Catatan'];
  
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.time,
    t.type === 'expense' ? 'Pengeluaran' : 'Pemasukan',
    `"${t.category.replace(/"/g, '""')}"`,
    t.amount,
    `"${t.paymentMethod}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CatatUang_Laporan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate formatted text summary for WhatsApp or text sharing
 */
export function generateShareableSummary(report: GeneratedReport): string {
  const lines: string[] = [
    `📊 *${report.title.toUpperCase()}*`,
    `Aplikasi CatatUang - Laporan Otomatis`,
    `--------------------------------------`,
    `💰 *Total Pemasukan:* ${formatRupiah(report.totalIncome)}`,
    `💸 *Total Pengeluaran:* ${formatRupiah(report.totalExpense)}`,
    `📈 *Sisa Saldo / Tabungan:* ${formatRupiah(report.netSavings)} (${report.savingsRate}%)`,
    `📅 *Rata-rata Harian:* ${formatRupiah(report.dailyAverageExpense)}/hari`,
    `--------------------------------------`,
    `🏷️ *Top 3 Pengeluaran:*`,
    ...report.topCategories.slice(0, 3).map((c, idx) => 
      `${idx + 1}. ${c.category}: ${formatRupiah(c.amount)} (${c.percentage}%)`
    ),
    `--------------------------------------`,
    `💡 *Evaluasi Finansial Otomatis:*`,
    ...report.insights.slice(0, 2).map(ins => `• *${ins.title}*: ${ins.message}`),
    `--------------------------------------`,
    `Dibuat otomatis pada ${formatDateIndo(new Date().toISOString().slice(0, 10), true)}`,
  ];

  return lines.join('\n');
}
