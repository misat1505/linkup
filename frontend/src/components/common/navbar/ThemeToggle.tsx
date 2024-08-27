import { useThemeContext } from "../../../contexts/ThemeProvider";
import React from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button className="h-8 w-fit" onClick={toggleTheme}>
      {theme}
    </button>
  );
}
