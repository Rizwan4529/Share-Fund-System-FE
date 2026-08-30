import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AdminTableIconAction } from "@/components/admin/AdminTableIconAction";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import { FormCommon, Input, Textarea } from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  settingCategoryFormSchema,
  type SettingCategoryFormValues,
} from "@/lib/schemas/settings";
import { optionalTrimmed, slugFromLabel } from "@/lib/settings/value";
import {
  useCreateSettingCategoryMutation,
  useDeleteSettingCategoryMutation,
  useListSettingCategoriesQuery,
  useUpdateSettingCategoryMutation,
} from "@/store/api/settingsApi";
import type { SettingCategory } from "@/types/settings";

type SettingCategoryManageDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EMPTY_FORM: SettingCategoryFormValues = {
  label: "",
  slug: "",
  description: "",
};

export function SettingCategoryManageDrawer({
  open,
  onOpenChange,
}: SettingCategoryManageDrawerProps) {
  const categoriesQuery = useListSettingCategoriesQuery(undefined, {
    skip: !open,
  });
  const [createCategory, createState] = useCreateSettingCategoryMutation();
  const [updateCategory, updateState] = useUpdateSettingCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteSettingCategoryMutation();
  const [editing, setEditing] = useState<SettingCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SettingCategory | null>(
    null,
  );

  const form = useForm<SettingCategoryFormValues>({
    resolver: zodResolver(settingCategoryFormSchema),
    defaultValues: EMPTY_FORM,
  });
  const label = form.watch("label");
  const generatedSlugRef = useRef("");

  useEffect(() => {
    if (!open) {
      setEditing(null);
      setPendingDelete(null);
      generatedSlugRef.current = "";
      form.reset(EMPTY_FORM);
    }
  }, [open, form]);

  useEffect(() => {
    if (editing) return;
    const generated = slugFromLabel(label);
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === generatedSlugRef.current) {
      form.setValue("slug", generated, { shouldValidate: false });
      generatedSlugRef.current = generated;
    }
  }, [label, editing, form]);

  const busy =
    createState.isLoading || updateState.isLoading || deleteState.isLoading;
  const categories = categoriesQuery.data ?? [];

  const startEdit = (category: SettingCategory) => {
    setEditing(category);
    setPendingDelete(null);
    generatedSlugRef.current = category.slug;
    form.reset({
      label: category.label,
      slug: category.slug,
      description: category.description ?? "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    generatedSlugRef.current = "";
    form.reset(EMPTY_FORM);
  };

  const onSubmit = async (values: SettingCategoryFormValues) => {
    try {
      if (editing) {
        await updateCategory({
          id: editing._id,
          slug: values.slug.trim(),
          label: values.label.trim(),
          description: optionalTrimmed(values.description),
        }).unwrap();
        toast.success("Category updated.");
      } else {
        await createCategory({
          slug: values.slug.trim(),
          label: values.label.trim(),
          description: optionalTrimmed(values.description),
        }).unwrap();
        toast.success("Category created.");
      }
      cancelEdit();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          editing ? "Could not update category." : "Could not create category.",
        ),
      );
    }
  };

  const onDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCategory(pendingDelete._id).unwrap();
      toast.success("Category deleted.");
      if (editing?._id === pendingDelete._id) cancelEdit();
      setPendingDelete(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Could not delete category. Move or remove its settings first.",
        ),
      );
    }
  };

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title="Manage categories"
      description="Add, rename, or remove setting categories. A category cannot be deleted while settings still use it."
    >
      <div className="space-y-5">
        <FormCommon form={form} onSubmit={onSubmit} className="space-y-3">
          <Typography variant="label">
            {editing ? `Edit ${editing.label}` : "Add category"}
          </Typography>
          <Input
            control={form.control}
            name="label"
            label="Label"
            required
            placeholder="Platform fee"
          />
          <Input
            control={form.control}
            name="slug"
            label="Slug"
            required
            placeholder="platformFee"
            description="Stored on each setting. Changing it updates existing settings."
          />
          <Textarea
            control={form.control}
            name="description"
            label="Description"
            rows={2}
            placeholder="Optional"
          />
          <div className="flex justify-end gap-2">
            {editing ? (
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel edit
              </Button>
            ) : null}
            <GoldButton type="submit" disabled={busy}>
              {busy ? <ButtonSpinner className="size-4" /> : null}
              {editing ? "Save category" : "Add category"}
            </GoldButton>
          </div>
        </FormCommon>

        <div className="space-y-2 border-t border-border pt-4">
          <Typography variant="label">Existing categories</Typography>
          {categoriesQuery.isLoading ? (
            <div className="flex min-h-24 items-center justify-center">
              <Spinner />
            </div>
          ) : categoriesQuery.isError ? (
            <Typography variant="body-sm" className="text-destructive">
              {getApiErrorMessage(
                categoriesQuery.error,
                "Could not load categories.",
              )}
            </Typography>
          ) : categories.length === 0 ? (
            <Typography variant="body-sm" color="muted">
              No categories yet. Add one above.
            </Typography>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category._id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
                >
                  <div className="min-w-0">
                    <Typography
                      variant="body-sm"
                      className="font-medium text-ink-heading"
                    >
                      {category.label}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {category.slug}
                    </Typography>
                  </div>
                  <div className="flex shrink-0">
                    <AdminTableIconAction
                      label="Edit"
                      icon={Pencil}
                      tone="info"
                      onClick={() => startEdit(category)}
                    />
                    <AdminTableIconAction
                      label="Delete"
                      icon={Trash2}
                      tone="danger"
                      onClick={() => setPendingDelete(category)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pendingDelete ? (
          <div className="space-y-3 rounded-md border border-destructive/30 bg-error-bg/40 p-3">
            <Typography variant="body-sm">
              Delete <strong>{pendingDelete.label}</strong>? This is blocked if
              any settings still use it.
            </Typography>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPendingDelete(null)}
                disabled={deleteState.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void onDelete()}
                disabled={deleteState.isLoading}
              >
                {deleteState.isLoading ? (
                  <ButtonSpinner className="size-4" />
                ) : null}
                Delete
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </DrawerCommon>
  );
}
