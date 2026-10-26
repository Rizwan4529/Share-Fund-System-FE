import { useCallback, useState } from "react";
import type { SortingState } from "@tanstack/react-table";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ALL_FILTER } from "@/lib/admin-participants/labels";

type SortOrder = "asc" | "desc";

/** A filter value of ALL_FILTER or "" means "not filtered". */
type ActiveFilters<F extends Record<string, string>> = {
  [K in keyof F]?: Exclude<F[K], typeof ALL_FILTER | "">;
};

/**
 * State for a server-paginated admin table (DataTableCommon): debounced
 * search, filters, sorting and paging. Any search/filter/sort change jumps
 * back to page 1 — reset during render, so no request goes out for a stale
 * page. Pass `initialFilters` / `sortableColumns` as module-level constants.
 */
export function useServerTableState<
  F extends Record<string, string>,
  S extends string,
>({
  initialFilters,
  sortableColumns,
}: {
  initialFilters: F;
  /** Table column id → API sortBy value. */
  sortableColumns: Record<string, S>;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [filters, setFilters] = useState<F>(initialFilters);
  const [sort, setSort] = useState<{ sortBy?: S; sortOrder?: SortOrder }>({});
  const [paging, setPaging] = useState({ offset: 0, limit: 10 });

  const queryKey = JSON.stringify([debouncedSearch, filters, sort]);
  const [prevQueryKey, setPrevQueryKey] = useState(queryKey);
  if (queryKey !== prevQueryKey) {
    setPrevQueryKey(queryKey);
    setPaging((prev) => ({ ...prev, offset: 0 }));
  }

  const onFetchData = useCallback((offset: number, limit: number) => {
    setPaging({ offset, limit });
  }, []);

  const onSortingChange = useCallback(
    (sorting: SortingState) => {
      const [first] = sorting;
      const sortBy = first ? sortableColumns[first.id] : undefined;
      setSort(first && sortBy ? { sortBy, sortOrder: first.desc ? "desc" : "asc" } : {});
    },
    [sortableColumns],
  );

  const setFilter = <K extends keyof F>(key: K, value: F[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => {
    setSearch("");
    setFilters(initialFilters);
  };

  const hasFilters =
    Boolean(search.trim()) ||
    (Object.keys(filters) as (keyof F)[]).some(
      (key) => filters[key] !== initialFilters[key],
    );

  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== ALL_FILTER && value !== ""),
  ) as ActiveFilters<F>;

  return {
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    hasFilters,
    /** Changes whenever page 1 should be shown — pass as pageResetKey. */
    queryKey,
    onFetchData,
    onSortingChange,
    args: {
      page: Math.floor(paging.offset / paging.limit) + 1,
      limit: paging.limit,
      search: debouncedSearch || undefined,
      ...activeFilters,
      ...sort,
    },
  };
}

/** "2026-10-04" → ISO at the start / end of that local day (inclusive range). */
export const dayStartIso = (day?: string) =>
  day ? new Date(`${day}T00:00:00`).toISOString() : undefined;
export const dayEndIso = (day?: string) =>
  day ? new Date(`${day}T23:59:59.999`).toISOString() : undefined;

/** List args without page/limit — e.g. to export everything matching the filters. */
export function withoutPaging<T extends object>(args: T): Omit<T, "page" | "limit"> {
  const rest = { ...args } as Record<string, unknown>;
  delete rest.page;
  delete rest.limit;
  return rest as Omit<T, "page" | "limit">;
}
