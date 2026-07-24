import { useState } from "react";
import type { Table } from "@tanstack/react-table";

export function useTableInstance<TData>() {
  const [tableInstance, setTableInstance] = useState<Table<TData> | null>(null);

  const resetRowSelection = () => {
    tableInstance?.resetRowSelection();
  };

  return { tableInstance, setTableInstance, resetRowSelection };
}
