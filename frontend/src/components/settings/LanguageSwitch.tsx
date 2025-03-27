import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    localStorage.setItem("lang", lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 p-2">
      <Button
        onClick={() => changeLanguage(i18n.language === "en" ? "pl" : "en")}
      >
        {i18n.language === "en" ? "Polski" : "English"}
      </Button>
    </div>
  );
}
