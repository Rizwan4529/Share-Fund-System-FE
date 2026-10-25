import { useMemo } from "react";

import { useListMySelectionsQuery } from "@/store/api/successCenterBrowseApi";

/** Program ids the participant already has an ACTIVE selection for. */
export function useSelectedProgramIds() {
  const query = useListMySelectionsQuery();
  const ids = useMemo(
    () =>
      new Set(
        (query.data ?? [])
          .map((selection) => selection.programId?._id)
          .filter((id): id is string => Boolean(id)),
      ),
    [query.data],
  );
  return { ids, isLoading: query.isLoading };
}
