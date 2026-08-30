import { Link, useParams } from "react-router-dom";
import { CircleAlert } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { useGetLegalDocumentQuery } from "@/store/api/legalApi";
import type { LegalDocumentType } from "@/types/auth";
import { ROUTES } from "@/utils/constants";

const LEGAL_TYPES: LegalDocumentType[] = [
  "disclaimer",
  "founding_disclosure",
  "terms",
  "privacy",
  "refund_policy",
  "checkout_acknowledgment",
  "success_center_notice",
  "partner_disclosure",
];

const LEGACY_KIND_MAP: Record<string, LegalDocumentType> = {
  partner_sponsored_notice: "partner_disclosure",
};

function resolveDocumentType(kind: string | undefined): LegalDocumentType {
  if (kind && Object.hasOwn(LEGACY_KIND_MAP, kind)) {
    return LEGACY_KIND_MAP[kind];
  }
  if (kind && LEGAL_TYPES.includes(kind as LegalDocumentType)) {
    return kind as LegalDocumentType;
  }
  return "disclaimer";
}

function formatUpdatedAt(value?: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function LegalPage() {
  const { kind } = useParams();
  const documentType = resolveDocumentType(kind);
  const { data, isLoading, isError, error } =
    useGetLegalDocumentQuery(documentType);

  return (
    <div className="min-h-svh bg-app-canvas px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          ← Back to login
        </Link>
        <nav className="mt-6 flex flex-wrap gap-2">
          {LEGAL_TYPES.map((type) => (
            <Link
              key={type}
              to={`/legal/${type}`}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold capitalize"
            >
              {type.replaceAll("_", " ")}
            </Link>
          ))}
        </nav>
        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <Spinner />
          </div>
        ) : null}
        {isError ? (
          <div className="mt-6">
            <EmptyState
              icon={CircleAlert}
              variant="error"
              title="Document unavailable"
              description={getApiErrorMessage(
                error,
                "No published document was found for this type.",
              )}
            />
          </div>
        ) : null}
        {data ? (
          <article className="mt-6 rounded-xl border border-border bg-card p-6 sm:p-8">
            <Typography variant="h2">{data.title}</Typography>
            <Typography
              variant="caption"
              className="mt-2 block text-muted-foreground"
            >
              Version {data.version} · Updated {formatUpdatedAt(data.updatedAt)}
            </Typography>
            <Typography
              variant="body"
              className="mt-6 whitespace-pre-wrap leading-relaxed"
            >
              {data.content}
            </Typography>
          </article>
        ) : null}
      </div>
    </div>
  );
}
