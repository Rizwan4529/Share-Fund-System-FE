import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/common/Typography";

type PreferenceToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function PreferenceToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: PreferenceToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-0">
      <div>
        <Typography variant="label" className="font-semibold text-ink-heading">
          {label}
        </Typography>
        {description ? (
          <Typography variant="caption" color="muted" className="mt-0.5 block">
            {description}
          </Typography>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
