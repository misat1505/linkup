import { useLanguageContext } from "@/providers/language-provider";
import { SettingsCards } from "@packages/ui/components/features/settings/settings-cards";
import { SettingsSlogan } from "@packages/ui/components/features/settings/settings-slogan";
import { useTheme } from "next-themes";
import React from "react";

const SettingsWrapper = () => {
  const { changeLanguage, locale } = useLanguageContext();
  const { theme, setTheme } = useTheme();

  return (
    <React.Fragment>
      <SettingsSlogan />
      <SettingsCards
        changeLanguage={changeLanguage}
        language={locale}
        theme={theme as "light" | "dark"}
        toggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      />
    </React.Fragment>
  );
};

export default SettingsWrapper;
