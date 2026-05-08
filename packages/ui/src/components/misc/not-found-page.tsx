"use client";

import {
  IMAGE_COMPONENT,
  LINK_COMPONENT,
  LOGO_PATH,
  TRANSLATION_COMPONENT,
} from "../../config";
import { buttonVariants } from "../shadcn/button";

export function NotFoundPage() {
  return (
    <div className="relative h-[calc(100vh-5rem)]">
      <div className="absolute left-1/2 top-1/2 flex max-w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center shadow-lg bg-slate-200 p-4 dark:bg-slate-800">
        <IMAGE_COMPONENT
          src={LOGO_PATH}
          alt="logo"
          width={160}
          height={160}
          className="h-40 w-40 rounded-full object-cover"
        />
        <p className="mb-4 mt-6 text-center text-muted-foreground text-sm">
          <TRANSLATION_COMPONENT translationKey="not-found.description" />
        </p>
        <LINK_COMPONENT
          href="/"
          className={buttonVariants({ variant: "default" })}
        >
          <TRANSLATION_COMPONENT translationKey="not-found.button" />
        </LINK_COMPONENT>
      </div>
    </div>
  );
}
