import { Category } from '../types/finance';

export const DEFAULT_CATEGORIES: Category[] = [
  // Pengeluaran (Expense)
  {
    id: 'cat-food',
    name: 'Makanan & Minuman',
    type: 'expense',
    icon: 'Utensils',
    color: '#f97316', // Orange
    bgColor: '#ffedd5',
    budget: 2500000,
  },
  {
    id: 'cat-transport',
    name: 'Transportasi',
    type: 'expense',
    icon: 'Car',
    color: '#0284c7', // Sky Blue
    bgColor: '#e0f2fe',
    budget: 800000,
  },
  {
    id: 'cat-groceries',
    name: 'Belanja Harian & Rumah',
    type: 'expense',
    icon: 'ShoppingCart',
    color: '#10b981', // Emerald
    bgColor: '#d1fae5',
    budget: 1500000,
  },
  {
    id: 'cat-bills',
    name: 'Tagihan & Utilitas',
    type: 'expense',
    icon: 'Receipt',
    color: '#8b5cf6', // Violet
    bgColor: '#ede9fe',
    budget: 1000000,
  },
  {
    id: 'cat-entertainment',
    name: 'Hiburan & Hobi',
    type: 'expense',
    icon: 'Film',
    color: '#ec4899', // Pink
    bgColor: '#fce7f3',
    budget: 600000,
  },
  {
    id: 'cat-health',
    name: 'Kesehatan & Medis',
    type: 'expense',
    icon: 'HeartPulse',
    color: '#ef4444', // Red
    bgColor: '#fee2e2',
    budget: 500000,
  },
  {
    id: 'cat-education',
    name: 'Pendidikan & Belajar',
    type: 'expense',
    icon: 'GraduationCap',
    color: '#3b82f6', // Blue
    bgColor: '#dbeafe',
    budget: 400000,
  },
  {
    id: 'cat-social',
    name: 'Sosial & Sedekah',
    type: 'expense',
    icon: 'Gift',
    color: '#14b8a6', // Teal
    bgColor: '#ccfbf1',
    budget: 500000,
  },
  {
    id: 'cat-housing',
    name: 'Tempat Tinggal / Kos',
    type: 'expense',
    icon: 'Home',
    color: '#6366f1', // Indigo
    bgColor: '#e0e7ff',
    budget: 1800000,
  },
  {
    id: 'cat-other-expense',
    name: 'Lain-lain',
    type: 'expense',
    icon: 'CircleEllipsis',
    color: '#64748b', // Slate
    bgColor: '#f1f5f9',
    budget: 300000,
  },

  // Pemasukan (Income)
  {
    id: 'cat-salary',
    name: 'Gaji Pokok',
    type: 'income',
    icon: 'Briefcase',
    color: '#059669', // Emerald
    bgColor: '#d1fae5',
  },
  {
    id: 'cat-freelance',
    name: 'Freelance & Usaha',
    type: 'income',
    icon: 'Laptop',
    color: '#0284c7', // Sky
    bgColor: '#e0f2fe',
  },
  {
    id: 'cat-investment',
    name: 'Investasi & Bunga',
    type: 'income',
    icon: 'TrendingUp',
    color: '#8b5cf6', // Violet
    bgColor: '#ede9fe',
  },
  {
    id: 'cat-allowance',
    name: 'Kiriman & Hadiah',
    type: 'income',
    icon: 'Sparkles',
    color: '#f59e0b', // Amber
    bgColor: '#fef3c7',
  },
  {
    id: 'cat-other-income',
    name: 'Pemasukan Lainnya',
    type: 'income',
    icon: 'PlusCircle',
    color: '#10b981', // Green
    bgColor: '#dcfce7',
  },
];

export const PAYMENT_METHODS = [
  { id: 'Tunai', name: 'Tunai (Cash)', icon: 'Banknote', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'QRIS', name: 'QRIS', icon: 'QrCode', color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'BCA', name: 'BCA', icon: 'CreditCard', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'Mandiri', name: 'Mandiri', icon: 'CreditCard', color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'BRI', name: 'BRI', icon: 'CreditCard', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { id: 'GoPay', name: 'GoPay', icon: 'Smartphone', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'OVO', name: 'OVO', icon: 'Smartphone', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Dana', name: 'DANA', icon: 'Smartphone', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { id: 'ShopeePay', name: 'ShopeePay', icon: 'Smartphone', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'Kartu Kredit', name: 'Kartu Kredit', icon: 'CreditCard', color: 'text-slate-700 bg-slate-100 border-slate-300' },
];

export function getCategoryByName(name: string, type: 'expense' | 'income' = 'expense'): Category {
  const found = DEFAULT_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (found) return found;
  return {
    id: 'cat-custom',
    name,
    type,
    icon: type === 'expense' ? 'CircleEllipsis' : 'PlusCircle',
    color: type === 'expense' ? '#64748b' : '#059669',
    bgColor: type === 'expense' ? '#f1f5f9' : '#d1fae5',
  };
}
