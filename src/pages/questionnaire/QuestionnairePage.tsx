import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import {
  AppPageContainer,
  AppSurfaceCard,
  InfoCallout,
  ParticipantPageHeader,
  SectionLabel,
} from "@/components/member/app";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  PLACEHOLDER_QUESTIONS,
  getQuestionnaire,
  saveQuestionnaire,
} from "@/lib/api/questionnaire";
import type { QuestionnaireAnswer } from "@/types";
import { ROUTES } from "@/utils/constants";

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getQuestionnaire();
        const map: Record<string, string> = {};
        for (const a of data.answers) map[a.questionId] = a.value;
        setValues(map);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const answers: QuestionnaireAnswer[] = PLACEHOLDER_QUESTIONS.map((q) => ({
      questionId: q.id,
      questionLabel: q.label,
      value: values[q.id]?.trim() ?? "",
    }));
    if (!answers[0]?.value || !answers[1]?.value || !answers[2]?.value) {
      toast.error("Please answer the required goal and amount questions.");
      return;
    }
    setSaving(true);
    try {
      await saveQuestionnaire(answers);
      await refresh();
      toast.success("Questionnaire saved. Projection generated.");
      navigate(ROUTES.RECOMMENDATION);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppPageContainer>
        <div className="h-40 animate-pulse rounded-panel bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <ParticipantPageHeader
        overline="BMIS intake"
        title="Questionnaire"
        subtitle="Placeholder questions until the final BMIS set is provided. Answers drive projection simulations only."
      />

      <InfoCallout className="mb-6 max-w-2xl">
        No live funding is involved. Your answers feed a rule-based planning
        budget and timeline estimate.
      </InfoCallout>

      <AppSurfaceCard className="max-w-2xl">
        <SectionLabel tone="info">Your answers</SectionLabel>
        <form className="mt-5 space-y-5" onSubmit={onSubmit}>
          {PLACEHOLDER_QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-2">
              <Label htmlFor={q.id} className="text-sm font-semibold text-ink-heading">
                {q.label}
              </Label>
              {q.id === "situation" ? (
                <Textarea
                  id={q.id}
                  placeholder={q.placeholder}
                  value={values[q.id] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [q.id]: e.target.value }))
                  }
                  className="min-h-24"
                />
              ) : (
                <Input
                  id={q.id}
                  placeholder={q.placeholder}
                  value={values[q.id] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [q.id]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <GoldButton type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save & view projections"}
            </GoldButton>
            <GoldButton variant="ghost-outline" asChild>
              <Link to={ROUTES.DASHBOARD}>Back to dashboard</Link>
            </GoldButton>
          </div>
        </form>
      </AppSurfaceCard>

      <Typography variant="caption" className="mt-4 block text-muted-soft">
        Final question wording is an open item from Todd.
      </Typography>
    </AppPageContainer>
  );
}
