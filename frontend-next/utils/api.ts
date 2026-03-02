import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { API_URL } from "./constants";

function createAPIInstance(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config);

  instance.interceptors.request.use(
    (config) => {
      // const token = getAccessToken();
      // if (token) {
      //   config.headers["Authorization"] = `Bearer ${token}`;
      // }
      config.headers["Accept-Language"] = localStorage.getItem("lang") || "en";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // instance.interceptors.response.use(
  //   (response) => {
  //     response.data = addFilePrefix(response.data);
  //     return response;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  return instance;
}

export const AUTH_API = createAPIInstance({
  baseURL: `${API_URL}/auth`,
  withCredentials: true,
});
