import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";
import Tooltip from "../Tooltip";
import { useThemeContext } from "@/contexts/ThemeProvider";
import { Switch } from "@/components/ui/theme-switch";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const { t } = useTranslation();

  const component =
    theme === "light" ? (
      <MdSunny className="text-white" />
    ) : (
      <IoMoon className="text-black" />
    );

  const tooltipText = t("common.theme.switch.tooltip", {
    mode: theme === "light" ? t("common.theme.dark") : t("common.theme.light"),
  });

  return (
    <Tooltip content={tooltipText}>
      <span>
        <Switch onClick={toggleTheme} checked={theme === "dark"}>
          <div className="flex h-full w-full items-center justify-center">
            {component}
          </div>
        </Switch>
      </span>
    </Tooltip>
  );
}
