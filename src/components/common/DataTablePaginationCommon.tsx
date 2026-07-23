import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataTablePaginationCommonProps<TData> = {
  table: Table<TData>;
  pageIndex: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (pageIndex: number) => void;
  totalCount?: number;
  currentDataCount?: number;
};

export function DataTablePaginationCommon<TData>({
  table,
  pageIndex,
  pageSize,
  onPageSizeChange,
  onPageChange,
  totalCount = 0,
  currentDataCount = 0,
}: DataTablePaginationCommonProps<TData>) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  return (
    <div className="flex flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of {currentDataCount}{" "}
        row(s) selected.
      </div>
      <div className="flex flex-wrap items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageIndex + 1} of {Math.max(1, totalPages)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-xs"
            className="hidden lg:flex"
            onClick={() => onPageChange(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            className="hidden lg:flex"
            onClick={() => onPageChange(Math.max(0, totalPages - 1))}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
