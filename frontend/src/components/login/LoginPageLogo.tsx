import React from "react";
import { LOGO_PATH } from "../../constants";
import { Img } from "react-image";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";

export default function LoginPageLogo() {
  const commonClasses = "mx-auto mb-4 h-64 w-64 rounded-full";

  return (
    <Img
      className={commonClasses}
      src={LOGO_PATH}
      loader={<Skeleton className={commonClasses} />}
      unloader={
        <div
          className={cn("items-center justify-center bg-white", commonClasses)}
        >
          Logo
        </div>
      }
    />
  );
}
