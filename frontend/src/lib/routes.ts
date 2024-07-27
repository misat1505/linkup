import { lazy } from "react";
import { route } from "react-router-typesafe-routes/dom";

const Home = lazy(() => import("../pages/Home"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));

type RouteType = {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
};

export const ROUTES = {
  HOME: route(""),
  SETTINGS: route("settings"),
  LOGIN: route("login"),
  SIGNUP: route("signup")
};

export const protectedRoutes: RouteType[] = [
  {
    path: ROUTES.HOME.path,
    component: Home
  },
  {
    path: ROUTES.SETTINGS.path,
    component: Settings
  }
];

export const publicRoutes: RouteType[] = [
  {
    path: ROUTES.LOGIN.path,
    component: Login
  },
  {
    path: ROUTES.SIGNUP.path,
    component: Signup
  },
  {
    path: "*",
    component: NotFound
  }
];
