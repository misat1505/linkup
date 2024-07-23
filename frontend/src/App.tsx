import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/common/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "./contexts/AppProvider";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { protectedRoutes, publicRoutes } from "./lib/routes";
import { toastContainerProps } from "./config/toasts";

export default function App() {
  return (
    <AppProvider>
      <Router>
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

      <ToastContainer {...toastContainerProps} />
    </AppProvider>
  );
}
