import { Download } from "lucide-react";
import { toast } from "sonner";

import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useExportAdminDataMutation } from "@/store/api/adminReportsApi";
import type { ExportDataset } from "@/types/adminOverview";

const BOM = "﻿";

/**
 * Saves CSV text as a file via a temporary object URL. response.text() strips
 * the server's UTF-8 BOM, so it's re-added — Excel needs it to read accents.
 */
function saveFile(filename: string, text: string) {
  const csv = text.startsWith(BOM) ? text : BOM + text;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  // Revoke after the click has been handled (some browsers need a tick).
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Downloads a CSV of the dataset using the page's CURRENT filters (no paging),
 * so the file matches what the admin is viewing. Each export is audit-logged.
 */
export function AdminExportButton({
  dataset,
  params,
}: {
  dataset: ExportDataset;
  /** The list's filters/sort, without page/limit. */
  params: object;
}) {
  const [exportData, state] = useExportAdminDataMutation();

  const onExport = async () => {
    try {
      const result = await exportData({ dataset, params }).unwrap();
      saveFile(result.filename, result.csv);
      toast.success(
        result.rowCount != null
          ? `Exported ${result.rowCount} ${result.rowCount === 1 ? "row" : "rows"}.`
          : "Export downloaded.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not export this data."));
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11"
      disabled={state.isLoading}
      onClick={() => void onExport()}
    >
      {state.isLoading ? <ButtonSpinner className="size-4" /> : <Download />}
      {state.isLoading ? "Exporting…" : "Export CSV"}
    </Button>
  );
}
