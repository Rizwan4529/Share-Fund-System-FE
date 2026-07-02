import { getCategoryIcon } from "@/lib/app/categoryIcons";
import { CATEGORIES } from "@/utils/constants";
import { cn } from "@/lib/utils";

type OnboardingCategoryPickerProps = {
  selected: string | null;
  onSelect: (id: string) => void;
};

export function OnboardingCategoryPicker({
  selected,
  onSelect,
}: OnboardingCategoryPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map((cat) => {
        const Icon = getCategoryIcon(cat.id);
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
              isSelected
                ? "border-gold-dark bg-bg-gold"
                : "border-line bg-white hover:border-gold-chip",
            )}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-gold bg-bg-icon">
              <Icon className="size-5 text-gold-dark" />
            </span>
            <span className="text-[15px] font-bold text-ink-heading">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
