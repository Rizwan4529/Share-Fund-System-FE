import { useMemo, useState, useTransition } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { ButtonSpinner } from "@/components/common/LoadingStates";
import {
  FormControl,
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
import { authInputClass } from "@/components/auth/authStyles";
import { cn } from "@/lib/utils";
import {
  COUNTRY_DIRECTORY,
  findCountryByName,
  type CountryOption,
} from "@/utils/countries";

type AuthCountryComboboxProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
  /** Called when a country is selected (after a brief sync loader). */
  onCountrySelected?: (country: CountryOption) => void | Promise<void>;
};

export function AuthCountryCombobox<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Country",
  required,
  placeholder = "Select country",
  disabled,
  className,
  itemClassName,
  onCountrySelected,
}: AuthCountryComboboxProps<TFieldValues>) {
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const items = useMemo(() => COUNTRY_DIRECTORY, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = findCountryByName(String(field.value ?? ""));
        const busy = syncing || isPending;

        return (
          <FormItem className={itemClassName}>
            {label ? (
              <FormLabel>
                {label}
                {required ? <span className="text-error"> *</span> : null}
              </FormLabel>
            ) : null}
            <Combobox
              items={items}
              value={selected ?? null}
              onValueChange={(next) => {
                const country = next as CountryOption | null;
                if (!country) {
                  field.onChange("");
                  return;
                }
                startTransition(() => {
                  field.onChange(country.name);
                });
                if (onCountrySelected) {
                  setSyncing(true);
                  void Promise.resolve(onCountrySelected(country)).finally(() =>
                    setSyncing(false),
                  );
                }
                setOpen(false);
              }}
              itemToStringValue={(item) => (item as CountryOption).name}
              open={open}
              onOpenChange={setOpen}
              disabled={disabled || busy}
            >
              <FormControl>
                <ComboboxTrigger
                  className={cn(
                    authInputClass,
                    "flex w-full items-center justify-between gap-2 text-left font-normal",
                    !selected && "text-muted-light",
                    busy && "[&>svg:last-child]:hidden",
                    className,
                  )}
                  disabled={disabled || busy}
                >
                  <span className="truncate">
                    {selected?.name ?? placeholder}
                  </span>
                  {busy ? (
                    <ButtonSpinner className="size-4 shrink-0 text-muted-foreground" />
                  ) : null}
                </ComboboxTrigger>
              </FormControl>
              <ComboboxContent className="w-[min(100vw-2rem,var(--anchor-width))]">
                <ComboboxInput
                  placeholder="Search countries…"
                  className="h-9"
                  showTrigger={false}
                />
                <ComboboxEmpty>No country found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => {
                    const country = item as CountryOption;
                    return (
                      <ComboboxItem key={country.code} value={country}>
                        <span className="truncate">{country.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          +{country.dialCode}
                        </span>
                      </ComboboxItem>
                    );
                  }}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
