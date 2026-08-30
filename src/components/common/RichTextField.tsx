import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Typography } from "./Typography";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RichTextEditor } from "../ui/rich-text-editor";

type RichTextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function RichTextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  placeholder,
  disabled,
}: RichTextFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label ? (
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
          ) : null}
          <FormControl>
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
              placeholder={placeholder}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
