import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminPageContainer, AdminPageHeader } from "@/components/admin";
import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { Textarea } from "@/components/ui/textarea";
import { listDisclosures, saveDisclosure } from "@/lib/api/disclosures";
import type { DisclosureDoc } from "@/types";

export default function AdminDisclosuresPage() {
  const [docs, setDocs] = useState<DisclosureDoc[]>([]);
  const [editing, setEditing] = useState<DisclosureDoc | null>(null);

  const reload = () => void listDisclosures().then(setDocs);
  useEffect(() => {
    reload();
  }, []);

  const onSave = async (bump: boolean) => {
    if (!editing) return;
    await saveDisclosure(editing, bump);
    toast.success(bump ? "Saved with new version." : "Saved.");
    setEditing(null);
    reload();
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Disclosures & legal"
        subtitle="Edit platform disclosures. Saving with a version bump records a new version for acceptances."
      />
      <div className="grid gap-3">
        {docs.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-border bg-card p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"
          >
            <div>
              <Typography variant="h3">{d.title}</Typography>
              <Typography
                variant="caption"
                className="mt-1 block text-muted-foreground"
              >
                {d.kind} · v{d.version} · updated {d.updatedAt}
              </Typography>
            </div>
            <GoldButton
              size="sm"
              variant="outline"
              className="mt-3 sm:mt-0"
              onClick={() => setEditing(d)}
            >
              Edit
            </GoldButton>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-5">
          <Typography variant="h3">{editing.title}</Typography>
          <Textarea
            className="min-h-48"
            value={editing.body}
            onChange={(e) =>
              setEditing({ ...editing, body: e.target.value })
            }
          />
          <div className="flex flex-wrap gap-2">
            <GoldButton size="sm" onClick={() => void onSave(true)}>
              Save & bump version
            </GoldButton>
            <GoldButton
              size="sm"
              variant="outline"
              onClick={() => void onSave(false)}
            >
              Save without bump
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
