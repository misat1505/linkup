"use client";

import { Translation } from "@/i18n/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type DotPaths<T> = T extends object
  ? {
      [K in keyof T & string]: `${K}${DotPrefix<DotPaths<T[K]>>}`;
    }[keyof T & string]
  : "";

type TranslationPath = DotPaths<Translation>;

type TranslateFn = (
  key: TranslationPath,
  vars?: Record<string, string>,
) => string;

type LanguageContextProps = {
  locale: string;
  t: TranslateFn;
  changeLanguage: (lng: string) => void;
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

  const changeLanguage = (lng: string) => {
    localStorage.setItem("lang", lng);
    setLocale(lng);
    loadTranslations(lng);
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setLocale(storedLang);
    loadTranslations(storedLang).then(() => setIsLoading(false));
  }, []);

  if (isLoading || !translations) return null;

  const t = (path: string, vars?: Record<string, string>) => {
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
