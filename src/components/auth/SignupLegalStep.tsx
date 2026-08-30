import type { Control } from "react-hook-form";
import { CircleAlert } from "lucide-react";

import { Checkbox } from "@/components/common/FormCommon";
import { EmptyState } from "@/components/common/EmptyState";
import { LegalDocumentHtml } from "@/components/common/LegalDocumentHtml";
import { Spinner } from "@/components/common/LoadingScreen";
import { Typography } from "@/components/common/Typography";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { SignupFormValues } from "@/lib/schemas/auth";
import { useGetLegalDocumentQuery } from "@/store/api/legalApi";
import {
  SIGNUP_LEGAL_TYPES,
  type LegalDocument,
  type SignupLegalType,
} from "@/types/auth";

const SIGNUP_FIELDS: Record<SignupLegalType, keyof SignupFormValues> = {
  terms: "acceptTerms",
  privacy: "acceptPrivacy",
  founding_disclosure: "acceptFounding",
};

function SignupLegalDocument({
  type,
  control,
}: {
  type: SignupLegalType;
  control: Control<SignupFormValues>;
}) {
  const query = useGetLegalDocumentQuery(type);

  if (query.isLoading) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-brand border border-line bg-bg-card/60">
        <Spinner />
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <EmptyState
        icon={CircleAlert}
        variant="error"
        title="Document unavailable"
        description={getApiErrorMessage(
          query.error,
          "This published legal document could not be loaded.",
        )}
      />
    );
  }

  const document: LegalDocument = query.data;

  return (
    <div className="rounded-brand border border-line bg-bg-card/60 p-3.5">
      <Typography
        variant="label"
        className="mb-1 text-[13px] font-semibold text-[#33425f]"
      >
        {document.title}
      </Typography>
      <Typography variant="caption" color="muted" className="mb-2 block">
        Version {document.version}
      </Typography>
      <div className="mb-3 max-h-32 overflow-y-auto rounded-md border border-line bg-white px-3 py-2">
        <LegalDocumentHtml
          className="text-[13px] text-muted-soft"
          content={document.content}
        />
      </div>
      <Checkbox
        control={control}
        name={SIGNUP_FIELDS[type]}
        required
        label={`I accept the ${document.title}`}
      />
    </div>
  );
}

export function useSignupLegalReady(skip = false) {
  const terms = useGetLegalDocumentQuery("terms", { skip });
  const privacy = useGetLegalDocumentQuery("privacy", { skip });
  const founding = useGetLegalDocumentQuery("founding_disclosure", { skip });
  const queries = [terms, privacy, founding];
  return {
    isLoading: !skip && queries.some((query) => query.isLoading),
    isReady: !skip && queries.every((query) => Boolean(query.data) && !query.isError),
  };
}

export function SignupLegalStep({
  control,
}: {
  control: Control<SignupFormValues>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {SIGNUP_LEGAL_TYPES.map((type) => (
        <SignupLegalDocument key={type} type={type} control={control} />
      ))}
    </div>
  );
}
