import { convertDates } from "../utils/convertDates";
import { API_URL } from "../constants";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { addFilePrefix } from "../utils/addFilePrefix";

function createAPIInstance(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);

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
  baseURL: `${API_URL}/users`,
  withCredentials: true
});

export const CHAT_API = createAPIInstance({
  baseURL: `${API_URL}/chats`,
  withCredentials: true
});
