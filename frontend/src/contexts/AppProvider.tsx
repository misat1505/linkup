import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchUser } from "../api/authAPI";
import { User } from "../models/User";
import { useQuery } from "react-query";

type AppContextProps = PropsWithChildren;

type AppContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
};

const AuthContext = createContext<AppContextValue>({} as AppContextValue);

export const useAppContext = () => useContext(AuthContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const [user, setUser] = useState<User | null>(null);
  const { data, isLoading } = useQuery("user", fetchUser);

  useEffect(() => {
    setUser(data!);
  }, [data]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AppProvider;
