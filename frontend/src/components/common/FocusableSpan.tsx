import React, { PropsWithChildren, forwardRef } from "react";
import { cn } from "../../lib/utils";

type FocusableSpanProps = PropsWithChildren<
  React.HTMLAttributes<HTMLSpanElement>
> & {
  fn: () => void;
};

const FocusableSpan = forwardRef<HTMLSpanElement, FocusableSpanProps>(
  ({ children, className, fn, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        onClick={fn}
        tabIndex={0}
        className={cn("hover:cursor-pointer", className)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fn();
          }
        }}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

FocusableSpan.displayName = "FocusableSpan";

export default FocusableSpan;
