import { API_URL } from "@/constants";
import { getAccessToken } from "@/lib/token";
import { addFilePrefix } from "@/utils/addFilePrefix";
import { convertDates } from "@/utils/convertDates";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

function createAPIInstance(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["Accept-Language"] =
          localStorage.getItem("lang") || "en";
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
