"use client";
import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Tooltip from "../shared/Tooltip";
import { useLanguageContext } from "@/providers/LanguageProvider";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root> & React.PropsWithChildren,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { t } = useLanguageContext();
  const { theme, setTheme } = useTheme();

  const component =
    theme === "light" ? (
      <MdSunny className="text-white" />
    ) : (
      <IoMoon className="text-black" />
    );

  const tooltipText = t("common.theme.switch.tooltip", {
    mode: theme === "light" ? t("common.theme.dark") : t("common.theme.light"),
  });

  return (
    <Tooltip content={tooltipText}>
      <span>
        <SwitchPrimitives.Root
          className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            theme === "dark"
              ? "data-[state=checked]:bg-black data-[state=unchecked]:bg-black"
              : "data-[state=checked]:bg-switch-white data-[state=unchecked]:bg-white",
            className,
          )}
          {...props}
          ref={ref}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all",
              theme === "dark"
                ? "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-white data-[state=unchecked]:bg-white"
                : "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-black data-[state=unchecked]:bg-black",
            )}
          >
            <div className="flex h-full w-full items-center justify-center">
              {component}
            </div>
          </SwitchPrimitives.Thumb>
        </SwitchPrimitives.Root>
      </span>
    </Tooltip>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
