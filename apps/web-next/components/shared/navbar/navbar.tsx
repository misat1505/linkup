"use client";
import logo from "@/assets/logo.webp";
import { Switch as ThemeSwitch } from "@/components/ui/theme-switch";
import { logoutUser } from "@/features/auth/actions/logout";
import { createPrivateChat } from "@/features/chats/actions/create-private-chats";
import { createFriendship } from "@/features/friends/actions/create-friendship";
import { useAppContext } from "@/providers/app-provider";
import { sleep } from "@/utils/sleep";
import { NavbarSearch, NavbarSheet } from "@packages/ui";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { I18nText } from "../i18n-text";
import Tooltip from "../tooltip";

export default function Navbar() {
  const { user, invalidateCurrentUser } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = async () => {
    logoutUser();
    invalidateCurrentUser();
    queryClient.clear();

    await sleep(10);
    router.push("/login");
  };

  return (
    <>
      <header className="fixed z-50 flex h-20 w-full items-center justify-between bg-slate-200 p-4 dark:bg-slate-800">
        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <Tooltip
              content={<I18nText translationKey="common.navbar.logo.tooltip" />}
            >
              <span>
                <Link href="/">
                  <Image
                    src={logo}
                    alt="logo"
                    width={48}
                    height={48}
                    className="rounded-full"
                    loading="eager"
                  />
                </Link>
              </span>
            </Tooltip>
          </div>
          {user && (
            <NavbarSearch
              user={user}
              addFriendAction={createFriendship}
              createChatAction={createPrivateChat}
            />
          )}
        </div>

        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <ThemeSwitch />
          </div>
          <NavbarSheet user={user ?? null} handleLogout={handleLogout} />
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
}
