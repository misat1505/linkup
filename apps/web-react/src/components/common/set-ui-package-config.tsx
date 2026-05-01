import { API_URL } from "@/constants";
import { useAppContext } from "@/contexts/app-provider";
import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";
import { queryKeys } from "@/lib/query-keys";
import { UserService } from "@/services/user.service";
import { setUiPackageConfig } from "@packages/ui";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { LinkWrapper } from "./link-wrapper";

function useSearchUsersQuery() {
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const { data: users = [], isFetching } = useQuery({
    queryKey: queryKeys.searchUsers(debouncedText),
    queryFn: () => UserService.search(debouncedText),
    enabled: debouncedText.length > 0,
  });

  return { users, isFetching, setText, debouncedText };
}

function ImageWrapper(props: { src: string; alt: string; className?: string }) {
  return <img {...props} />;
}

export function SetUiPackageConfig() {
  const { setConfigIsLoaded } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setUiPackageConfig({
      translationFunction: t,
      linkComponent: LinkWrapper,
      imageComponent: ImageWrapper,
      // @ts-expect-error it's fine
      useFetchProtectedURL: useFetchProtectedURL,
      useSearchUsersQuery,
      apiUrl: API_URL,
      navigate,
    });

    setConfigIsLoaded();
  }, [t, setConfigIsLoaded, navigate]);

  return null;
}
