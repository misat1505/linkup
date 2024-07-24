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
import { useQuery } from "react-query";

type AppContextProps = PropsWithChildren;

type AppContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  status: "idle" | "error" | "loading" | "success";
};

const AppContext = createContext<AppContextValue>({} as AppContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const [user, setUser] = useState<User | null>(null);
  const { status } = useQuery("user", fetchUser, {
    onSuccess: (d) => setUser(d)
  });
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
        status
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
