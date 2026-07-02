import { useQuery } from "@tanstack/react-query";

import { getLearnArticle, getLearnItem, getLearnItems } from "@/lib/api/learn";

export function useLearnItems() {
  return useQuery({ queryKey: ["learn"], queryFn: getLearnItems });
}

export function useLearnItem(slug: string) {
  return useQuery({
    queryKey: ["learnItem", slug],
    queryFn: () => getLearnItem(slug),
    enabled: Boolean(slug),
  });
}

export function useLearnArticle(slug: string) {
  return useQuery({
    queryKey: ["learnArticle", slug],
    queryFn: () => getLearnArticle(slug),
    enabled: Boolean(slug),
  });
}
