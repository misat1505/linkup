import { getAccessTokenFromCookie } from "@/features/auth/utils/getAccessTokenFromCookie";
import { getRefreshTokenFromCookie } from "@/features/auth/utils/getRefreshTokenFromCookie";
import { API_URL } from "@/utils/constants";
import { ApiContractClient } from "@packages/api-contract";
import axios from "axios";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessTokenFromCookie();
    config.headers["Authorization"] = `Bearer ${accessToken}`;

    const refreshToken = await getRefreshTokenFromCookie();
    config.headers["cookie"] = `refresh-token=${refreshToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const apiContractClient = new ApiContractClient(instance);
