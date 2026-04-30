"use client";

import { PropsWithChildren, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { I18nText } from "@/components/shared/i18n-text";

type MyPostPreviewCollapseProps = PropsWithChildren;

export function MyPostPreviewCollapse({
  children,
}: MyPostPreviewCollapseProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative m-auto my-4 w-[95%] overflow-hidden p-4 lg:w-[60%]",
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
          <I18nText translationKey="posts.preview.show-less" />
        ) : (
          <I18nText translationKey="posts.preview.show-more" />
        )}
      </Button>
    </div>
  );
}
