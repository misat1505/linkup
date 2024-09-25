import React from "react";
import styles from "../../styles/slogan.module.css";
import { cn } from "../../lib/utils";
import { useLocalStorageAnimation } from "../../hooks/useLocalStorageAnimation";

export default function LoginSlogan() {
  const isAnimating = useLocalStorageAnimation(
    "login-animation",
    60 * 60 * 1000
  );

  return (
    <div className="col-span-1 mb-12 flex flex-col justify-center xl:mx-20 xl:mb-0">
      <h1
        className={cn(
          "mx-auto mt-20 text-6xl font-bold text-white md:text-8xl xl:text-9xl",
          styles.shadow,
          {
            [styles.title]: isAnimating
          }
        )}
      >
        <div className="text-nowrap">Welcome to</div>
        <div className="text-nowrap">Link Up</div>
      </h1>
      <p
        className={cn("mt-32 text-balance text-center text-2xl font-semibold", {
          [styles.description]: isAnimating
        })}
      >
        Immerse yourself in a social network where connecting with friends,
        sharing your moments, and discovering new communities is just a click
        away.
      </p>
    </div>
  );
}
