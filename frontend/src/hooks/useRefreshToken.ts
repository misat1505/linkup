import { AuthService } from "../services/Auth.service";
import { User } from "../types/User";
import { useEffect, useRef } from "react";

export const useRefreshToken = (user: User | null | undefined) => {
  const refreshTokenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleRefreshToken = async () => {
      if (!user) return;

      try {
        console.log("Trying to refresh the token...");
        await AuthService.refreshToken();
        console.log("Token refreshed successfully.");
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    handleRefreshToken();

    refreshTokenIntervalRef.current = setInterval(
      handleRefreshToken,
      30 * 60 * 1000
    );

    return () => {
      if (refreshTokenIntervalRef.current !== null) {
        clearInterval(refreshTokenIntervalRef.current);
      }
    };
  }, [user]);
};
