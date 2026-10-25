import { StatusChip } from "@/components/member/app";
import { resolveCategoryIcon } from "@/lib/app/categoryIcons";
import {
  GOAL_NATURE_LABELS,
  PARTICIPANT_PROGRAM_TYPE_LABELS,
} from "@/lib/success-centers/labels";
import { cn } from "@/lib/utils";
import type { BrowseProgram } from "@/types/successCenterSelections";

/** Category icon tile — an admin-set icon key or emoji, else one from the slug. */
export function CategoryIconBadge({
  icon,
  slug,
  className,
}: {
  icon?: string;
  slug?: string;
  className?: string;
}) {
  const resolved = resolveCategoryIcon(icon, slug);
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-bg-icon text-gold-dark",
        className,
      )}
    >
      {resolved.Icon ? (
        <resolved.Icon className="size-5" />
      ) : (
        <span className="text-xl leading-none">{resolved.emoji}</span>
      )}
    </span>
  );
}

/** One-time/recurring + funding/planning tags, plus "Coming soon" when relevant. */
export function ProgramTags({
  program,
  className,
}: {
  program: Pick<BrowseProgram, "goalNature" | "programType" | "status">;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {program.status === "coming_soon" ? (
        <StatusChip tone="gold">Coming soon</StatusChip>
      ) : null}
      <StatusChip tone="info">{GOAL_NATURE_LABELS[program.goalNature]}</StatusChip>
      <StatusChip tone="navy">
        {PARTICIPANT_PROGRAM_TYPE_LABELS[program.programType]}
      </StatusChip>
    </div>
  );
}
