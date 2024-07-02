import React, { createContext, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    const refreshToken = async () => {
      try {
        console.log("Trying to refresh the token...");

        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

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

    refreshToken();

    refreshTokenIntervalRef.current = setInterval(refreshToken, 30 * 60 * 1000);

    return () => {
      if (refreshTokenIntervalRef.current !== null) {
        clearInterval(refreshTokenIntervalRef.current);
      }
    };
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
