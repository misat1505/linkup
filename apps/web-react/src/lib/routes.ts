import React, { lazy } from "react";
import { route } from "react-router-typesafe-routes";

const Home = lazy(() => import("../pages/home"));
const Settings = lazy(() => import("../pages/settings"));
const NotFound = lazy(() => import("../pages/not-found"));
const Login = lazy(() => import("../pages/login"));
const Signup = lazy(() => import("../pages/signup"));
const Chats = lazy(() => import("../pages/chats"));
const PostEditor = lazy(() => import("../pages/post-editor"));
const Posts = lazy(() => import("../pages/posts"));
const Friends = lazy(() => import("../pages/friends"));

type RouteType = {
	path: string;
	component: React.LazyExoticComponent<() => React.JSX.Element>;
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
		path: ROUTES.HOME.$path(),
		component: Home,
	},
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
