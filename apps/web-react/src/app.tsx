import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppProvider from "./contexts/app-provider";
import Navbar from "./components/common/navbar/navbar";
import { protectedRoutes, publicRoutes } from "./lib/routes";
import ProtectedRoute from "./components/common/protected-route";
import Loading from "./components/common/loading";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}
