import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

import { DialogCommon } from "@/components/common/DialogCommon";
import {
  FormCommon,
  Input,
  RadioGroup,
  Select,
} from "@/components/common/FormCommon";
import { GoldButton } from "@/components/common/GoldButton";
import { ButtonSpinner } from "@/components/common/LoadingStates";
import { Typography } from "@/components/common/Typography";
import { InfoCallout, StatusChip } from "@/components/member/app";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  ACTIVATE_PROGRAM_DEFAULTS,
  activateProgramFormSchema,
  toCreateSelectionRequest,
  type ActivateProgramFormValues,
} from "@/lib/schemas/successCenterSelection";
import {
  OBLIGATION_TYPE_OPTIONS,
  PAYEE_TYPE_LABELS,
  PRICING_SOURCE_OPTIONS,
} from "@/lib/success-centers/labels";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { useCreateSelectionMutation } from "@/store/api/successCenterBrowseApi";
import {
  PAYEE_TYPES,
  type BrowseProgram,
} from "@/types/successCenterSelections";
import { ROUTES, activationPlanPath } from "@/utils/constants";

const PAYEE_TYPE_OPTIONS = PAYEE_TYPES.map((type) => ({
  value: type,
  label: PAYEE_TYPE_LABELS[type],
}));

type ProgramActivateActionProps = {
  program: Pick<BrowseProgram, "_id" | "name" | "status">;
  /** The participant already has an active selection for this program. */
  isSelected: boolean;
  /** Selections still loading — don't offer activation until we know. */
  isChecking?: boolean;
  className?: string;
};

/**
 * The single "activate" control for a program: coming-soon programs are
 * view-only, already-selected ones say so, published ones open the form.
 */
export function ProgramActivateAction({
  program,
  isSelected,
  isChecking = false,
  className,
}: ProgramActivateActionProps) {
  const [open, setOpen] = useState(false);

  if (program.status === "coming_soon") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Disabled buttons don't emit hover events; the span does. */}
              <span tabIndex={0} className="inline-flex">
                <GoldButton disabled className="pointer-events-none">
                  <Clock />
                  Activate this program
                </GoldButton>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              This program is coming soon and can't be activated yet.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Typography variant="caption" color="muted">
          Not yet available — you can still explore it.
        </Typography>
      </div>
    );
  }

  if (isSelected) {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <StatusChip tone="success">Selected</StatusChip>
        <GoldButton variant="ghost-outline" asChild>
          <Link to={ROUTES.MY_SELECTIONS}>View my programs</Link>
        </GoldButton>
      </div>
    );
  }

  return (
    <>
      <GoldButton
        className={className}
        disabled={isChecking}
        onClick={() => setOpen(true)}
      >
        Activate this program
      </GoldButton>
      <ActivateProgramDialog
        open={open}
        onOpenChange={setOpen}
        program={program}
      />
    </>
  );
}

function ActivateProgramDialog({
  open,
  onOpenChange,
  program,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Pick<BrowseProgram, "_id" | "name">;
}) {
  const currency = useAppSelector((state) => state.auth.user?.preferredCurrency);
  const [createSelection, createState] = useCreateSelectionMutation();
  // Id of the selection just created — drives the "View activation plan" link.
  const [activatedId, setActivatedId] = useState<string | null>(null);
  const activated = Boolean(activatedId);

  const form = useForm<ActivateProgramFormValues>({
    resolver: zodResolver(activateProgramFormSchema),
    defaultValues: ACTIVATE_PROGRAM_DEFAULTS,
  });
  const pricingSource = useWatch({ control: form.control, name: "pricingSource" });
  const amountSuffix = currency ? ` (${currency.toUpperCase()})` : "";

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset(ACTIVATE_PROGRAM_DEFAULTS);
      setActivatedId(null);
    }
    onOpenChange(next);
  };

  const onSubmit = async (values: ActivateProgramFormValues) => {
    // TODO(payments): enforce the paid selection allowance here (e.g. $50 = 1
    // program, $100 = 3) once funding-access purchases exist. The API will
    // also reject over-limit selections then; surface its message.
    try {
      const selection = await createSelection(
        toCreateSelectionRequest(program._id, values),
      ).unwrap();
      setActivatedId(selection._id);
    } catch (error) {
      const isDuplicate =
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === 409;
      toast.error(
        getApiErrorMessage(error, "Could not activate this program."),
      );
      // Already selected elsewhere (e.g. another tab): the refreshed list
      // now shows it as selected, so there's nothing left to do here.
      if (isDuplicate) handleOpenChange(false);
    }
  };

  return (
    <DialogCommon
      open={open}
      onOpenChange={handleOpenChange}
      title={activated ? "Program activated" : `Activate ${program.name}`}
      description={
        activated
          ? undefined
          : "Tell us a little about this goal. Only the first question is required."
      }
      className="sm:max-w-lg"
    >
      {activated ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            <Typography variant="body-sm" className="text-ink-heading">
              <strong>{program.name}</strong> is now one of your active
              programs.
            </Typography>
          </div>
          <InfoCallout>
            Next, see your recommendation — how much to activate, your
            payment pace options, and a projected timeline. These are
            estimates for planning, not guaranteed funding.
          </InfoCallout>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Done
            </Button>
            <GoldButton variant="ghost-outline" asChild>
              <Link to={ROUTES.MY_SELECTIONS}>View my programs</Link>
            </GoldButton>
            {activatedId ? (
              <GoldButton asChild>
                <Link to={activationPlanPath(activatedId)}>
                  View my recommendation
                </Link>
              </GoldButton>
            ) : null}
          </div>
        </div>
      ) : (
        <FormCommon form={form} onSubmit={onSubmit} className="space-y-5">
          <RadioGroup
            control={form.control}
            name="obligationType"
            label="Is this an existing bill or a new goal?"
            required
            options={OBLIGATION_TYPE_OPTIONS}
            className="grid gap-3"
          />
          <Input
            control={form.control}
            name="goalAmount"
            label={`Goal amount${amountSuffix}`}
            description="Optional — you can add or change this later."
            placeholder="12000"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
          />
          <RadioGroup
            control={form.control}
            name="pricingSource"
            label="Where does this amount come from?"
            options={PRICING_SOURCE_OPTIONS}
            className="grid gap-3"
          />
          {pricingSource === "verified" ? (
            <Input
              control={form.control}
              name="verifiedQuoteAmount"
              label={`Verified quote amount${amountSuffix}`}
              required
              placeholder="11500"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
            />
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              control={form.control}
              name="payeeName"
              label="Who gets paid?"
              placeholder="Optional"
            />
            <Select
              control={form.control}
              name="payeeType"
              label="Payee type"
              placeholder="Optional"
              options={PAYEE_TYPE_OPTIONS}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createState.isLoading}
            >
              Cancel
            </Button>
            <GoldButton type="submit" disabled={createState.isLoading}>
              {createState.isLoading ? <ButtonSpinner /> : null}
              Activate program
            </GoldButton>
          </div>
        </FormCommon>
      )}
    </DialogCommon>
  );
}
