import { cn } from "@/lib/utils";
import styles from "./styles/slogan.module.css";
import { useLocalStorageAnimation } from "../hooks/useLocalStorageAnimation";
import { I18nText } from "@/components/shared/I18nText";

export default function SignupSlogan() {
  const isAnimating = useLocalStorageAnimation(
    "signup-animation",
    60 * 60 * 1000,
  );

  return (
    <div className="col-span-1 mx-4 flex flex-col justify-center xl:mx-20">
      <h1
        className={cn(
          "mx-auto mt-20 text-6xl font-bold text-white md:text-8xl xl:text-9xl",
          styles.shadow,
          {
            [styles.title]: isAnimating,
          },
        )}
      >
        <div className="text-nowrap">
          <I18nText translationKey="signup.header.1" />
        </div>
        <div className="text-nowrap">
          <I18nText translationKey="signup.header.2" />
        </div>
      </h1>
      <p
        className={cn(
          "mt-32 mb-8 text-balance text-center text-2xl font-semibold",
          {
            [styles.description]: isAnimating,
          },
        )}
      >
        <I18nText translationKey="signup.slogan" />
      </p>
    </div>
  );
}
