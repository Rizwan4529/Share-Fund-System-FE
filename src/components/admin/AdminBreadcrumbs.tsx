import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { ROUTES } from "@/utils/constants";
import { cn } from "@/lib/utils";

const ADMIN_CRUMBS: Array<{ path: string; name: string; end?: boolean }> = [
  { path: ROUTES.ADMIN, name: "Overview", end: true },
  { path: ROUTES.ADMIN_PARTICIPANTS, name: "Participants" },
  { path: ROUTES.ADMIN_ENROLLMENTS, name: "Enrollments" },
  { path: ROUTES.ADMIN_SUCCESS_CENTERS, name: "Success Centers" },
  { path: ROUTES.ADMIN_PRICING, name: "Pricing" },
  { path: ROUTES.ADMIN_RULES, name: "Rules" },
  { path: ROUTES.ADMIN_RECOMMENDATIONS, name: "Recommendations" },
  { path: ROUTES.ADMIN_DISCLOSURES, name: "Disclosures" },
  { path: ROUTES.ADMIN_SETTINGS, name: "Settings" },
];

type AdminBreadcrumbsProps = {
  className?: string;
  /** Override current crumb label (defaults to matched route name). */
  currentLabel?: string;
};

/** Tags-style trail: Home › Current page */
export function AdminBreadcrumbs({
  className,
  currentLabel,
}: AdminBreadcrumbsProps) {
  const { pathname } = useLocation();
  const match =
    ADMIN_CRUMBS.find((c) =>
      c.end ? pathname === c.path : pathname.startsWith(c.path),
    ) ?? ADMIN_CRUMBS[0];

  const crumbs = [
    { name: "Home", path: ROUTES.ADMIN, isCurrent: pathname === ROUTES.ADMIN },
    ...(pathname === ROUTES.ADMIN
      ? []
      : [
          {
            name: currentLabel ?? match.name,
            path: match.path,
            isCurrent: true,
          },
        ]),
  ];

  return (
    <nav
      className={cn("flex items-center gap-1 text-sm", className)}
      aria-label="Breadcrumb"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <Fragment key={`${crumb.path}-${crumb.name}`}>
            {index > 0 ? (
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
            ) : null}
            {isLast ? (
              <span className="font-medium text-foreground">{crumb.name}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.name}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
