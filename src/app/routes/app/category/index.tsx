import { FC } from 'react';
import { CategoryPage } from './page';
import { CategoryType } from '@/types/api';

interface CategoryRouteProps {
  type: CategoryType;
}

export const CategoryRoute: FC<CategoryRouteProps> = ({ type }) => {
  return <CategoryPage type={type} />;
};
