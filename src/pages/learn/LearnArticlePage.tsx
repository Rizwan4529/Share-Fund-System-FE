import { useParams } from "react-router-dom";

import {
  ArticleAuthorRow,
  ArticleCtaBanner,
} from "@/components/learn/LearnArticleExtras";
import { BackNavLink } from "@/components/member/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useLearnArticle, useLearnItem } from "@/hooks/queries/useLearn";
import { ROUTES } from "@/utils/constants";

export default function LearnArticlePage() {
  const { slug = "" } = useParams();
  const { data: item } = useLearnItem(slug);
  const { data: article, isLoading } = useLearnArticle(slug);

  if (isLoading) return <Skeleton className="h-96 rounded-panel" />;

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <BackNavLink to={ROUTES.LEARN}>Learn center</BackNavLink>
      <span className="inline-flex rounded-full border border-border-gold bg-bg-gold px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-wide text-gold-dark">
        {article?.cat ?? item?.cat}
      </span>
      <h1 className="font-display text-[36px] font-bold leading-tight tracking-tight text-ink-heading">
        {article?.title ?? item?.title}
      </h1>
      <ArticleAuthorRow meta={article?.meta ?? item?.mins ?? ""} />
      <div className="space-y-4">
        {article?.body?.map((block, i) =>
          block.type === "h" ? (
            <h2 key={i} className="font-display text-xl font-bold text-ink-heading">
              {block.text}
            </h2>
          ) : (
            <p key={i} className="text-[15.5px] leading-relaxed text-[#3a4967]">
              {block.text}
            </p>
          ),
        )}
      </div>
      <ArticleCtaBanner />
    </article>
  );
}
