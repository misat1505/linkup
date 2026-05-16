import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_URL } from "./constants";
import { getLanguageCookie } from "./get-language-cookie";

function createAPIInstance(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.request.use(
    async (config) => {
      config.headers["Accept-Language"] = (await getLanguageCookie()) ?? "en";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
}

export const AUTH_API = createAPIInstance({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});

export const CHAT_API = createAPIInstance({
  baseURL: `${API_URL}/chats`,
});

export const FILE_API = createAPIInstance({
  baseURL: `${API_URL}/files`,
});
