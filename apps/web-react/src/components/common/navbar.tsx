import { useAppContext } from "@/contexts/app-provider";
import { useThemeContext } from "@/contexts/theme-provider";
import { queryKeys } from "@/lib/query-keys";
import { ROUTES } from "@/lib/routes";
import { AuthService } from "@/services/auth.service";
import { ChatService } from "@/services/chat.service";
import { FriendService } from "@/services/friend.service";
import { Chat, Friendship } from "@packages/schemas";
import { Navbar } from "@packages/ui/components/misc/navbar/navbar";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function NavbarWrapper() {
	const queryClient = useQueryClient();
	const { user, setUser } = useAppContext();
	const navigate = useNavigate();
	const { theme, toggleTheme } = useThemeContext();

	const handleLogout = async () => {
		await AuthService.logout();
		setUser(null);
		queryClient.clear();
		navigate(ROUTES.LOGIN.$path());
	};

	function createChatCb(chat: Chat) {
		queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
			if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
			return oldChats ? [...oldChats, chat] : [chat];
		});
	}

	function addFriendCb(friendship: Friendship) {
		queryClient.setQueryData<Friendship[]>(queryKeys.friends(), (oldFriends) => {
			if (
				oldFriends?.find(
					(f) =>
						f.requester.id === friendship.requester.id && f.acceptor.id === friendship.acceptor.id,
				)
			)
				return oldFriends;
			return oldFriends ? [...oldFriends, friendship] : [friendship];
		});
	}

	return (
		<Navbar
			user={user ?? null}
			addFriendAction={FriendService.createFriendship}
			createChatAction={ChatService.createPrivateChat}
			createChatCb={createChatCb}
			addFriendCb={addFriendCb}
			handleLogout={handleLogout}
			theme={theme}
			toggleTheme={toggleTheme}
		/>
	);
}
