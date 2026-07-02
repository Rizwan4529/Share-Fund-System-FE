import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import { routes } from "@/routes";

function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-app-canvas">
      <div className="size-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export default function App() {
  const element = useRoutes(routes);
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}
