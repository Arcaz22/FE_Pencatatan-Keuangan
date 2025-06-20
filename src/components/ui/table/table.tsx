import { ArchiveX, ArrowUpDown } from 'lucide-react';
import * as React from 'react';

import { BaseEntity } from '@/types/api';
import { cn } from '@/utils/cn';

import { TablePagination, TablePaginationProps } from './pagination';

const TableElement = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-lg border border-slate-200 shadow-sm">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
);
TableElement.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-slate-50 border-b border-slate-200', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('divide-y divide-slate-200 [&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-slate-200 bg-slate-50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn('transition-colors hover:bg-slate-50', className)} {...props} />
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-6 py-4 align-middle', className)} {...props} />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-slate-500', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

export {
  TableElement,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};

export type TableColumn<Entry> = {
  title: React.ReactNode | string;
  field: keyof Entry;
  sortable?: boolean;
  Cell?({ entry }: { entry: Entry }): React.ReactElement;
};

export type SortingState = {
  field: string;
  direction: 'asc' | 'desc';
};

export type TableProps<Entry> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
  pagination?: TablePaginationProps;
  sorting?: {
    state?: SortingState;
    onSort?: (field: string) => void;
  };
  isLoading?: boolean;
};

export const Table = <Entry extends BaseEntity>({
  data,
  columns,
  pagination,
  sorting,
  isLoading = false
}: TableProps<Entry>) => {
  if (isLoading) {
    return (
      <div className="flex h-60 flex-col items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
        <h4 className="mt-2 text-sm font-medium">Memuat data...</h4>
      </div>
    );
  }
  if (!data?.length) {
    return (
      <div className="flex h-60 flex-col items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <ArchiveX className="size-12" />
        <h4 className="mt-2 text-sm font-medium">Tidak ada data</h4>
      </div>
    );
  }

  const renderColumnTitle = (column: TableColumn<Entry>) => {
    if (!column.sortable || !sorting || !sorting.onSort) {
      return column.title;
    }

    const isActive = sorting.state ? sorting.state.field === String(column.field) : false;
    const direction = isActive && sorting.state ? sorting.state.direction : undefined;

    return (
      <div
        className="flex items-center cursor-pointer"
        onClick={() => sorting.onSort?.(String(column.field))}
      >
        <span>{column.title}</span>
        <ArrowUpDown className="ml-2 size-4" />
        {isActive && <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>}
      </div>
    );
  };

  return (
    <>
      <TableElement>
        <TableHeader>
          <TableRow>
            {columns.map((column, colIndex) => (
              <TableHead key={`${String(column.field)}-${colIndex}`}>
                {renderColumnTitle(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, entryIndex) => (
            <TableRow key={entry?.id || entryIndex}>
              {columns.map(({ Cell, field, title }, columnIndex) => (
                <TableCell key={String(title) + columnIndex}>
                  {Cell ? <Cell entry={entry} /> : `${entry[field]}`}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableElement>

      {pagination && (
        <div className="mt-2">
          <TablePagination {...pagination} />
        </div>
      )}
    </>
  );
};
