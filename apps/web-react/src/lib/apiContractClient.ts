import { API_URL } from "@/constants";
import { addFilePrefix } from "@/utils/addFilePrefix";
import { ApiContractClient } from "@packages/api-contract";
import axios from "axios";
import { getAccessToken } from "./token";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Accept-Language"] = localStorage.getItem("lang") || "en";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    response.data = addFilePrefix(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const apiContractClient = new ApiContractClient(instance);
