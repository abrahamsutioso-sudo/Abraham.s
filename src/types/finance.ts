export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note: string;
  paymentMethod: string;
  receiptImage?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  bgColor: string;
  budget?: number; // Monthly budget in IDR
}

export interface BudgetConfig {
  monthlyTotalBudget: number;
  categoryBudgets: Record<string, number>;
}

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface CategoryStat {
  category: string;
  type: TransactionType;
  amount: number;
  count: number;
  percentage: number; // percentage of total expenses
  color: string;
  bgColor: string;
  icon: string;
  budget?: number;
  budgetUsage?: number; // percentage of budget consumed
}

export interface DailyStat {
  date: string;
  formattedDate: string;
  dayName: string;
  expense: number;
  income: number;
  net: number;
  transactionCount: number;
}

export interface AutomatedInsight {
  id: string;
  type: 'achievement' | 'warning' | 'tip' | 'info';
  title: string;
  message: string;
  metric?: string;
  actionableSuggestion?: string;
}

export interface GeneratedReport {
  periodType: ReportPeriod;
  title: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number; // in percent
  dailyAverageExpense: number;
  transactionCount: number;
  expenseCount: number;
  incomeCount: number;
  highestExpenseDay: { date: string; amount: number; dayName: string } | null;
  lowestExpenseDay: { date: string; amount: number; dayName: string } | null;
  topCategories: CategoryStat[];
  dailyStats: DailyStat[];
  insights: AutomatedInsight[];
  budgetStatus: {
    totalBudget: number;
    usedAmount: number;
    usedPercentage: number;
    remainingAmount: number;
    status: 'safe' | 'warning' | 'danger';
    projectedMonthEndExpense: number;
  };
}
