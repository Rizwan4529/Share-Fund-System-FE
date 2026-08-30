import type { Control, FieldValues, Path } from "react-hook-form";

import { Input, Textarea } from "@/components/common/FormCommon";
import type { SettingDataType } from "@/types/settings";

type SettingValueFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name?: Path<TFieldValues>;
  dataType: SettingDataType;
  disabled?: boolean;
};

const VALUE_HINTS: Record<SettingDataType, string> = {
  number: "Numeric value (for example 2500)",
  percentage: "Numeric percentage (for example 2.5)",
  object: 'JSON object (for example {"min": 1, "max": 10})',
  array: 'JSON array (for example ["a", "b"])',
};

export function SettingValueField<TFieldValues extends FieldValues>({
  control,
  name = "valueInput" as Path<TFieldValues>,
  dataType,
  disabled,
}: SettingValueFieldProps<TFieldValues>) {
  if (dataType === "number" || dataType === "percentage") {
    return (
      <Input
        control={control}
        name={name}
        label="Value"
        required
        type="number"
        step="any"
        disabled={disabled}
        placeholder={dataType === "percentage" ? "2.5" : "0"}
        description={VALUE_HINTS[dataType]}
      />
    );
  }

  return (
    <Textarea
      control={control}
      name={name}
      label="Value"
      required
      rows={8}
      disabled={disabled}
      placeholder={VALUE_HINTS[dataType]}
      description={VALUE_HINTS[dataType]}
    />
  );
}
