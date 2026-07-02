import { delay } from "@/lib/delay";
import { ARTICLES } from "@/lib/mock/data";
import { LEARN_ITEMS } from "@/utils/constants";
import type { LearnArticle, LearnItem } from "@/types";

export async function getLearnItems(): Promise<LearnItem[]> {
  await delay();
  return LEARN_ITEMS;
}

export async function getLearnArticle(slug: string): Promise<LearnArticle | null> {
  await delay();
  return ARTICLES[slug] ?? null;
}

export async function getLearnItem(slug: string): Promise<LearnItem | null> {
  await delay();
  return LEARN_ITEMS.find((i) => i.id === slug) ?? null;
}
