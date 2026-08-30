import type { Control } from "react-hook-form";

import { Checkbox } from "@/components/common/FormCommon";
import { Typography } from "@/components/common/Typography";
import type { SignupFormValues } from "@/lib/schemas/auth";
import type { SignupLegalType } from "@/types/auth";

const DUMMY_SIGNUP_DOCS: {
  type: SignupLegalType;
  title: string;
  field: keyof SignupFormValues;
  content: string;
}[] = [
  {
    type: "terms",
    title: "Terms",
    field: "acceptTerms",
    content:
      "Placeholder Terms of Use. Final wording will be published by the platform owner. Checking this box means you agree to the Terms for the purpose of creating your account.",
  },
  {
    type: "privacy",
    title: "Privacy Policy",
    field: "acceptPrivacy",
    content:
      "Placeholder Privacy Policy. Final wording will be published by the platform owner. Checking this box means you acknowledge how SFS may use the information you provide at signup.",
  },
  {
    type: "founding_disclosure",
    title: "Founding Participant disclosure",
    field: "acceptFounding",
    content:
      "Placeholder Founding Participant disclosure. Phase 1 is a planning and enrollment program — live funding is not active. Checking this box means you understand this disclosure.",
  },
];

export function SignupLegalStep({
  control,
}: {
  control: Control<SignupFormValues>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {DUMMY_SIGNUP_DOCS.map((doc) => (
        <div
          key={doc.type}
          className="rounded-brand border border-line bg-bg-card/60 p-3.5"
        >
          <Typography
            variant="label"
            className="mb-2 text-[13px] font-semibold text-[#33425f]"
          >
            {doc.title}
          </Typography>
          <div className="mb-3 max-h-32 overflow-y-auto whitespace-pre-wrap rounded-md border border-line bg-white px-3 py-2 text-[13px] leading-relaxed text-muted-soft">
            {doc.content}
          </div>
          <Checkbox
            control={control}
            name={doc.field}
            required
            label={`I accept the ${doc.title}`}
          />
        </div>
      ))}
    </div>
  );
}
