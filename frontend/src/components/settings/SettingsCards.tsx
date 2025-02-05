import ThemeToggle from "../common/navbar/ThemeToggle";
import SettingCard from "./SettingCard";
import TooltipSwitch from "./TooltipSwitch";

export default function SettingsCards() {
  const cards = [
    {
      title: "Theme",
      description:
        "Switch between light and dark themes to suit your preference.",
      switchComponent: <ThemeToggle />,
    },
    {
      title: "Tooltips",
      description:
        "Enable or disable tooltips for additional guidance in the app.",
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
