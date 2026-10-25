import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  InfoCallout,
  ParticipantPageHeader,
} from "@/components/member/app";
import { CategoryIconBadge } from "@/components/success-centers/SuccessCenterBadges";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useListBrowseCategoriesQuery } from "@/store/api/successCenterBrowseApi";
import { ROUTES, successCenterCategoryPath } from "@/utils/constants";

export default function SuccessCentersBrowsePage() {
  const categoriesQuery = useListBrowseCategoriesQuery();
  const categories = categoriesQuery.data ?? [];

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="BMIS"
        title="Success Centers"
        subtitle="Explore Success Center categories and the programs inside them. Browsing is always free."
        actions={
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.MY_SELECTIONS}>My selections</Link>
          </GoldButton>
        }
      />

      <InfoCallout className="mb-5">
        Open any category to see its programs, then activate the ones you want
        to work toward.
      </InfoCallout>

      {categoriesQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-panel bg-muted" />
          ))}
        </div>
      ) : categoriesQuery.isError ? (
        <EmptyState
          icon={LayoutGrid}
          variant="error"
          title="Could not load Success Centers"
          description={getApiErrorMessage(
            categoriesQuery.error,
            "Please try again in a moment.",
          )}
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => void categoriesQuery.refetch()}
            >
              Try again
            </Button>
          }
        />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={LayoutGrid}
          variant="muted"
          title="No Success Centers available yet"
          description="Check back soon — new categories are on the way."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={successCenterCategoryPath(category._id)}
              className="group flex flex-col rounded-panel border border-line bg-white p-4 shadow-app-card transition hover:-translate-y-0.5 hover:border-gold-chip sm:p-6"
            >
              <CategoryIconBadge icon={category.icon} slug={category.slug} />
              <Typography
                as="h2"
                variant="h5"
                className="mt-4 font-display text-[17px] font-bold text-ink-heading"
              >
                {category.name}
              </Typography>
              <Typography variant="body-sm" className="mt-2 flex-1 text-muted-soft">
                {category.description || "Explore programs in this category."}
              </Typography>
              <Typography
                as="span"
                variant="label"
                className="mt-4 inline-flex items-center gap-1 text-gold-dark"
              >
                Explore programs
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
              </Typography>
            </Link>
          ))}
        </div>
      )}
    </AppPageContainer>
  );
}
