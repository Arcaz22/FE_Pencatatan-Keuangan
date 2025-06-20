import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './use-debounce';
import { SortingState } from '@/components/ui/table';

export interface SearchPaginationParams<T = string> {
  page: number;
  limit: number;
  search?: string;
  sort_by: string;
  sort_dir: 'asc' | 'desc';
  type?: T;
}

type SearchAndPaginationOptions<T = string> = {
  initialSortField?: string;
  initialSortDirection?: 'asc' | 'desc';
  initialLimit?: number;
  fetchData?: (params: SearchPaginationParams<T>) => Promise<void>;
  type?: T;
};

export function useSearchAndPagination<T = string>(options: SearchAndPaginationOptions<T>) {
  const {
    initialSortField = 'name',
    initialSortDirection = 'asc',
    initialLimit = 10,
    fetchData,
    type
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const debouncedSearchTerm = useDebounce(normalizedSearchTerm, 500);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(initialLimit);

  const [sorting, setSorting] = useState<SortingState>({
    field: initialSortField,
    direction: initialSortDirection
  });

  const isMountedRef = useRef(true);

  const lastFetchTimeRef = useRef(0);
  const throttleInterval = 500;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!fetchData) return;

    const now = Date.now();

    if (now - lastFetchTimeRef.current < throttleInterval) return;

    lastFetchTimeRef.current = now;

    fetchData({
      page: currentPage,
      limit,
      search: debouncedSearchTerm,
      sort_by: sorting.field,
      sort_dir: sorting.direction,
      type
    }).catch((err) => {
      if (isMountedRef.current) {
        console.error('Error fetching data:', err);
      }
    });
  }, [debouncedSearchTerm, currentPage, sorting.field, sorting.direction, limit, fetchData, type]);

  const handleSort = useCallback((field: string) => {
    setSorting((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && fetchData) {
        setCurrentPage(1);
        fetchData({
          page: 1,
          limit,
          search: normalizedSearchTerm,
          sort_by: sorting.field,
          sort_dir: sorting.direction,
          type
        });
      }
    },
    [fetchData, limit, normalizedSearchTerm, sorting.field, sorting.direction, type]
  );

  const filterData = useCallback(
    <ItemType>(data: ItemType[], getSearchableText: (item: ItemType) => string) => {
      if (!searchTerm.trim()) return data;

      return data.filter((item) => {
        const text = getSearchableText(item).toLowerCase();
        return text.includes(normalizedSearchTerm);
      });
    },
    [normalizedSearchTerm, searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    limit,
    sorting,

    handleSort,
    handlePageChange,
    handleSearchKeyDown,
    filterData,

    // Search parameters for API calls
    searchParams: {
      page: currentPage,
      limit,
      search: debouncedSearchTerm,
      sort_by: sorting.field,
      sort_dir: sorting.direction,
      type
    }
  };
}
