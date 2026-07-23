import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AdminPageContainer,
  AdminPageHeader,
  AdminTableScroll,
} from "@/components/admin";
import { GoldButton } from "@/components/common/GoldButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchAdminParticipants,
  updateParticipantFoundingStatus,
} from "@/lib/api/admin";
import { foundingStatusLabel } from "@/lib/auth/roles";
import type { AuthUser, FoundingStatus } from "@/types";

export default function AdminParticipantsPage() {
  const [rows, setRows] = useState<AuthUser[]>([]);

  const reload = () => void fetchAdminParticipants().then(setRows);
  useEffect(() => {
    reload();
  }, []);

  const onStatus = async (id: string, status: FoundingStatus) => {
    await updateParticipantFoundingStatus(id, status);
    toast.success("Founding status updated.");
    reload();
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Participants"
        subtitle="View participants and manage Founding / Founder Stack status."
      />
      <AdminTableScroll>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-card text-[11.5px] font-bold tracking-wide text-muted-soft uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Centers</th>
              <th className="px-4 py-3">Questionnaire</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-muted-foreground">
                  No participants yet. Sign up as a non-admin user to populate.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-[#f2f5fa] hover:bg-bg-card">
                  <td className="px-4 py-3 font-semibold">{r.name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">
                    {foundingStatusLabel(r.foundingStatus)}
                  </td>
                  <td className="px-4 py-3">
                    {r.selectedCenterIds.length}/{r.centerLimit}
                  </td>
                  <td className="px-4 py-3">
                    {r.questionnaireComplete ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={r.foundingStatus}
                      onValueChange={(v) =>
                        void onStatus(r.id, v as FoundingStatus)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not enrolled</SelectItem>
                        <SelectItem value="founding_participant">
                          Founding Participant
                        </SelectItem>
                        <SelectItem value="founder_stack">
                          Founder Stack
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableScroll>
      <div className="mt-4">
        <GoldButton size="sm" variant="outline" onClick={reload}>
          Refresh
        </GoldButton>
      </div>
    </AdminPageContainer>
  );
}
