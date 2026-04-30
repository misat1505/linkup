import { IoMoon } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import { TRANSLATION_FUNCTION } from "../../../config";
import { Switch } from "../../shadcn/theme-switch";
import Tooltip from "../tooltip";

type ThemeToggleProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
  const component =
    theme === "light" ? (
      <MdSunny className="text-white" />
    ) : (
      <IoMoon className="text-black" />
    );

  const tooltipText = TRANSLATION_FUNCTION("common.theme.switch.tooltip", {
    mode:
      theme === "light"
        ? TRANSLATION_FUNCTION("common.theme.dark")
        : TRANSLATION_FUNCTION("common.theme.light"),
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
