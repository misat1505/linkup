import { Switch } from "../../ui/theme-switch";
import { useThemeContext } from "../../../contexts/ThemeProvider";
import React from "react";
import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  const component =
    theme === "light" ? (
      <MdSunny className="text-white" />
    ) : (
      <IoMoon className="text-black" />
    );

  return (
    <div className="bg-blue">
      <Switch className="" onClick={toggleTheme}>
        <div className="flex h-full w-full items-center justify-center">
          {component}
        </div>
      </Switch>
    </div>
  );
}
