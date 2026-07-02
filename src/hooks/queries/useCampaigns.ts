import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getCategories, getCategory, activateCampaign, getActiveCampaign } from "@/lib/api/campaigns";
import type { ActivateCampaignInput } from "@/types";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategory(id),
    enabled: Boolean(id),
  });
}

export function useActiveCampaign() {
  return useQuery({ queryKey: ["activeCampaign"], queryFn: getActiveCampaign });
}

export function useActivateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ActivateCampaignInput) => activateCampaign(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["activeCampaign"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["rewards"] });
    },
  });
}
