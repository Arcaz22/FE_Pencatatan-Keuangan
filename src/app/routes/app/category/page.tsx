import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableColumn } from '@/components/ui/table';
import { Category, CategoryFormValues } from '@/types/api';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { FormDrawer } from '@/components/ui/form';
import { useState } from 'react';
import { CategoryForm } from '@/features/category/category-form';

type CategoryPageProps = {
  type: 'income' | 'expense';
  categories: Category[];
};

const columns: TableColumn<Category>[] = [
  {
    title: 'Nama Kategori',
    field: 'name',
    Cell: ({ entry }) => (
      <div className="flex flex-col">
        <span className="font-medium text-[hsl(var(--text-primary))]">{entry.name}</span>
      </div>
    )
  },
  {
    title: 'Keterangan',
    field: 'description',
    Cell: ({ entry }) => (
      <div className="flex flex-col">
        <span className="font-medium text-[hsl(var(--text-primary))]">{entry.description}</span>
      </div>
    )
  },
  {
    title: 'Actions',
    field: 'id',
    Cell: (
      { entry: category } // renamed entry to category to be more descriptive
    ) => (
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log('Edit category:', category.id)}
        >
          <Pencil className="size-4 text-[hsl(var(--text-secondary))]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => console.log('Delete category:', category.id)}
        >
          <Trash2 className="size-4 text-[hsl(var(--bg-destructive))]" />
        </Button>
      </div>
    )
  }
];

export const CategoryPage = ({ type, categories }: CategoryPageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCategory = async (values: CategoryFormValues) => {
    setIsLoading(true);
    try {
      console.log(values);
    } finally {
      setIsLoading(false);
    }
  };

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
            <CategoryForm onSubmit={handleCreateCategory} isLoading={isLoading} />
          </FormDrawer>
        </div>

        <div className="mt-8">
          <Table data={categories} columns={columns} />
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};
