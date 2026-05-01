"use client";

import { searchUsers } from "@/features/auth/actions/search-users";
import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";
import { queryKeys } from "@/lib/query-keys";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { API_URL } from "@/utils/constants";
import { setUiPackageConfig } from "@packages/ui";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

function useSearchUsersQuery() {
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const { data: users = [], isFetching } = useQuery({
    queryKey: queryKeys.searchUsers(debouncedText),
    queryFn: () => searchUsers(debouncedText),
    enabled: debouncedText.length > 0,
  });

  return { users, isFetching, setText, debouncedText };
}

const SetUiPackageConfig = () => {
  const { setConfigIsLoaded } = useAppContext();
  const { t } = useLanguageContext();
  const router = useRouter();

  useEffect(() => {
    setUiPackageConfig({
      apiUrl: API_URL,
      linkComponent: Link,
      imageComponent: Image,
      isNextjsImage: true,
      // @ts-expect-error it's fine
      useFetchProtectedURL: useFetchProtectedURL,
      useSearchUsersQuery,
      translationFunction: t,
      navigate: router.push,
    });

    setConfigIsLoaded();
  }, [router.push, setConfigIsLoaded, t]);

  return null;
};

export default SetUiPackageConfig;
