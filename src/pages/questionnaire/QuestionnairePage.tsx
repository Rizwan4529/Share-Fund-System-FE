import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  ParticipantPageHeader,
  SectionLabel,
} from "@/components/member/app";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  getSuccessProfile,
  saveSuccessProfile,
} from "@/lib/api/questionnaire";
import {
  REQUIRED_PROFILE_FIELDS,
  SUCCESS_PROFILE_STEPS,
  type FieldDef,
} from "@/lib/questionnaire/schema";
import { cn } from "@/lib/utils";
import {
  useListSuccessCenterCategoriesQuery,
  useListSuccessCenterProgramsQuery,
} from "@/store/api/successCentersApi";
import type { SuccessProfile } from "@/types";
import type {
  SuccessCenterCategory,
  SuccessCenterProgram,
} from "@/types/successCenters";
import { ROUTES } from "@/utils/constants";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<SuccessProfile | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categoriesQuery = useListSuccessCenterCategoriesQuery();
  const programsQuery = useListSuccessCenterProgramsQuery({
    status: "published",
  });

  const categories = useMemo(
    () =>
      (categoriesQuery.data ?? [])
        .filter((c) => c.status === "active")
        .slice()
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [categoriesQuery.data],
  );

  useEffect(() => {
    void (async () => {
      try {
        const data = await getSuccessProfile();
        setProfile(data.profile);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const programs = useMemo(() => {
    if (!profile?.selectedCategoryId) return [] as SuccessCenterProgram[];
    return (programsQuery.data ?? []).filter(
      (p) => String(p.categoryId) === profile.selectedCategoryId,
    );
  }, [programsQuery.data, profile?.selectedCategoryId]);

  const step = SUCCESS_PROFILE_STEPS[stepIdx]!;
  const isLast = stepIdx === SUCCESS_PROFILE_STEPS.length - 1;
  const pageLoading =
    loading ||
    !profile ||
    categoriesQuery.isLoading ||
    programsQuery.isLoading;

  const set = (key: keyof SuccessProfile, value: SuccessProfile[keyof SuccessProfile]) =>
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));

  const missingRequired = (): boolean => {
    if (!profile) return true;
    const stepRequired = step.fields.filter((f) => f.required);
    return stepRequired.some((f) => {
      const v = profile[f.key];
      if (typeof v === "boolean") return !v;
      if (typeof v === "number") return !(v > 0);
      return String(v ?? "").trim().length === 0;
    });
  };

  const next = () => {
    if (missingRequired()) {
      toast.error("Please complete the required fields on this step.");
      return;
    }
    setStepIdx((i) => Math.min(i + 1, SUCCESS_PROFILE_STEPS.length - 1));
  };

  const back = () => setStepIdx((i) => Math.max(i - 1, 0));

  const submit = async () => {
    if (!profile) return;
    const missing = REQUIRED_PROFILE_FIELDS.filter((key) => {
      const v = profile[key];
      if (typeof v === "boolean") return !v;
      if (typeof v === "number") return !(v > 0);
      return String(v ?? "").trim().length === 0;
    });
    if (missing.length > 0) {
      toast.error("Some required Success Profile fields are still missing.");
      return;
    }
    setSaving(true);
    try {
      await saveSuccessProfile(profile);
      await refresh();
      toast.success("Success Profile saved. Your BMIS projection is ready.");
      navigate(ROUTES.RECOMMENDATION);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <AppPageContainer>
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="BMIS · Success Profile"
        title="Success Profile"
        subtitle="A short intake that powers your rule-based BMIS planning projections. No live funding is involved."
      />

      <ol className="mb-6 flex flex-wrap gap-2">
        {SUCCESS_PROFILE_STEPS.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => i <= stepIdx && setStepIdx(i)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-primary bg-primary-light text-primary-foreground"
                    : done
                      ? "border-info/40 bg-info-bg/50 text-info"
                      : "border-line bg-bg-card text-muted-soft",
                )}
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-current/15 text-[10px]">
                  {done ? <Check className="size-3" /> : i + 1}
                </span>
                {s.title}
              </button>
            </li>
          );
        })}
      </ol>

      <AppSurfaceCard className="max-w-2xl">
        <SectionLabel tone="info">{step.title}</SectionLabel>
        <Typography variant="body-sm" className="mt-1.5 text-muted-soft">
          {step.description}
        </Typography>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {step.fields.map((field) => {
            if (field.showWhen && !profile[field.showWhen]) return null;
            const isWide =
              field.type === "textarea" ||
              field.type === "boolean" ||
              field.type === "category" ||
              field.type === "program";
            return (
              <div
                key={String(field.key)}
                className={cn("space-y-2", isWide && "sm:col-span-2")}
              >
                <QuestionnaireField
                  field={field}
                  profile={profile}
                  categories={categories}
                  programs={programs}
                  onChange={set}
                />
                {field.help ? (
                  <p className="text-xs text-muted-soft">{field.help}</p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <GoldButton variant="ghost-outline" asChild>
            <Link to={ROUTES.DASHBOARD}>Save & exit</Link>
          </GoldButton>
          <div className="flex gap-2">
            {stepIdx > 0 ? (
              <GoldButton variant="ghost-outline" onClick={back}>
                Back
              </GoldButton>
            ) : null}
            {isLast ? (
              <GoldButton onClick={() => void submit()} disabled={saving}>
                {saving ? "Saving…" : "Generate projection"}
              </GoldButton>
            ) : (
              <GoldButton onClick={next}>Continue</GoldButton>
            )}
          </div>
        </div>
      </AppSurfaceCard>
    </AppPageContainer>
  );
}

function QuestionnaireField({
  field,
  profile,
  categories,
  programs,
  onChange,
}: {
  field: FieldDef;
  profile: SuccessProfile;
  categories: SuccessCenterCategory[];
  programs: SuccessCenterProgram[];
  onChange: (
    key: keyof SuccessProfile,
    value: SuccessProfile[keyof SuccessProfile],
  ) => void;
}) {
  const id = `q-${String(field.key)}`;
  const value = profile[field.key];

  const numberValue = (v: SuccessProfile[keyof SuccessProfile]) =>
    typeof v === "number" && v > 0 ? String(v) : "";

  if (field.type === "boolean") {
    return (
      <label
        htmlFor={id}
        className="flex items-start gap-3 rounded-lg border border-line bg-bg-card px-3.5 py-3"
      >
        <Checkbox
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(v) => onChange(field.key, v === true)}
        />
        <span className="text-sm leading-snug text-ink-heading">
          {field.label}
        </span>
      </label>
    );
  }

  return (
    <>
      <Label htmlFor={id} className="text-sm font-semibold text-ink-heading">
        {field.label}
        {field.required ? <span className="text-error"> *</span> : null}
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          id={id}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="min-h-24"
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          className={selectClass}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "category" ? (
        <select
          id={id}
          className={selectClass}
          value={String(value ?? "")}
          onChange={(e) => {
            onChange(field.key, e.target.value);
            onChange("selectedProgramId", "");
          }}
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      ) : field.type === "program" ? (
        <select
          id={id}
          className={selectClass}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">Select a program…</option>
          {programs.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      ) : field.type === "date" ? (
        <Input
          id={id}
          type="date"
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      ) : field.type === "number" || field.type === "currency" ? (
        <Input
          id={id}
          type="number"
          min={0}
          inputMode="numeric"
          placeholder={field.placeholder}
          value={numberValue(value)}
          onChange={(e) =>
            onChange(field.key, e.target.value === "" ? 0 : Number(e.target.value))
          }
        />
      ) : (
        <Input
          id={id}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )}
    </>
  );
}
