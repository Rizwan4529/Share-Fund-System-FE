import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { GoldButton } from "@/components/common/GoldButton";
import { GoldAvatar } from "@/components/member/app";
import { ROUTES } from "@/utils/constants";

type ArticleAuthorRowProps = {
  meta: string;
};

export function ArticleAuthorRow({ meta }: ArticleAuthorRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-line pb-6">
      <GoldAvatar initials="SL" size="lg" />
      <div>
        <div className="text-[14.5px] font-bold text-ink-heading">SFS Learning Team</div>
        <div className="text-[13px] text-muted-soft">{meta}</div>
      </div>
    </div>
  );
}

type ArticleCtaBannerProps = {
  title?: string;
  subtitle?: string;
};

export function ArticleCtaBanner({
  title = "Ready to put this into action?",
  subtitle = "Browse campaigns and find the goal that fits your life.",
}: ArticleCtaBannerProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-panel border border-border-gold bg-gradient-to-br from-bg-gold to-bg-gold-alt px-6 py-5">
      <div>
        <h3 className="font-display text-[17px] font-bold text-ink-heading">{title}</h3>
        <p className="mt-1 text-[13.5px] text-[#6a5f38]">{subtitle}</p>
      </div>
      <GoldButton size="app" asChild>
        <Link to={ROUTES.CAMPAIGNS}>
          Browse campaigns
          <ArrowRight className="size-4" />
        </Link>
      </GoldButton>
    </div>
  );
}
