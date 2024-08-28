import { Switch } from "../../ui/theme-switch";
import { useThemeContext } from "../../../contexts/ThemeProvider";
import React from "react";
import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";
import Tooltip from "../Tooltip";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  const component =
    theme === "light" ? (
      <MdSunny className="text-white" />
    ) : (
      <IoMoon className="text-black" />
    );

  const tooltipText = `Switch to ${theme === "light" ? "dark" : "light"} mode`;

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