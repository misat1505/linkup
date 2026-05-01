"use client";

import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { API_URL } from "@/utils/constants";
import { setUiPackageConfig } from "@packages/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SetUiPackageConfig = () => {
  const { setConfigIsLoaded } = useAppContext();
  const { t } = useLanguageContext();
  const router = useRouter();

  useEffect(() => {
    setUiPackageConfig({
      apiUrl: API_URL,
      linkComponent: Link,
      // @ts-expect-error it's fine
      useFetchProtectedURL: useFetchProtectedURL,
      translationFunction: t,
      navigate: router.push,
    });

    setConfigIsLoaded();
  }, [router.push, setConfigIsLoaded, t]);

  return null;
};

export default SetUiPackageConfig;
