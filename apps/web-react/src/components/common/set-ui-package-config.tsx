import { API_URL } from "@/constants";
import { useAppContext } from "@/contexts/app-provider";
import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";
import { setUiPackageConfig } from "@packages/ui";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LinkWrapper } from "./link-wrapper";

export function SetUiPackageConfig() {
  const { setConfigIsLoaded } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setUiPackageConfig({
      translationFunction: t,
      linkComponent: LinkWrapper,
      // @ts-expect-error it's fine
      useFetchProtectedURL: useFetchProtectedURL,
      apiUrl: API_URL,
      navigate,
    });

    setConfigIsLoaded();
  }, [t, setConfigIsLoaded, navigate]);

  return null;
}
