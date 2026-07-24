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
const QuestionnairePage = lazy(() => import("@/pages/questionnaire/QuestionnairePage"));
const SuccessCentersBrowsePage = lazy(
  () => import("@/pages/success-centers/SuccessCentersBrowsePage"),
);
const SuccessCenterDetailPage = lazy(
  () => import("@/pages/success-centers/SuccessCenterDetailPage"),
);
const EnrollmentPage = lazy(() => import("@/pages/enrollment/EnrollmentPage"));
const EnrollmentCheckoutPage = lazy(
  () => import("@/pages/enrollment/EnrollmentCheckoutPage"),
);
const BillingPage = lazy(() => import("@/pages/billing/BillingPage"));
const RecommendationPage = lazy(
  () => import("@/pages/recommendation/RecommendationPage"),
);
const AccountPage = lazy(() => import("@/pages/account/AccountPage"));
const LegalPage = lazy(() => import("@/pages/legal/LegalPage"));

const AdminOverviewPage = lazy(() => import("@/pages/admin/AdminOverviewPage"));
const AdminParticipantsPage = lazy(
  () => import("@/pages/admin/AdminParticipantsPage"),
);
const AdminEnrollmentsPage = lazy(
  () => import("@/pages/admin/AdminEnrollmentsPage"),
);
const AdminSuccessCentersPage = lazy(
  () => import("@/pages/admin/AdminSuccessCentersPage"),
);
const AdminPricingPage = lazy(() => import("@/pages/admin/AdminPricingPage"));
const AdminRulesPage = lazy(() => import("@/pages/admin/AdminRulesPage"));
const AdminRecommendationsPage = lazy(
  () => import("@/pages/admin/AdminRecommendationsPage"),
);
const AdminDisclosuresPage = lazy(
  () => import("@/pages/admin/AdminDisclosuresPage"),
);
const AdminSettingsPage = lazy(() => import("@/pages/admin/AdminSettingsPage"));

/*
 * PHASE2_PARKED — page modules kept on disk but routes are unreachable:
 * - pages/rewards/RewardsPage
 * - pages/learn/*
 * - pages/campaigns/*
 * - pages/dashboard/DashboardProgressPage
 * - pages/admin/AdminRewardsPage, AdminMarketingPage, AdminAnalyticsPage
 * - pages/admin/AdminMembersPage, AdminCampaignsPage, AdminContentPage
 */

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    path: ROUTES.LEGAL,
    element: <LegalPage />,
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
      { path: ROUTES.ADMIN_PARTICIPANTS, element: <AdminParticipantsPage /> },
      { path: ROUTES.ADMIN_ENROLLMENTS, element: <AdminEnrollmentsPage /> },
      {
        path: ROUTES.ADMIN_SUCCESS_CENTERS,
        element: <AdminSuccessCentersPage />,
      },
      { path: ROUTES.ADMIN_PRICING, element: <AdminPricingPage /> },
      { path: ROUTES.ADMIN_RULES, element: <AdminRulesPage /> },
      {
        path: ROUTES.ADMIN_RECOMMENDATIONS,
        element: <AdminRecommendationsPage />,
      },
      { path: ROUTES.ADMIN_DISCLOSURES, element: <AdminDisclosuresPage /> },
      { path: ROUTES.ADMIN_SETTINGS, element: <AdminSettingsPage /> },
      /* PHASE2_PARKED admin deep links → overview */
      { path: "/admin/rewards", element: <Navigate to={ROUTES.ADMIN} replace /> },
      {
        path: "/admin/marketing",
        element: <Navigate to={ROUTES.ADMIN} replace />,
      },
      {
        path: "/admin/analytics",
        element: <Navigate to={ROUTES.ADMIN} replace />,
      },
      {
        path: "/admin/members",
        element: <Navigate to={ROUTES.ADMIN_PARTICIPANTS} replace />,
      },
      {
        path: "/admin/campaigns",
        element: <Navigate to={ROUTES.ADMIN_SUCCESS_CENTERS} replace />,
      },
      {
        path: "/admin/content",
        element: <Navigate to={ROUTES.ADMIN_DISCLOSURES} replace />,
      },
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
      { path: ROUTES.QUESTIONNAIRE, element: <QuestionnairePage /> },
      { path: ROUTES.SUCCESS_CENTERS, element: <SuccessCentersBrowsePage /> },
      {
        path: ROUTES.SUCCESS_CENTER_DETAIL,
        element: <SuccessCenterDetailPage />,
      },
      { path: ROUTES.ENROLLMENT, element: <EnrollmentPage /> },
      { path: ROUTES.ENROLLMENT_CHECKOUT, element: <EnrollmentCheckoutPage /> },
      { path: ROUTES.BILLING, element: <BillingPage /> },
      { path: ROUTES.RECOMMENDATION, element: <RecommendationPage /> },
      { path: ROUTES.ACCOUNT, element: <Navigate to="/account/profile" replace /> },
      { path: ROUTES.ACCOUNT_SECTION, element: <AccountPage /> },
      /* PHASE2_PARKED participant deep links → dashboard */
      {
        path: "/rewards",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: "/rewards/*",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      { path: "/learn", element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      { path: "/learn/*", element: <Navigate to={ROUTES.DASHBOARD} replace /> },
      {
        path: "/campaigns",
        element: <Navigate to={ROUTES.SUCCESS_CENTERS} replace />,
      },
      {
        path: "/campaigns/*",
        element: <Navigate to={ROUTES.SUCCESS_CENTERS} replace />,
      },
      {
        path: "/dashboard/progress",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
];
