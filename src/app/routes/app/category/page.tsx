import { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableColumn } from '@/components/ui/table';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { CategoryForm } from '@/features/category/category-form';
import { Category, CategoryFormValues, CategoryType, CategoryQueryParams } from '@/types/api';
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
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  selectCategories,
  selectCategoryLoading,
  selectCategoryPagination
} from '@/stores/slices/categorySlice';
import { useSearchParams } from 'react-router-dom';

type CategoryPageProps = {
  type: CategoryType;
};

export const CategoryPage = ({ type }: CategoryPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoryLoading);
  const pagination = useAppSelector(selectCategoryPagination);
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const fetchCategoriesHandler = useCallback(
    async (params: CategoryQueryParams) => {
      await dispatch(fetchCategories(params));
    },
    [dispatch]
  );

  const fetchDataMemoized = useCallback(
    async (params: SearchPaginationParams<CategoryType>): Promise<void> => {
      return fetchCategoriesHandler({
        page: params.page,
        limit: 5,
        search: params.search,
        sort_by: params.sort_by,
        sort_dir: params.sort_dir,
        type: params.type
      });
    },
    [fetchCategoriesHandler]
  );

  const { searchTerm, setSearchTerm, sorting, handleSort, handleSearchKeyDown } =
    useSearchAndPagination<CategoryType>({
      initialSortField: 'name',
      fetchData: fetchDataMemoized,
      type
    });

  useEffect(() => {
    fetchCategoriesHandler({
      page: currentPage,
      limit: 5,
      type
    });
  }, [fetchCategoriesHandler, type, currentPage]);

  const handleCreateCategory = async (values: CategoryFormValues) => {
    try {
      const categoryData: CategoryFormValues = {
        ...values,
        type,
        description: values.description || ''
      };

      const resultAction = await dispatch(createCategory(categoryData));

      if (createCategory.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            message: resultAction.payload.message || `Kategori "${values.name}" berhasil dibuat`,
            type: 'success'
          })
        );

        await fetchCategoriesHandler({
          page: pagination?.current_page || 1,
          limit: 5,
          type
        });
      }
    } catch (error) {
      console.error('Gagal membuat kategori:', error);
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Gagal membuat kategori',
          type: 'error'
        })
      );
    }
  };

  const handleUpdateCategory = async (values: CategoryFormValues) => {
    if (!selectedCategory) return;

    setIsFormSubmitted(false);
    try {
      const categoryData: CategoryFormValues = {
        ...values,
        type,
        description: values.description || ''
      };

      const resultAction = await dispatch(
        updateCategory({ id: selectedCategory.id, data: categoryData })
      );

      if (updateCategory.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            type: 'success',
            message: resultAction.payload.message || `Kategori "${values.name}" berhasil diperbarui`
          })
        );

        await fetchCategoriesHandler({
          page: pagination?.current_page || 1,
          limit: 5,
          type
        });

        setIsFormSubmitted(true);
        setIsEditDrawerOpen(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Gagal memperbarui kategori:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: error instanceof Error ? error.message : 'Gagal memperbarui kategori'
        })
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      const categoryName = selectedCategory.name;

      // Add logging for debugging
      console.log('Deleting category:', selectedCategory.id);

      const resultAction = await dispatch(deleteCategory(selectedCategory.id));
      console.log('Delete category result:', resultAction);

      // Check if the action was fulfilled or rejected
      if (deleteCategory.fulfilled.match(resultAction)) {
        dispatch(
          showNotification({
            type: 'success',
            message: resultAction.payload.message || `Kategori "${categoryName}" berhasil dihapus`
          })
        );

        // Optionally refresh the categories list
        await fetchCategoriesHandler({
          page: pagination?.current_page || 1,
          limit: 5,
          type
        });
      } else {
        // This block will run if the action was rejected
        dispatch(
          showNotification({
            type: 'error',
            message:
              (resultAction.payload as string) || 'Gagal menghapus kategori. Silakan coba lagi.'
          })
        );
      }

      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error in handleDeleteCategory:', error);
      dispatch(
        showNotification({
          type: 'error',
          message: 'Gagal menghapus kategori. Silakan coba lagi.'
        })
      );
      setIsDeleteDialogOpen(false);
    }
  };

  const columns: TableColumn<Category>[] = useMemo(
    () => [
      {
        title: 'Nama Kategori',
        field: 'name',
        sortable: true,
        Cell: ({ entry }) => (
          <div className="flex flex-col">
            <span className="font-medium text-[hsl(var(--text-primary))]">{entry.name}</span>
          </div>
        )
      },
      {
        title: 'Keterangan',
        field: 'description',
        sortable: true,
        Cell: ({ entry }) => (
          <div className="flex flex-col">
            <span className="font-medium text-[hsl(var(--text-primary))]">{entry.description}</span>
          </div>
        )
      },
      {
        title: 'Actions',
        field: 'id',
        Cell: ({ entry: category }) => (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedCategory(category);
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
                setSelectedCategory(category);
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

  const pageTitle = type === 'income' ? 'Kategori Pemasukan' : 'Kategori Pengeluaran';

  return (
    <DashboardLayout>
      <ContentLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[hsl(var(--text-primary))]">{pageTitle}</h1>
          <FormDrawer
            isDone={!isLoading}
            title={`Tambah ${pageTitle}`}
            triggerButton={<Button icon={<Plus className="size-4" />}>Tambah Kategori</Button>}
            submitButton={
              <Button type="submit" form="category-form" isLoading={isLoading}>
                Simpan
              </Button>
            }
          >
            <CategoryForm
              onSubmit={handleCreateCategory}
              isLoading={isLoading}
              defaultType={type}
            />
          </FormDrawer>

          <FormDrawer
            isDone={isFormSubmitted}
            title={`Edit ${pageTitle}`}
            isOpen={isEditDrawerOpen}
            onOpenChange={(open) => {
              setIsEditDrawerOpen(open);
              if (!open) {
                setIsFormSubmitted(false);
              }
            }}
            triggerButton={null}
            submitButton={
              <Button type="submit" form="category-edit-form" isLoading={isLoading}>
                Update
              </Button>
            }
          >
            {selectedCategory && (
              <CategoryForm
                key={`edit-category-${selectedCategory.id}`}
                id="category-edit-form"
                onSubmit={handleUpdateCategory}
                isLoading={isLoading}
                defaultType={type}
                initialValues={{
                  name: selectedCategory.name,
                  description: selectedCategory.description || '',
                  type: selectedCategory.type
                }}
              />
            )}
          </FormDrawer>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedCategory ? (
                    <>
                      Apakah anda yakin ingin menghapus kategori{' '}
                      <strong>"{selectedCategory.name}"</strong>?
                    </>
                  ) : (
                    'Apakah anda yakin ingin menghapus kategori ini?'
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteCategory}
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
        </div>

        <div className="mt-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari kategori..."
            className="max-w-sm"
          />
        </div>

        <div className="mt-8">
          <Table
            data={categories}
            columns={columns}
            sorting={{
              state: sorting,
              onSort: handleSort
            }}
            pagination={
              pagination && {
                currentPage: pagination.current_page,
                totalPages: pagination.total_pages,
                rootUrl: `/category/${type}`
              }
            }
            isLoading={isLoading}
          />
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};
