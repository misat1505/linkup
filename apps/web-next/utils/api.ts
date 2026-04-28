import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_URL } from "./constants";

function createAPIInstance(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);
  return instance;
}

export const AUTH_API = createAPIInstance({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

export const USER_API = createAPIInstance({
  baseURL: `${API_URL}/users`,
});

export const CHAT_API = createAPIInstance({
  baseURL: `${API_URL}/chats`,
});

export const FILE_API = createAPIInstance({
  baseURL: `${API_URL}/files`,
});

export const POSTS_API = createAPIInstance({
  baseURL: `${API_URL}/posts`,
});

export const FRIENDS_API = createAPIInstance({
  baseURL: `${API_URL}/friendships`,
});
