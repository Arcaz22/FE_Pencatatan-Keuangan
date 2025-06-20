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
import { mockIncomes, incomeCategoryDisplay } from '@/lib/mock-data';
import { Income } from '@/types/api';
import { IncomeForm } from '@/features/income/income-form';
import { cn } from '@/utils/cn';
import { FormDrawer } from '@/components/ui/form';

type IncomeFormValues = {
  amount: number;
  description: string;
  category: string;
  date: string;
};

export const IncomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [incomes, setIncomes] = useState<Income[]>(mockIncomes);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleCreateIncome = async (values: IncomeFormValues) => {
    setIsLoading(true);
    setIsFormSubmitted(false);

    try {
      console.log('Create income:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newIncome = {
        id: `income-${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setIncomes([newIncome, ...incomes]);
      setIsFormSubmitted(true);
      successfully;
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to create income:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateIncome = async (values: IncomeFormValues) => {
    if (!selectedIncome) return Promise.reject('No income selected');

    setIsLoading(true);
    setIsFormSubmitted(false);

    try {
      console.log('Update income:', values, 'ID:', selectedIncome.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedIncomes = incomes.map((income) =>
        income.id === selectedIncome.id
          ? { ...income, ...values, updatedAt: new Date().toISOString() }
          : income
      );
      setIncomes(updatedIncomes);
      setIsFormSubmitted(true);
      successfully;
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update income:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIncome = async () => {
    if (!selectedIncome) return;

    setIsLoading(true);
    try {
      console.log('Delete income:', selectedIncome.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const filteredIncomes = incomes.filter((income) => income.id !== selectedIncome.id);
      setIncomes(filteredIncomes);

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete income:', error);
    } finally {
      setIsLoading(false);
      setSelectedIncome(null);
    }
  };

  const columns: TableColumn<Income>[] = [
    {
      title: 'Tanggal',
      field: 'date' as keyof Income,
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
      field: 'category' as keyof Income,
      Cell: ({ entry }) => {
        const category = entry.category;
        if (category in incomeCategoryDisplay) {
          const categoryInfo =
            incomeCategoryDisplay[category as keyof typeof incomeCategoryDisplay];
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
      field: 'description' as keyof Income,
      Cell: ({ entry }) => (
        <div className="flex items-center">
          <span className="text-[hsl(var(--text-primary))]">{entry.description}</span>
        </div>
      )
    },
    {
      title: 'Jumlah',
      field: 'amount' as keyof Income,
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
      field: 'id' as keyof Income,
      Cell: ({ entry }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedIncome(entry);
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
              setSelectedIncome(entry);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="size-4 text-[hsl(var(--bg-destructive))]" />
          </Button>
        </div>
      )
    }
  ] as const;

  const handleAddButtonClick = () => {
    console.log('Add button clicked, setting isAddDrawerOpen to true');
    setIsFormSubmitted(false); // Reset submission flag when opening
    setIsAddDrawerOpen(true);
  };

  // Effects to control drawer state based on submission
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

  // Reset form submission flag when drawer closes
  useEffect(() => {
    if (!isAddDrawerOpen && !isEditDrawerOpen) {
      setIsFormSubmitted(false);
    }
  }, [isAddDrawerOpen, isEditDrawerOpen]);

  return (
    <DashboardLayout>
      <ContentLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
            Daftar Pemasukan
          </h1>

          {/* Add Income Button - Changed to regular button to separate from drawer logic */}
          <Button onClick={handleAddButtonClick} icon={<Plus className="size-4" />}>
            Tambah Pemasukan
          </Button>
        </div>

        <FormDrawer
          isDone={isFormSubmitted}
          title="Tambah Pemasukan"
          isOpen={isAddDrawerOpen}
          onOpenChange={(open) => {
            setIsAddDrawerOpen(open);
            if (!open) {
              // Reset form submitted state when drawer closes
              setIsFormSubmitted(false);
            }
          }}
          triggerButton={null} // No trigger button, we control it externally
          submitButton={
            <Button type="submit" form="income-form" isLoading={isLoading}>
              Simpan
            </Button>
          }
        >
          <IncomeForm id="income-form" onSubmit={handleCreateIncome} />
        </FormDrawer>

        <FormDrawer
          isDone={isFormSubmitted}
          title="Edit Pemasukan"
          isOpen={isEditDrawerOpen}
          onOpenChange={(open) => {
            setIsEditDrawerOpen(open);
            if (!open) {
              // Reset form submitted state when drawer closes
              setIsFormSubmitted(false);
            }
          }}
          triggerButton={null}
          submitButton={
            <Button type="submit" form="income-edit-form" isLoading={isLoading}>
              Update
            </Button>
          }
        >
          {selectedIncome && (
            <IncomeForm
              key={`edit-income-${selectedIncome.id}`}
              id="income-edit-form"
              onSubmit={handleUpdateIncome}
              defaultValues={{
                amount: selectedIncome.amount,
                description: selectedIncome.description,
                category: selectedIncome.category,
                date: selectedIncome.date
              }}
            />
          )}
        </FormDrawer>

        {/* Delete Income Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Pemasukan</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedIncome ? (
                  <>
                    Apakah anda yakin ingin menghapus pemasukan{' '}
                    <strong>"{selectedIncome.description}"</strong> dengan jumlah{' '}
                    <strong>Rp {selectedIncome.amount.toLocaleString('id-ID')}</strong>?
                  </>
                ) : (
                  'Apakah anda yakin ingin menghapus pemasukan ini?'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteIncome}
                disabled={isLoading}
                className="bg-[hsl(var(--bg-destructive))] text-[hsl(var(--text-white))]"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
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
          <Table data={incomes} columns={columns} />
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};

export default IncomePage;
