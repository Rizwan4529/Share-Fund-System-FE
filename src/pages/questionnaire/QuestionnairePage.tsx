import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { GoldButton } from "@/components/common/GoldButton";
import { Typography } from "@/components/common/Typography";
import { AppPageContainer, AppSurfaceCard } from "@/components/member/app";
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
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <div className="mb-6 max-w-2xl">
        <Typography variant="h2">BMIS questionnaire</Typography>
        <Typography variant="body" className="mt-2 text-muted-foreground">
          Placeholder questions until the final BMIS set is provided. Your
          answers drive rule-based budget and timeline projections (simulations
          only — no live funding).
        </Typography>
      </div>

      <AppSurfaceCard className="max-w-2xl p-6">
        <form className="space-y-5" onSubmit={onSubmit}>
          {PLACEHOLDER_QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-2">
              <Label htmlFor={q.id}>{q.label}</Label>
              {q.id === "situation" ? (
                <Textarea
                  id={q.id}
                  placeholder={q.placeholder}
                  value={values[q.id] ?? ""}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [q.id]: e.target.value }))
                  }
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
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Back to dashboard
            </Link>
          </div>
        </form>
      </AppSurfaceCard>
    </AppPageContainer>
  );
}
