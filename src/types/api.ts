export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

export type AuthResponse = {
  user: User;
};

// Base type for transaction forms
type BaseTransactionFormValues = {
  amount: number;
  description: string;
  category: string;
  date: string;
};

// Income types
export type Income = BaseEntity & BaseTransactionFormValues;
export type IncomeFormValues = BaseTransactionFormValues;

// Expense types
export type Expense = BaseEntity & BaseTransactionFormValues;
export type ExpenseFormValues = BaseTransactionFormValues;

// Category types
export type Category = BaseEntity & {
  name: string;
  description: string;
};

export type CategoryFormValues = {
  name: string;
  description?: string;
};

// Statistics types
export type StatsData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

// Chart types
export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
};

export type PieChartData = {
  name: string;
  value: number;
};

// Budget types
export type BudgetData = {
  date: string;
  amount: number;
  budget: number;
};

export type Budget = BaseEntity & {
  categoryId: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
};

export type CreateBudgetDTO = {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
};

export type UpdateBudgetDTO = Partial<CreateBudgetDTO>;
