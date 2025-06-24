import { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableColumn } from '@/components/ui/table';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { ExpenseForm } from '@/features/expense/expense-form';
import { Expense, ExpenseFormValues, QueryParams } from '@/types/api';
import { cn } from '@/utils/cn';
import { SearchPaginationParams, useSearchAndPagination } from '@/hooks/user-search-pagination';
import { showNotification } from '@/stores/slices/notificationSlice';
import { FormDrawer, SearchInput } from '@/components/ui/form';
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
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  selectExpenses,
  selectExpenseLoading,
  selectExpensePagination
} from '@/stores/slices/expenseSlice';
import { useSearchParams } from 'react-router-dom';
import { expenseCategoryDisplay } from '@/lib/mock-data';

export const ExpensePage = () => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectExpenses);
  const isLoading = useAppSelector(selectExpenseLoading);
  const pagination = useAppSelector(selectExpensePagination);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchExpensesHandler = useCallback(
    async (params: QueryParams) => {
      await dispatch(fetchExpenses(params));
    },
    [dispatch]
  );

  const fetchDataMemoized = useCallback(
    async (params: SearchPaginationParams<void>): Promise<void> => {
      return fetchExpensesHandler({
        page: params.page,
        limit: 5,
        search: params.search,
        sort_by: params.sort_by,
        sort_dir: params.sort_dir
      });
    },
    [fetchExpensesHandler]
  );

  const { searchTerm, setSearchTerm, sorting, handleSort, handleSearchKeyDown } =
    useSearchAndPagination({
      initialSortField: 'date',
      fetchData: fetchDataMemoized
    });

  useEffect(() => {
    fetchExpensesHandler({
      page: currentPage,
      limit: 5
    });
  }, [fetchExpensesHandler, currentPage]);

  const handleCreateExpense = async (values: ExpenseFormValues) => {
    try {
      const formattedDate = values.date.includes('T') ? values.date.split('T')[0] : values.date;

      const expenseData: ExpenseFormValues = {
        ...values,
        category_id: values.category,
        date: formattedDate
      };

      const resultAction = await dispatch(createExpense(expenseData));

      if (createExpense.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message:
              resultAction.payload.message || `Pengeluaran "${values.description}" berhasil dibuat`,
            type: 'success'
          })
        );

        await fetchExpensesHandler({
          page: pagination.current_page,
          limit: 5,
          search: searchTerm,
          sort_by: sorting?.field,
          sort_dir: sorting?.direction
        });

        setIsFormSubmitted(true);
        setIsAddDrawerOpen(false);
      }
    } catch (error) {
      console.error('Failed to create expense:', error);
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Gagal membuat pengeluaran',
          type: 'error'
        })
      );
    }
  };

  const handleUpdateExpense = async (values: ExpenseFormValues) => {
    if (!selectedExpense) return;

    setIsFormSubmitted(false);
    try {
      const formattedDate = values.date.includes('T') ? values.date.split('T')[0] : values.date;

      const expenseData: ExpenseFormValues = {
        ...values,
        category_id: values.category,
        date: formattedDate
      };

      const resultAction = await dispatch(
        updateExpense({ id: selectedExpense.id, data: expenseData })
      );

      if (updateExpense.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || 'Pengeluaran berhasil diperbarui',
            type: 'success'
          })
        );

        await fetchExpensesHandler({
          page: pagination.current_page,
          limit: 5,
          search: searchTerm,
          sort_by: sorting?.field,
          sort_dir: sorting?.direction
        });

        setIsFormSubmitted(true);
        setIsEditDrawerOpen(false);
        setSelectedExpense(null);
      }
    } catch (error) {
      console.error('Failed to update expense:', error);
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Gagal memperbarui pengeluaran',
          type: 'error'
        })
      );
    }
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;

    try {
      const resultAction = await dispatch(deleteExpense(selectedExpense.id));

      if (deleteExpense.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || 'Pengeluaran berhasil dihapus',
            type: 'success'
          })
        );

        await fetchExpensesHandler({
          page: pagination.current_page,
          limit: 5,
          search: searchTerm,
          sort_by: sorting?.field,
          sort_dir: sorting?.direction
        });
      } else {
        dispatch(
          showNotification({
            type: 'error',
            message:
              (resultAction.payload as string) || 'Gagal menghapus pengeluaran. Silakan coba lagi.'
          })
        );
      }
      setIsDeleteDialogOpen(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Gagal menghapus pengeluaran. Silakan coba lagi.'
        })
      );
    }
  };

  const columns: TableColumn<Expense>[] = useMemo(
    () => [
      {
        title: 'Tanggal',
        field: 'date',
        sortable: true,
        Cell: ({ entry }) => {
          const date = new Date(entry.date);
          return (
            <div className="flex flex-col">
              <span className="font-medium text-[hsl(var(--text-primary))]">
                {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
              <span className="text-xs text-[hsl(var(--text-secondary))]">
                {date.getFullYear()}
              </span>
            </div>
          );
        }
      },
      {
        title: 'Kategori',
        field: 'category',
        sortable: true,
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
        sortable: true,
        Cell: ({ entry }) => (
          <div className="flex items-center">
            <span className="text-[hsl(var(--text-primary))]">{entry.description}</span>
          </div>
        )
      },
      {
        title: 'Jumlah',
        field: 'amount',
        sortable: true,
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
    ],
    []
  );

  return (
      <DashboardLayout>
        <ContentLayout>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
              Daftar Pengeluaran
            </h1>

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
              triggerButton={<Button icon={<Plus className="size-4" />}>Tambah Pengeluaran</Button>}
              submitButton={
                <Button type="submit" form="expense-form" isLoading={isLoading}>
                  Simpan
                </Button>
              }
            >
              <ExpenseForm onSubmit={handleCreateExpense} isLoading={isLoading} />
            </FormDrawer>
          </div>

          <div className="mt-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              onKeyDown={handleSearchKeyDown}
              placeholder="Cari pengeluaran..."
              className="max-w-sm"
            />
          </div>

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
                isLoading={isLoading}
                initialValues={{
                  amount: selectedExpense.amount,
                  category: selectedExpense.category_id || selectedExpense.category,
                  date: new Date(selectedExpense.date).toISOString().split('T')[0],
                  description: selectedExpense.description
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
                    'Apakah anda yakin ingin menghapus pengeluran ini?'
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
            <Table
              data={expenses}
              columns={columns}
              sorting={{
                state: sorting,
                onSort: handleSort
              }}
              pagination={
                pagination && {
                  currentPage: pagination.current_page,
                  totalPages: pagination.total_pages,
                  rootUrl: '/expense'
                }
              }
              isLoading={isLoading}
            />
          </div>
        </ContentLayout>
      </DashboardLayout>
    );
  };

export default ExpensePage;
