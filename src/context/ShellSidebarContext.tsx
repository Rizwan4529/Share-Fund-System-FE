import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

const DESKTOP_BREAKPOINT = 1024;

type ShellSidebarContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  openMobile: () => void;
  closeMobile: () => void;
};

const ShellSidebarContext = createContext<ShellSidebarContextValue | null>(null);

export function ShellSidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        closeMobile();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [closeMobile]);

  const value = useMemo(
    () => ({
      mobileOpen,
      setMobileOpen,
      openMobile,
      closeMobile,
    }),
    [mobileOpen, openMobile, closeMobile],
  );

  return (
    <ShellSidebarContext.Provider value={value}>
      {children}
    </ShellSidebarContext.Provider>
  );
}

export function useShellSidebar() {
  const context = useContext(ShellSidebarContext);
  if (!context) {
    throw new Error("useShellSidebar must be used within ShellSidebarProvider");
  }
  return context;
}
