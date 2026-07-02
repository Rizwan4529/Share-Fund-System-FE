import { BookOpen, Home, TrendingUp } from "lucide-react";

import { Typography } from "@/components/common/Typography";
import { AppSurfaceCard } from "@/components/member/app/AppSurfaceCard";
import { QuickActionRow } from "@/components/member/app/QuickActionRow";
import { ROUTES } from "@/utils/constants";

export function QuickActionsCard() {
  return (
    <AppSurfaceCard padding="md">
      <Typography variant="h5" className="mb-4 text-[17px] font-bold text-ink-heading">
        Quick actions
      </Typography>
      <div className="flex flex-col gap-2">
        <QuickActionRow
          to={ROUTES.CAMPAIGNS}
          label="Browse categories"
          icon={<Home className="size-[18px]" strokeWidth={1.9} />}
        />
        <QuickActionRow
          to={ROUTES.DASHBOARD_PROGRESS}
          label="View progress"
          icon={<TrendingUp className="size-[18px]" strokeWidth={1.9} />}
        />
        <QuickActionRow
          to={ROUTES.LEARN}
          label="Explore learning"
          icon={<BookOpen className="size-[18px]" strokeWidth={1.9} />}
        />
      </div>
    </AppSurfaceCard>
  );
}
