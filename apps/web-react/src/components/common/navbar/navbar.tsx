import { LOGO_PATH } from "@/constants";
import { useAppContext } from "@/contexts/app-provider";
import { useThemeContext } from "@/contexts/theme-provider";
import { queryKeys } from "@/lib/query-keys";
import { ROUTES } from "@/lib/routes";
import { AuthService } from "@/services/auth.service";
import { ChatService } from "@/services/chat.service";
import { FriendService } from "@/services/friend.service";
import { Chat, Friendship } from "@packages/schemas";
import { NavbarSearch, NavbarSheet, ThemeToggle } from "@packages/ui";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import FocusableSpan from "../focusable-span";
import Tooltip from "../tooltip";

export default function Navbar() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeContext();
  const isLoggedIn = !!user;

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
    queryClient.setQueryData<Friendship[]>(
      queryKeys.friends(),
      (oldFriends) => {
        if (
          oldFriends?.find(
            (f) =>
              f.requester.id === friendship.requester.id &&
              f.acceptor.id === friendship.acceptor.id,
          )
        )
          return oldFriends;
        return oldFriends ? [...oldFriends, friendship] : [friendship];
      },
    );
  }

  return (
    <>
      <header className="fixed z-50 flex h-20 w-full items-center justify-between bg-slate-200 p-4 dark:bg-slate-800">
        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <Tooltip content={t("common.navbar.logo.tooltip")}>
              <span>
                <FocusableSpan fn={() => navigate(ROUTES.HOME.$path())}>
                  <img src={LOGO_PATH} className="h-12 w-12 rounded-full" />
                </FocusableSpan>
              </span>
            </Tooltip>
          </div>
          {isLoggedIn && (
            <NavbarSearch
              user={user}
              addFriendAction={FriendService.createFriendship}
              createChatAction={ChatService.createPrivateChat}
              createChatCb={createChatCb}
              addFriendCb={addFriendCb}
            />
          )}
        </div>

        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <NavbarSheet user={user ?? null} handleLogout={handleLogout} />
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
}
