import { PropsWithChildren } from "react";
import { TranslationPath, TVars } from "../utils/i18n";

export type TranslationProps = {
  translationKey: TranslationPath;
  values?: TVars;
};

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

type Config = {
  translationComponent: TranslationComponent;
  linkComponent: LinkComponent;
};

export function setUiPackageConfig(config: Config) {
  TRANSLATION_COMPONENT = config.translationComponent;
  LINK_COMPONENT = config.linkComponent;
}
