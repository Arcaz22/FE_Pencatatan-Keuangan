import { useState } from 'react';
import { mockIncomes, mockExpenses } from '@/lib/mock-data';
import { getCurrentMonth, getCurrentYear } from '../utils/date-utils';
import { BudgetData, ChartData, PieChartData } from '@/types/api';

export const useDashboardData = () => {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [currentYear, setCurrentYear] = useState(getCurrentYear());

  const handlePreviousPeriod = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextPeriod = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const filteredIncomes = mockIncomes.filter((income) => {
    const date = new Date(income.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const filteredExpenses = mockExpenses.filter((expense) => {
    const date = new Date(expense.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpense;

  const chartData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Income',
        data: [300000, 450000, 320000, 500000],
        backgroundColor: 'hsl(var(--bg-success))'
      },
      {
        label: 'Expense',
        data: [200000, 300000, 250000, 400000],
        backgroundColor: 'hsl(var(--bg-destructive))'
      }
    ]
  };

  const pieChartData: PieChartData[] = [
    { name: 'Internet', value: 319000 },
    { name: 'Makan', value: 1000000 },
    { name: 'Transportasi', value: 500000 },
    { name: 'Lainnya', value: 200000 }
  ];

  const budgetData: BudgetData[] = [
    { date: '2024-03-01', amount: 1000000, budget: 1500000 },
    { date: '2024-03-05', amount: 1200000, budget: 1500000 },
    { date: '2024-03-10', amount: 1350000, budget: 1500000 },
    { date: '2024-03-15', amount: 1400000, budget: 1500000 },
    { date: '2024-03-20', amount: 1450000, budget: 1500000 },
    { date: '2024-03-25', amount: 1480000, budget: 1500000 },
    { date: '2024-03-30', amount: 1495000, budget: 1500000 }
  ];

  return {
    totalIncome,
    totalExpense,
    balance,
    currentMonth,
    currentYear,
    chartData,
    pieChartData,
    handlePreviousPeriod,
    handleNextPeriod,
    budgetData
  };
};
