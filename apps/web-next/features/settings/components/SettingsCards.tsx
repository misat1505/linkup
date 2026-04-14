import SettingCard from "./SettingCard";
import TooltipSwitch from "./TooltipSwitch";
import LanguageSwitch from "./LanguageSwitch";
import { I18nText } from "@/components/shared/I18nText";
import { Switch } from "@/components/ui/theme-switch";

export default function SettingsCards() {
  const cards = [
    {
      title: <I18nText translationKey="settings.language.title" />,
      description: <I18nText translationKey="settings.language.description" />,
      switchComponent: <LanguageSwitch />,
    },
    {
      title: <I18nText translationKey="settings.theme.title" />,
      description: <I18nText translationKey="settings.theme.description" />,
      switchComponent: <Switch />,
    },
    {
      title: <I18nText translationKey="settings.tooltips.title" />,
      description: <I18nText translationKey="settings.tooltips.description" />,
      switchComponent: <TooltipSwitch />,
    },
  ];

  return (
    <div className="max-w-[95vw] `md:max-w-125 w-full mx-auto mt-24 mb-4">
      {cards.map((card, idx) => (
        <SettingCard key={idx} {...card} />
      ))}
    </div>
  );
}
