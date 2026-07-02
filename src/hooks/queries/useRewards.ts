import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getRewardsData, redeemCredits } from "@/lib/api/rewards";

export function useRewards() {
  return useQuery({ queryKey: ["rewards"], queryFn: getRewardsData });
}

export function useRedeemCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (optionId: string) => redeemCredits(optionId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["rewards"] });
    },
  });
}
