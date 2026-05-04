"use client";
import logo from "@/assets/logo.webp";
import { searchUsers } from "@/features/auth/actions/search-users";
import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";
import { getQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import AppProvider from "@/providers/app-provider";
import {
  LanguageProvider,
  useLanguageContext,
} from "@/providers/language-provider";
import { API_URL } from "@/utils/constants";
import { UiPackageProvider } from "@packages/ui/config";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useState } from "react";
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

export default function Providers({ children }: PropsWithChildren) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AppProvider>
            <UiPackageWrapper>{children}</UiPackageWrapper>
          </AppProvider>
        </LanguageProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function UiPackageWrapper({ children }: PropsWithChildren) {
  const { t } = useLanguageContext();
  const router = useRouter();

  return (
    <UiPackageProvider
      apiUrl={API_URL}
      linkComponent={Link}
      imageComponent={Image}
      isNextjsImage={true}
      // @ts-expect-error it's fine
      useFetchProtectedURL={useFetchProtectedURL}
      useSearchUsersQuery={useSearchUsersQuery}
      translationFunction={t}
      navigate={router.push}
      // @ts-expect-error it can be also StaticImageData
      logoPath={logo}
    >
      {children}
    </UiPackageProvider>
  );
}
