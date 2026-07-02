import { Search } from "lucide-react";

import { FilterChips } from "@/components/common/FilterChips";
import { Input } from "@/components/ui/input";

type ChipOption = { id: string; label: string };

type PageSearchToolbarProps<T extends string> = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filterOptions: readonly ChipOption[];
  filter: T;
  onFilterChange: (value: T) => void;
};

export function PageSearchToolbar<T extends string>({
  search,
  onSearchChange,
  searchPlaceholder,
  filterOptions,
  filter,
  onFilterChange,
}: PageSearchToolbarProps<T>) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-[220px] flex-1 lg:max-w-md">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-light" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-[46px] border-border-input bg-input-bg pl-10 text-[15px]"
        />
      </div>
      <FilterChips
        options={filterOptions as readonly { id: T; label: string }[]}
        value={filter}
        onChange={onFilterChange}
      />
    </div>
  );
}
