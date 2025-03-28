import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function LanguageSwitch() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    localStorage.setItem("lang", lng);
    i18n.changeLanguage(lng);
  };

  const getDisplayedLanguage = () => {
    if (i18n.language === "en") return "English";
    if (i18n.language === "de") return "Deutsch";
    if (i18n.language === "zh") return "中文";
    return "Polski";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <span>{getDisplayedLanguage()}</span>
          <MdKeyboardArrowDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("de")}>
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("zh")}>
          中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("pl")}>
          Polski
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
