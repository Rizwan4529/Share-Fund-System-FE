import { Eye, EyeOff } from "lucide-react";
import {
  useFormState,
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  authInputClass,
  passwordStrength,
  STRENGTH_LABELS,
} from "@/components/auth/authStyles";
import { Input } from "@/components/common/FormCommon";
import { Typography } from "@/components/common/Typography";
import { cn } from "@/lib/utils";

type AuthPasswordFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  showLabel?: boolean;
  required?: boolean;
  showStrength?: boolean;
  showToggle?: boolean;
  showPw: boolean;
  onToggle: () => void;
};

export function AuthPasswordField<T extends FieldValues>({
  control,
  name,
  label = "Password",
  showLabel = true,
  required = false,
  showStrength = false,
  showToggle = true,
  showPw,
  onToggle,
}: AuthPasswordFieldProps<T>) {
  const pw = useWatch({ control, name }) ?? "";
  const strength = passwordStrength(pw);
  const { errors } = useFormState({ control, name });
  const message = errors[name]?.message;
  const errorMessage = typeof message === "string" ? message : null;

  return (
    <div className="flex flex-col gap-[7px]">
      {showLabel ? (
        <Typography
          variant="label"
          className="text-[13px] font-semibold text-[#33425f]"
        >
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </Typography>
      ) : null}
      <div className="relative">
        <Input
          control={control}
          name={name}
          type={showPw ? "text" : "password"}
          required={required}
          showMessage={false}
          className={cn(authInputClass, showToggle && "pr-11")}
        />
        {showToggle ? (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-light"
            onClick={onToggle}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : null}
      </div>
      {showStrength ? (
        <>
          <div className="flex gap-[5px]">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  strength >= i ? "bg-gold-dark" : "bg-line",
                )}
              />
            ))}
          </div>
          <Typography variant="caption" color="muted" className="text-[12.5px]">
            {STRENGTH_LABELS[strength] || "Enter a password"}
          </Typography>
        </>
      ) : null}
      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  );
}
