/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Transaction, 
  Category, 
  BudgetConfig, 
  ReportPeriod, 
  GeneratedReport 
} from './types/finance';
import { DEFAULT_CATEGORIES } from './utils/categories';
import { generateInitialTransactions } from './utils/mockData';
import { generateAutomatedReport } from './utils/reportGenerator';
import { getTodayDateString, formatRupiah } from './utils/formatters';

// Components
import { Header, AppTab } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { BudgetAlertBanner } from './components/BudgetAlertBanner';
import { TransactionList } from './components/TransactionList';
import { AutomaticReportView } from './components/AutomaticReportView';
import { BudgetManager } from './components/BudgetManager';
import { TransactionFormModal } from './components/TransactionFormModal';
import { PrintableReport } from './components/PrintableReport';

const STORAGE_KEYS = {
  TRANSACTIONS: 'catatuang_transactions_v1',
  CATEGORIES: 'catatuang_categories_v1',
  BUDGET: 'catatuang_budget_v1',
};

export default function App() {
  // 1. Initial State from LocalStorage or realistic initial data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading transactions from localStorage', e);
    }
    return generateInitialTransactions();
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading categories from localStorage', e);
    }
    return DEFAULT_CATEGORIES;
  });

  const [budgetConfig, setBudgetConfig] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading budgetConfig from localStorage', e);
    }
    const categoryBudgets: Record<string, number> = {};
    DEFAULT_CATEGORIES.forEach((c) => {
      if (c.type === 'expense' && c.budget) {
        categoryBudgets[c.name] = c.budget;
      }
    });
    return {
      monthlyTotalBudget: 6500000,
      categoryBudgets,
    };
  });

  // UI States
  const [activeTab, setActiveTab] = useState<AppTab>('reports');
  const [selectedReportPeriod, setSelectedReportPeriod] = useState<ReportPeriod>('monthly');
  const [customStartDate, setCustomStartDate] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [customEndDate, setCustomEndDate] = useState<string>(getTodayDateString());

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgetConfig));
    } catch (e) {
      console.error('Failed to save budgetConfig to localStorage', e);
    }
  }, [budgetConfig]);

  // Generate Current Month's report for budget tracking
  const currentMonthReport = useMemo(() => {
    return generateAutomatedReport({
      transactions,
      period: 'monthly',
      budgetConfig,
      allCategories: categories,
    });
  }, [transactions, budgetConfig, categories]);

  // Generate Active Report according to selected tab & period
  const activeReport = useMemo(() => {
    return generateAutomatedReport({
      transactions,
      period: selectedReportPeriod,
      customStartDate,
      customEndDate,
      budgetConfig,
      allCategories: categories,
    });
  }, [transactions, selectedReportPeriod, customStartDate, customEndDate, budgetConfig, categories]);

  // Handlers for Transactions
  const handleSaveTransaction = (data: Omit<Transaction, 'id'>, editId?: string) => {
    if (editId) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editId ? { ...data, id: editId } : t))
      );
    } else {
      const newTx: Transaction = {
        ...data,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      setTransactions((prev) => [newTx, ...prev]);

      // Trigger celebratory confetti for positive income
      if (data.type === 'income') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsFormModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingTransaction(null);
    setIsFormModalOpen(true);
  };

  const handleResetData = () => {
    const initial = generateInitialTransactions();
    setTransactions(initial);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveBudgetConfig = (newConfig: BudgetConfig) => {
    setBudgetConfig(newConfig);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
    });
  };

  const handleFilterByCategory = (catName: string) => {
    setActiveCategoryFilter(catName);
    setActiveTab('transactions');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewTransaction={handleOpenNew}
        onResetData={handleResetData}
        onPrintReport={handlePrint}
        monthlyBalance={{
          income: currentMonthReport.totalIncome,
          expense: currentMonthReport.totalExpense,
          net: currentMonthReport.netSavings,
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Real-time Category Budget Alert Banner (Shows when any category is >= 80% or > 100%) */}
        <BudgetAlertBanner
          categoryStats={currentMonthReport.topCategories}
          onOpenBudgetManager={() => setActiveTab('budgets')}
          onFilterByCategory={handleFilterByCategory}
        />

        {/* Dashboard Overview Cards & Quick 1-Click logging */}
        <div className="no-print">
          <DashboardOverview
            transactions={transactions}
            budgetConfig={budgetConfig}
            categoryStats={currentMonthReport.topCategories}
            onQuickAdd={(tx) => handleSaveTransaction(tx)}
            onOpenReport={() => setActiveTab('reports')}
            onOpenBudget={() => setActiveTab('budgets')}
          />
        </div>

        {/* Dynamic Tab Content */}
        <div className="no-print">
          {activeTab === 'reports' && (
            <AutomaticReportView
              report={activeReport}
              rawTransactions={transactions}
              selectedPeriod={selectedReportPeriod}
              onPeriodChange={setSelectedReportPeriod}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDateChange={(start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
              }}
              onOpenBudgetManager={() => setActiveTab('budgets')}
              onPrintReport={handlePrint}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionList
              transactions={transactions}
              categories={categories}
              onEditTransaction={handleEditClick}
              onDeleteTransaction={handleDeleteTransaction}
              onAddNew={handleOpenNew}
              activeCategoryFilter={activeCategoryFilter}
              onClearCategoryFilter={() => setActiveCategoryFilter(null)}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetManager
              categories={categories}
              budgetConfig={budgetConfig}
              categoryStats={currentMonthReport.topCategories}
              totalMonthlyExpense={currentMonthReport.totalExpense}
              onSaveBudgetConfig={handleSaveBudgetConfig}
            />
          )}
        </div>
      </main>

      {/* Printable Report Component (rendered only during print / PDF generation) */}
      <PrintableReport
        report={activeReport}
        transactions={transactions}
      />

      {/* Transaction Modal (Add / Edit) with Live Category Budget Warnings */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
        categories={categories}
        budgetConfig={budgetConfig}
        categoryStats={currentMonthReport.topCategories}
      />

      {/* Footer */}
      <footer className="no-print mt-auto py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            CatatUang &bull; Pencatat Pengeluaran Harian & Pelindung Anggaran Otomatis
          </span>
          <span>Data tersimpan aman secara lokal di peramban Anda.</span>
        </div>
      </footer>
    </div>
  );
}
