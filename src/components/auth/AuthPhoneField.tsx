import { useEffect, useMemo, useState, useTransition } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useWatch } from "react-hook-form";

import { ButtonSpinner } from "@/components/common/LoadingStates";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { authInputClass } from "@/components/auth/authStyles";
import { cn } from "@/lib/utils";
import {
  COUNTRY_DIRECTORY,
  composeInternationalPhone,
  dialCodeLabel,
  findCountryByName,
  formatDialPrefix,
  stripDialPrefix,
  type CountryOption,
} from "@/utils/countries";

type AuthPhoneFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  /** Country form field — when it changes, dial code auto-syncs (still editable). */
  countryFieldName?: FieldPath<TFieldValues>;
  label?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
  /** External signal that dial-code sync is in progress (from country picker). */
  syncing?: boolean;
  /** Apply a dial country from outside (e.g. country picker selection). */
  syncCountry?: CountryOption | null;
};

export function AuthPhoneField<TFieldValues extends FieldValues>({
  control,
  name,
  countryFieldName,
  label = "Phone",
  required,
  description = "",
  disabled,
  className,
  itemClassName,
  syncing = false,
  syncCountry = null,
}: AuthPhoneFieldProps<TFieldValues>) {
  const [dialCountry, setDialCountry] = useState<CountryOption | undefined>();
  const [national, setNational] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const items = useMemo(() => COUNTRY_DIRECTORY, []);

  const countryValue = useWatch({
    control,
    name: (countryFieldName ?? name) as FieldPath<TFieldValues>,
    disabled: !countryFieldName,
  });

  const phoneValue = useWatch({ control, name });

  // Keep dial country in sync when the Country field changes.
  useEffect(() => {
    if (!countryFieldName) return;
    const matched = findCountryByName(String(countryValue ?? ""));
    if (!matched) return;
    if (dialCountry?.code === matched.code) return;
    startTransition(() => {
      setDialCountry(matched);
    });
  }, [countryFieldName, countryValue, dialCountry?.code]);

  // Explicit sync from parent (shows loader while parent sets syncing).
  useEffect(() => {
    if (!syncCountry) return;
    if (dialCountry?.code === syncCountry.code) return;
    startTransition(() => {
      setDialCountry(syncCountry);
    });
  }, [syncCountry, dialCountry?.code]);

  // Hydrate national digits once from the stored phone value.
  useEffect(() => {
    if (hydrated || !dialCountry) return;
    const raw = String(phoneValue ?? "");
    if (!raw) {
      setHydrated(true);
      return;
    }
    const stripped = stripDialPrefix(raw, dialCountry);
    if (stripped) setNational(stripped);
    setHydrated(true);
  }, [dialCountry, phoneValue, hydrated]);

  const busy = syncing || isPending;
  const prefix = dialCountry ? formatDialPrefix(dialCountry) : "";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const applyCompose = (
          nextDial: CountryOption | undefined,
          nextNational: string,
        ) => {
          const composed = composeInternationalPhone(nextDial, nextNational);
          const nextPrefix = nextDial ? formatDialPrefix(nextDial) : "";
          // Don't persist prefix-only values — treat as empty until digits exist.
          field.onChange(
            !nextDial || !nextNational.replace(/\D/g, "")
              ? ""
              : composed === nextPrefix
                ? ""
                : composed,
          );
        };

        const onDialChange = (next: CountryOption | null) => {
          if (!next) return;
          startTransition(() => {
            setDialCountry(next);
            const nextNational =
              national || stripDialPrefix(String(field.value ?? ""), next);
            setNational(nextNational);
            applyCompose(next, nextNational);
          });
          setCodeOpen(false);
        };

        const onNationalChange = (raw: string) => {
          let cleaned = raw;
          if (prefix && cleaned.startsWith(prefix)) {
            cleaned = cleaned.slice(prefix.length);
          }
          cleaned = cleaned.replace(/[^\d\s()-]/g, "");
          setNational(cleaned);
          applyCompose(dialCountry, cleaned);
        };

        return (
          <FormItem className={itemClassName}>
            {label ? (
              <FormLabel>
                {label}
                {required ? <span className="text-error"> *</span> : null}
              </FormLabel>
            ) : null}

            <div className={cn("flex gap-2", className)}>
              <Combobox
                items={items}
                value={dialCountry ?? null}
                onValueChange={(next) =>
                  onDialChange(next as CountryOption | null)
                }
                itemToStringValue={(item) =>
                  dialCodeLabel(item as CountryOption)
                }
                open={codeOpen}
                onOpenChange={setCodeOpen}
                disabled={disabled || busy}
              >
                <ComboboxTrigger
                  className={cn(
                    authInputClass,
                    "flex w-[min(42%,9.5rem)] shrink-0 items-center justify-between gap-1.5 px-2.5 text-left font-normal",
                    !dialCountry && "text-muted-light",
                    busy && "[&>svg:last-child]:hidden",
                  )}
                  disabled={disabled || busy}
                  aria-label="Country calling code"
                >
                  <span className="truncate font-semibold tabular-nums">
                    {dialCountry
                      ? `${dialCountry.code} +${dialCountry.dialCode}`
                      : "Code"}
                  </span>
                  {busy ? (
                    <ButtonSpinner className="size-3.5 shrink-0 text-muted-foreground" />
                  ) : null}
                </ComboboxTrigger>
                <ComboboxContent className="min-w-[18rem]">
                  <ComboboxInput
                    placeholder="Search country code…"
                    className="h-9"
                    showTrigger={false}
                  />
                  <ComboboxEmpty>No country code found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => {
                      const country = item as CountryOption;
                      return (
                        <ComboboxItem key={country.code} value={country}>
                          <span className="truncate">{country.name}</span>
                          <span className="ml-auto font-semibold tabular-nums text-muted-foreground">
                            +{country.dialCode}
                          </span>
                        </ComboboxItem>
                      );
                    }}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <FormControl>
                <div
                  className={cn(
                    authInputClass,
                    "flex min-w-0 flex-1 items-center gap-0 overflow-hidden p-0",
                    busy && "opacity-80",
                  )}
                >
                  {dialCountry ? (
                    <span
                      className="shrink-0 select-none border-r border-border-input bg-muted/40 px-2.5 py-2 text-sm font-semibold tabular-nums text-ink-heading"
                      title="Country code (cannot be removed)"
                    >
                      {prefix}
                    </span>
                  ) : null}
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    disabled={disabled || busy || !dialCountry}
                    placeholder={
                      dialCountry
                        ? "555 123 4567"
                        : "Select a country code first"
                    }
                    value={national}
                    onChange={(e) => onNationalChange(e.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                  />
                  {busy ? (
                    <ButtonSpinner className="mr-2.5 size-4 shrink-0 text-muted-foreground" />
                  ) : null}
                </div>
              </FormControl>
            </div>

            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
