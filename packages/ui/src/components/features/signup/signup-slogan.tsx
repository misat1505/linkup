import { TRANSLATION_COMPONENT } from "../../../config";
import { useLocalStorageAnimation } from "../../../hooks/use-local-storage-animation";
import { cn } from "../../../lib/utils";
import styles from "../login/slogan.module.css";

export function SignupSlogan() {
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
          <TRANSLATION_COMPONENT translationKey="signup.header.1" />
        </div>
        <div className="text-nowrap">
          <TRANSLATION_COMPONENT translationKey="signup.header.2" />
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
        <TRANSLATION_COMPONENT translationKey="signup.slogan" />{" "}
      </p>
    </div>
  );
}
