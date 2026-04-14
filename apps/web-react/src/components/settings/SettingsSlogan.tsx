import { useLocalStorageAnimation } from "@/hooks/useLocalStorageAnimation";
import { cn } from "@/lib/utils";
import styles from "@/styles/slogan.module.css";
import { useTranslation } from "react-i18next";

export default function SettingsSlogan() {
  const { t } = useTranslation();

  const isAnimating = useLocalStorageAnimation(
    "settings-animation",
    60 * 60 * 1000
  );

  return (
    <div className="col-span-1 mb-12 flex flex-col justify-center xl:mx-20">
      <h1
        className={cn(
          "mx-auto mt-20 text-4xl sm:text-5xl font-bold text-white xl:text-6xl 2xl:text-8xl",
          styles.shadow,
          {
            [styles.title]: isAnimating,
          }
        )}
      >
        <div className="text-nowrap">{t("settings.header.1")}</div>
        <div className="text-nowrap">{t("settings.header.2")}</div>
      </h1>
      <p
        className={cn("mt-12 text-balance text-center text-2xl font-semibold", {
          [styles.description]: isAnimating,
        })}
      >
        {t("settings.slogan")}
      </p>
    </div>
  );
}
