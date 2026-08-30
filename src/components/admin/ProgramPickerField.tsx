import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Typography } from "@/components/common/Typography";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { SuccessCenterProgramOption } from "@/types/founderPlans";

type ProgramPickerFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  required?: boolean;
  programs: SuccessCenterProgramOption[];
  disabled?: boolean;
};

export function ProgramPickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required,
  programs,
  disabled,
}: ProgramPickerFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = (
          Array.isArray(field.value) ? field.value : []
        ) as string[];

        const toggle = (id: string, checked: boolean) => {
          const next = checked
            ? [...selected, id]
            : selected.filter((value) => value !== id);
          field.onChange(next);
        };

        return (
          <FormItem>
            <FormLabel>
              <Typography
                as="span"
                variant="label"
                className="inline-flex items-center gap-0.5"
              >
                {label}
                {required ? (
                  <span className="font-semibold text-destructive">*</span>
                ) : null}
              </Typography>
            </FormLabel>
            <FormControl>
              <div className="max-h-52 space-y-2 overflow-y-auto rounded-md border border-border-input p-3">
                {programs.length === 0 ? (
                  <Typography variant="body-sm" color="muted">
                    No success center programs are available yet. Seed the
                    database first.
                  </Typography>
                ) : (
                  programs.map((program) => (
                    <label
                      key={program._id}
                      className="flex items-center gap-2 text-sm text-ink-heading"
                    >
                      <Checkbox
                        checked={selected.includes(program._id)}
                        disabled={disabled}
                        onCheckedChange={(checked) =>
                          toggle(program._id, checked === true)
                        }
                      />
                      {program.name}
                    </label>
                  ))
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
