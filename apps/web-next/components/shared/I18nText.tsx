"use client";

import {
  TranslationPath,
  TVars,
  useLanguageContext,
} from "@/providers/LanguageProvider";

type I18nTextProps = {
  translationKey: TranslationPath;
  values?: TVars;
};

export function I18nText({ translationKey, values }: I18nTextProps) {
  const { t } = useLanguageContext();

  return t(translationKey, values);
}
