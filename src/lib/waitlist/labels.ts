import type { WaitlistCampaignCategory } from "../../types/waitlist";

export function waitlistCampaignLabel(
  slug: string | undefined,
  categories?: WaitlistCampaignCategory[],
): string {
  if (!slug) return "—";
  const match = categories?.find((category) => category.slug === slug);
  if (match) return match.label;
  return slug.replaceAll("_", " ");
}
