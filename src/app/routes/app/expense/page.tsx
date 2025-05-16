import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableColumn } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { mockExpenses, expenseCategoryDisplay } from '@/lib/mock-data';
import { Expense } from '@/types/api';
import { ExpenseForm } from '@/features/expense/expense-form';
import { cn } from '@/utils/cn';
import { FormDrawer } from '@/components/ui/form';

type ExpenseTableValues = {
  amount: number;
  description: string;
  category: string;
  date: string;
};

export const ExpensePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleCreateExpense = async (values: ExpenseTableValues) => {
    setIsLoading(true);
    setIsFormSubmitted(false);

    try {
      console.log('Create expense:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newExpense = {
        id: `expense-${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setExpenses([newExpense, ...expenses]);
      setIsFormSubmitted(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to create expense:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExpense = async (values: ExpenseTableValues) => {
    if (!selectedExpense) return Promise.reject('No expense selected');

    setIsLoading(true);
    setIsFormSubmitted(false);

    try {
      console.log('Update expense:', values, 'ID:', selectedExpense.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedExpenses = expenses.map((expense) =>
        expense.id === selectedExpense.id
          ? { ...expense, ...values, updatedAt: new Date().toISOString() }
          : expense
      );
      setExpenses(updatedExpenses);
      setIsFormSubmitted(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update expense:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;

    setIsLoading(true);
    try {
      console.log('Delete expense:', selectedExpense.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const filteredExpenses = expenses.filter((expense) => expense.id !== selectedExpense.id);
      setExpenses(filteredExpenses);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    } finally {
      setIsLoading(false);
      setSelectedExpense(null);
    }
  };

  const handleAddButtonClick = () => {
    setIsFormSubmitted(false);
    setIsAddDrawerOpen(true);
  };

  useEffect(() => {
    if (isFormSubmitted && isAddDrawerOpen) {
      const timer = setTimeout(() => {
        setIsAddDrawerOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFormSubmitted, isAddDrawerOpen]);

  useEffect(() => {
    if (isFormSubmitted && isEditDrawerOpen) {
      const timer = setTimeout(() => {
        setIsEditDrawerOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFormSubmitted, isEditDrawerOpen]);

  useEffect(() => {
    if (!isAddDrawerOpen && !isEditDrawerOpen) {
      setIsFormSubmitted(false);
    }
  }, [isAddDrawerOpen, isEditDrawerOpen]);

  const columns: TableColumn<Expense>[] = [
    {
      title: 'Tanggal',
      field: 'date',
      Cell: ({ entry }) => {
        const date = new Date(entry.date);
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[hsl(var(--text-primary))]">
              {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
            <span className="text-xs text-[hsl(var(--text-secondary))]">{date.getFullYear()}</span>
          </div>
        );
      }
    },
    {
      title: 'Kategori',
      field: 'category',
      Cell: ({ entry }) => {
        const category = entry.category;
        if (category in expenseCategoryDisplay) {
          const categoryInfo =
            expenseCategoryDisplay[category as keyof typeof expenseCategoryDisplay];
          return (
            <div className="flex items-center">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-[hsl(var(--text-white))]',
                  categoryInfo.color,
                  category === 'other' && 'text-[hsl(var(--text-secondary))]'
                )}
              >
                {categoryInfo.label}
              </span>
            </div>
          );
        }
        return <div>{category}</div>;
      }
    },
    {
      title: 'Keterangan',
      field: 'description',
      Cell: ({ entry }) => (
        <div className="flex items-center">
          <span className="text-[hsl(var(--text-primary))]">{entry.description}</span>
        </div>
      )
    },
    {
      title: 'Jumlah',
      field: 'amount',
      Cell: ({ entry }) => (
        <div className="flex items-center">
          <span className="font-medium text-[hsl(var(--text-primary))]">
            Rp {entry.amount.toLocaleString('id-ID')}
          </span>
        </div>
      )
    },
    {
      title: 'Actions',
      field: 'id',
      Cell: ({ entry }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedExpense(entry);
              setIsEditDrawerOpen(true);
            }}
          >
            <Pencil className="size-4 text-[hsl(var(--text-secondary))]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedExpense(entry);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="size-4 text-[hsl(var(--bg-destructive))]" />
          </Button>
        </div>
      )
    }
  ] as const;

  return (
    <DashboardLayout>
      <ContentLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
            Daftar Pengeluaran
          </h1>

          <Button onClick={handleAddButtonClick} icon={<Plus className="size-4" />}>
            Tambah Pengeluaran
          </Button>
        </div>

        <FormDrawer
          isDone={isFormSubmitted}
          title="Tambah Pengeluaran"
          isOpen={isAddDrawerOpen}
          onOpenChange={(open) => {
            setIsAddDrawerOpen(open);
            if (!open) {
              setIsFormSubmitted(false);
            }
          }}
          triggerButton={null}
          submitButton={
            <Button type="submit" form="expense-form" isLoading={isLoading}>
              Simpan
            </Button>
          }
        >
          <ExpenseForm id="expense-form" onSubmit={handleCreateExpense} />
        </FormDrawer>

        <FormDrawer
          isDone={isFormSubmitted}
          title="Edit Pengeluaran"
          isOpen={isEditDrawerOpen}
          onOpenChange={(open) => {
            setIsEditDrawerOpen(open);
            if (!open) {
              setIsFormSubmitted(false);
            }
          }}
          triggerButton={null}
          submitButton={
            <Button type="submit" form="expense-edit-form" isLoading={isLoading}>
              Update
            </Button>
          }
        >
          {selectedExpense && (
            <ExpenseForm
              key={`edit-expense-${selectedExpense.id}`}
              id="expense-edit-form"
              onSubmit={handleUpdateExpense}
              defaultValues={{
                amount: selectedExpense.amount,
                description: selectedExpense.description,
                category: selectedExpense.category,
                date: selectedExpense.date
              }}
            />
          )}
        </FormDrawer>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Pengeluaran</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedExpense ? (
                  <>
                    Apakah anda yakin ingin menghapus pengeluaran{' '}
                    <strong>"{selectedExpense.description}"</strong> dengan jumlah{' '}
                    <strong>Rp {selectedExpense.amount.toLocaleString('id-ID')}</strong>?
                  </>
                ) : (
                  'Apakah anda yakin ingin menghapus pengeluaran ini?'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteExpense}
                disabled={isLoading}
                className="bg-[hsl(var(--bg-destructive))] text-[hsl(var(--text-white))]"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Menghapus...
                  </>
                ) : (
                  'Hapus'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="mt-8">
          <Table data={expenses} columns={columns} />
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};

export default ExpensePage;
