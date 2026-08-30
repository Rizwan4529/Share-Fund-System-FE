import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerCommon } from "@/components/common/DrawerCommon";
import {
  DatePicker,
  FormCommon,
  Input,
  Textarea,
} from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { Spinner } from "@/components/common/LoadingScreen";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { legalDocumentTypeLabel } from "@/lib/legal/labels";
import { optionalTrimmed, toDateInput } from "@/lib/settings/value";
import {
  legalDocumentFormSchema,
  type LegalDocumentFormValues,
} from "@/lib/schemas/legal";
import {
  useCreateLegalDocumentMutation,
  useListLegalDocumentVersionsQuery,
  usePublishLegalDocumentMutation,
  useUpdateLegalDocumentMutation,
} from "@/store/api/legalApi";
import type { LegalDocumentType } from "@/types/auth";

type LegalDocumentFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  documentType: LegalDocumentType | null;
};

const EMPTY_FORM = (
  documentType: LegalDocumentType,
): LegalDocumentFormValues => ({
  documentType,
  title: "",
  content: "",
  effectiveDate: "",
});

export function LegalDocumentFormDrawer({
  open,
  onOpenChange,
  mode,
  documentType,
}: LegalDocumentFormDrawerProps) {
  const close = () => onOpenChange(false);
  const type = documentType ?? "terms";
  const versionsQuery = useListLegalDocumentVersionsQuery(type, {
    skip: !open || mode !== "edit" || !documentType,
  });
  const [createDocument, createState] = useCreateLegalDocumentMutation();
  const [updateDocument, updateState] = useUpdateLegalDocumentMutation();
  const [publishDocument, publishState] = usePublishLegalDocumentMutation();

  const versions = versionsQuery.data ?? [];
  const latest = versions[0];
  const isDraft = latest?.status === "draft";

  const form = useForm<LegalDocumentFormValues>({
    resolver: zodResolver(legalDocumentFormSchema),
    defaultValues: EMPTY_FORM(type),
  });

  useEffect(() => {
    if (!open || !documentType) return;
    if (mode === "create") {
      form.reset(EMPTY_FORM(documentType));
      return;
    }
    if (!latest) return;
    form.reset({
      documentType,
      title: latest.title,
      content: latest.content,
      effectiveDate: toDateInput(latest.effectiveDate),
    });
  }, [open, mode, documentType, latest, form]);

  const busy =
    createState.isLoading || updateState.isLoading || publishState.isLoading;

  const onSave = async (values: LegalDocumentFormValues) => {
    if (!documentType) return;
    try {
      if (mode === "create") {
        await createDocument({
          documentType,
          title: values.title.trim(),
          content: values.content.trim(),
        }).unwrap();
        toast.success("Draft created. Publish it when the wording is final.");
      } else {
        await updateDocument({
          documentType,
          title: values.title.trim(),
          content: values.content.trim(),
        }).unwrap();
        toast.success(
          latest?.status === "published"
            ? "New draft version created. Publish it to go live."
            : "Draft updated.",
        );
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save document."));
    }
  };

  const onPublish = async () => {
    if (!documentType || !latest) return;
    const values = form.getValues();
    try {
      let version = latest.version;
      if (
        values.title.trim() !== latest.title ||
        values.content.trim() !== latest.content
      ) {
        const saved = await updateDocument({
          documentType,
          title: values.title.trim(),
          content: values.content.trim(),
        }).unwrap();
        version = saved.version;
      }
      await publishDocument({
        documentType,
        version,
        effectiveDate: optionalTrimmed(values.effectiveDate),
      }).unwrap();
      toast.success("Document published.");
      close();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not publish document."));
    }
  };

  const title =
    mode === "create"
      ? `Add ${legalDocumentTypeLabel(type)}`
      : `Edit ${legalDocumentTypeLabel(type)}`;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Saving a published document creates a new draft. Old versions stay retrievable for acceptances."
    >
      {mode === "edit" && versionsQuery.isLoading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <FormCommon form={form} onSubmit={onSave} className="space-y-4">
          <Input
            control={form.control}
            name="title"
            label="Title"
            required
            placeholder="Terms of Use"
          />
          <Textarea
            control={form.control}
            name="content"
            label="Content"
            required
            rows={12}
            placeholder="Document body"
          />
          {isDraft ? (
            <DatePicker
              control={form.control}
              name="effectiveDate"
              label="Effective date"
              calendarYearsFuture={10}
            />
          ) : null}
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" variant="outline" disabled={busy}>
              {createState.isLoading || updateState.isLoading ? (
                <ButtonSpinner className="size-4" />
              ) : null}
              {mode === "create" ? "Create draft" : "Save draft"}
            </Button>
            {mode === "edit" && isDraft ? (
              <GoldButton
                type="button"
                disabled={busy}
                onClick={() => void onPublish()}
              >
                {publishState.isLoading ? (
                  <ButtonSpinner className="size-4" />
                ) : null}
                Publish
              </GoldButton>
            ) : null}
          </div>
          {mode === "edit" && versions.length > 0 ? (
            <div className="space-y-3 border-t border-border pt-4">
              <Typography variant="label">Version history</Typography>
              <ol className="space-y-2">
                {versions.map((version) => (
                  <li
                    key={version._id}
                    className="rounded-md border border-border bg-muted/30 px-3 py-2.5"
                  >
                    <Typography
                      variant="body-sm"
                      className="font-medium text-ink-heading"
                    >
                      v{version.version} · {version.status}
                    </Typography>
                    <Typography variant="caption" color="muted">
                      {version.title}
                    </Typography>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </FormCommon>
      )}
    </DrawerCommon>
  );
}
