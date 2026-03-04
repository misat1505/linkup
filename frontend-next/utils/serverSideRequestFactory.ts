import { getAccessTokenFromCookie } from "@/features/auth/utils/getAccessTokenFromCookie";

import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getRefreshTokenFromCookie } from "@/features/auth/utils/getRefreshTokenFromCookie";

type FactoryOptions = {
  base: AxiosInstance;
  include?: {
    accessToken?: boolean;
    refreshToken?: boolean;
  };
};

export async function serverSideRequestFactory(
  options: FactoryOptions,
): Promise<AxiosInstance> {
  const instance = options.base;

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const headers = config.headers || {};

      if (options?.include?.accessToken) {
        const accessToken = await getAccessTokenFromCookie();
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
      }

      if (options?.include?.refreshToken) {
        const refreshToken = await getRefreshTokenFromCookie();
        if (refreshToken) headers["cookie"] = `refresh-token=${refreshToken}`;
      }

      config.headers = headers;
      return config;
    },
  );

  return instance;
}
