import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import { toSessionUser } from "@/lib/auth/sessionUser";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/authSlice";
import type { AuthUser } from "@/types";
import { ROUTES } from "@/utils/constants";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  finishOnboarding: (categoryId?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const backendUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useMemo(
    () => (backendUser ? toSessionUser(backendUser) : null),
    [backendUser],
  );

  const logout = useCallback(async () => {
    dispatch(logoutAction());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  const refresh = useCallback(async () => {}, []);

  const finishOnboarding = useCallback(async () => {
    navigate(ROUTES.QUESTIONNAIRE);
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isLoading: false,
      logout,
      refresh,
      finishOnboarding,
    }),
    [user, logout, refresh, finishOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
