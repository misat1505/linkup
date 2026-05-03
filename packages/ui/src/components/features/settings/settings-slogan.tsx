import { TRANSLATION_COMPONENT } from "../../../config";
import { useLocalStorageAnimation } from "../../../hooks/use-local-storage-animation";
import { cn } from "../../../lib/utils";
import styles from "../login/slogan.module.css";

export function SettingsSlogan() {
  const isAnimating = useLocalStorageAnimation(
    "settings-animation",
    60 * 60 * 1000,
  );

  return (
    <div className="col-span-1 mb-12 flex flex-col justify-center xl:mx-20">
      <h1
        className={cn(
          "mx-auto mt-20 text-4xl sm:text-5xl font-bold text-white xl:text-6xl 2xl:text-8xl",
          styles.shadow,
          {
            [styles.title]: isAnimating,
          },
        )}
      >
        <div className="text-nowrap">
          <TRANSLATION_COMPONENT translationKey="settings.header.1" />
        </div>
        <div className="text-nowrap">
          <TRANSLATION_COMPONENT translationKey="settings.header.2" />
        </div>
      </h1>
      <p
        className={cn("mt-12 text-balance text-center text-2xl font-semibold", {
          [styles.description]: isAnimating,
        })}
      >
        <TRANSLATION_COMPONENT translationKey="settings.slogan" />{" "}
      </p>
    </div>
  );
}
