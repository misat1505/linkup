import React from "react";
import styles from "../../styles/slogan.module.css";
import { cn } from "../../lib/utils";

export default function LoginSlogan() {
  return (
    <div className="col-span-1 mx-20 flex flex-col justify-center">
      <h1 className={cn("mt-20 text-9xl font-bold text-white", styles.title)}>
        <div className="text-nowrap">Welcome to</div>
        <div className="text-nowrap">Link Up</div>
      </h1>
      <p
        className={cn(
          "mt-32 text-center text-2xl font-semibold",
          styles.description
        )}
      >
        Immerse yourself in a social network where connecting with friends,
        sharing your moments, and discovering new communities is just a click
        away.
      </p>
    </div>
  );
}
