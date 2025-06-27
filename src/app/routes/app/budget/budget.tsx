import { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableColumn } from '@/components/ui/table';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { BudgetForm } from '@/features/budget/budget-form';
import { Budget, BudgetFormValues, QueryParams } from '@/types/api';
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
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  selectBudgets,
  selectBudgetLoading,
  selectBudgetPagination
} from '@/stores/slices/budgetSlice';
import { useSearchParams } from 'react-router-dom';
import { expenseCategoryDisplay } from '@/lib/mock-data';

export const BudgetPage = () => {
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const dispatch = useAppDispatch();
  const budgets = useAppSelector(selectBudgets);
  const isLoading = useAppSelector(selectBudgetLoading);
  const pagination = useAppSelector(selectBudgetPagination);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchBudgetsHandler = useCallback(
    async (params: QueryParams) => {
      await dispatch(fetchBudgets(params));
    },
    [dispatch]
  );

  const fetchDataMemoized = useCallback(
    async (params: SearchPaginationParams<void>): Promise<void> => {
      return fetchBudgetsHandler({
        page: params.page,
        limit: 5,
        search: params.search,
        sort_by: params.sort_by,
        sort_dir: params.sort_dir
      });
    },
    [fetchBudgetsHandler]
  );

  const { searchTerm, setSearchTerm, sorting, handleSort, handleSearchKeyDown } =
    useSearchAndPagination({
      initialSortField: 'effective_from',
      fetchData: fetchDataMemoized
    });

  useEffect(() => {
    fetchBudgetsHandler({
      page: currentPage,
      limit: 5
    });
  }, [fetchBudgetsHandler, currentPage]);

  const handleCreateBudget = async (values: BudgetFormValues) => {
    try {
      const formattedDateEffectiveFrom = values.effective_from.includes('T')
        ? values.effective_from.split('T')[0]
        : values.effective_from;
      const formattedDateEffectiveTo = values.effective_to.includes('T')
        ? values.effective_to.split('T')[0]
        : values.effective_to;

      const budgetData: BudgetFormValues = {
        ...values,
        category_id: values.category,
        effective_from: formattedDateEffectiveFrom,
        effective_to: formattedDateEffectiveTo
      };

      const resultAction = await dispatch(createBudget(budgetData));

      if (createBudget.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || 'Anggaran berhasil dibuat',
            type: 'success'
          })
        );

        await fetchBudgetsHandler({
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
      console.error('Failed to create budget:', error);
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Gagal membuat pemasukan',
          type: 'error'
        })
      );
    }
  };

  const handleUpdateBudget = async (values: BudgetFormValues) => {
    if (!selectedBudget) return;

    setIsFormSubmitted(false);
    try {
      const formattedDateEffectiveFrom = values.effective_from.includes('T')
        ? values.effective_from.split('T')[0]
        : values.effective_from;
      const formattedDateEffectiveTo = values.effective_to.includes('T')
        ? values.effective_to.split('T')[0]
        : values.effective_to;

      const budgetData: BudgetFormValues = {
        ...values,
        category_id: values.category,
        effective_from: formattedDateEffectiveFrom,
        effective_to: formattedDateEffectiveTo
      };

      const resultAction = await dispatch(
        updateBudget({ id: selectedBudget.id, data: budgetData })
      );

      if (updateBudget.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || 'Pemasukan berhasil diperbarui',
            type: 'success'
          })
        );

        await fetchBudgetsHandler({
          page: pagination.current_page,
          limit: 5,
          search: searchTerm,
          sort_by: sorting?.field,
          sort_dir: sorting?.direction
        });

        setIsFormSubmitted(true);
        setIsEditDrawerOpen(false);
        setSelectedBudget(null);
      }
    } catch (error) {
      console.error('Failed to update budget:', error);
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Gagal memperbarui anggaran',
          type: 'error'
        })
      );
    }
  };

  const handleDeleteBudget = async () => {
    if (!selectedBudget) return;

    try {
      const resultAction = await dispatch(deleteBudget(selectedBudget.id));

      if (deleteBudget.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || 'Pemasukan berhasil dihapus',
            type: 'success'
          })
        );

        await fetchBudgetsHandler({
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
              (resultAction.payload as string) || 'Gagal menghapus pemasukan. Silakan coba lagi.'
          })
        );
      }
      setIsDeleteDialogOpen(false);
      setSelectedBudget(null);
    } catch (error) {
      console.error('Failed to delete budget:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Gagal menghapus anggaran. Silakan coba lagi.'
        })
      );
    }
  };

  const columns: TableColumn<Budget>[] = useMemo(
    () => [
      {
        title: 'Tanggal Mulai',
        field: 'effective_from',
        sortable: true,
        Cell: ({ entry }) => {
          const date = new Date(entry.effective_from);
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
        title: 'Tanggal Akhir',
        field: 'effective_to',
        sortable: true,
        Cell: ({ entry }) => {
          const date = new Date(entry.effective_to);
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
                setSelectedBudget(entry);
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
                setSelectedBudget(entry);
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
            Pengaturan Anggaran
          </h1>

          <FormDrawer
            isDone={!isLoading}
            title="Tambah Anggaran"
            isOpen={isAddDrawerOpen}
            onOpenChange={(open) => {
              setIsAddDrawerOpen(open);
              if (!open) {
                setIsFormSubmitted(false);
              }
            }}
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

        <div className="mt-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari Anggaran..."
            className="max-w-sm"
          />
        </div>

        <FormDrawer
          isDone={isFormSubmitted}
          title="Edit Anggaran"
          isOpen={isEditDrawerOpen}
          onOpenChange={(open) => {
            setIsEditDrawerOpen(open);
            if (!open) {
              setIsFormSubmitted(false);
            }
          }}
          triggerButton={null}
          submitButton={
            <Button type="submit" form="budget-edit-form" isLoading={isLoading}>
              Update
            </Button>
          }
        >
          {selectedBudget && (
            <BudgetForm
              key={`edit-budget-${selectedBudget.id}`}
              id="budget-edit-form"
              onSubmit={handleUpdateBudget}
              isLoading={isLoading}
              initialValues={{
                amount: selectedBudget.amount,
                category: selectedBudget.category_id || selectedBudget.category,
                // date: new Date(selectedBudget.date).toISOString().split('T')[0],
                effective_from: new Date(selectedBudget.effective_from).toISOString().split('T')[0],
                effective_to: new Date(selectedBudget.effective_to).toISOString().split('T')[0],
                is_active: selectedBudget.is_active
              }}
            />
          )}
        </FormDrawer>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Anggaran</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedBudget ? (
                  <>
                    Apakah anda yakin ingin menghapus pemasukan{' '}
                    <strong>"{selectedBudget.amount}"</strong> dengan jumlah{' '}
                    <strong>Rp {selectedBudget.amount.toLocaleString('id-ID')}</strong>?
                  </>
                ) : (
                  'Apakah anda yakin ingin menghapus pemasukan ini?'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBudget}
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
            data={budgets}
            columns={columns}
            sorting={{
              state: sorting,
              onSort: handleSort
            }}
            pagination={
              pagination && {
                currentPage: pagination.current_page,
                totalPages: pagination.total_pages,
                rootUrl: '/budget'
              }
            }
            isLoading={isLoading}
          />
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};
