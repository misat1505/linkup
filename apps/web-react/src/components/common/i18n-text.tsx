"use client";

import { TranslationProps } from "@packages/ui/config";
import { useTranslation } from "react-i18next";

export function I18nText({ translationKey, values }: TranslationProps) {
  const { t } = useTranslation();

  return t(translationKey, values);
}
