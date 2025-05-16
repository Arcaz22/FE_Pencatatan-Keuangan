import { useParams, Navigate } from 'react-router-dom';
import { CategoryPage } from './page';
import { mockIncomeCategories, mockExpenseCategories } from '@/lib/mock-data';

export const CategoryRoute = () => {
  const { type } = useParams<{ type: string }>();

  if (type !== 'income' && type !== 'expense') {
    return <Navigate to="/404" replace />;
  }

  const categories = type === 'income' ? mockIncomeCategories : mockExpenseCategories;

  return <CategoryPage type={type as 'income' | 'expense'} categories={categories} />;
};
