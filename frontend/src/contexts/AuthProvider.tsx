import React, { createContext, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { refreshToken } from "../api/authAPI";

interface AuthContextProps {
  children: React.ReactNode;
}

interface AuthContextValue {}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthContextProps) => {
  const navigate = useNavigate();

  const refreshTokenIntervalRef = useRef<any | null>(null);

  useEffect(() => {
    const handleRefreshToken = async () => {
      try {
        console.log("Trying to refresh the token...");

        const response = await refreshToken();

        if (response.status !== 200) {
          navigate("/login");
          return;
        }

        console.log("Token refreshed successfully.");
      } catch (error) {
        navigate("/login");
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

    // no navigate so that it doesnt rerender on switchin between pages
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
