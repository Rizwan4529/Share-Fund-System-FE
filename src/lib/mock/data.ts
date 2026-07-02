import type {
  ActivityItem,
  LearnArticle,
  Milestone,
  NotificationItem,
  RewardHistoryItem,
} from "@/types";

export const ARTICLES: Record<string, LearnArticle> = {
  "housing-basics": {
    cat: "Getting Started",
    title: "How SFS campaigns work",
    meta: "5 min read · Updated Mar 2026",
    type: "guide",
    body: [
      {
        type: "t",
        text: "An SFS campaign is a simple structure around a real-life money goal. You pick the category that matches what you're working toward, name your goal, and set a target and timeline that feel realistic for you.",
      },
      { type: "h", text: "The six-step journey" },
      {
        type: "t",
        text: "Every campaign follows the same clear path: create your account, choose a category, learn how to activate, track your progress, earn rewards for staying engaged, and access resources whenever you need them.",
      },
      {
        type: "t",
        text: "Nothing here is locked in. You can adjust your target and timeline as life changes, and your progress is always yours to see from the dashboard.",
      },
      { type: "h", text: "What SFS handles for you" },
      {
        type: "t",
        text: "Behind the scenes, SFS provides centralized marketing support so you don't have to be a marketing expert. You focus on the goal; we help with the parts that usually get in the way.",
      },
    ],
  },
  "first-goal": {
    cat: "Getting Started",
    title: "Setting a goal you can actually reach",
    meta: "6 min read · Updated Feb 2026",
    type: "guide",
    body: [
      {
        type: "t",
        text: "The best goal is one that's specific enough to picture and flexible enough to survive a hard month. Start with the outcome you want, then work backward into a target and a timeline.",
      },
      { type: "h", text: "Make it concrete" },
      {
        type: "t",
        text: 'Instead of "save more," try "build a $3,000 cushion by December." A concrete goal gives every small action a clear place to land.',
      },
      {
        type: "t",
        text: "Then break it into a monthly rhythm. Progress compounds when it's steady, not dramatic.",
      },
    ],
  },
  "budget-101": {
    cat: "Budgeting",
    title: "Budgeting basics for real life",
    meta: "8 min read · Updated Jan 2026",
    type: "guide",
    body: [
      {
        type: "t",
        text: "A budget isn't a punishment — it's a plan for the money you already have. The goal is clarity, not restriction.",
      },
      { type: "h", text: "Start with the essentials" },
      {
        type: "t",
        text: "List what has to be paid: housing, food, utilities, and any minimum debt payments. Everything else flows around those anchors.",
      },
      {
        type: "t",
        text: "Whatever's left is yours to direct — toward your goal, toward flexibility, or toward a little breathing room.",
      },
    ],
  },
  "rewards-guide": {
    cat: "Rewards",
    title: "Making the most of your credits",
    meta: "3 min read · Updated Mar 2026",
    type: "guide",
    body: [
      {
        type: "t",
        text: "Rewards credits recognize your participation. You earn them for staying engaged — activating campaigns, hitting milestones, and completing learning content.",
      },
      { type: "h", text: "Where to use them" },
      {
        type: "t",
        text: "Credits can go toward future campaign activations, upcoming marketplace items, platform services, and promotional opportunities as they become available.",
      },
    ],
  },
  "staying-on": {
    cat: "Campaigns",
    title: "Staying motivated month to month",
    meta: "5 min read · Updated Feb 2026",
    type: "guide",
    body: [
      {
        type: "t",
        text: "Motivation fades; systems last. The members who reach their goals lean on small, repeatable habits rather than bursts of willpower.",
      },
      { type: "h", text: "Check in, not obsess" },
      {
        type: "t",
        text: "A quick weekly glance at your progress is enough to stay oriented. Celebrate the milestones — they're proof the plan is working.",
      },
    ],
  },
  "debt-video": {
    cat: "Budgeting",
    title: "Snowball vs. avalanche, explained",
    meta: "4 min watch",
    type: "video",
    vid: "Two of the most popular debt-payoff methods, side by side. The snowball builds momentum with quick wins; the avalanche saves the most on interest.",
  },
  "activate-video": {
    cat: "Campaigns",
    title: "Activating your first campaign",
    meta: "2 min watch",
    type: "video",
    vid: "A quick walkthrough of the activation flow — naming your goal, setting a target and timeline, and confirming.",
  },
  "faq-credits": {
    cat: "Rewards",
    title: "Rewards credits: common questions",
    meta: "FAQ · Updated Mar 2026",
    type: "guide",
    body: [
      { type: "h", text: "Do credits expire?" },
      {
        type: "t",
        text: "No. Your rewards credits stay in your balance until you choose to use them.",
      },
      { type: "h", text: "Can I transfer credits?" },
      {
        type: "t",
        text: "Credits are tied to your account and can't be transferred, but you'll have more ways to spend them as new features launch.",
      },
    ],
  },
};

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    title: "Campaign activated",
    note: "Your goal was set up and tracking began.",
    state: "done",
  },
  {
    title: "First milestone reached",
    note: "You crossed 25% of your goal. Nicely done.",
    state: "done",
  },
  {
    title: "Halfway point",
    note: "You're closing in — 35% and climbing.",
    state: "current",
  },
  {
    title: "Goal reached",
    note: "The finish line. We'll celebrate with you.",
    state: "todo",
  },
];

export const DEFAULT_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    icon: "up",
    text: "Progress updated — you're now at 35% of your goal.",
    date: "Today, 9:24 AM",
    tone: "gold",
  },
  {
    id: "2",
    icon: "star",
    text: "Earned 40 rewards credits for a monthly check-in.",
    date: "Yesterday",
    tone: "gold",
  },
  {
    id: "3",
    icon: "book",
    text: 'Completed the guide "Budgeting basics for real life."',
    date: "2 days ago",
    tone: "blue",
  },
  {
    id: "4",
    icon: "flag",
    text: "Reached your first milestone at 25%.",
    date: "Mar 14, 2026",
    tone: "green",
  },
  {
    id: "5",
    icon: "check",
    text: 'Campaign "Move to a bigger place" activated.',
    date: "Mar 2, 2026",
    tone: "green",
  },
];

export const DEFAULT_REWARD_HISTORY: RewardHistoryItem[] = [
  {
    id: "1",
    title: "Monthly check-in",
    date: "Today",
    delta: "+40",
    positive: true,
  },
  {
    id: "2",
    title: "Completed a learning guide",
    date: "2 days ago",
    delta: "+25",
    positive: true,
  },
  {
    id: "3",
    title: "Reached 25% milestone",
    date: "Mar 14, 2026",
    delta: "+100",
    positive: true,
  },
  {
    id: "4",
    title: "Redeemed — activation credit",
    date: "Mar 8, 2026",
    delta: "−250",
    positive: false,
  },
  {
    id: "5",
    title: "Welcome bonus",
    date: "Mar 2, 2026",
    delta: "+150",
    positive: true,
  },
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Marketing support is active",
    body: "Your campaign is now receiving centralized marketing support from SFS.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "New guide available",
    body: "Check out 'Staying motivated month to month' in the Learn center.",
    time: "Yesterday",
    read: false,
  },
  {
    id: "3",
    title: "Milestone reached",
    body: "You crossed 25% of your goal. Keep it up!",
    time: "Mar 14",
    read: true,
  },
];
