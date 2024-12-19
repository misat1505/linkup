import { lazy } from "react";
import { route } from "react-router-typesafe-routes/dom";

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
  HOME: route(""),
  SETTINGS: route("settings"),
  LOGIN: route("login"),
  SIGNUP: route("signup"),
  CHATS: route("chats"),
  CHAT_DETAIL: route("chats/:chatId"),
  POST_EDITOR: route("posts/editor/:postId?"),
  POSTS: route("posts"),
  FRIENDS: route("friends")
};

export const protectedRoutes: RouteType[] = [
  {
    path: ROUTES.HOME.path,
    component: Home
  },
  {
    path: ROUTES.SETTINGS.path,
    component: Settings
  },
  {
    path: ROUTES.CHATS.path,
    component: Chats
  },
  {
    path: ROUTES.CHAT_DETAIL.path,
    component: Chats
  },
  {
    path: ROUTES.POST_EDITOR.path,
    component: PostEditor
  },
  {
    path: ROUTES.POSTS.path,
    component: Posts
  },
  {
    path: ROUTES.FRIENDS.path,
    component: Friends
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
