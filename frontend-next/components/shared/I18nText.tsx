"use client";

import {
  TranslationPath,
  useLanguageContext,
} from "@/providers/LanguageProvider";

type I18nTextProps = {
  translationKey: TranslationPath;
  values?: Record<string, any>;
};

export function I18nText({ translationKey, values }: I18nTextProps) {
  const { t } = useLanguageContext();

  return t(translationKey, values);
}
