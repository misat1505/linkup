import ThemeToggle from "../common/navbar/ThemeToggle";
import SettingCard from "./SettingCard";

export default function SettingsCards() {
  const cards = [
    {
      title: "App Theme",
      description:
        "Switch between light and dark themes to suit your preference.",
      switchComponent: <ThemeToggle />,
    },
  ];

  return (
    <div className="max-w-[95vw] md:max-w-[500px] w-full mx-auto my-4 lg:my-auto">
      {cards.map((card, idx) => (
        <SettingCard key={idx} {...card} />
      ))}
    </div>
  );
}
