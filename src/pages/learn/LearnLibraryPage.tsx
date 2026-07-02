import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { LearnContentCard, LearnFeaturedHero } from "@/components/learn/LearnContentCards";
import { PageSearchToolbar } from "@/components/member/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useLearnItems } from "@/hooks/queries/useLearn";
import { LEARN_CATEGORIES } from "@/utils/constants";

export default function LearnLibraryPage() {
  const { data: items = [], isLoading } = useLearnItems();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchCat = category === "all" || item.cat === category;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.blurb.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, category, search]);

  const featured = items[0];

  if (isLoading) return <Skeleton className="h-96 rounded-panel" />;

  return (
    <div className="space-y-6">
      {featured && !search && category === "all" ? (
        <LearnFeaturedHero item={featured} />
      ) : null}

      <PageSearchToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search guides, videos, FAQs…"
        filterOptions={LEARN_CATEGORIES}
        filter={category}
        onFilterChange={setCategory}
      />

      {filtered.length === 0 ? (
        <div className="rounded-panel border border-dashed border-[#d3dcea] bg-white px-10 py-14 text-center">
          <SearchX className="mx-auto mb-4 size-10 text-muted-light" />
          <Typography variant="h4" className="font-bold text-ink-heading">
            No content found
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-2">
            Try a different search or category.
          </Typography>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <LearnContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
