"use client";

import { useRefreshToken } from "@/features/auth/hooks/useRefreshToken";
import { User } from "@/features/auth/schemas/user";
import { getReactions } from "@/features/chats/actions/getReactions";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, PropsWithChildren, useContext } from "react";

type AppContextProps = PropsWithChildren;

type AppContextValue = {
  user: User | null | undefined;
  invalidateCurrentUser: () => void;
  isLoading: boolean;
};

const AppContext = createContext<AppContextValue>({} as AppContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: async () => {
      const response = await axios.get("/api/auth/me");
      return User.parse(response.data);
    },
  });

  const { isLoading: isLoadingReactions } = useQuery({
    queryFn: getReactions,
    queryKey: queryKeys.reactions(),
  });

  function invalidateCurrentUser() {
    queryClient.invalidateQueries({ queryKey: queryKeys.me() });
  }

  useRefreshToken(user);

  return (
    <AppContext.Provider
      value={{
        user,
        invalidateCurrentUser,
        isLoading: isLoading || isLoadingReactions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
