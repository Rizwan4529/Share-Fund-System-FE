import { Check } from "lucide-react";

type IncludedItemsListProps = {
  items: string[];
};

export function IncludedItemsList({ items }: IncludedItemsListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-success-bg">
            <Check className="size-3 text-success" strokeWidth={3} />
          </span>
          <span className="text-[14.5px] text-[#33425f]">{item}</span>
        </li>
      ))}
    </ul>
  );
}
