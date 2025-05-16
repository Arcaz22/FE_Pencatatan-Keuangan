import { Table, TableColumn } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Budget } from '@/types/api';
import { expenseCategoryDisplay } from '@/lib/mock-data';
import { cn } from '@/utils/cn';

type BudgetTableProps = {
  data: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
};

export const BudgetTable = ({ data, onEdit, onDelete }: BudgetTableProps) => {
  const columns: TableColumn<Budget>[] = [
    {
      title: 'Kategori',
      field: 'categoryId',
      Cell: ({ entry }) => {
        const category =
          expenseCategoryDisplay[entry.categoryId as keyof typeof expenseCategoryDisplay];
        return (
          <div className="flex items-center">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-[hsl(var(--text-white))]',
                category?.color
              )}
            >
              {category?.label}
            </span>
          </div>
        );
      }
    },
    {
      title: 'Batas Anggaran',
      field: 'amount',
      Cell: ({ entry }) => (
        <div className="font-medium">Rp {entry.amount.toLocaleString('id-ID')}</div>
      )
    },
    {
      title: 'Terpakai',
      field: 'spent',
      Cell: ({ entry }) => (
        <div className="font-medium">Rp {entry.spent.toLocaleString('id-ID')}</div>
      )
    },
    {
      title: 'Periode',
      field: 'month',
      Cell: ({ entry }) => (
        <div>
          {new Date(0, entry.month - 1).toLocaleString('id-ID', { month: 'long' })} {entry.year}
        </div>
      )
    },
    {
      title: 'Actions',
      field: 'id',
      Cell: ({ entry }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
            <Pencil className="size-4 text-[hsl(var(--text-secondary))]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(entry)}>
            <Trash2 className="size-4 text-[hsl(var(--bg-destructive))]" />
          </Button>
        </div>
      )
    }
  ];

  return <Table data={data} columns={columns} />;
};
