"use client";
import { logoutUser } from "@/features/auth/actions/logout";
import { createPrivateChat } from "@/features/chats/actions/create-private-chats";
import { createFriendship } from "@/features/friends/actions/create-friendship";
import { useAppContext } from "@/providers/app-provider";
import { sleep } from "@/utils/sleep";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Navbar } from "@packages/ui";
import { useTheme } from "next-themes";

export default function NavbarWrapper() {
  const { user, invalidateCurrentUser } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    logoutUser();
    invalidateCurrentUser();
    queryClient.clear();

    await sleep(10);
    router.push("/login");
  };

  return (
    <Navbar
      user={user ?? null}
      addFriendAction={createFriendship}
      createChatAction={createPrivateChat}
      handleLogout={handleLogout}
      theme={theme as "light" | "dark"}
      toggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
    />
  );
}
