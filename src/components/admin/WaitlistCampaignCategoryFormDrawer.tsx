import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerCommon } from "../common/DrawerCommon";
import {
  Checkbox,
  FormCommon,
  Input,
  Textarea,
} from "../common/FormCommon";
import { GoldButton } from "../common/GoldButton";
import { Spinner } from "../common/LoadingScreen";
import { ButtonSpinner } from "../common/LoadingStates";
import { Button } from "../ui/button";
import { getApiErrorMessage } from "../../lib/api/getApiErrorMessage";
import {
  numberToInput,
  parseOptionalNumber,
  slugFromWaitlistLabel,
  waitlistCampaignCategoryFormSchema,
  type WaitlistCampaignCategoryFormValues,
} from "../../lib/schemas/waitlist";
import {
  useCreateWaitlistCampaignCategoryMutation,
  useGetWaitlistCampaignCategoryByIdQuery,
  useUpdateWaitlistCampaignCategoryMutation,
} from "../../store/api/waitlistApi";

type WaitlistCampaignCategoryFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  categoryId?: string | null;
};

const CREATE_DEFAULTS: WaitlistCampaignCategoryFormValues = {
  label: "",
  slug: "",
  description: "",
  order: "",
  isActive: true,
};

function optionalTrimmed(value?: string): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed || undefined;
}

export function WaitlistCampaignCategoryFormDrawer({
  open,
  onOpenChange,
  mode,
  categoryId,
}: WaitlistCampaignCategoryFormDrawerProps) {
  const close = () => onOpenChange(false);
  const categoryQuery = useGetWaitlistCampaignCategoryByIdQuery(
    categoryId ?? "",
    { skip: !open || mode !== "edit" || !categoryId },
  );
  const [createCategory, createState] =
    useCreateWaitlistCampaignCategoryMutation();
  const [updateCategory, updateState] =
    useUpdateWaitlistCampaignCategoryMutation();

  const form = useForm<WaitlistCampaignCategoryFormValues>({
    resolver: zodResolver(waitlistCampaignCategoryFormSchema),
    defaultValues: CREATE_DEFAULTS,
  });
  const label = form.watch("label");
  const generatedSlugRef = useRef("");
  const saving = createState.isLoading || updateState.isLoading;

  useEffect(() => {
    if (!open) {
      generatedSlugRef.current = "";
      form.reset(CREATE_DEFAULTS);
      return;
    }
    if (mode === "create") {
      generatedSlugRef.current = "";
      form.reset(CREATE_DEFAULTS);
    }
  }, [open, mode, form]);

  useEffect(() => {
    if (!open || mode !== "edit" || !categoryQuery.data) return;
    const category = categoryQuery.data;
    form.reset({
      label: category.label,
      slug: category.slug,
      description: category.description ?? "",
      order: numberToInput(category.order),
      isActive: category.isActive,
    });
    generatedSlugRef.current = category.slug;
  }, [open, mode, categoryQuery.data, form]);

  useEffect(() => {
    if (!open || mode !== "create") return;
    const generated = slugFromWaitlistLabel(label);
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === generatedSlugRef.current) {
      form.setValue("slug", generated, { shouldValidate: false });
      generatedSlugRef.current = generated;
    }
  }, [label, open, mode, form]);

  const onSubmit = async (values: WaitlistCampaignCategoryFormValues) => {
    const order = parseOptionalNumber(values.order);
    const payload = {
      label: values.label.trim(),
      slug: values.slug.trim(),
      description: optionalTrimmed(values.description) ?? "",
      order,
      isActive: values.isActive,
    };

    try {
      if (mode === "create") {
        await createCategory(payload).unwrap();
        toast.success("Campaign category created.");
      } else if (categoryId) {
        await updateCategory({ id: categoryId, ...payload }).unwrap();
        toast.success("Campaign category updated.");
      }
      close();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Could not save campaign category."),
      );
    }
  };

  const loadingEdit = mode === "edit" && categoryQuery.isLoading;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "create" ? "Add campaign category" : "Edit campaign category"
      }
      description="Campaign categories appear on the public waitlist form when active."
    >
      {loadingEdit ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <FormCommon form={form} onSubmit={onSubmit} className="space-y-4">
          <Input
            control={form.control}
            name="label"
            label="Label"
            required
            placeholder="Housing"
          />
          <Input
            control={form.control}
            name="slug"
            label="Slug"
            required
            placeholder="housing"
          />
          <Textarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Optional short description"
          />
          <Input
            control={form.control}
            name="order"
            label="Order"
            type="number"
            placeholder="1"
          />
          <Checkbox
            control={form.control}
            name="isActive"
            label="Active (shown on public waitlist form)"
          />
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <GoldButton type="submit" disabled={saving}>
              {saving ? <ButtonSpinner /> : null}
              {mode === "create" ? "Create category" : "Save changes"}
            </GoldButton>
          </div>
        </FormCommon>
      )}
    </DrawerCommon>
  );
}
