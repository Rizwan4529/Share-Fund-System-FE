import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_FILTER } from "@/lib/admin-participants/labels";

/** Toolbar filter dropdown with an "All …" option (value ALL_FILTER). */
export function AdminFilterSelect<T extends string>({
  placeholder,
  allLabel,
  value,
  options,
  onChange,
}: {
  placeholder: string;
  allLabel: string;
  value: T | typeof ALL_FILTER;
  options: { value: T; label: string }[];
  onChange: (value: T | typeof ALL_FILTER) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as T | typeof ALL_FILTER)}
    >
      <SelectTrigger className="h-11 w-full sm:w-44" aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_FILTER}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
