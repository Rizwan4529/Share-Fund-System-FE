import { Suspense } from "react";
import { useRoutes } from "react-router-dom";

import { LoadingScreen } from "@/components/common/LoadingScreen";
import { routes } from "@/routes";

export default function App() {
  const element = useRoutes(routes);
  return <Suspense fallback={<LoadingScreen />}>{element}</Suspense>;
}
