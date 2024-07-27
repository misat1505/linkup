import React from "react";
import styles from "../../styles/slogan.module.css";
import { cn } from "../../lib/utils";

export default function SignupSlogan() {
  return (
    <div className="col-span-1 mx-20 flex flex-col justify-center">
      <h1
        className={cn(
          "mt-20 text-center text-9xl font-bold text-white",
          styles.title
        )}
      >
        <div className="text-nowrap">Join the</div>
        <div className="text-nowrap">Network</div>
      </h1>
      <p
        className={cn(
          "mt-32 text-center text-2xl font-semibold",
          styles.description
        )}
      >
        Start your journey today and discover a world of connections and
        opportunities.
      </p>
    </div>
  );
}
