import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  acceptDisclosures,
  completeOnboarding,
  getSession,
  loginUser,
  logoutUser,
  signupUser,
  verifyUser,
} from "@/lib/api/auth";
import { isAdminUser } from "@/lib/auth/roles";
import { ROUTES } from "@/utils/constants";
import type { AuthUser } from "@/types";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verify: () => Promise<void>;
  finishOnboarding: (categoryId?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = useCallback(async () => {
    const session = await getSession();
    setUser(session);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await refresh();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const u = await loginUser(email, password);
      setUser(u);
      navigate(isAdminUser(u.role) ? ROUTES.ADMIN : ROUTES.DASHBOARD);
    },
    [navigate],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const u = await signupUser(name, email, password);
      setUser(u);
      try {
        await acceptDisclosures(["terms", "privacy", "disclaimer"]);
      } catch {
        /* mock acceptance best-effort */
      }
      navigate(ROUTES.VERIFY);
    },
    [navigate],
  );

  const verify = useCallback(async () => {
    const u = await verifyUser();
    setUser(u);
    navigate(ROUTES.ONBOARDING);
  }, [navigate]);

  const finishOnboarding = useCallback(
    async (categoryId?: string) => {
      const u = await completeOnboarding(categoryId);
      setUser(u);
      navigate(ROUTES.QUESTIONNAIRE);
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      verify,
      finishOnboarding,
      logout,
      refresh,
    }),
    [user, isLoading, login, signup, verify, finishOnboarding, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
