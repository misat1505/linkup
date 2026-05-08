"use client";
import { TRANSLATION_COMPONENT } from "../../../config";
import { useLocalStorageAnimation } from "../../../hooks/use-local-storage-animation";
import { cn } from "../../../lib/utils";

export function LoginSlogan() {
  const isAnimating = useLocalStorageAnimation(
    "login-animation",
    60 * 60 * 1000,
  );

  return (
    <div className="col-span-1 mb-12 flex flex-col justify-center xl:mx-20 xl:mb-0">
      <h1
        className={cn(
          "mx-auto mt-20 text-6xl font-bold text-white md:text-8xl xl:text-9xl",
          isAnimating && "animate-titleEntry",
          "text-shadow-[0_25px_50px_rgba(0,0,0,0.5)]",
        )}
      >
        <div className="text-nowrap">
          <TRANSLATION_COMPONENT translationKey="login.greeting" />
        </div>
        <div className="text-nowrap">LinkUp</div>
      </h1>

      <p
        className={cn(
          "mt-32 text-balance text-center text-2xl font-semibold",
          isAnimating && "animate-descriptionEntry",
        )}
      >
        <TRANSLATION_COMPONENT translationKey="login.slogan" />
      </p>
    </div>
  );
}
