import { cn } from "@/lib/utils";
import styles from "@/styles/slogan.module.css";

export default function SettingsSlogan() {
  return (
    <div className="col-span-1 mb-12 flex flex-col justify-center xl:mx-20">
      <h1
        className={cn(
          "mx-auto mt-20 text-4xl sm:text-5xl font-bold text-white xl:text-6xl 2xl:text-8xl",
          styles.shadow
        )}
      >
        <div className="text-nowrap">Personalize</div>
        <div className="text-nowrap">Your Experience</div>
      </h1>
      <p className="mt-32 text-balance text-center text-2xl font-semibold">
        Customize your settings to make Link Up truly yours. Toggle themes,
        tweak preferences, and shape the way you interact with the platform.
      </p>
    </div>
  );
}
