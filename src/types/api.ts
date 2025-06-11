export type BaseEntity = {
  id: string;
  createdAt?: number | null;
  updatedAt?: number | null;
  deletedAt?: number | null;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
};

export type ApiResponse<T> = {
  message: string;
  data: T;
  pagination?: Meta;
};

export type User = Entity<{
  name: string;
  email: string;
}>;

export type RegisterInput = {
  email: string;
  password: string;
  confirm_password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
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
