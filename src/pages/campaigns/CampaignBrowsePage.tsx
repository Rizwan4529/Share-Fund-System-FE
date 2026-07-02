import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import { CategoryCard } from "@/components/common/CategoryCard";
import { Typography } from "@/components/common/Typography";
import {
  CampaignFeaturedHero,
} from "@/components/campaigns";
import { PageSearchToolbar } from "@/components/member/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/queries/useCampaigns";
import { CAMPAIGN_FILTERS, ROUTES } from "@/utils/constants";
import type { CampaignFilter } from "@/types";

export default function CampaignBrowsePage() {
  const { data: categories = [], isLoading } = useCategories();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<CampaignFilter>("all");

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const matchesFilter = filter === "all" || c.filter === filter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.blurb.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [categories, filter, search]);

  const featured = categories.find((c) => c.featured === "dark");
  const gridItems = filtered.filter((c) => c.id !== featured?.id || filter !== "all");

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-panel" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h2" className="text-[28px] font-bold tracking-tight text-ink-heading">
          Find the campaign for your goal.
        </Typography>
        <Typography variant="body" color="muted" className="mt-2 text-[15.5px]">
          Seven categories, one place to start.
        </Typography>
      </div>

      <PageSearchToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories…"
        filterOptions={CAMPAIGN_FILTERS}
        filter={filter}
        onFilterChange={setFilter}
      />

      {featured && filter === "all" && !search ? (
        <CampaignFeaturedHero
          category={featured}
          href={`${ROUTES.CAMPAIGNS}/${featured.id}`}
        />
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-panel border border-dashed border-[#d3dcea] bg-white px-10 py-14 text-center">
          <SearchX className="mx-auto mb-4 size-10 text-muted-light" />
          <Typography variant="h4" className="font-bold text-ink-heading">
            No categories match that.
          </Typography>
          <Typography variant="body-sm" color="muted" className="mt-2">
            Try clearing your filters or search.
          </Typography>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-gold-dark"
            onClick={() => {
              setSearch("");
              setFilter("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              href={`${ROUTES.CAMPAIGNS}/${cat.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
