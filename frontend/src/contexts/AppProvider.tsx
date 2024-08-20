import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { fetchUser, refreshToken } from "../api/authAPI";
import { User } from "../models/User";
import { useQuery, useQueryClient } from "react-query";
import { queryKeys } from "../lib/queryKeys";

type AppContextProps = PropsWithChildren;

type AppContextValue = {
  user: User | undefined;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const AppContext = createContext<AppContextValue>({} as AppContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const queryClient = useQueryClient();
  const { isLoading } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: fetchUser
  });

  const user = queryClient.getQueryData<User>(queryKeys.me());
  const setUser = (user: User | null) => {
    queryClient.setQueryData(queryKeys.me(), user);
  };

  const refreshTokenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleRefreshToken = async () => {
      if (!user) return;

      try {
        console.log("Trying to refresh the token...");
        await refreshToken();
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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
