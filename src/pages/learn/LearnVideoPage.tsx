import { useParams } from "react-router-dom";

import { VideoPlayerHero } from "@/components/learn/VideoPlayerHero";
import { BackNavLink } from "@/components/member/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useLearnArticle, useLearnItem } from "@/hooks/queries/useLearn";
import { ROUTES } from "@/utils/constants";

export default function LearnVideoPage() {
  const { slug = "" } = useParams();
  const { data: item } = useLearnItem(slug);
  const { data: article, isLoading } = useLearnArticle(slug);

  if (isLoading) return <Skeleton className="h-96 rounded-panel" />;

  const title = article?.title ?? item?.title ?? "";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <BackNavLink to={ROUTES.LEARN}>Learn center</BackNavLink>
      <VideoPlayerHero title={title} />
      <span className="inline-flex rounded-full border border-border-gold bg-bg-gold px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide text-gold-dark">
        {article?.cat ?? item?.cat}
      </span>
      <h1 className="font-display text-[28px] font-bold tracking-tight text-ink-heading">
        {title}
      </h1>
      <p className="text-[15.5px] leading-relaxed text-[#3a4967]">
        {article?.vid ?? item?.blurb}
      </p>
      <p className="text-[13px] text-muted-soft">{article?.meta ?? item?.mins}</p>
    </div>
  );
}
