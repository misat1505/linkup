import { useRefreshToken } from "@/hooks/use-refresh-token";
import { queryKeys } from "@/lib/query-keys";
import { AuthService } from "@/services/auth.service";
import { ChatService } from "@/services/chat.service";
import { User } from "@packages/schemas";
import { createContext, PropsWithChildren, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";

type AppContextProps = PropsWithChildren;

type AppContextValue = {
  user: User | null | undefined;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const AppContext = createContext<AppContextValue>({} as AppContextValue);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const queryClient = useQueryClient();
  const { isLoading } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: AuthService.me,
  });

  useQuery({
    queryKey: queryKeys.reactions(),
    queryFn: ChatService.getReactions,
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
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
