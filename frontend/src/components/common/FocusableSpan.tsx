import React, { PropsWithChildren, forwardRef } from "react";
import { cn } from "../../lib/utils";

type FocusableSpanProps = PropsWithChildren<
  React.HTMLAttributes<HTMLSpanElement>
> & {
  fn: () => void;
};

const FocusableSpan = forwardRef<HTMLSpanElement, FocusableSpanProps>(
  ({ children, className, fn, ...rest }, ref) => {
    const handleInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (
        e.type === "click" ||
        (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter")
      ) {
        e.preventDefault();
        fn();
      }
    };

    return (
      <span
        ref={ref}
        onClick={handleInteraction}
        tabIndex={0}
        className={cn("hover:cursor-pointer", className)}
        onKeyDown={handleInteraction}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

FocusableSpan.displayName = "FocusableSpan";

export default FocusableSpan;
