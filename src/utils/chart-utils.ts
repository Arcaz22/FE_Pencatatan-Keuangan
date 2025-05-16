import { Income, Expense } from '@/types/api';
import { getMonthName } from './date-utils';

export const groupTransactionsByMonth = (transactions: (Income | Expense)[], year: number) => {
  const monthlyData = Array(12).fill(0);

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    if (date.getFullYear() === year) {
      monthlyData[date.getMonth()] += transaction.amount;
    }
  });

  return monthlyData;
};

export const generateChartData = (incomes: Income[], expenses: Expense[], year: number) => {
  const monthlyIncomes = groupTransactionsByMonth(incomes, year);
  const monthlyExpenses = groupTransactionsByMonth(expenses, year);

  return {
    labels: Array.from({ length: 12 }, (_, i) => getMonthName(i)),
    datasets: [
      {
        label: 'Pemasukan',
        data: monthlyIncomes,
        backgroundColor: 'hsl(var(--bg-success))'
      },
      {
        label: 'Pengeluaran',
        data: monthlyExpenses,
        backgroundColor: 'hsl(var(--bg-destructive))'
      }
    ]
  };
};

export const generatePieChartData = (expenses: Expense[]) => {
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(categoryTotals).map(([category, value]) => ({
    name: category,
    value: value
  }));
};
