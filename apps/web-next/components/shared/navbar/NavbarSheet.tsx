"use client";
import React, { HTMLAttributes, ReactNode } from "react";
import NavbarAvatar from "./NavbarAvatar";
import { CiLogin, CiLogout } from "react-icons/ci";
import { MdOutlineSupervisorAccount, MdArticle } from "react-icons/md";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { PiChatsCircleFill } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Tooltip from "../Tooltip";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createFullName } from "@/utils/createFullName";
import { I18nText } from "../I18nText";
import { useAppContext } from "@/providers/AppProvider";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/features/auth/actions/logout";
import { sleep } from "@/utils/sleep";

export default function NavbarSheet() {
  const { user } = useAppContext();
  const isLoggedIn = !!user;

  return (
    <Sheet>
      <SheetTrigger data-testid="cy-nav-trigger">
        <Tooltip
          content={
            <I18nText translationKey="common.navbar.sheet.trigger.tooltip" />
          }
        >
          <span>
            <NavbarAvatar />
          </span>
        </Tooltip>
      </SheetTrigger>
      {isLoggedIn ? <LoggedInSheet /> : <GuestSheet />}
    </Sheet>
  );
}

type ButtonsType = {
  icon: React.ReactNode;
  text: React.ReactNode;
  onClick: () => void;
};

function LoggedInSheet() {
  const { user } = useAppContext();
  const router = useRouter();

  const buttons: ButtonsType[] = [
    {
      icon: <FaHome size={20} className="text-blue-500" />,
      text: <I18nText translationKey="common.navbar.sheet.items.home" />,
      onClick: () => router.push("/"),
    },
    {
      icon: <PiChatsCircleFill size={20} className="text-blue-500" />,
      text: <I18nText translationKey="common.navbar.sheet.items.chats" />,
      onClick: () => router.push("/chats"),
    },
    {
      icon: <IoIosSettings size={20} className="text-blue-500" />,
      text: <I18nText translationKey="common.navbar.sheet.items.settings" />,
      onClick: () => router.push("/settings"),
    },
    {
      icon: <MdArticle size={20} className="text-blue-500" />,
      text: <I18nText translationKey="common.navbar.sheet.items.posts" />,
      onClick: () => router.push("/posts"),
    },
    {
      icon: <FaUserFriends size={20} className="text-blue-500" />,
      text: <I18nText translationKey="common.navbar.sheet.items.friends" />,
      onClick: () => router.push("/friends"),
    },
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          {
            <I18nText
              translationKey="common.navbar.sheet.title.logged-in"
              values={{
                fullName: createFullName(user!),
              }}
            />
          }
        </SheetTitle>
      </SheetHeader>
      <SheetDescription className="flex h-full flex-col justify-between pb-8 pt-4 text-sm text-muted-foreground">
        <span>
          {buttons.map((button, idx) => (
            <SheetItem
              key={idx}
              text={button.text}
              Icon={button.icon}
              onClick={button.onClick}
            />
          ))}
        </span>
        <LogoutDialog />
      </SheetDescription>
    </SheetContent>
  );
}

function GuestSheet() {
  const router = useRouter();

  const buttons: ButtonsType[] = [
    {
      icon: <CiLogin size={20} className="text-emerald-500" />,
      text: <I18nText translationKey="common.navbar.sheet.items.login" />,
      onClick: () => router.push("/login"),
    },
    {
      icon: <MdOutlineSupervisorAccount size={20} />,
      text: <I18nText translationKey="common.navbar.sheet.items.signup" />,
      onClick: () => router.push("/signup"),
    },
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <I18nText translationKey="common.navbar.sheet.title.anonymous" />
        </SheetTitle>
      </SheetHeader>
      <SheetDescription className="flex h-full flex-col justify-end pb-8 pt-4">
        {buttons.map((button, idx) => (
          <SheetItem
            key={idx}
            text={button.text}
            Icon={button.icon}
            onClick={button.onClick}
          />
        ))}
      </SheetDescription>
    </SheetContent>
  );
}

type SheetItemType = HTMLAttributes<HTMLButtonElement> & {
  Icon: ReactNode;
  text: React.ReactNode;
};

// eslint-disable-next-line react/display-name
const SheetItem = React.forwardRef<HTMLButtonElement, SheetItemType>(
  ({ text, className, Icon, ...rest }, ref) => {
    return (
      <SheetClose
        ref={ref}
        className={cn(
          "mb-2 flex w-full items-center justify-between bg-white p-4 transition-all duration-500 ease-in-out hover:bg-slate-200 dark:bg-background dark:hover:bg-slate-800",
          className,
        )}
        {...rest}
      >
        <div className="flex items-center gap-x-4">
          {Icon}
          {text}
        </div>
        <div></div>
      </SheetClose>
    );
  },
);

function LogoutDialog() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { invalidateCurrentUser } = useAppContext();

  const handleLogout = async () => {
    logoutUser();
    invalidateCurrentUser();
    queryClient.clear();

    await sleep(10);
    router.push("/login");
  };

  const button: ButtonsType = {
    text: (
      <I18nText translationKey="common.navbar.sheet.items.logout.trigger" />
    ),
    icon: <CiLogout size={20} className="text-red-500" />,
    onClick: () => {},
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="mb-2 flex w-full items-center justify-between bg-white p-4 transition-all duration-500 ease-in-out hover:bg-slate-200 dark:bg-background dark:hover:bg-slate-800">
          <div className="flex items-center gap-x-4">
            {button.icon}
            {button.text}
          </div>
          <div></div>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <I18nText translationKey="common.navbar.sheet.items.logout.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <I18nText translationKey="common.navbar.sheet.items.logout.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <I18nText translationKey="common.navbar.sheet.items.logout.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleLogout()}>
            <I18nText translationKey="common.navbar.sheet.items.logout.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
