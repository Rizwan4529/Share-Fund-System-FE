import {
  Briefcase,
  Car,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutGrid,
  ShoppingCart,
  TrendingUp,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  housing: Home,
  food: UtensilsCrossed,
  utilities: Zap,
  debt: ShoppingCart,
  vehicle: Car,
  transport: Car,
  medical: HeartPulse,
  health: HeartPulse,
  business: Briefcase,
  education: GraduationCap,
  invest: TrendingUp,
  wealth: TrendingUp,
};

export function getCategoryIcon(categoryId: string): LucideIcon {
  return CATEGORY_ICONS[categoryId] ?? Home;
}

/**
 * A category's admin-set `icon` may be an icon key ("housing") or an emoji.
 * Returns a Lucide icon for keys, the raw text for emoji, and otherwise an
 * icon guessed from the slug (e.g. "debt-management" → debt).
 */
export function resolveCategoryIcon(
  icon?: string,
  slug?: string,
): { Icon: LucideIcon; emoji?: undefined } | { Icon?: undefined; emoji: string } {
  const key = icon?.trim().toLowerCase();
  if (key && CATEGORY_ICONS[key]) return { Icon: CATEGORY_ICONS[key] };
  if (icon?.trim()) return { emoji: icon.trim() };
  const fromSlug = Object.keys(CATEGORY_ICONS).find((name) =>
    slug?.toLowerCase().includes(name),
  );
  return { Icon: fromSlug ? CATEGORY_ICONS[fromSlug]! : LayoutGrid };
}
