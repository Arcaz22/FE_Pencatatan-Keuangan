import { Expense, Income, Category } from '@/types/api';

export const mockIncomeCategories: Category[] = [
  {
    id: '1',
    name: 'Gaji',
    description: 'Pendapatan dari pekerjaan tetap',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Bonus',
    description: 'Pendapatan tambahan dari bonus',
    createdAt: Date.now()
  },
  {
    id: '3',
    name: 'Investasi',
    description: 'Pendapatan dari investasi',
    createdAt: Date.now()
  },
  {
    id: '4',
    name: 'Lainnya',
    description: 'Pendapatan dari sumber lain',
    createdAt: Date.now()
  }
];

export const mockExpenseCategories: Category[] = [
  {
    id: '1',
    name: 'Internet',
    description: 'Biaya internet bulanan',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Makan',
    description: 'Biaya makan per bulan',
    createdAt: Date.now()
  },
  {
    id: '3',
    name: 'Transportasi',
    description: 'Biaya transportasi',
    createdAt: Date.now()
  },
  {
    id: '4',
    name: 'Lainnya',
    description: 'Pengeluaran lain-lain',
    createdAt: Date.now()
  }
];

// Mock Incomes
export const mockIncomes: Income[] = [
  {
    id: '1',
    amount: 5000000,
    description: 'Gaji Bulanan',
    category: 'salary',
    date: '2024-02-20',
    createdAt: Date.now() - 3600000 * 24 * 10 // 10 days ago
  },
  {
    id: '2',
    amount: 1000000,
    description: 'Bonus Project',
    category: 'bonus',
    date: '2024-02-21',
    createdAt: Date.now() - 3600000 * 24 * 5 // 5 days ago
  },
  {
    id: '3',
    amount: 500000,
    description: 'Dividen Saham',
    category: 'investment',
    date: '2024-03-01',
    createdAt: Date.now() - 3600000 * 24 * 2 // 2 days ago
  }
];

// Mock Expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 319000,
    description: 'Internet Bulanan',
    category: 'internet',
    date: '2024-02-20',
    createdAt: Date.now() - 3600000 * 24 * 8 // 8 days ago
  },
  {
    id: '2',
    amount: 1000000,
    description: 'Makan per bulan',
    category: 'makan',
    date: '2024-02-21',
    createdAt: Date.now() - 3600000 * 24 * 4 // 4 days ago
  },
  {
    id: '3',
    amount: 500000,
    description: 'Bensin dan Transportasi',
    category: 'transportasi',
    date: '2024-03-05',
    createdAt: Date.now() - 3600000 * 24 * 1 // 1 day ago
  }
];

// Form options for dropdowns
export const incomeCategories = [
  { label: 'Gaji', value: 'salary' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Investasi', value: 'investment' },
  { label: 'Lainnya', value: 'other' }
];

export const expenseCategories = [
  { label: 'Internet', value: 'internet' },
  { label: 'Makan', value: 'makan' },
  { label: 'Transportasi', value: 'transportasi' },
  { label: 'Lainnya', value: 'other' }
];

// Category display information for UI
export const incomeCategoryDisplay = {
  salary: { label: 'Gaji', color: 'bg-[hsl(var(--bg-info))]' },
  bonus: { label: 'Bonus', color: 'bg-[hsl(var(--bg-success))]' },
  investment: { label: 'Investasi', color: 'bg-[hsl(var(--bg-primary))]' },
  other: { label: 'Lainnya', color: 'bg-[hsl(var(--bg-secondary))]' }
};

export const expenseCategoryDisplay = {
  internet: { label: 'Internet', color: 'bg-[hsl(var(--bg-info))]' },
  makan: { label: 'Makan', color: 'bg-[hsl(var(--bg-success))]' },
  transportasi: { label: 'Transportasi', color: 'bg-[hsl(var(--bg-warning))]' },
  other: { label: 'Lainnya', color: 'bg-[hsl(var(--bg-secondary))]' }
};
