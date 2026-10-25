import { Input } from "@/components/ui/input";

/** From/to day pickers for admin table toolbars (values are "YYYY-MM-DD"). */
export function AdminDateRangeInputs({
  from,
  to,
  onFromChange,
  onToChange,
}: {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <>
      <Input
        type="date"
        aria-label="From date"
        value={from}
        max={to || undefined}
        onChange={(event) => onFromChange(event.target.value)}
        className="h-11 w-full bg-white sm:w-40"
      />
      <Input
        type="date"
        aria-label="To date"
        value={to}
        min={from || undefined}
        onChange={(event) => onToChange(event.target.value)}
        className="h-11 w-full bg-white sm:w-40"
      />
    </>
  );
}
