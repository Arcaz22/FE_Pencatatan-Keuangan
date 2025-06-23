import { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableColumn } from '@/components/ui/table';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { IncomeForm } from '@/features/income/income-form';
import { Income, IncomeFormValues, QueryParams } from '@/types/api';
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
  fetchIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
  selectIncomes,
  selectIncomeLoading,
  selectIncomePagination
} from '@/stores/slices/incomeSlice';
import { useSearchParams } from 'react-router-dom';
import { incomeCategoryDisplay } from '@/lib/mock-data';

export const IncomePage = () => {
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const dispatch = useAppDispatch();
  const incomes = useAppSelector(selectIncomes);
  const isLoading = useAppSelector(selectIncomeLoading);
  const pagination = useAppSelector(selectIncomePagination);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchIncomesHandler = useCallback(
    async (params: QueryParams) => {
      await dispatch(fetchIncomes(params));
    },
    [dispatch]
  );

  const fetchDataMemoized = useCallback(
    async (params: SearchPaginationParams<void>): Promise<void> => {
      return fetchIncomesHandler({
        page: params.page,
        limit: 5,
        search: params.search,
        sort_by: params.sort_by,
        sort_dir: params.sort_dir
      });
    },
    [fetchIncomesHandler]
  );

  const { searchTerm, setSearchTerm, sorting, handleSort, handleSearchKeyDown } =
    useSearchAndPagination({
      initialSortField: 'date',
      fetchData: fetchDataMemoized
    });

  useEffect(() => {
    fetchIncomesHandler({
      page: currentPage,
      limit: 5
    });
  }, [fetchIncomesHandler, currentPage]);

  const handleCreateIncome = async (values: IncomeFormValues) => {
    try {
      const formattedDate = values.date.includes('T') ? values.date.split('T')[0] : values.date;

      const incomeData: IncomeFormValues = {
        ...values,
        category_id: values.category,
        date: formattedDate
      };

      const resultAction = await dispatch(createIncome(incomeData));

      if (createIncome.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message:
              resultAction.payload.message || `Pemasukan "${values.description}" berhasil dibuat`,
            type: 'success'
          })
        );

        await fetchIncomesHandler({
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
      console.error('Failed to create income:', error);
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Gagal membuat pemasukan',
          type: 'error'
        })
      );
    }
  };

  const handleUpdateIncome = async (values: IncomeFormValues) => {
    if (!selectedIncome) return;

    setIsFormSubmitted(false);
    try {
      const formattedDate = values.date.includes('T') ? values.date.split('T')[0] : values.date;

      const incomeData: IncomeFormValues = {
        ...values,
        category_id: values.category,
        date: formattedDate
      };

      const resultAction = await dispatch(
        updateIncome({ id: selectedIncome.id, data: incomeData })
      );

      if (updateIncome.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || 'Pemasukan berhasil diperbarui',
            type: 'success'
          })
        );

        await fetchIncomesHandler({
          page: pagination.current_page,
          limit: 5,
          search: searchTerm,
          sort_by: sorting?.field,
          sort_dir: sorting?.direction
        });

        setIsFormSubmitted(true);
        setIsEditDrawerOpen(false);
        setSelectedIncome(null);
      }
    } catch (error) {
      console.error('Failed to update income:', error);
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Gagal memperbarui pemasukan',
          type: 'error'
        })
      );
    }
  };

  const handleDeleteIncome = async () => {
    if (!selectedIncome) return;

    try {
      const resultAction = await dispatch(deleteIncome(selectedIncome.id));

      if (deleteIncome.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || 'Pemasukan berhasil dihapus',
            type: 'success'
          })
        );

        await fetchIncomesHandler({
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
      setSelectedIncome(null);
    } catch (error) {
      console.error('Failed to delete income:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Gagal menghapus pemasukan. Silakan coba lagi.'
        })
      );
    }
  };

  const columns: TableColumn<Income>[] = useMemo(
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
    ],
    []
  );

  return (
    <DashboardLayout>
      <ContentLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
            Daftar Pemasukan
          </h1>

          <FormDrawer
            isDone={isFormSubmitted}
            title="Tambah Pemasukan"
            isOpen={isAddDrawerOpen}
            onOpenChange={(open) => {
              setIsAddDrawerOpen(open);
              if (!open) {
                setIsFormSubmitted(false);
              }
            }}
            triggerButton={<Button icon={<Plus className="size-4" />}>Tambah Pemasukan</Button>}
            submitButton={
              <Button type="submit" form="income-form" isLoading={isLoading}>
                Simpan
              </Button>
            }
          >
            <IncomeForm onSubmit={handleCreateIncome} isLoading={isLoading} />
          </FormDrawer>
        </div>

        <div className="mt-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari pemasukan..."
            className="max-w-sm"
          />
        </div>

        <FormDrawer
          isDone={isFormSubmitted}
          title="Edit Pemasukan"
          isOpen={isEditDrawerOpen}
          onOpenChange={(open) => {
            setIsEditDrawerOpen(open);
            if (!open) {
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
              isLoading={isLoading}
              initialValues={{
                amount: selectedIncome.amount,
                category: selectedIncome.category_id || selectedIncome.category,
                date: new Date(selectedIncome.date).toISOString().split('T')[0],
                description: selectedIncome.description
              }}
            />
          )}
        </FormDrawer>

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
          <Table
            data={incomes}
            columns={columns}
            sorting={{
              state: sorting,
              onSort: handleSort
            }}
            pagination={
              pagination && {
                currentPage: pagination.current_page,
                totalPages: pagination.total_pages,
                rootUrl: '/income'
              }
            }
            isLoading={isLoading}
          />
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};

export default IncomePage;
