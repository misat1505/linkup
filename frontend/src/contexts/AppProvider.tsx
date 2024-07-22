import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState
} from "react";
import { fetchUser } from "../api/authAPI";
import { User } from "../models/User";
import { useQuery } from "react-query";

type AppContextProps = PropsWithChildren;

type AppContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AppContextValue>({} as AppContextValue);

export const useAppContext = () => useContext(AuthContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const [user, setUser] = useState<User | null>(null);
  useQuery("user", fetchUser, {
    onSuccess: (d) => setUser(d)
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AppProvider;
