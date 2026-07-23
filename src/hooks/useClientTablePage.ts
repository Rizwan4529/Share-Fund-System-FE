import { useCallback, useState } from "react";

/**
 * Client-side slice helper for DataTableCommon's manualPagination contract.
 * Keeps full dataset in memory; exposes the current page slice + onFetchData.
 */
export function useClientTablePage<T>(allRows: T[]) {
  const [pageRows, setPageRows] = useState<T[]>([]);

  const onFetchData = useCallback(
    (offset: number, limit: number) => {
      setPageRows(allRows.slice(offset, offset + limit));
    },
    [allRows],
  );

  return {
    pageRows,
    totalDataCount: allRows.length,
    onFetchData,
  };
}
