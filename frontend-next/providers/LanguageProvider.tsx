"use client";

import { Translation } from "@/i18n/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type LanguageContextProps = {
  locale: string;
  t: Translation;
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

export const LanguageProvider = ({ children }: Props) => {
  const [locale, setLocale] = useState("en");
  const [t, setT] = useState<Translation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = async (lng: string) => {
    try {
      const data = await import(`../i18n/locales/${lng}.json`);
      setT(data.default.translation);
    } catch {
      const data = await import("../i18n/locales/en.json");
      setT(data.default.translation);
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

  if (isLoading || !t) return null;

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};
