import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { isAdminUser } from "@/lib/auth/roles";
import { ROUTES } from "@/utils/constants";

function LoadingScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-app-canvas">
      <div className="size-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!isAdminUser(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (isAdminUser(user.role)) {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  if (path === ROUTES.VERIFY) {
    if (user.verified) {
      return (
        <Navigate
          to={user.onboardingComplete ? ROUTES.DASHBOARD : ROUTES.ONBOARDING}
          replace
        />
      );
    }
    return children;
  }

  if (path === ROUTES.ONBOARDING) {
    if (!user.verified) {
      return <Navigate to={ROUTES.VERIFY} replace />;
    }
    if (user.onboardingComplete) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    return children;
  }

  if (!user.verified) {
    return <Navigate to={ROUTES.VERIFY} replace />;
  }

  if (!user.onboardingComplete) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  return children;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (user) {
    if (isAdminUser(user.role)) {
      return <Navigate to={ROUTES.ADMIN} replace />;
    }
    if (!user.verified) return <Navigate to={ROUTES.VERIFY} replace />;
    if (!user.onboardingComplete) return <Navigate to={ROUTES.ONBOARDING} replace />;
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
