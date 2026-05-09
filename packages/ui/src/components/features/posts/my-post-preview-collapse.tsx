"use client";

import { PropsWithChildren, useState } from "react";
import { TRANSLATION_COMPONENT } from "../../../config";
import { cn } from "../../../lib/utils";
import { Button } from "../../shadcn/button";

export type MyPostPreviewCollapseProps = PropsWithChildren & {
  useTheme: () => { theme: "dark" | "light" };
};

export function MyPostPreviewCollapse({
  children,
  useTheme,
}: MyPostPreviewCollapseProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative m-auto my-4 w-[95%] overflow-hidden px-4 pb-4 lg:w-[60%]",
        {
          "max-h-72": !isExpanded,
        },
      )}
      style={{ backgroundColor: theme === "light" ? "white" : "#0c1117" }}
    >
      {children}
      <Button
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? (
          <TRANSLATION_COMPONENT translationKey="posts.preview.show-less" />
        ) : (
          <TRANSLATION_COMPONENT translationKey="posts.preview.show-more" />
        )}
      </Button>
    </div>
  );
}
