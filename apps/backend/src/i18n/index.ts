import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "pl", "de", "es", "ru", "zh"],
    backend: {
      loadPath: __dirname + "/locales/{{lng}}.json",
    },
    detection: {
      order: ["header"],
      caches: false,
    },
    interpolation: { escapeValue: false },
  });

export default i18next;
