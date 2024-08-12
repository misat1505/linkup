import React, { HTMLAttributes, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../../ui/sheet";
import NavbarAvatar from "./NavbarAvatar";
import { cn } from "../../../lib/utils";
import { CiLogin, CiLogout } from "react-icons/ci";
import { MdOutlineSupervisorAccount, MdArticle } from "react-icons/md";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { PiChatsCircleFill } from "react-icons/pi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../../ui/alert-dialog";
import { useAppContext } from "../../../contexts/AppProvider";

export default function NavbarSheet() {
  const { user } = useAppContext();
  const isLoggedIn = !!user;

  return (
    <Sheet>
      <SheetTrigger>
        <NavbarAvatar />
      </SheetTrigger>
      {isLoggedIn ? <LoggedInSheet /> : <GuestSheet />}
    </Sheet>
  );
}

type ButtonsType = {
  icon: JSX.Element;
  text: string;
  onClick: () => void;
};

function LoggedInSheet() {
  const buttons: ButtonsType[] = [
    {
      icon: <FaHome size={20} className="text-blue-500" />,
      text: "Home",
      onClick: () => {}
    },
    {
      icon: <PiChatsCircleFill size={20} className="text-blue-500" />,
      text: "Chats",
      onClick: () => {}
    },
    {
      icon: <MdArticle size={20} className="text-blue-500" />,
      text: "Posts",
      onClick: () => {}
    },
    {
      icon: <FaUserFriends size={20} className="text-blue-500" />,
      text: "Friends",
      onClick: () => {}
    }
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Welcome user!</SheetTitle>
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
  const buttons: ButtonsType[] = [
    {
      icon: <CiLogin size={20} className="text-emerald-500" />,
      text: "Login",
      onClick: () => {}
    },
    {
      icon: <MdOutlineSupervisorAccount size={20} />,
      text: "Create new account",
      onClick: () => {}
    }
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Welcome Guest!</SheetTitle>
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
  text: string;
};

function SheetItem({ text, className, Icon, ...rest }: SheetItemType) {
  return (
    <button
      className={cn(
        "mb-2 flex w-full items-center justify-between bg-white p-4 transition-all duration-500 ease-in-out hover:bg-slate-200",
        className
      )}
      {...rest}
    >
      <div className="flex items-center gap-x-4">
        {Icon}
        {text}
      </div>
      <div></div>
    </button>
  );
}

function LogoutDialog() {
  const button: ButtonsType = {
    text: "Logout",
    icon: <CiLogout size={20} className="text-red-500" />,
    onClick: () => {}
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <SheetItem
          text={button.text}
          Icon={button.icon}
          onClick={button.onClick}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? This will end your session, and
            you will need to log in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Yes, logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
