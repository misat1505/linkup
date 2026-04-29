import { useAppContext } from "@/contexts/app-provider";
import { useNavigate } from "react-router-dom";
import Tooltip from "../tooltip";
import FocusableSpan from "../focusable-span";
import { ROUTES } from "@/lib/routes";
import { LOGO_PATH } from "@/constants";
import NavbarSearch from "./navbar-search";
import ThemeToggle from "./theme-toggle";
import NavbarSheet from "./navbar-sheet";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t } = useTranslation();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

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
          {isLoggedIn && <NavbarSearch />}
        </div>

        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <NavbarSheet />
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
}
