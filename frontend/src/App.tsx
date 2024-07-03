import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider";
import Loading from "./components/common/Loading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = lazy(() => import("./pages/Home"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

export default function App() {
  const SuspenseWrapper = ({
    lazyComponent,
  }: {
    lazyComponent: React.LazyExoticComponent<() => JSX.Element>;
  }) => {
    return (
      <Suspense fallback={<Loading />}>
        {React.createElement(lazyComponent)}
      </Suspense>
    );
  };

  const authorize = (
    Component: React.LazyExoticComponent<() => JSX.Element>
  ) => {
    return (
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      </AuthProvider>
    );
  };

  const protectedRoutes = [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/settings",
      component: Settings,
    },
  ];

  const routes = [
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/signup",
      component: Signup,
    },
    {
      path: "*",
      component: NotFound,
    },
  ];

  return (
    <>
      <Router>
        <Routes>
          {protectedRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={authorize(route.component)}
            />
          ))}
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<SuspenseWrapper lazyComponent={route.component} />}
            />
          ))}
        </Routes>
      </Router>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
