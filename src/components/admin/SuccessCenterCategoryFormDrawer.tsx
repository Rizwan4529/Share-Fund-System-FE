import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerCommon } from "../common/DrawerCommon";
import {
  FormCommon,
  Input,
  Select,
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
  slugFromName,
  successCenterCategoryFormSchema,
  type SuccessCenterCategoryFormValues,
} from "../../lib/schemas/successCenters";
import {
  useCreateSuccessCenterCategoryMutation,
  useGetSuccessCenterCategoryByIdQuery,
  useUpdateSuccessCenterCategoryMutation,
} from "../../store/api/successCentersApi";
import { SUCCESS_CENTER_CATEGORY_STATUSES } from "../../types/successCenters";

type SuccessCenterCategoryFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  categoryId?: string | null;
};

const STATUS_OPTIONS = SUCCESS_CENTER_CATEGORY_STATUSES.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

const CREATE_DEFAULTS: SuccessCenterCategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  programsIntroduction: "",
  order: "",
  image: "",
  icon: "",
  status: "active",
};

function optionalTrimmed(value?: string): string | undefined {
  const trimmed = value?.trim() ?? "";
  return trimmed || undefined;
}

export function SuccessCenterCategoryFormDrawer({
  open,
  onOpenChange,
  mode,
  categoryId,
}: SuccessCenterCategoryFormDrawerProps) {
  const close = () => onOpenChange(false);
  const categoryQuery = useGetSuccessCenterCategoryByIdQuery(categoryId ?? "", {
    skip: !open || mode !== "edit" || !categoryId,
  });
  const [createCategory, createState] = useCreateSuccessCenterCategoryMutation();
  const [updateCategory, updateState] = useUpdateSuccessCenterCategoryMutation();

  const form = useForm<SuccessCenterCategoryFormValues>({
    resolver: zodResolver(successCenterCategoryFormSchema),
    defaultValues: CREATE_DEFAULTS,
  });
  const name = form.watch("name");
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
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      programsIntroduction: category.programsIntroduction ?? "",
      order: numberToInput(category.order),
      image: category.image ?? "",
      icon: category.icon ?? "",
      status: category.status,
    });
    generatedSlugRef.current = category.slug;
  }, [open, mode, categoryQuery.data, form]);

  useEffect(() => {
    if (!open || mode !== "create") return;
    const generated = slugFromName(name);
    const currentSlug = form.getValues("slug");
    if (!currentSlug || currentSlug === generatedSlugRef.current) {
      form.setValue("slug", generated, { shouldValidate: false });
      generatedSlugRef.current = generated;
    }
  }, [name, open, mode, form]);

  const onSubmit = async (values: SuccessCenterCategoryFormValues) => {
    const order = parseOptionalNumber(values.order);
    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: optionalTrimmed(values.description),
      programsIntroduction: optionalTrimmed(values.programsIntroduction),
      order: order ?? undefined,
      image: optionalTrimmed(values.image),
      icon: optionalTrimmed(values.icon),
      status: values.status,
    };

    try {
      if (mode === "create") {
        await createCategory(payload).unwrap();
        toast.success("Category created.");
      } else if (categoryId) {
        await updateCategory({ id: categoryId, ...payload }).unwrap();
        toast.success("Category updated.");
      }
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save category."));
    }
  };

  const loadingEdit = mode === "edit" && categoryQuery.isLoading;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add category" : "Edit category"}
      description="Success Center categories appear on the participant browse page when active."
    >
      {loadingEdit ? (
        <div className="flex min-h-48 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <FormCommon form={form} onSubmit={onSubmit} className="space-y-4">
          <Input
            control={form.control}
            name="name"
            label="Name"
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
            placeholder="Short summary shown on browse and detail pages."
          />
          <Textarea
            control={form.control}
            name="programsIntroduction"
            label="Programs introduction"
            placeholder="Optional intro above programs on the detail page."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              control={form.control}
              name="order"
              label="Order"
              type="number"
              placeholder="1"
            />
            <Select
              control={form.control}
              name="status"
              label="Status"
              required
              options={STATUS_OPTIONS}
            />
          </div>
          <Input
            control={form.control}
            name="icon"
            label="Icon"
            placeholder="Optional icon key or emoji"
          />
          <Input
            control={form.control}
            name="image"
            label="Image URL"
            placeholder="https://…"
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
