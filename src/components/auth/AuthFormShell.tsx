import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthBackLink } from "@/components/auth/AuthBackLink";
import { ASSETS } from "@/utils/assets";

type AuthFormBackProps = {
  to?: string;
  onClick?: () => void;
  children?: ReactNode;
};

const AuthFormBackContext = createContext<
  ((node: ReactNode) => void) | null
>(null);

export function AuthFormBack({ to, onClick, children = "Back" }: AuthFormBackProps) {
  const setBack = useContext(AuthFormBackContext);
  const node = useMemo(
    () => (
      <AuthBackLink to={to} onClick={onClick}>
        {children}
      </AuthBackLink>
    ),
    [to, onClick, children],
  );

  useLayoutEffect(() => {
    if (!setBack) return;
    setBack(node);
    return () => setBack(null);
  }, [node, setBack]);

  return null;
}

export function AuthFormShell({ children }: { children: ReactNode }) {
  const [back, setBack] = useState<ReactNode>(null);

  return (
    <AuthFormBackContext.Provider value={setBack}>
      <div className="relative flex min-h-svh flex-col bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {/* Logo (small screens) and Back share one row so they never overlap. */}
        <div className="mb-8 flex min-h-9 items-center justify-between gap-4">
          <img src={ASSETS.logo} alt="SFS" className="h-9 w-auto lg:hidden" />
          {back ? <div className="ml-auto">{back}</div> : null}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[404px]">{children}</div>
        </div>
      </div>
    </AuthFormBackContext.Provider>
  );
}
