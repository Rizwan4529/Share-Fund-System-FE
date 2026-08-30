import { z } from "zod";

import { LEGAL_DOCUMENT_TYPES } from "@/types/auth";

export const legalDocumentFormSchema = z.object({
  documentType: z.enum(LEGAL_DOCUMENT_TYPES, {
    error: "Document type is required",
  }),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  effectiveDate: z.string().optional(),
});

export type LegalDocumentFormValues = z.infer<typeof legalDocumentFormSchema>;
