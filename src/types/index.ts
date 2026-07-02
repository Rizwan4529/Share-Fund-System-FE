export type CampaignFilter = "all" | "essentials" | "financial" | "business";

export type CampaignCategory = {
  id: string;
  name: string;
  blurb: string;
  filter: Exclude<CampaignFilter, "all">;
  tag?: string;
  long: string;
  featured?: "dark" | "gold";
};

export type ActiveCampaign = {
  cat: string;
  name: string;
  target: number;
  saved: number;
  timeline: string;
  started: string;
};

export type LearnItem = {
  id: string;
  cat: string;
  type: "guide" | "video" | "faq";
  title: string;
  mins: string;
  blurb: string;
};

export type ArticleBlock =
  | { type: "t"; text: string }
  | { type: "h"; text: string };

export type LearnArticle = {
  cat: string;
  title: string;
  meta: string;
  type: "guide" | "video" | "faq";
  body?: ArticleBlock[];
  vid?: string;
};

export type Milestone = {
  title: string;
  note: string;
  state: "done" | "current" | "todo";
};

export type ActivityItem = {
  id: string;
  icon: "up" | "star" | "book" | "flag" | "check";
  text: string;
  date: string;
  tone: "gold" | "blue" | "green";
};

export type RewardHistoryItem = {
  id: string;
  title: string;
  date: string;
  delta: string;
  positive: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarInitials: string;
  membership: string;
};

export type NotificationPrefs = {
  platform: boolean;
  campaign: boolean;
  education: boolean;
  announce: boolean;
};

export type CommunicationPrefs = {
  email: boolean;
  product: boolean;
  promos: boolean;
};

export type RewardsBalance = {
  balance: number;
  monthEarned: number;
  lifetime: number;
};

export type RedeemOption = {
  id: string;
  title: string;
  description: string;
  cost: number;
};

export type UserRole = "member" | "admin";

export type AuthUser = UserProfile & {
  id: string;
  onboardingComplete: boolean;
  verified: boolean;
  role: UserRole;
};

export type ActivateCampaignInput = {
  categoryId: string;
  goalName: string;
  target: number;
  timeline: string;
};
