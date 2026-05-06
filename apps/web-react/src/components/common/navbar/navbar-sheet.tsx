import { useAppContext } from "@/contexts/app-provider";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
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
} from "@packages/ui/components/shadcn/alert-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@packages/ui/components/shadcn/sheet";
import { createFullName } from "@packages/ui/utils/create-full-name";
import React, { HTMLAttributes, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CiLogin, CiLogout } from "react-icons/ci";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdArticle, MdOutlineSupervisorAccount } from "react-icons/md";
import { PiChatsCircleFill } from "react-icons/pi";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import Tooltip from "../tooltip";
import NavbarAvatar from "./navbar-avatar";

export default function NavbarSheet() {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const isLoggedIn = !!user;

  return (
    <Sheet>
      <SheetTrigger data-testid="cy-nav-trigger">
        <Tooltip content={t("common.navbar.sheet.trigger.tooltip")}>
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
  icon: React.JSX.Element;
  text: string;
  onClick: () => void;
};

function LoggedInSheet() {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const buttons: ButtonsType[] = [
    {
      icon: <FaHome size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.home"),
      onClick: () => navigate(ROUTES.HOME.$path()),
    },
    {
      icon: <PiChatsCircleFill size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.chats"),
      onClick: () => navigate(ROUTES.CHATS.$path()),
    },
    {
      icon: <IoIosSettings size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.settings"),
      onClick: () => navigate(ROUTES.SETTINGS.$path()),
    },
    {
      icon: <MdArticle size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.posts"),
      onClick: () => navigate(ROUTES.POSTS.$path()),
    },
    {
      icon: <FaUserFriends size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.friends"),
      onClick: () => navigate(ROUTES.FRIENDS.$path()),
    },
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          {t("common.navbar.sheet.title.logged-in", {
            fullName: createFullName(user!),
          })}
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const buttons: ButtonsType[] = [
    {
      icon: <CiLogin size={20} className="text-emerald-500" />,
      text: t("common.navbar.sheet.items.login"),
      onClick: () => navigate(ROUTES.LOGIN.$path()),
    },
    {
      icon: <MdOutlineSupervisorAccount size={20} />,
      text: t("common.navbar.sheet.items.signup"),
      onClick: () => navigate(ROUTES.SIGNUP.$path()),
    },
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{t("common.navbar.sheet.title.anonymous")}</SheetTitle>
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

const SheetItem = React.forwardRef<HTMLButtonElement, SheetItemType>(
  ({ text, className, Icon, ...rest }, ref) => {
    return (
      <SheetClose
        data-testid={`cy-nav-sheet-item-${text.toLowerCase()}`}
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    queryClient.clear();
    navigate(ROUTES.LOGIN.$path());
  };

  const button: ButtonsType = {
    text: t("common.navbar.sheet.items.logout.trigger"),
    icon: <CiLogout size={20} className="text-red-500" />,
    onClick: () => {},
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          data-testid={`cy-nav-sheet-item-${button.text.toLowerCase()}`}
          className="mb-2 flex w-full items-center justify-between bg-white p-4 transition-all duration-500 ease-in-out hover:bg-slate-200 dark:bg-background dark:hover:bg-slate-800"
        >
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
            {t("common.navbar.sheet.items.logout.dialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("common.navbar.sheet.items.logout.dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("common.navbar.sheet.items.logout.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleLogout()}>
            {t("common.navbar.sheet.items.logout.dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
