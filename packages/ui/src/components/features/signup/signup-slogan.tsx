import { TRANSLATION_COMPONENT } from "../../../config";
import { useLocalStorageAnimation } from "../../../hooks/use-local-storage-animation";
import { cn } from "../../../lib/utils";

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
          "text-shadow-[0_25px_50px_rgba(0,0,0,0.5)]",
          isAnimating && "animate-titleEntry",
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
          isAnimating && "animate-descriptionEntry",
        )}
      >
        <TRANSLATION_COMPONENT translationKey="signup.slogan" />
      </p>
    </div>
  );
}
