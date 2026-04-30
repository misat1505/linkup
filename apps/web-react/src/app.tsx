import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loading from "./components/common/loading";
import Navbar from "./components/common/navbar/navbar";
import ProtectedRoute from "./components/common/protected-route";
import { Toaster } from "./components/ui/toaster";
import { useAppContext } from "./contexts/app-provider";
import { protectedRoutes, publicRoutes } from "./lib/routes";

export default function App() {
  const { isLoading } = useAppContext();

  if (isLoading) return <Loading />;

  return (
    <>
      <Router>
        <Navbar />
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
      </Router>

      <Toaster />
    </>
  );
}
