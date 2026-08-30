import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SettingValueField } from "@/components/admin/SettingValueField";
import { DrawerCommon } from "@/components/common/DrawerCommon";
import {
  DatePicker,
  FormCommon,
  Input,
  Select,
  Textarea,
} from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  insertSettingFormSchema,
  updateSettingFormSchema,
  type InsertSettingFormValues,
  type UpdateSettingFormValues,
} from "@/lib/schemas/settings";
import {
  formatSettingDate,
  formatSettingValue,
  optionalTrimmed,
  parseSettingValue,
  settingCategoryLabel,
  settingValueToInput,
  toDateInput,
} from "@/lib/settings/value";
import {
  useGetSettingByKeyQuery,
  useInsertSettingMutation,
  useListSettingCategoriesQuery,
  useUpdateSettingMutation,
} from "@/store/api/settingsApi";
import {
  SETTING_DATA_TYPES,
  type SettingVersionEntry,
} from "@/types/settings";

type SettingFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  settingKey?: string | null;
};

const DATA_TYPE_OPTIONS = SETTING_DATA_TYPES.map((dataType) => ({
  value: dataType,
  label: dataType.charAt(0).toUpperCase() + dataType.slice(1),
}));

const CREATE_DEFAULTS: Omit<InsertSettingFormValues, "category"> = {
  key: "",
  dataType: "number",
  valueInput: "",
  description: "",
  effectiveDate: "",
};

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Typography variant="label">{label}</Typography>
      <Typography
        variant="body-sm"
        className="rounded-md border border-border-input bg-muted/40 px-3 py-2.5 font-medium text-ink-heading"
      >
        {value}
      </Typography>
    </div>
  );
}

function VersionHistoryList({
  entries,
}: {
  entries: SettingVersionEntry[] | undefined;
}) {
  const history = [...(entries ?? [])].reverse();

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <Typography variant="label">Version history</Typography>
      {history.length === 0 ? (
        <Typography variant="body-sm" color="muted">
          No previous versions yet.
        </Typography>
      ) : (
        <ol className="space-y-3">
          {history.map((entry, index) => (
            <li
              key={`${entry.at ?? "entry"}-${index}`}
              className="rounded-md border border-border bg-muted/30 px-3 py-2.5"
            >
              <Typography
                variant="body-sm"
                className="break-all font-medium text-ink-heading"
              >
                {formatSettingValue(entry.value)}
              </Typography>
              {entry.reason ? (
                <Typography variant="body-sm" color="muted" className="mt-1">
                  {entry.reason}
                </Typography>
              ) : null}
              <Typography variant="body-sm" color="muted" className="mt-1">
                {formatSettingDate(entry.at)}
              </Typography>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function CreateSettingForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [insertSetting, insertState] = useInsertSettingMutation();
  const categoriesQuery = useListSettingCategoriesQuery(undefined, {
    skip: !open,
  });
  const categories = categoriesQuery.data ?? [];
  const firstCategory = categories[0]?.slug ?? "";
  const form = useForm<InsertSettingFormValues>({
    resolver: zodResolver(insertSettingFormSchema),
    defaultValues: { ...CREATE_DEFAULTS, category: firstCategory },
  });
  const dataType = form.watch("dataType");

  useEffect(() => {
    if (open) form.reset({ ...CREATE_DEFAULTS, category: firstCategory });
  }, [open, firstCategory, form]);

  const onSubmit = async (values: InsertSettingFormValues) => {
    try {
      await insertSetting({
        key: values.key.trim(),
        category: values.category,
        dataType: values.dataType,
        value: parseSettingValue(values.valueInput, values.dataType),
        description: optionalTrimmed(values.description),
        effectiveDate: optionalTrimmed(values.effectiveDate),
      }).unwrap();
      toast.success("Setting created.");
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create setting."));
    }
  };

  return (
    <FormCommon form={form} onSubmit={onSubmit} className="space-y-4">
      <Input
        control={form.control}
        name="key"
        label="Key"
        required
        placeholder="platformFee.percentage"
      />
      <Select
        control={form.control}
        name="category"
        label="Category"
        required
        options={categories.map((category) => ({
          value: category.slug,
          label: category.label,
        }))}
        disabled={categoriesQuery.isLoading || categories.length === 0}
        placeholder={
          categoriesQuery.isLoading
            ? "Loading categories…"
            : categories.length === 0
              ? "Add a category first"
              : "Select category"
        }
      />
      <Select
        control={form.control}
        name="dataType"
        label="Data type"
        required
        options={DATA_TYPE_OPTIONS}
        placeholder="Select data type"
      />
      <SettingValueField control={form.control} dataType={dataType} />
      <Textarea
        control={form.control}
        name="description"
        label="Description"
        rows={3}
        placeholder="Optional description"
      />
      <DatePicker
        control={form.control}
        name="effectiveDate"
        label="Effective date"
        calendarYearsFuture={10}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={insertState.isLoading}
        >
          Cancel
        </Button>
        <GoldButton
          type="submit"
          disabled={insertState.isLoading || categories.length === 0}
        >
          {insertState.isLoading ? <ButtonSpinner className="size-4" /> : null}
          Create setting
        </GoldButton>
      </div>
    </FormCommon>
  );
}

function EditSettingForm({
  open,
  settingKey,
  onClose,
}: {
  open: boolean;
  settingKey: string;
  onClose: () => void;
}) {
  const categoriesQuery = useListSettingCategoriesQuery(undefined, {
    skip: !open,
  });
  const settingQuery = useGetSettingByKeyQuery(settingKey, {
    skip: !open,
  });
  const [updateSetting, updateState] = useUpdateSettingMutation();
  const form = useForm<UpdateSettingFormValues>({
    resolver: zodResolver(updateSettingFormSchema),
    defaultValues: {
      dataType: "number",
      valueInput: "",
      reason: "",
      effectiveDate: "",
    },
  });
  const setting = settingQuery.data;
  const dataType = form.watch("dataType");

  useEffect(() => {
    if (!setting) return;
    form.reset({
      dataType: setting.dataType,
      valueInput: settingValueToInput(setting.value, setting.dataType),
      reason: "",
      effectiveDate: toDateInput(setting.effectiveDate),
    });
  }, [setting, form]);

  const onSubmit = async (values: UpdateSettingFormValues) => {
    try {
      await updateSetting({
        key: settingKey,
        value: parseSettingValue(values.valueInput, values.dataType),
        reason: optionalTrimmed(values.reason),
        effectiveDate: optionalTrimmed(values.effectiveDate),
      }).unwrap();
      toast.success("Setting updated.");
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update setting."));
    }
  };

  if (!setting && (settingQuery.isLoading || settingQuery.isFetching)) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (settingQuery.isError || !setting) {
    return (
      <Typography variant="body-sm" className="text-destructive">
        {getApiErrorMessage(
          settingQuery.error,
          "Could not load this setting.",
        )}
      </Typography>
    );
  }

  return (
    <FormCommon form={form} onSubmit={onSubmit} className="space-y-4">
      <ReadOnlyField label="Key" value={setting.key} />
      <ReadOnlyField
        label="Category"
        value={settingCategoryLabel(setting.category, categoriesQuery.data)}
      />
      <ReadOnlyField label="Data type" value={setting.dataType} />
      <SettingValueField
        control={form.control}
        dataType={dataType}
        disabled={updateState.isLoading}
      />
      <Textarea
        control={form.control}
        name="reason"
        label="Reason"
        rows={3}
        placeholder="Why is this value changing?"
        disabled={updateState.isLoading}
      />
      <DatePicker
        control={form.control}
        name="effectiveDate"
        label="Effective date"
        calendarYearsFuture={10}
        disabled={updateState.isLoading}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={updateState.isLoading}
        >
          Cancel
        </Button>
        <GoldButton type="submit" disabled={updateState.isLoading}>
          {updateState.isLoading ? <ButtonSpinner className="size-4" /> : null}
          Save changes
        </GoldButton>
      </div>
      <VersionHistoryList entries={setting.versionHistory} />
    </FormCommon>
  );
}

export function SettingFormDrawer({
  open,
  onOpenChange,
  mode,
  settingKey,
}: SettingFormDrawerProps) {
  const close = () => onOpenChange(false);
  const title = mode === "create" ? "Add setting" : "Edit setting";
  const description =
    mode === "create"
      ? "Create a new platform setting. The value must match the selected data type."
      : "Update the current value. The previous value is stored in version history.";

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      {mode === "create" ? (
        <CreateSettingForm open={open} onClose={close} />
      ) : settingKey ? (
        <EditSettingForm
          open={open}
          settingKey={settingKey}
          onClose={close}
        />
      ) : null}
    </DrawerCommon>
  );
}
