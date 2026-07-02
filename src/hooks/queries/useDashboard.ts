import { useQuery } from "@tanstack/react-query";

import { getDashboardData, refreshActivity } from "@/lib/api/dashboard";

export function useDashboard() {
  return useQuery({ queryKey: ["dashboard"], queryFn: getDashboardData });
}

export function useActivityRefresh() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: refreshActivity,
    enabled: false,
  });
}
