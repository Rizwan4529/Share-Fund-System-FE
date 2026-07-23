import { useMemo } from "react";

export function filterRowsBySearch<T>(
  rows: T[],
  query: string,
  getHaystack: (row: T) => string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => getHaystack(row).toLowerCase().includes(q));
}

/** Client-side text filter for admin table toolbars. */
export function useAdminTableSearch<T>(
  rows: T[],
  query: string,
  getHaystack: (row: T) => string,
) {
  return useMemo(
    () => filterRowsBySearch(rows, query, getHaystack),
    // getHaystack is expected to be a stable inline identity per render usage;
    // pages should wrap with useCallback or keep a simple field extractor.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- haystack fn is intentional per-call
    [rows, query],
  );
}
