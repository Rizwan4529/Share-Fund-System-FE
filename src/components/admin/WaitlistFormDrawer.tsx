import { useEffect } from "react";
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
import { Typography } from "../common/Typography";
import { Button } from "../ui/button";
import { getApiErrorMessage } from "../../lib/api/getApiErrorMessage";
import {
  waitlistFormSchema,
  type WaitlistFormValues,
} from "../../lib/schemas/waitlist";
import {
  useGetWaitlistEntryByIdQuery,
  useListWaitlistCampaignCategoriesQuery,
  useUpdateWaitlistEntryMutation,
} from "../../store/api/waitlistApi";
import { WAITLIST_STATUSES } from "../../types/waitlist";

type WaitlistFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entryId?: string | null;
};

const STATUS_OPTIONS = WAITLIST_STATUSES.map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

const EMPTY: WaitlistFormValues = {
  name: "",
  email: "",
  campaignCategory: "",
  message: "",
  status: "pending",
};

export function WaitlistFormDrawer({
  open,
  onOpenChange,
  entryId,
}: WaitlistFormDrawerProps) {
  const close = () => onOpenChange(false);
  const entryQuery = useGetWaitlistEntryByIdQuery(entryId ?? "", {
    skip: !open || !entryId,
  });
  const categoriesQuery = useListWaitlistCampaignCategoriesQuery(
    { includeInactive: true },
    { skip: !open },
  );
  const [updateEntry, updateState] = useUpdateWaitlistEntryMutation();

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: EMPTY,
  });
  const message = form.watch("message");

  useEffect(() => {
    if (!open) {
      form.reset(EMPTY);
      return;
    }
    if (!entryQuery.data) return;
    const entry = entryQuery.data;
    form.reset({
      name: entry.name,
      email: entry.email,
      campaignCategory: entry.campaignCategory,
      message: entry.message ?? "",
      status: entry.status,
    });
  }, [open, entryQuery.data, form]);

  const onSubmit = async (values: WaitlistFormValues) => {
    if (!entryId) return;
    try {
      await updateEntry({
        id: entryId,
        name: values.name.trim(),
        email: values.email.trim(),
        campaignCategory: values.campaignCategory,
        message: values.message.trim(),
        status: values.status,
      }).unwrap();
      toast.success("Waitlist entry updated.");
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update waitlist entry."));
    }
  };

  const campaignOptions = (categoriesQuery.data ?? []).map((category) => ({
    value: category.slug,
    label: category.isActive
      ? category.label
      : `${category.label} (inactive)`,
  }));

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title="Edit waitlist entry"
      description="Update this pre-access waitlist submission."
    >
      {entryQuery.isLoading || categoriesQuery.isLoading ? (
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
            placeholder="Your name"
          />
          <Input
            control={form.control}
            name="email"
            label="Email"
            type="email"
            required
            placeholder="you@email.com"
          />
          <Select
            control={form.control}
            name="campaignCategory"
            label="Campaign"
            required
            placeholder="Select a campaign category"
            options={campaignOptions}
          />
          <Select
            control={form.control}
            name="status"
            label="Status"
            required
            options={STATUS_OPTIONS}
          />
          <div className="space-y-1.5">
            <Textarea
              control={form.control}
              name="message"
              label="Message (optional)"
              placeholder="Tell us about your goal or what you hope to fund…"
              className="min-h-28"
            />
            <Typography
              variant="caption"
              color="muted"
              className="block text-right tabular-nums"
            >
              {message.length}/500
            </Typography>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <GoldButton type="submit" disabled={updateState.isLoading}>
              {updateState.isLoading ? <ButtonSpinner /> : null}
              Save changes
            </GoldButton>
          </div>
        </FormCommon>
      )}
    </DrawerCommon>
  );
}
