import {
  LEGAL_DOCUMENT_TYPES,
  type LegalDocument,
  type LegalDocumentType,
} from "@/types/auth";

export type LegalDocumentRow = {
  documentType: LegalDocumentType;
  latest: LegalDocument | null;
  published: LegalDocument | null;
};

export function legalDocumentTypeLabel(type: string): string {
  return type
    .replaceAll("_", " ")
    .replace(/^./, (char) => char.toUpperCase());
}

export function legalDocumentTypeOptions(
  existingTypes: LegalDocumentType[] = [],
) {
  return LEGAL_DOCUMENT_TYPES.map((documentType) => ({
    value: documentType,
    label: existingTypes.includes(documentType)
      ? `${legalDocumentTypeLabel(documentType)} (already added)`
      : legalDocumentTypeLabel(documentType),
    disabled: existingTypes.includes(documentType),
  }));
}

export function summarizeLegalDocuments(
  documents: LegalDocument[],
): LegalDocumentRow[] {
  return LEGAL_DOCUMENT_TYPES.map((documentType) => {
    const versions = documents
      .filter((document) => document.documentType === documentType)
      .sort((a, b) => b.version - a.version);
    return {
      documentType,
      latest: versions[0] ?? null,
      published: versions.find((document) => document.status === "published") ?? null,
    };
  });
}
