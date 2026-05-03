import { User } from "@packages/schemas";
import React, { HTMLAttributes, ReactNode } from "react";
import { CiLogin, CiLogout } from "react-icons/ci";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdArticle, MdOutlineSupervisorAccount } from "react-icons/md";
import { PiChatsCircleFill } from "react-icons/pi";
import {
  navigate,
  TRANSLATION_COMPONENT,
  useUiPackageContext,
} from "../../../config";
import { cn } from "../../../lib/utils";
import { createFullName } from "../../../utils/create-full-name";
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
} from "../../shadcn/alert-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../shadcn/sheet";
import Tooltip from "../tooltip";
import { NavbarAvatar } from "./navbar-avatar";

type LogoutFn = () => Promise<void>;
type NavbarSheetProps = { user: User | null; handleLogout: LogoutFn };

export function NavbarSheet({ user, handleLogout }: NavbarSheetProps) {
  const { t } = useUiPackageContext();
  const isLoggedIn = !!user;

  return (
    <Sheet>
      <SheetTrigger data-testid="cy-nav-trigger">
        <Tooltip content={t("common.navbar.sheet.trigger.tooltip")}>
          <span>
            <NavbarAvatar user={user} />
          </span>
        </Tooltip>
      </SheetTrigger>
      {isLoggedIn ? (
        <LoggedInSheet user={user} handleLogout={handleLogout} />
      ) : (
        <GuestSheet />
      )}
    </Sheet>
  );
}

type ButtonsType = {
  icon: React.JSX.Element;
  text: string;
  onClick: () => void;
};

function LoggedInSheet({
  user,
  handleLogout,
}: {
  user: User;
  handleLogout: LogoutFn;
}) {
  const { t } = useUiPackageContext();
  const buttons: ButtonsType[] = [
    {
      icon: <FaHome size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.home"),
      onClick: () => navigate("/"),
    },
    {
      icon: <PiChatsCircleFill size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.chats"),
      onClick: () => navigate("/chats"),
    },
    {
      icon: <IoIosSettings size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.settings"),
      onClick: () => navigate("/settings"),
    },
    {
      icon: <MdArticle size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.posts"),
      onClick: () => navigate("/posts"),
    },
    {
      icon: <FaUserFriends size={20} className="text-blue-500" />,
      text: t("common.navbar.sheet.items.friends"),
      onClick: () => navigate("/friends"),
    },
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <TRANSLATION_COMPONENT
            translationKey="common.navbar.sheet.title.logged-in"
            values={{
              fullName: createFullName(user!),
            }}
          />
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
        <LogoutDialog handleLogout={handleLogout} />
      </SheetDescription>
    </SheetContent>
  );
}

function GuestSheet() {
  const { t } = useUiPackageContext();
  const buttons: ButtonsType[] = [
    {
      icon: <CiLogin size={20} className="text-emerald-500" />,
      text: t("common.navbar.sheet.items.login"),
      onClick: () => navigate("/login"),
    },
    {
      icon: <MdOutlineSupervisorAccount size={20} />,
      text: t("common.navbar.sheet.items.signup"),
      onClick: () => navigate("/signup"),
    },
  ];

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <TRANSLATION_COMPONENT translationKey="common.navbar.sheet.title.anonymous" />
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

function LogoutDialog({ handleLogout }: { handleLogout: LogoutFn }) {
  const { t } = useUiPackageContext();
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
            <TRANSLATION_COMPONENT translationKey="common.navbar.sheet.items.logout.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TRANSLATION_COMPONENT translationKey="common.navbar.sheet.items.logout.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <TRANSLATION_COMPONENT translationKey="common.navbar.sheet.items.logout.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleLogout()}>
            <TRANSLATION_COMPONENT translationKey="common.navbar.sheet.items.logout.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
