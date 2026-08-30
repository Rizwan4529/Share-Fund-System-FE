import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DrawerCommon } from "../common/DrawerCommon";
import { DatePicker, FormCommon, Input, Select } from "../common/FormCommon";
import { GoldButton } from "../common/GoldButton";
import { Spinner } from "../common/LoadingScreen";
import { ButtonSpinner } from "../common/LoadingStates";
import { RichTextField } from "../common/RichTextField";
import { Typography } from "../common/Typography";
import { Button } from "../ui/button";
import { getApiErrorMessage } from "../../lib/api/getApiErrorMessage";
import { sanitizeLegalHtml, toEditorHtml } from "../../lib/legal/html";
import {
  legalDocumentTypeLabel,
  legalDocumentTypeOptions,
} from "../../lib/legal/labels";
import { optionalTrimmed, toDateInput } from "../../lib/settings/value";
import {
  legalDocumentFormSchema,
  type LegalDocumentFormValues,
} from "../../lib/schemas/legal";
import {
  useCreateLegalDocumentMutation,
  useListLegalDocumentVersionsQuery,
  usePublishLegalDocumentMutation,
  useUpdateLegalDocumentMutation,
} from "../../store/api/legalApi";
import {
  LEGAL_DOCUMENT_TYPES,
  type LegalDocumentType,
} from "../../types/auth";

type LegalDocumentFormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  documentType: LegalDocumentType | null;
  existingTypes?: LegalDocumentType[];
};

const EMPTY_FORM = (
  documentType?: LegalDocumentType | null,
): LegalDocumentFormValues => ({
  documentType: documentType ?? "terms",
  title: "",
  content: "",
  effectiveDate: "",
});

export function LegalDocumentFormDrawer({
  open,
  onOpenChange,
  mode,
  documentType,
  existingTypes = [],
}: LegalDocumentFormDrawerProps) {
  const close = () => onOpenChange(false);
  const versionsQuery = useListLegalDocumentVersionsQuery(documentType ?? "terms", {
    skip: !open || mode !== "edit" || !documentType,
  });
  const [createDocument, createState] = useCreateLegalDocumentMutation();
  const [updateDocument, updateState] = useUpdateLegalDocumentMutation();
  const [publishDocument, publishState] = usePublishLegalDocumentMutation();

  const versions = versionsQuery.data ?? [];
  const latest = versions[0];
  const isDraft = latest?.status === "draft";
  const typeOptions = legalDocumentTypeOptions(existingTypes);
  const canCreateAny = typeOptions.some((option) => !option.disabled);

  const form = useForm<LegalDocumentFormValues>({
    resolver: zodResolver(legalDocumentFormSchema),
    defaultValues: EMPTY_FORM(documentType),
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      const firstAvailable =
        documentType && !existingTypes.includes(documentType)
          ? documentType
          : (LEGAL_DOCUMENT_TYPES.find((type) => !existingTypes.includes(type)) ??
            "terms");
      form.reset(EMPTY_FORM(firstAvailable));
      return;
    }
    if (!documentType || !latest) return;
    form.reset({
      documentType,
      title: latest.title,
      content: toEditorHtml(latest.content),
      effectiveDate: toDateInput(latest.effectiveDate),
    });
  }, [open, mode, documentType, latest, existingTypes, form]);

  const busy =
    createState.isLoading || updateState.isLoading || publishState.isLoading;
  const selectedType = form.watch("documentType");

  const onSave = async (values: LegalDocumentFormValues) => {
    const content = sanitizeLegalHtml(toEditorHtml(values.content));
    try {
      if (mode === "create") {
        await createDocument({
          documentType: values.documentType,
          title: values.title.trim(),
          content,
        }).unwrap();
        toast.success("Draft created. Publish it when the wording is final.");
        close();
        return;
      }
      if (!documentType) return;
      await updateDocument({
        documentType,
        title: values.title.trim(),
        content,
      }).unwrap();
      toast.success(
        latest?.status === "published"
          ? "New draft version created. Publish it to go live."
          : "Draft updated.",
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save document."));
    }
  };

  const onPublish = async () => {
    if (!documentType || !latest) return;
    const values = form.getValues();
    const content = sanitizeLegalHtml(toEditorHtml(values.content));
    try {
      let version = latest.version;
      if (
        values.title.trim() !== latest.title ||
        content !== latest.content
      ) {
        const saved = await updateDocument({
          documentType,
          title: values.title.trim(),
          content,
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
      ? "Add legal document"
      : `Edit ${legalDocumentTypeLabel(documentType ?? selectedType)}`;

  return (
    <DrawerCommon
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Choose the document type, then write the wording in the rich editor. Saving a published document creates a new draft."
      className="sm:max-w-lg md:max-w-2xl"
    >
      {mode === "edit" && versionsQuery.isLoading ? (
        <div className="flex min-h-40 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <FormCommon form={form} onSubmit={onSave} className="space-y-4">
          <Select
            control={form.control}
            name="documentType"
            label="Document type"
            required
            disabled={mode === "edit"}
            placeholder="Select a document type"
            options={
              mode === "edit"
                ? [
                    {
                      value: documentType ?? selectedType,
                      label: legalDocumentTypeLabel(
                        documentType ?? selectedType,
                      ),
                    },
                  ]
                : typeOptions
            }
          />
          {mode === "create" && !canCreateAny ? (
            <>
              <Typography variant="body-sm" color="muted">
                Every document type already has a version. Edit an existing
                document to create a new draft.
              </Typography>
              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={close}>
                  Close
                </Button>
              </div>
            </>
          ) : null}
          {mode === "create" && !canCreateAny ? null : (
            <>
          <Input
            control={form.control}
            name="title"
            label="Title"
            required
            placeholder="Terms of Use"
          />
          <RichTextField
            control={form.control}
            name="content"
            label="Content"
            required
            placeholder="Write the legal document…"
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
            </>
          )}
        </FormCommon>
      )}
    </DrawerCommon>
  );
}
