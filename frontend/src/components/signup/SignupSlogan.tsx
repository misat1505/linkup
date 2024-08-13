import React from "react";
import styles from "../../styles/slogan.module.css";
import { cn } from "../../lib/utils";
import { useLocalStorageAnimation } from "../../hooks/useLocalStorageAnimation";

export default function SignupSlogan() {
  const isAnimating = useLocalStorageAnimation(
    "signup-animation",
    60 * 60 * 1000
  );

  return (
    <div className="col-span-1 mx-20 flex flex-col justify-center">
      <h1
        className={cn(
          "mt-20 text-center text-9xl font-bold text-white",
          styles.shadow,
          {
            [styles.title]: isAnimating
          }
        )}
      >
        <div className="text-nowrap">Join the</div>
        <div className="text-nowrap">Network</div>
      </h1>
      <p
        className={cn("mt-32 text-balance text-center text-2xl font-semibold", {
          [styles.description]: isAnimating
        })}
      >
        Start your journey today and discover a world of connections and
        opportunities.
      </p>
    </div>
  );
}
