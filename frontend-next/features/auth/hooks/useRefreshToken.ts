import { useEffect, useRef } from "react";
import { User } from "../schemas/user";
import { refreshToken } from "../actions/refreshToken";

export const useRefreshToken = (user: User | null | undefined) => {
  const refreshTokenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleRefreshToken = async () => {
      if (!user) return;

      try {
        await refreshToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    // TODO: there is some race condition here

    // handleRefreshToken();

    refreshTokenIntervalRef.current = setInterval(
      handleRefreshToken,
      10 * 60 * 1000,
    );

    return () => {
      if (refreshTokenIntervalRef.current !== null) {
        clearInterval(refreshTokenIntervalRef.current);
      }
    };
  }, [user]);
};
