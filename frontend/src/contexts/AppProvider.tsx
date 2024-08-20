import React, { createContext, PropsWithChildren, useContext } from "react";
import { fetchUser } from "../api/authAPI";
import { User } from "../models/User";
import { useQuery, useQueryClient } from "react-query";
import { queryKeys } from "../lib/queryKeys";
import { useRefreshToken } from "../hooks/useRefreshToken";

type AppContextProps = PropsWithChildren;

type AppContextValue = {
  user: User | null | undefined;
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

  useRefreshToken(user);

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
