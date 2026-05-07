import { Loading } from "@packages/ui/components/misc/loading";
import { Toaster } from "@packages/ui/components/shadcn/toaster";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import NavbarWrapper from "./components/common/navbar";
import ProtectedRoute from "./components/common/protected-route";
import { useAppContext } from "./contexts/app-provider";
import { protectedRoutes, publicRoutes } from "./lib/routes";

export default function App() {
  const { isLoading } = useAppContext();

  if (isLoading) return <Loading />;

  return (
    <>
      <NavbarWrapper />
      <Routes>
        {protectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading />}>
                  <route.component />
                </Suspense>
              </ProtectedRoute>
            }
          />
        ))}
        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <Suspense fallback={<Loading />}>
                <route.component />
              </Suspense>
            }
          />
        ))}
      </Routes>

      <Toaster />
    </>
  );
}
