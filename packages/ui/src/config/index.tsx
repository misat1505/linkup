"use client";
import { User } from "@packages/schemas";
import { createContext, PropsWithChildren, useContext } from "react";
import { TranslationPath, TVars } from "../utils/i18n";

export type TranslationProps = {
  translationKey: TranslationPath;
  values?: TVars;
};

export type TranslateFn = (key: TranslationPath, values?: TVars) => string;

export type LinkProps = PropsWithChildren & {
  href: string;
  className?: string;
};
type LinkComponent = React.ComponentType<LinkProps>;

export type ImageProps = PropsWithChildren & {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  height?: number;
  width?: number;
  loading?: "lazy" | "eager";
};
type ImageComponent = React.ComponentType<ImageProps>;

type UseFetchProtectedURLType = (url: string) => {
  data: string;
  isError: boolean;
  isLoading: boolean;
};

type useSearchUsersQueryType = () => {
  users: User[];
  isFetching: boolean;
  setText: (text: string) => void;
  debouncedText: string;
};

type NavigateFn = (path: string) => void;

// @ts-expect-error it will be null for now
export let LINK_COMPONENT: LinkComponent = null;
// @ts-expect-error it will be null for now
export let IMAGE_COMPONENT: ImageComponent = null;
// @ts-expect-error it will be null for now
export let useFetchProtectedURL: UseFetchProtectedURLType = null;
// @ts-expect-error it will be null for now
export let useSearchUsersQuery: useSearchUsersQueryType = null;
// @ts-expect-error it will be null for now
export let API_URL: string = null;
// @ts-expect-error it will be null for now
export let navigate: NavigateFn = null;
export let IS_NEXT_IMAGE: boolean = false;
// @ts-expect-error it will be null for now
export let LOGO_PATH: string = null;

type UiPackageContextValue = { t: TranslateFn };

const UiPackageContext = createContext<UiPackageContextValue | undefined>(
  undefined,
);

export const useUiPackageContext = () => {
  const context = useContext(UiPackageContext);
  if (!context)
    throw new Error("useUiPackageContext called outside UiPackageProvider.");
  return context;
};

export const TRANSLATION_COMPONENT = ({
  translationKey,
  values,
}: TranslationProps) => {
  const { t } = useUiPackageContext();
  return <>{t(translationKey, values)}</>;
};

type UiPackageProviderProps = PropsWithChildren & {
  translationFunction: TranslateFn;
  linkComponent: LinkComponent;
  imageComponent: ImageComponent;
  useFetchProtectedURL: UseFetchProtectedURLType;
  useSearchUsersQuery: useSearchUsersQueryType;
  apiUrl: string;
  navigate: NavigateFn;
  isNextjsImage?: boolean;
  logoPath: string;
};

const UiPackageProvider = ({
  children,
  translationFunction,
  linkComponent,
  imageComponent,
  useFetchProtectedURL: fetchProtectedURL,
  useSearchUsersQuery: searchUsersQuery,
  apiUrl,
  navigate: navigateFn,
  isNextjsImage,
  logoPath,
}: UiPackageProviderProps) => {
  LINK_COMPONENT = linkComponent;
  IMAGE_COMPONENT = imageComponent;
  useFetchProtectedURL = fetchProtectedURL;
  useSearchUsersQuery = searchUsersQuery;
  API_URL = apiUrl;
  navigate = navigateFn;
  if (isNextjsImage) IS_NEXT_IMAGE = isNextjsImage;
  LOGO_PATH = logoPath;

  return (
    <UiPackageContext.Provider value={{ t: translationFunction }}>
      {children}
    </UiPackageContext.Provider>
  );
};

export { UiPackageProvider };
