import { useTranslation } from "react-i18next";
import ThemeToggle from "../common/navbar/theme-toggle";
import SettingCard from "./setting-card";
import TooltipSwitch from "./tooltip-switch";
import LanguageSwitch from "./language-switch";

export default function SettingsCards() {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("settings.language.title"),
      description: t("settings.language.description"),
      switchComponent: <LanguageSwitch />,
    },
    {
      title: t("settings.theme.title"),
      description: t("settings.theme.description"),
      switchComponent: <ThemeToggle />,
    },
    {
      title: t("settings.tooltips.title"),
      description: t("settings.tooltips.description"),
      switchComponent: <TooltipSwitch />,
    },
  ];

  return (
    <div className="max-w-[95vw] md:max-w-[500px] w-full mx-auto mt-24 mb-4">
      {cards.map((card, idx) => (
        <SettingCard key={idx} {...card} />
      ))}
    </div>
  );
}
