import { lazy } from "react";
import { route } from "react-router-typesafe-routes";

const Home = lazy(() => import("../pages/Home"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Chats = lazy(() => import("../pages/Chats"));
const PostEditor = lazy(() => import("../pages/PostEditor"));
const Posts = lazy(() => import("../pages/Posts"));
const Friends = lazy(() => import("../pages/Friends"));

type RouteType = {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
};

export const ROUTES = {
  HOME: route({ path: "" }),
  SETTINGS: route({ path: "settings" }),
  LOGIN: route({ path: "login" }),
  SIGNUP: route({ path: "signup" }),
  CHATS: route({ path: "chats" }),
  CHAT_DETAIL: route({ path: "chats/:chatId" }),
  POST_EDITOR: route({ path: "posts/editor/:postId?" }),
  POSTS: route({ path: "posts" }),
  FRIENDS: route({ path: "friends" }),
};

export const protectedRoutes: RouteType[] = [
  {
    path: ROUTES.HOME.$path(),
    component: Home,
  },
  {
    path: ROUTES.SETTINGS.$path(),
    component: Settings,
  },
  {
    path: ROUTES.CHATS.$path(),
    component: Chats,
  },
  {
    path: ROUTES.CHAT_DETAIL.$path(),
    component: Chats,
  },
  {
    path: ROUTES.POST_EDITOR.$path(),
    component: PostEditor,
  },
  {
    path: ROUTES.POSTS.$path(),
    component: Posts,
  },
  {
    path: ROUTES.FRIENDS.$path(),
    component: Friends,
  },
];

export const publicRoutes: RouteType[] = [
  {
    path: ROUTES.LOGIN.$path(),
    component: Login,
  },
  {
    path: ROUTES.SIGNUP.$path(),
    component: Signup,
  },
  {
    path: "*",
    component: NotFound,
  },
];
