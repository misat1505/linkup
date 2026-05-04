import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import { useUiPackageContext } from "../../../config";
import { Switch } from "../../shadcn/theme-switch";
import { Tooltip } from "../tooltip";

export type ThemeToggleProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const { t } = useUiPackageContext();

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
        <Switch onClick={toggleTheme} checked={theme === "dark"} theme={theme}>
          <div className="flex h-full w-full items-center justify-center">
            {component}
          </div>
        </Switch>
      </span>
    </Tooltip>
  );
}
