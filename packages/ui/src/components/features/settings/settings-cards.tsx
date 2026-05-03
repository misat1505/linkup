import { TRANSLATION_COMPONENT } from "../../../config";
import { ThemeToggle, ThemeToggleProps } from "../../misc";
import { LanguageSwitch, LanguageSwitchProps } from "./language-switch";
import { SettingCard } from "./setting-card";
import { TooltipSwitch } from "./tooltip-switch";

type SettingsCardsProps = ThemeToggleProps & LanguageSwitchProps;

export function SettingsCards({
  changeLanguage,
  language,
  theme,
  toggleTheme,
}: SettingsCardsProps) {
  const cards = [
    {
      title: <TRANSLATION_COMPONENT translationKey="settings.language.title" />,
      description: (
        <TRANSLATION_COMPONENT translationKey="settings.language.description" />
      ),
      switchComponent: (
        <LanguageSwitch changeLanguage={changeLanguage} language={language} />
      ),
    },
    {
      title: <TRANSLATION_COMPONENT translationKey="settings.theme.title" />,
      description: (
        <TRANSLATION_COMPONENT translationKey="settings.theme.description" />
      ),
      switchComponent: <ThemeToggle theme={theme} toggleTheme={toggleTheme} />,
    },
    {
      title: <TRANSLATION_COMPONENT translationKey="settings.tooltips.title" />,
      description: (
        <TRANSLATION_COMPONENT translationKey="settings.tooltips.description" />
      ),
      switchComponent: <TooltipSwitch />,
    },
  ];

  return (
    <div className="max-w-[95vw] w-full mx-auto mt-24 mb-4">
      {cards.map((card, idx) => (
        <SettingCard key={idx} {...card} />
      ))}
    </div>
  );
}
