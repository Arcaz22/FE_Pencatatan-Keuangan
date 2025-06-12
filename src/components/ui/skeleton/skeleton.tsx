import React from 'react';
import { useLocation } from 'react-router-dom';

type SkeletonLoaderProps = {
  className?: string;
  type?: 'dashboard' | 'income' | 'expense' | 'budget' | 'category' | 'default';
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = '', type }) => {
  // Gunakan location untuk otomatis mendeteksi halaman jika type tidak disediakan
  const location = useLocation();
  const path = location.pathname;

  // Tentukan tipe skeleton berdasarkan path jika tidak disediakan
  const skeletonType = type || getSkeletonTypeFromPath(path);

  // Log untuk debugging
  console.log('Rendering skeleton for:', skeletonType);

  // Render skeleton berdasarkan tipe
  return <div className={`${className}`}>{renderSkeletonByType(skeletonType)}</div>;
};

// Helper untuk menentukan tipe skeleton dari path
function getSkeletonTypeFromPath(path: string): SkeletonLoaderProps['type'] {
  if (path.includes('/dashboard')) return 'dashboard';
  if (path.includes('/income')) return 'income';
  if (path.includes('/expense')) return 'expense';
  if (path.includes('/budget')) return 'budget';
  if (path.includes('/category')) return 'category';
  return 'default';
}

// Render skeleton berdasarkan tipe
function renderSkeletonByType(type: SkeletonLoaderProps['type']) {
  switch (type) {
    case 'dashboard':
      return <DashboardSkeleton />;
    case 'income':
    case 'expense':
      return <TableSkeleton type={type} />;
    case 'budget':
      return <BudgetSkeleton />;
    case 'category':
      return <CategorySkeleton />;
    default:
      return <DefaultSkeleton />;
  }
}

// Skeleton untuk dashboard
const DashboardSkeleton = () => (
  <div className="space-y-6 p-4">
    {/* Header dan selector */}
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-200 rounded h-[400px] animate-pulse"></div>
      <div className="bg-gray-200 rounded h-[400px] animate-pulse"></div>
    </div>
  </div>
);

// Skeleton untuk tabel (income/expense)
const TableSkeleton = ({ type }: { type: 'income' | 'expense' | undefined }) => (
  <div className="space-y-8 p-4">
    {/* Header dengan tombol */}
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
    </div>

    {/* Title */}
    {type && <div className="h-6 bg-gray-200 rounded w-64 animate-pulse mb-4"></div>}

    {/* Tabel */}
    <div className="space-y-4 animate-pulse">
      {/* Header tabel */}
      <div className="h-12 bg-gray-200 rounded"></div>

      {/* Baris-baris tabel */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// Skeleton untuk budget
const BudgetSkeleton = () => (
  <div className="space-y-6 p-4">
    {/* Header dengan tombol */}
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
    </div>

    {/* Budget cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

// Skeleton untuk category
const CategorySkeleton = () => (
  <div className="space-y-6 p-4">
    {/* Header dengan tombol */}
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
    </div>

    {/* Category list */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

// Default skeleton
const DefaultSkeleton = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md p-4">
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);
