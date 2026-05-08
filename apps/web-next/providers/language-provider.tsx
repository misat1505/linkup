"use client";

import { setLanguageCookie } from "@/actions/set-language-cookie";
import { Translation } from "@/i18n/types";
import { getCookieValue } from "@/utils/get-cookie-value";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type DotPaths<T> = T extends object
  ? {
      // @ts-expect-error dot string won't be infinite
      [K in keyof T & string]: `${K}${DotPrefix<DotPaths<T[K]>>}`;
    }[keyof T & string]
  : "";

export type TranslationPath = DotPaths<Translation>;

export type TranslateFn = (
  key: TranslationPath,
  vars?: Record<string, string>,
) => string;

export type TVars = Record<string, string>;

type LanguageContextProps = {
  locale: string;
  t: TranslateFn;
  changeLanguage: (lng: string) => Promise<void>;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguageContext must be used within LanguageProvider");
  return context;
};

type Props = {
  children: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNested = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
};

const interpolate = (template: string, vars?: Record<string, string>) => {
  if (!vars) return template;
  return template.replace(/{{(.*?)}}/g, (_, key) => vars[key.trim()] || "");
};

export const LanguageProvider = ({ children }: Props) => {
  const [locale, setLocale] = useState("en");
  const [translations, setTranslations] = useState<Translation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = async (lng: string) => {
    try {
      const data = await import(`../i18n/locales/${lng}.json`);
      setTranslations(data.default.translation);
    } catch {
      const data = await import("../i18n/locales/en.json");
      setTranslations(data.default.translation);
    }
  };

  const changeLanguage = async (lng: string) => {
    await setLanguageCookie(lng);
    await loadTranslations(lng);
    setLocale(lng);
  };

  useEffect(() => {
    const storedLang = getCookieValue("lang") || "en";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(storedLang);
    loadTranslations(storedLang).then(() => setIsLoading(false));
  }, []);

  if (isLoading || !translations) return null;

  const t = (path: string, vars?: TVars) => {
    const value = getNested(translations, path);
    if (typeof value === "string") return interpolate(value, vars);
    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};
