"use client";

import { useRefreshToken } from "@/features/auth/hooks/use-refresh-token";
import { getReactions } from "@/features/chats/actions/get-reactions";
import { queryKeys } from "@/lib/query-keys";
import { User } from "@packages/schemas";
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

const AppProvider = ({ children }: AppContextProps) => {
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

	const isAppReady = !isLoading && !isLoadingReactions;

	return (
		<AppContext.Provider
			value={{
				user,
				invalidateCurrentUser,
				isLoading: !isAppReady,
			}}
		>
			{isAppReady ? children : null}
		</AppContext.Provider>
	);
};

export default AppProvider;
