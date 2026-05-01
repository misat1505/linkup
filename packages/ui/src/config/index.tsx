import { User } from "@packages/schemas";
import { PropsWithChildren } from "react";
import { TranslationPath, TVars } from "../utils/i18n";

export type TranslationProps = {
  translationKey: TranslationPath;
  values?: TVars;
};

type TranslateFn = (key: TranslationPath, values?: TVars) => string;

// @ts-expect-error it will be null for now
export let TRANSLATION_FUNCTION: TranslateFn = null;

type TranslationComponent = React.ComponentType<TranslationProps>;

// @ts-expect-error it will be null for now
export let TRANSLATION_COMPONENT: TranslationComponent = null;

export type LinkProps = PropsWithChildren & {
  href: string;
  className?: string;
};

type LinkComponent = React.ComponentType<LinkProps>;

// @ts-expect-error it will be null for now
export let LINK_COMPONENT: LinkComponent = null;

type UseFetchProtectedURLType = (url: string) => {
  data: string;
  isError: boolean;
  isLoading: boolean;
};

// @ts-expect-error it will be null for now
export let useFetchProtectedURL: UseFetchProtectedURLType = null;

type useSearchUsersQueryType = () => {
  users: User[];
  isFetching: boolean;
  setText: (text: string) => void;
  debouncedText: string;
};
// @ts-expect-error it will be null for now
export let useSearchUsersQuery: useSearchUsersQueryType = null;

// @ts-expect-error it will be null for now
export let API_URL: string = null;

type NavigateFn = (path: string) => void;
// @ts-expect-error it will be null for now
export let navigate: NavigateFn = null;

type Config = {
  translationFunction: TranslateFn;
  linkComponent: LinkComponent;
  useFetchProtectedURL: UseFetchProtectedURLType;
  useSearchUsersQuery: useSearchUsersQueryType;
  apiUrl: string;
  navigate: NavigateFn;
};

export function setUiPackageConfig(config: Config) {
  TRANSLATION_FUNCTION = config.translationFunction;
  TRANSLATION_COMPONENT = ({ translationKey, values }) => {
    return <>{TRANSLATION_FUNCTION(translationKey, values)}</>;
  };
  LINK_COMPONENT = config.linkComponent;
  useFetchProtectedURL = config.useFetchProtectedURL;
  API_URL = config.apiUrl;
  navigate = config.navigate;
  useSearchUsersQuery = config.useSearchUsersQuery;
}
