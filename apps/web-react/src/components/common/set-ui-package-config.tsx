import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";
import { setUiPackageConfig } from "@packages/ui";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LinkWrapper } from "./link-wrapper";

export function SetUiPackageConfig() {
  const { t } = useTranslation();

  useEffect(() => {
    setUiPackageConfig({
      translationFunction: t,
      linkComponent: LinkWrapper,
      // @ts-expect-error it's fine
      useFetchProtectedURL: useFetchProtectedURL,
    });
  }, [t]);

  return null;
}
