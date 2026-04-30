import { LOGO_PATH } from "@/constants";
import { useAppContext } from "@/contexts/app-provider";
import { useThemeContext } from "@/contexts/theme-provider";
import { ROUTES } from "@/lib/routes";
import { AuthService } from "@/services/auth.service";
import { NavbarSheet, ThemeToggle } from "@packages/ui";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import FocusableSpan from "../focusable-span";
import Tooltip from "../tooltip";
import NavbarSearch from "./navbar-search";

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
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <NavbarSheet user={user ?? null} handleLogout={handleLogout} />
        </div>
      </header>
      <div className="h-20"></div>
    </>
  );
}
