import { Navigate, useLocation } from "react-router-dom";

import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { homePathForRole, isAdminUser } from "@/lib/auth/roles";
import { ROUTES } from "@/utils/constants";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!isAdminUser(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return children;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (isAdminUser(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  if (!user.verified) {
    return <Navigate to={ROUTES.VERIFY} replace />;
  }

  return children;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (user) {
    if (isAdminUser(user.role)) {
      return <Navigate to={homePathForRole(user.role)} replace />;
    }
    if (!user.verified) {
      if (location.pathname === ROUTES.VERIFY) return children;
      return <Navigate to={ROUTES.VERIFY} replace />;
    }
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  return children;
}

export function RoleHomeRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isAdminUser(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }

  if (!user.verified) {
    return <Navigate to={ROUTES.VERIFY} replace />;
  }

  return <Navigate to={homePathForRole(user.role)} replace />;
}
