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
import { Textarea } from "@/components/ui/textarea";
import {
  saveSuccessCenter,
  setSuccessCenterActive,
} from "@/lib/api/successCenters";
import { fetchAdminSuccessCenters } from "@/lib/api/admin";
import type { SuccessCenter } from "@/types";

export default function AdminSuccessCentersPage() {
  const [centers, setCenters] = useState<SuccessCenter[]>([]);
  const [editing, setEditing] = useState<SuccessCenter | null>(null);

  const reload = () => void fetchAdminSuccessCenters().then(setCenters);
  useEffect(() => {
    reload();
  }, []);

  const onToggle = async (id: string, active: boolean) => {
    await setSuccessCenterActive(id, active);
    toast.success(active ? "Activated." : "Deactivated.");
    reload();
  };

  const onSave = async () => {
    if (!editing) return;
    await saveSuccessCenter(editing);
    toast.success("Success Center saved.");
    setEditing(null);
    reload();
  };

  const onCreate = () => {
    setEditing({
      id: `sc-${Date.now()}`,
      name: "New Success Center",
      blurb: "",
      long: "",
      filter: "essentials",
      active: false,
      notices: "Planning tools only. No live funding in Phase 1.",
      content: "",
    });
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Success Centers"
        subtitle="Create, edit, activate, and deactivate Success Centers."
        actions={
          <GoldButton size="sm" onClick={onCreate}>
            New Success Center
          </GoldButton>
        }
      />

      <AdminTableScroll>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className={adminTableHeaderClass}>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Filter</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((c) => (
              <tr key={c.id} className={adminTableRowClass}>
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3 capitalize">{c.filter}</td>
                <td className="px-4 py-3">{c.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <GoldButton
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(c)}
                    >
                      Edit
                    </GoldButton>
                    <GoldButton
                      size="sm"
                      variant="outline"
                      onClick={() => void onToggle(c.id, !c.active)}
                    >
                      {c.active ? "Deactivate" : "Activate"}
                    </GoldButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableScroll>

      {editing ? (
        <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-bold">Edit Success Center</h3>
          <Input
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            placeholder="Name"
          />
          <Input
            value={editing.blurb}
            onChange={(e) => setEditing({ ...editing, blurb: e.target.value })}
            placeholder="Short blurb"
          />
          <Textarea
            value={editing.long}
            onChange={(e) => setEditing({ ...editing, long: e.target.value })}
            placeholder="Long description"
          />
          <Textarea
            value={editing.notices}
            onChange={(e) =>
              setEditing({ ...editing, notices: e.target.value })
            }
            placeholder="Notices"
          />
          <div className="flex gap-2">
            <GoldButton size="sm" onClick={() => void onSave()}>
              Save
            </GoldButton>
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => setEditing(null)}
            >
              Cancel
            </GoldButton>
          </div>
        </div>
      ) : null}
    </AdminPageContainer>
  );
}
