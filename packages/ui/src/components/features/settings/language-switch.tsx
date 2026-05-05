import { MdKeyboardArrowDown } from "react-icons/md";
import Flag from "react-world-flags";
import { Button } from "../../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";

export type LanguageSwitchProps = {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
};

export function LanguageSwitch({
  language,
  changeLanguage,
}: LanguageSwitchProps) {
  const languages: Language[] = [
    {
      onclick: () => changeLanguage("en"),
      displayLang: "English",
      flagCode: "GB_ENG",
      code: "en",
    },
    {
      onclick: () => changeLanguage("de"),
      displayLang: "Deutsch",
      flagCode: "DE",
      code: "de",
    },
    {
      onclick: () => changeLanguage("es"),
      displayLang: "Español",
      flagCode: "ES",
      code: "es",
    },
    {
      onclick: () => changeLanguage("ru"),
      displayLang: "Русский",
      flagCode: "RU",
      code: "ru",
    },
    {
      onclick: () => changeLanguage("zh"),
      displayLang: "中文",
      flagCode: "CN",
      code: "zh",
    },
    {
      onclick: () => changeLanguage("pl"),
      displayLang: "Polski",
      flagCode: "PL",
      code: "pl",
    },
  ];

  const getSelectedLanguage = (): Language => {
    const languageObj = languages.find((lang) => lang.code === language);
    if (languageObj) return languageObj;

    return languages.find((lang) => lang.code === "en")!;
  };

  const resolvedLanguage = getSelectedLanguage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FlagComponent = Flag as unknown as React.FC<any>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          <div className="flex gap-x-2 items-center">
            <FlagComponent code={resolvedLanguage.flagCode} width={26} />
            <span>{resolvedLanguage.displayLang}</span>
          </div>
          <MdKeyboardArrowDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang, idx) => (
          <LanguageSwitchItem key={idx} {...lang} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Language = {
  flagCode: string;
  displayLang: string;
  onclick: () => Promise<void>;
  code: string;
};

function LanguageSwitchItem({ onclick, flagCode, displayLang }: Language) {
  const handleClick = async () => {
    await onclick();
    // setTimeout(() => {
    //   document.title = `LinkUp - ${TRANSLATION_FUNCTION("tabs.settings")}`;
    // }, 100);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FlagComponent = Flag as unknown as React.FC<any>;

  return (
    <DropdownMenuItem onClick={handleClick}>
      <div className="flex gap-x-2 items-center">
        <FlagComponent code={flagCode} width={26} />
        <span>{displayLang}</span>
      </div>
    </DropdownMenuItem>
  );
}
