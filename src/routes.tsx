import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { AdminRoute, GuestRoute, ProtectedRoute } from "@/components/common/ProtectedRoute";
import { AppShellLayout } from "@/layouts/AppShellLayout";
import { AdminShellLayout } from "@/layouts/AdminShellLayout";
import { AuthSplitLayout } from "@/layouts/AuthSplitLayout";
import { ROUTES } from "@/utils/constants";

const LoginSignupPage = lazy(() => import("@/pages/auth/LoginSignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const VerifyEmailPage = lazy(() => import("@/pages/auth/VerifyEmailPage"));
const OnboardingPage = lazy(() => import("@/pages/onboarding/OnboardingPage"));
const DashboardHomePage = lazy(() => import("@/pages/dashboard/DashboardHomePage"));
const DashboardProgressPage = lazy(() => import("@/pages/dashboard/DashboardProgressPage"));
const CampaignBrowsePage = lazy(() => import("@/pages/campaigns/CampaignBrowsePage"));
const CampaignDetailPage = lazy(() => import("@/pages/campaigns/CampaignDetailPage"));
const CampaignActivatePage = lazy(() => import("@/pages/campaigns/CampaignActivatePage"));
const CampaignSuccessPage = lazy(() => import("@/pages/campaigns/CampaignSuccessPage"));
const RewardsPage = lazy(() => import("@/pages/rewards/RewardsPage"));
const LearnLibraryPage = lazy(() => import("@/pages/learn/LearnLibraryPage"));
const LearnArticlePage = lazy(() => import("@/pages/learn/LearnArticlePage"));
const LearnVideoPage = lazy(() => import("@/pages/learn/LearnVideoPage"));
const AccountPage = lazy(() => import("@/pages/account/AccountPage"));
const AdminOverviewPage = lazy(() => import("@/pages/admin/AdminOverviewPage"));
const AdminMembersPage = lazy(() => import("@/pages/admin/AdminMembersPage"));
const AdminCampaignsPage = lazy(() => import("@/pages/admin/AdminCampaignsPage"));
const AdminRewardsPage = lazy(() => import("@/pages/admin/AdminRewardsPage"));
const AdminContentPage = lazy(() => import("@/pages/admin/AdminContentPage"));
const AdminAnalyticsPage = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));
const AdminMarketingPage = lazy(() => import("@/pages/admin/AdminMarketingPage"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    element: <AuthSplitLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <GuestRoute>
            <LoginSignupPage />
          </GuestRoute>
        ),
      },
      {
        path: ROUTES.SIGNUP,
        element: (
          <GuestRoute>
            <LoginSignupPage />
          </GuestRoute>
        ),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: ROUTES.VERIFY,
    element: (
      <ProtectedRoute>
        <VerifyEmailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ONBOARDING,
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <AdminRoute>
        <AdminShellLayout />
      </AdminRoute>
    ),
    children: [
      { path: ROUTES.ADMIN, element: <AdminOverviewPage /> },
      { path: ROUTES.ADMIN_MEMBERS, element: <AdminMembersPage /> },
      { path: ROUTES.ADMIN_CAMPAIGNS, element: <AdminCampaignsPage /> },
      { path: ROUTES.ADMIN_REWARDS, element: <AdminRewardsPage /> },
      { path: ROUTES.ADMIN_CONTENT, element: <AdminContentPage /> },
      { path: ROUTES.ADMIN_ANALYTICS, element: <AdminAnalyticsPage /> },
      { path: ROUTES.ADMIN_MARKETING, element: <AdminMarketingPage /> },
      { path: ROUTES.ADMIN_SETTINGS, element: <AdminSettingsPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ROUTES.DASHBOARD, element: <DashboardHomePage /> },
      { path: ROUTES.DASHBOARD_PROGRESS, element: <DashboardProgressPage /> },
      { path: ROUTES.CAMPAIGNS, element: <CampaignBrowsePage /> },
      { path: ROUTES.CAMPAIGN_DETAIL, element: <CampaignDetailPage /> },
      { path: ROUTES.CAMPAIGN_ACTIVATE, element: <CampaignActivatePage /> },
      { path: ROUTES.CAMPAIGN_SUCCESS, element: <CampaignSuccessPage /> },
      { path: ROUTES.REWARDS, element: <RewardsPage /> },
      { path: ROUTES.LEARN, element: <LearnLibraryPage /> },
      { path: ROUTES.LEARN_ARTICLE, element: <LearnArticlePage /> },
      { path: ROUTES.LEARN_VIDEO, element: <LearnVideoPage /> },
      { path: ROUTES.ACCOUNT, element: <Navigate to="/account/profile" replace /> },
      { path: ROUTES.ACCOUNT_SECTION, element: <AccountPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
];
