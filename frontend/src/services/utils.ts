import { convertDates } from "../utils/convertDates";
import { API_URL } from "../constants";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { addFilePrefix } from "../utils/addFilePrefix";
import { getAccessToken } from "../lib/token";

function createAPIInstance(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      response.data = addFilePrefix(response.data);
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      response.data = convertDates(response.data);
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
}

export const AUTH_API = createAPIInstance({
  baseURL: `${API_URL}/auth`,
  withCredentials: true
});

export const USER_API = createAPIInstance({
  baseURL: `${API_URL}/users`
});

export const CHAT_API = createAPIInstance({
  baseURL: `${API_URL}/chats`
});

export const FILE_API = createAPIInstance({
  baseURL: `${API_URL}/files`
});

export const POSTS_API = createAPIInstance({
  baseURL: `${API_URL}/posts`,
  withCredentials: true
});

export const FRIENDS_API = createAPIInstance({
  baseURL: `${API_URL}/friendships`,
  withCredentials: true
});
