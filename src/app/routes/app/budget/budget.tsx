import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { Button } from '@/components/ui/button';
import { FormDrawer } from '@/components/ui/form';
import { BudgetForm } from '@/features/budget/budget-form';
import { BudgetTable } from '@/features/budget/budget-table';
import { Budget } from '@/types/api';

type BudgetFormValues = {
  amount: number;
  category: string;
  month: string;
  year: string;
};

export const BudgetPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [budgets] = useState<Budget[]>([
    {
      id: '1',
      categoryId: 'makan',
      amount: 1500000,
      spent: 1200000,
      month: 3,
      year: 2024,
      createdAt: Date.now()
    }
  ]);

  const handleCreateBudget = async (values: BudgetFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBudget = (budget: Budget) => {
    console.log('Edit budget:', budget);
  };

  const handleDeleteBudget = (budget: Budget) => {
    console.log('Delete budget:', budget);
  };

  return (
    <DashboardLayout>
      <ContentLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
            Pengaturan Anggaran
          </h1>
          <FormDrawer
            isDone={!isLoading}
            title="Tambah Anggaran"
            triggerButton={<Button icon={<Plus className="size-4" />}>Tambah Anggaran</Button>}
            submitButton={
              <Button type="submit" form="budget-form" isLoading={isLoading}>
                Simpan
              </Button>
            }
          >
            <BudgetForm onSubmit={handleCreateBudget} isLoading={isLoading} />
          </FormDrawer>
        </div>

        <div className="mt-8">
          <BudgetTable data={budgets} onEdit={handleEditBudget} onDelete={handleDeleteBudget} />
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};
