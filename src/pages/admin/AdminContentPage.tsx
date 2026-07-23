import { useQuery } from "@tanstack/react-query";
import { BookOpen, HelpCircle, Pencil, Play, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  AdminGoldButton,
  AdminPageHeader,
  AdminStatusPill,
  AdminSurfaceCard,
  AdminTableScroll,
  adminTableHeaderClass,
  adminTableRowClass,
} from "@/components/admin";
import { Typography } from "@/components/common/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminContent } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const TYPE_META = {
  guide: { icon: BookOpen, className: "bg-info-bg text-[#2b5299]" },
  video: { icon: Play, className: "bg-error-bg text-[#a2453b]" },
  faq: { icon: HelpCircle, className: "bg-bg-icon text-[#8a6413]" },
};

export default function AdminContentPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-content"],
    queryFn: fetchAdminContent,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-96 rounded-lg" />;
  }

  return (
    <div className="min-w-0 animate-fade-up">
      <AdminPageHeader
        title="Content"
        subtitle="Guides, videos, and FAQs in the member knowledge center."
        actions={
          <AdminGoldButton onClick={() => toast.success("New content draft created")}>
            <Plus className="size-4" />
            New content
          </AdminGoldButton>
        }
      />

      <AdminSurfaceCard className="min-w-0 w-full">
        <AdminTableScroll minWidth="640px">
        <div
          className={cn(
            adminTableHeaderClass,
            "grid-cols-[2.6fr_1fr_1fr_1.1fr_40px]",
          )}
        >
          <span>Title</span>
          <span>Type</span>
          <span>Category</span>
          <span>Status</span>
          <span />
        </div>
        {data.content.map((item) => {
          const meta = TYPE_META[item.type];
          const Icon = meta.icon;
          return (
            <div
              key={item.id}
              className={cn(
                adminTableRowClass,
                "grid-cols-[2.6fr_1fr_1fr_1.1fr_40px]",
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    meta.className,
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <Typography variant="label" className="truncate text-sm font-semibold text-[#1a2c4e]">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" className="text-[#93a3c2]">
                    Updated {item.updated}
                  </Typography>
                </div>
              </div>
              <Typography variant="body-sm" className="capitalize text-muted-soft">
                {item.type}
              </Typography>
              <Typography variant="body-sm" className="text-muted-soft">
                {item.cat}
              </Typography>
              <AdminStatusPill status={item.status} />
              <button
                type="button"
                className="flex size-[30px] items-center justify-center justify-self-end rounded-md border border-[#e0e7f1] bg-white text-[#7386a8]"
                onClick={() => toast.message(`Edit ${item.title}`)}
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
          );
        })}
        </AdminTableScroll>
      </AdminSurfaceCard>
    </div>
  );
}
