import { createContext, PropsWithChildren, useContext, useState } from "react";

type ThemeContextProps = PropsWithChildren;

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({} as ThemeContextValue);

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: ThemeContextProps) => {
  const addClassIfDark = (theme: Theme) => {
    if (theme === "dark") document.documentElement.classList.add("dark");
  };

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("theme") as Theme | null;
    document.body.classList.add("transition-colors");

    if (savedTheme) {
      addClassIfDark(savedTheme);
      return savedTheme;
    }

    if (window.matchMedia) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      addClassIfDark(systemTheme);
      return systemTheme;
    }

    const defaultTheme = "light";
    return defaultTheme;
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      if (newTheme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
