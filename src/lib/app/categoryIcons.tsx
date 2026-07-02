import {
  Briefcase,
  Car,
  HeartPulse,
  Home,
  ShoppingCart,
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
  medical: HeartPulse,
  business: Briefcase,
};

export function getCategoryIcon(categoryId: string): LucideIcon {
  return CATEGORY_ICONS[categoryId] ?? Home;
}
