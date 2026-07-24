import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  FileText,
  Flag,
  Gift,
  Layers,
  Megaphone,
  Scale,
  Settings,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function AdminNavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const props = { className: cn("size-[18px]", className), strokeWidth: 1.8 };
  const icons: Record<string, ReactNode> = {
    overview: <BarChart3 {...props} />,
    members: <Users {...props} />,
    campaigns: <Layers {...props} />,
    rewards: <Gift {...props} />,
    content: <BookOpen {...props} />,
    recommendations: <Sparkles {...props} />,
    disclosures: <FileText {...props} />,
    rules: <Scale {...props} />,
    analytics: <BarChart3 {...props} />,
    marketing: <Megaphone {...props} />,
    settings: <Settings {...props} />,
    star: <Star {...props} />,
    flag: <Flag {...props} />,
  };
  return icons[name] ?? <BarChart3 {...props} />;
}
