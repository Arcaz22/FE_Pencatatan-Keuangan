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

export type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
};

export type ApiResponse<T> = {
  message: string;
  data: T;
  pagination?: Meta;
};

// User types
export type User = Entity<{
  name: string;
  email: string;
}>;

export type RegisterInput = {
  email: string;
  password: string;
  confirm_password: string;
};

export type RegisterValues = {
  user: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginValues = {
  token: string;
  user: User;
};

// Category types
export type CategoryType = 'income' | 'expense';

export type CategoryQueryParams = QueryParams & {
  type?: CategoryType;
};

export type Category = BaseEntity & {
  name: string;
  type: CategoryType;
  description: string;
};

export type CategoryFormValues = {
  name: string;
  type: CategoryType;
  description: string;
};

// Transaction types
type BaseTransactionFormValues = {
  amount: number;
  description: string;
  category: string;
  category_id?: string;
  date: string;
};

export type Income = BaseEntity & BaseTransactionFormValues;
export type IncomeFormValues = BaseTransactionFormValues;

export type Expense = BaseEntity & BaseTransactionFormValues;
export type ExpenseFormValues = BaseTransactionFormValues;

// Budget types
export type Budget = BaseEntity & {
  amount: number;
  category: string;
  category_id?: string;
  effective_from: string;
  effective_to: string;
  is_active: boolean;
};

export type BudgetFormValues = {
  amount: number;
  category: string;
  category_id?: string;
  effective_from: string;
  effective_to: string;
  is_active?: boolean;
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
