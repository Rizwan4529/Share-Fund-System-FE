import { useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  ADMIN_TABLE_SECTION,
  ADMIN_TABLE_SLOT,
  AdminPageHeader,
  AdminTableIconAction,
  AdminTableToolbar,
} from "@/components/admin";
import { DialogCommon } from "@/components/common/DialogCommon";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import { DataTableColumnHeaderCommon } from "@/components/common/DataTableColumnHeaderCommon";
import { DataTableCommon } from "@/components/common/DataTableCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { filterRowsBySearch } from "@/hooks/useAdminTableSearch";
import { useClientTablePage } from "@/hooks/useClientTablePage";
import {
  saveSuccessCenter,
  setSuccessCenterActive,
} from "@/lib/api/successCenters";
import { fetchAdminSuccessCenters } from "@/lib/api/admin";
import type { SuccessCenter } from "@/types";

export default function AdminSuccessCentersPage() {
  const [centers, setCenters] = useState<SuccessCenter[]>([]);
  const [editing, setEditing] = useState<SuccessCenter | null>(null);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("edit");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<SuccessCenter | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      filterRowsBySearch(
        centers,
        search,
        (c) =>
          `${c.name} ${c.filter} ${c.active ? "yes active" : "no inactive"}`,
      ),
    [centers, search],
  );
  const { pageRows, totalDataCount, onFetchData } =
    useClientTablePage(filtered);

  const reload = () => void fetchAdminSuccessCenters().then(setCenters);
  useEffect(() => {
    reload();
  }, []);

  const openCreate = () => {
    setDrawerMode("create");
    setEditing({
      id: `sc-${Date.now()}`,
      name: "New Success Center",
      blurb: "",
      long: "",
      filter: "essentials",
      active: false,
      notices: "Planning tools only. No live funding in Phase 1.",
      content: "",
      programs: [],
    });
    setDrawerOpen(true);
  };

  const openEdit = (center: SuccessCenter) => {
    setDrawerMode("edit");
    setEditing({ ...center });
    setDrawerOpen(true);
  };

  const closeDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) setEditing(null);
  };

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await saveSuccessCenter(editing);
      toast.success("Success Center saved.");
      closeDrawer(false);
      reload();
    } finally {
      setSaving(false);
    }
  };

  const onConfirmToggle = async () => {
    if (!confirmTarget) return;
    const nextActive = !confirmTarget.active;
    await setSuccessCenterActive(confirmTarget.id, nextActive);
    toast.success(nextActive ? "Activated." : "Deactivated.");
    setConfirmTarget(null);
    reload();
  };

  const isCreate = drawerMode === "create";

  const addProgram = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      programs: [
        ...editing.programs,
        {
          id: `prog-${Date.now()}`,
          name: "New program",
          blurb: "",
          activationPercent: 5,
          educationSummary: "",
          timelineNote: "",
          eligibilityNote: "",
        },
      ],
    });
  };

  const updateProgram = (
    id: string,
    patch: Partial<SuccessCenter["programs"][number]>,
  ) => {
    if (!editing) return;
    setEditing({
      ...editing,
      programs: editing.programs.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    });
  };

  const removeProgram = (id: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      programs: editing.programs.filter((p) => p.id !== id),
    });
  };

  const columns = useMemo<ColumnDef<SuccessCenter>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon
            column={column}
            title="Name"
            className="ml-1"
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-ink-heading">
            {row.original.name}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "filter",
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Filter" />
        ),
        cell: ({ row }) => (
          <span className="capitalize">{row.original.filter}</span>
        ),
        enableSorting: true,
      },
      {
        id: "programs",
        accessorFn: (c) => c.programs.length,
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Programs" />
        ),
        cell: ({ row }) => <span>{row.original.programs.length}</span>,
        enableSorting: true,
      },
      {
        id: "active",
        accessorFn: (c) => (c.active ? "Yes" : "No"),
        header: ({ column }) => (
          <DataTableColumnHeaderCommon column={column} title="Active" />
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        enableSorting: false,
        enableHiding: false,
        header: () => <span>Actions</span>,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex items-center justify-end gap-0.5">
              <AdminTableIconAction
                label="Edit"
                icon={Pencil}
                tone="info"
                onClick={() => openEdit(c)}
              />
              <AdminTableIconAction
                label={c.active ? "Deactivate" : "Activate"}
                icon={Power}
                tone={c.active ? "danger" : "success"}
                onClick={() => setConfirmTarget(c)}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <section className={ADMIN_TABLE_SECTION}>
      <AdminPageHeader
        title="Success Centers"
        subtitle="Create, edit, activate, and deactivate Success Centers."
        actions={
          <GoldButton size="sm" onClick={openCreate}>
            + New Success Center
          </GoldButton>
        }
      />

      <AdminTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search name, filter, or active status…"
        resultCount={filtered.length}
      />

      <div className={ADMIN_TABLE_SLOT}>
        <DataTableCommon
          columns={columns}
          data={pageRows}
          totalDataCount={totalDataCount}
          onFetchData={onFetchData}
          fillViewport={false}
          className="min-h-0 flex-1"
          emptyMessage="No Success Centers yet."
        />
      </div>

      <DrawerCommon
        open={drawerOpen}
        onOpenChange={closeDrawer}
        title={isCreate ? "New Success Center" : "Edit Success Center"}
        description="Update name, category, content, and availability."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDrawer(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gold"
              onClick={() => void onSave()}
              disabled={saving}
            >
              Save
            </Button>
          </>
        }
      >
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sc-name">Name</Label>
              <Input
                id="sc-name"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                placeholder="Name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-filter">Category</Label>
              <select
                id="sc-filter"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={editing.filter}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    filter: e.target.value as SuccessCenter["filter"],
                  })
                }
              >
                <option value="essentials">Essentials</option>
                <option value="financial">Financial</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
              <div>
                <Label htmlFor="sc-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive centers are hidden from participants.
                </p>
              </div>
              <Switch
                id="sc-active"
                checked={editing.active}
                onCheckedChange={(v) =>
                  setEditing({ ...editing, active: v })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-blurb">Short blurb</Label>
              <Input
                id="sc-blurb"
                value={editing.blurb}
                onChange={(e) =>
                  setEditing({ ...editing, blurb: e.target.value })
                }
                placeholder="Short blurb"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-long">Long description</Label>
              <Textarea
                id="sc-long"
                value={editing.long}
                onChange={(e) =>
                  setEditing({ ...editing, long: e.target.value })
                }
                placeholder="Long description"
                className="min-h-28"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-content">Content</Label>
              <Textarea
                id="sc-content"
                value={editing.content}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
                placeholder="Additional content shown on the detail page"
                className="min-h-24"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-notices">Notices</Label>
              <Textarea
                id="sc-notices"
                value={editing.notices}
                onChange={(e) =>
                  setEditing({ ...editing, notices: e.target.value })
                }
                placeholder="Notices"
                className="min-h-24"
              />
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between gap-2">
                <Label>Programs</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addProgram}
                >
                  <Plus className="size-4" />
                  Add program
                </Button>
              </div>
              {editing.programs.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No programs yet. Add specialized programs participants can
                  explore under this category.
                </p>
              ) : (
                <div className="space-y-3">
                  {editing.programs.map((program) => (
                    <div
                      key={program.id}
                      className="space-y-2 rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-start gap-2">
                        <Input
                          value={program.name}
                          placeholder="Program name"
                          onChange={(e) =>
                            updateProgram(program.id, { name: e.target.value })
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 text-error hover:bg-error-bg/50 hover:text-error"
                          onClick={() => removeProgram(program.id)}
                          aria-label={`Remove ${program.name}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <Input
                        value={program.blurb}
                        placeholder="Short blurb"
                        onChange={(e) =>
                          updateProgram(program.id, { blurb: e.target.value })
                        }
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Activation %
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            step="any"
                            value={program.activationPercent}
                            onChange={(e) =>
                              updateProgram(program.id, {
                                activationPercent: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Timeline note
                          </Label>
                          <Input
                            value={program.timelineNote}
                            placeholder="e.g. 6–12 months"
                            onChange={(e) =>
                              updateProgram(program.id, {
                                timelineNote: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Textarea
                        value={program.educationSummary}
                        placeholder="Education summary"
                        className="min-h-16"
                        onChange={(e) =>
                          updateProgram(program.id, {
                            educationSummary: e.target.value,
                          })
                        }
                      />
                      <Input
                        value={program.eligibilityNote}
                        placeholder="Eligibility note"
                        onChange={(e) =>
                          updateProgram(program.id, {
                            eligibilityNote: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DrawerCommon>

      <DialogCommon
        open={Boolean(confirmTarget)}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
        title={
          confirmTarget?.active
            ? `Deactivate ${confirmTarget.name}?`
            : `Activate ${confirmTarget?.name ?? ""}?`
        }
        description={
          confirmTarget?.active
            ? "This Success Center will be hidden from participants until reactivated."
            : "This Success Center will become available for participant selection."
        }
        confirmLabel={confirmTarget?.active ? "Deactivate" : "Activate"}
        confirmVariant={confirmTarget?.active ? "destructive" : "gold"}
        onConfirm={onConfirmToggle}
      />
    </section>
  );
}
