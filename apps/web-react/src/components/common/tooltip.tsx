import {
  TooltipContent,
  TooltipShadcn as TooltipLib,
  TooltipProvider,
  TooltipTrigger,
} from "@packages/ui/components/shadcn/tooltip";
import React, { PropsWithChildren } from "react";
import useLocalStorage from "use-local-storage";

type TooltipProps = PropsWithChildren & {
  content: React.ReactNode;
};

export default function Tooltip({ children, content }: TooltipProps) {
  const [showTooltips] = useLocalStorage("show-tooltips", true);

  return (
    <TooltipProvider>
      <TooltipLib>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {showTooltips && <TooltipContent>{content}</TooltipContent>}
      </TooltipLib>
    </TooltipProvider>
  );
}
