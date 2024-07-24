import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));

type RouteType = {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
};

export const protectedRoutes: RouteType[] = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/settings",
    component: Settings
  }
];

export const publicRoutes: RouteType[] = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/signup",
    component: Signup
  },
  {
    path: "*",
    component: NotFound
  }
];
