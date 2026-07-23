import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Typography } from "@/components/common/Typography";
import { getDisclosureByKind } from "@/lib/api/disclosures";
import type { DisclosureDoc, DisclosureKind } from "@/types";
import { ROUTES } from "@/utils/constants";

const KINDS: DisclosureKind[] = [
  "disclaimer",
  "founding_disclosure",
  "terms",
  "privacy",
  "refund_policy",
  "checkout_acknowledgment",
];

export default function LegalPage() {
  const { kind = "disclaimer" } = useParams();
  const [doc, setDoc] = useState<DisclosureDoc | null>(null);

  useEffect(() => {
    const k = (KINDS.includes(kind as DisclosureKind)
      ? kind
      : "disclaimer") as DisclosureKind;
    void getDisclosureByKind(k).then(setDoc);
  }, [kind]);

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
          {KINDS.map((k) => (
            <Link
              key={k}
              to={`/legal/${k}`}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold capitalize"
            >
              {k.replaceAll("_", " ")}
            </Link>
          ))}
        </nav>
        <article className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
          <Typography variant="h2">{doc?.title ?? "Legal"}</Typography>
          <Typography variant="caption" className="mt-2 block text-muted-foreground">
            Version {doc?.version ?? "—"} · Updated {doc?.updatedAt ?? "—"}
          </Typography>
          <Typography variant="body" className="mt-6 whitespace-pre-wrap leading-relaxed">
            {doc?.body ?? "Loading…"}
          </Typography>
        </article>
      </div>
    </div>
  );
}
