import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AdminPageContainer,
  AdminPageHeader,
  AdminTableScroll,
  adminTableHeaderClass,
  adminTableRowClass,
} from "@/components/admin";
import { GoldButton } from "@/components/common/GoldButton";
import { Input } from "@/components/ui/input";
import { fetchAdminRecommendations } from "@/lib/api/admin";
import { reviewRecommendation } from "@/lib/api/recommendations";
import type { Recommendation } from "@/types";

export default function AdminRecommendationsPage() {
  const [rows, setRows] = useState<Recommendation[]>([]);
  const [drafts, setDrafts] = useState<
    Record<string, { budget: string; months: string }>
  >({});

  const reload = () => void fetchAdminRecommendations().then(setRows);
  useEffect(() => {
    reload();
  }, []);

  const act = async (
    id: string,
    status: "approved" | "adjusted" | "rejected",
  ) => {
    const d = drafts[id];
    await reviewRecommendation(id, {
      status,
      adjustedBudget:
        status === "adjusted" && d?.budget ? Number(d.budget) : null,
      adjustedTimelineMonths:
        status === "adjusted" && d?.months ? Number(d.months) : null,
      notes:
        status === "adjusted"
          ? "Manually adjusted by administrator."
          : undefined,
    });
    toast.success(`Recommendation ${status}.`);
    reload();
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Recommendations"
        subtitle="Review, approve, or manually adjust projected figures (simulations)."
      />
      <AdminTableScroll>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className={adminTableHeaderClass}>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Budget (proj.)</th>
              <th className="px-4 py-3">Timeline (proj.)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Adjust / actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                  No recommendations yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className={adminTableRowClass}>
                  <td className="px-4 py-3 font-semibold">{r.userName}</td>
                  <td className="px-4 py-3">
                    ${r.recommendedBudget.toLocaleString()}
                    {r.adjustedBudget != null
                      ? ` → $${r.adjustedBudget.toLocaleString()}`
                      : ""}
                  </td>
                  <td className="px-4 py-3">
                    {r.projectedTimelineMonths} mo
                    {r.adjustedTimelineMonths != null
                      ? ` → ${r.adjustedTimelineMonths} mo`
                      : ""}
                  </td>
                  <td className="px-4 py-3 capitalize">{r.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        className="w-24"
                        placeholder="Budget"
                        value={drafts[r.id]?.budget ?? ""}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [r.id]: {
                              budget: e.target.value,
                              months: d[r.id]?.months ?? "",
                            },
                          }))
                        }
                      />
                      <Input
                        className="w-20"
                        placeholder="Months"
                        value={drafts[r.id]?.months ?? ""}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [r.id]: {
                              budget: d[r.id]?.budget ?? "",
                              months: e.target.value,
                            },
                          }))
                        }
                      />
                      <GoldButton
                        size="sm"
                        variant="outline"
                        onClick={() => void act(r.id, "approved")}
                      >
                        Approve
                      </GoldButton>
                      <GoldButton
                        size="sm"
                        variant="outline"
                        onClick={() => void act(r.id, "adjusted")}
                      >
                        Adjust
                      </GoldButton>
                      <GoldButton
                        size="sm"
                        variant="outline"
                        onClick={() => void act(r.id, "rejected")}
                      >
                        Reject
                      </GoldButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableScroll>
    </AdminPageContainer>
  );
}
