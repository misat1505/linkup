import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import i18n from "../i18n";

type LanguageContextProps = PropsWithChildren & {};

type LanguageContextProvidedValues = {
  isLoading: boolean;
  changeLanguage: (lng: string) => Promise<void>;
};

const LanguageContext = createContext<
  LanguageContextProvidedValues | undefined
>(undefined);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined)
    throw new Error("useLanguageContext called outside LanguageProvider.");
  return context;
};

const LanguageProvider = ({ children }: LanguageContextProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const loadLanguage = async (lng: string) => {
    try {
      const module = await import(`../i18n/${lng}.ts`);
      return module[lng].translation;
    } catch (error) {
      console.error(`Error loading language file for ${lng}:`, error);
      return {};
    }
  };

  const changeLanguage = async (lng: string) => {
    setIsLoading(true);
    const translations = await loadLanguage(lng);
    i18n.addResourceBundle(lng, "translation", translations, true, true);
    await i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    setIsLoading(false);
  };

  useEffect(() => {
    const initLanguage = async () => {
      const currentLang = localStorage.getItem("lang") || "en";
      await changeLanguage(currentLang);
    };

    initLanguage();
  }, []);

  return (
    <LanguageContext.Provider value={{ isLoading, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
