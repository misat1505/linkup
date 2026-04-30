import React, { PropsWithChildren } from "react";
import useLocalStorage from "use-local-storage";
import {
  TooltipContent,
  Tooltip as TooltipLib,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/tooltip";

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
