import { Link } from "react-router-dom";
import type { Control } from "react-hook-form";

import { Checkbox } from "@/components/common/FormCommon";
import type { SignupFormValues } from "@/lib/schemas/auth";
import {
  SIGNUP_LEGAL_TYPES,
  type SignupLegalType,
} from "@/types/auth";

const SIGNUP_FIELDS: Record<SignupLegalType, keyof SignupFormValues> = {
  terms: "acceptTerms",
  privacy: "acceptPrivacy",
  founding_disclosure: "acceptFounding",
};

const SIGNUP_LINK_LABELS: Record<SignupLegalType, string> = {
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  founding_disclosure: "Founding Participant Disclosure",
};

function LegalAcceptLabel({ type }: { type: SignupLegalType }) {
  return (
    <span className="text-sm font-medium leading-snug text-ink-heading">
      Do you accept the{" "}
      <Link
        to={`/legal/${type}`}
        state={{ from: "signup" }}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-gold-dark underline underline-offset-2 hover:text-gold"
        onClick={(event) => event.stopPropagation()}
      >
        {SIGNUP_LINK_LABELS[type]}
      </Link>
      ?
    </span>
  );
}

export function SignupLegalStep({
  control,
}: {
  control: Control<SignupFormValues>;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      {SIGNUP_LEGAL_TYPES.map((type) => (
        <Checkbox
          key={type}
          control={control}
          name={SIGNUP_FIELDS[type]}
          required
          itemClassName="items-start"
          label={<LegalAcceptLabel type={type} />}
        />
      ))}
    </div>
  );
}
