import { TranslationPath, TVars } from "../utils/i18n";

export type TranslationProps = {
  translationKey: TranslationPath;
  values?: TVars;
};

type TranslationComponent = React.ComponentType<TranslationProps>;

// @ts-expect-error it will be null for now
export let TRANSLATION_COMPONENT: TranslationComponent = null;

type Config = {
  translationComponent: TranslationComponent;
};

export function setUiPackageConfig(config: Config) {
  TRANSLATION_COMPONENT = config.translationComponent;
}
