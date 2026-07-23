import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { DataTablePaginationCommon } from "@/components/common/DataTablePaginationCommon";
import { DataTableViewOptionsCommon } from "@/components/common/DataTableViewOptionsCommon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { cn } from "@/lib/utils";

export type DataTableFilter = {
  name: string;
  count: number;
};

function getColumnId<TData, TValue>(column: ColumnDef<TData, TValue>) {
  if (column.id) return column.id;
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey;
  }
  return undefined;
}

function isActionsColumnId(id: string | undefined) {
  return id === "actions";
}

/** Keep the Actions column pinned as the last column. */
function pinActionsColumnLast<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
): ColumnDef<TData, TValue>[] {
  const actions: ColumnDef<TData, TValue>[] = [];
  const rest: ColumnDef<TData, TValue>[] = [];

  for (const column of columns) {
    if (isActionsColumnId(getColumnId(column))) {
      actions.push(column);
    } else {
      rest.push(column);
    }
  }

  return actions.length > 0 ? [...rest, ...actions] : columns;
}

type DataTableCommonProps<TData, TValue> = {
  filters?: DataTableFilter[];
  selectedFilter?: string;
  setSelectedFilter?: (name: string) => void;
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  isLoading?: boolean;
  totalDataCount?: number;
  onFetchData?: (offset: number, limit: number) => void;
  onTableInstanceChange?: (table: TanstackTable<TData>) => void;
  fillViewport?: boolean;
  className?: string;
  emptyMessage?: string;
};

export function DataTableCommon<TData, TValue>({
  filters = [],
  selectedFilter,
  setSelectedFilter,
  columns,
  data = [],
  isLoading = false,
  totalDataCount = 0,
  onFetchData,
  onTableInstanceChange,
  fillViewport = true,
  className,
  emptyMessage = "No results.",
}: DataTableCommonProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [tablePagination, setTablePagination] = useState<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const { ref: viewportRef, height: viewportHeight } = useFillViewportHeight(
    20,
    fillViewport,
  );
  const pageSize = tablePagination.pageSize;
  const pageIndex = tablePagination.pageIndex;
  const totalPages = Math.max(1, Math.ceil(totalDataCount / pageSize) || 1);
  const orderedColumns = useMemo(
    () => pinActionsColumnLast(columns),
    [columns],
  );

  useEffect(() => {
    const offset = tablePagination.pageIndex * tablePagination.pageSize;
    const limit = tablePagination.pageSize;
    onFetchData?.(offset, limit);
  }, [tablePagination.pageIndex, tablePagination.pageSize, onFetchData]);

  const onPageSizeChange = (newPageSize: number) => {
    setTablePagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 0,
    }));
  };

  const onPageChange = (newPageIndex: number) => {
    setTablePagination((prev) => ({
      ...prev,
      pageIndex: newPageIndex,
    }));
  };

  const table = useReactTable({
    data,
    columns: orderedColumns,
    manualPagination: true,
    pageCount: totalPages,
    enableRowSelection: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater({
          pageIndex,
          pageSize,
        });

        if (newPagination.pageIndex !== pageIndex) {
          onPageChange(newPagination.pageIndex);
        }

        if (newPagination.pageSize !== pageSize) {
          onPageSizeChange(newPagination.pageSize);
        }
      }
    },
  });

  useEffect(() => {
    onTableInstanceChange?.(table);
  }, [table, onTableInstanceChange]);

  return (
    <TooltipProvider delayDuration={200}>
    <div
      ref={fillViewport ? viewportRef : undefined}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm",
        fillViewport ? "mt-0" : "mt-0 min-h-0 flex-1 basis-0",
        className,
      )}
      style={
        fillViewport && viewportHeight ? { height: viewportHeight } : undefined
      }
    >
      {filters.length > 0 ? (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border p-2">
          <div className="flex items-center rounded-md border border-border">
            {filters.map((filter, index) => (
              <Button
                key={filter.name}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFilter?.(filter.name)}
                className={cn(
                  "rounded-none! flex items-center gap-2",
                  selectedFilter === filter.name ? "bg-muted" : "bg-transparent",
                  index !== filters.length - 1 ? "border-r border-border" : null,
                )}
              >
                <span>{filter.name}</span>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md text-xs",
                    selectedFilter === filter.name
                      ? "bg-navy text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {filter.count}
                </span>
              </Button>
            ))}
          </div>

          <DataTableViewOptionsCommon table={table} />
        </div>
      ) : null}

      <div className="h-0 min-h-0 flex-1 basis-0 overflow-x-auto overflow-y-auto">
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted/60 [&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  const isLast = index === headerGroup.headers.length - 1;
                  const isActions = isActionsColumnId(header.column.id);
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "bg-muted/60 text-muted-foreground shadow-[0_1px_0_0_var(--color-line)]",
                        isFirst && "pl-8",
                        isLast && "pr-8",
                        isActions && "w-[1%] text-right whitespace-nowrap",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="pl-8 pr-8">
                  <div className="flex flex-col gap-2 py-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const isFirst = index === 0;
                    const isLast =
                      index === row.getVisibleCells().length - 1;
                    const isActions = isActionsColumnId(cell.column.id);
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          isFirst && "pl-8",
                          isLast && "pr-8",
                          isActions && "w-[1%] text-right whitespace-nowrap",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 pl-8 pr-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>

      <div className="shrink-0 border-t border-border bg-background">
        <DataTablePaginationCommon
          table={table}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
          totalCount={totalDataCount}
          currentDataCount={data.length}
        />
      </div>
    </div>
    </TooltipProvider>
  );
}
