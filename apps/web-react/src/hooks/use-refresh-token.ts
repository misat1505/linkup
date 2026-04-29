import { AuthService } from "@/services/auth.service";
import { User } from "@packages/schemas";
import { useEffect, useRef } from "react";

export const useRefreshToken = (user: User | null | undefined) => {
  const refreshTokenIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const handleRefreshToken = async () => {
      if (!user) return;

      try {
        await AuthService.refreshToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    handleRefreshToken();

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
